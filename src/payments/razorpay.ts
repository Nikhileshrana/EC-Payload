import type { PaymentAdapter, PaymentAdapterClient } from '@payloadcms/plugin-ecommerce/types'
import type { Endpoint, GroupField } from 'payload'
import type { CollectionSlug } from 'payload'
import crypto from 'crypto'

import type { Order, Transaction } from '@/payload-types'

export type RazorpayAdapterArgs = {
  apiKey: string
  secretKey: string
  label?: string
}

function authHeader(apiKey: string, secretKey: string): string {
  return `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString('base64')}`
}

async function razorpayRequest<T>(
  path: string,
  apiKey: string,
  secretKey: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: authHeader(apiKey, secretKey),
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error((await response.text()) || `Razorpay request failed: ${path}`)
  }

  return response.json() as Promise<T>
}

function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): boolean {
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

function flattenCartItems(
  cart: NonNullable<Parameters<NonNullable<PaymentAdapter['initiatePayment']>>[0]['data']['cart']>,
) {
  return cart.items.map((item) => {
    const productID = typeof item.product === 'object' ? item.product.id : item.product
    const variantID = item.variant
      ? typeof item.variant === 'object'
        ? item.variant.id
        : item.variant
      : undefined
    const { product: _p, variant: _v, ...rest } = item

    return {
      ...rest,
      product: productID,
      quantity: item.quantity,
      ...(variantID ? { variant: variantID } : {}),
    }
  })
}

export const razorpayAdapter = ({ apiKey, secretKey, label = 'Razorpay' }: RazorpayAdapterArgs): PaymentAdapter => {
  const group: GroupField = {
    name: 'razorpay',
    type: 'group',
    admin: {
      condition: (data) => data?.paymentMethod === 'razorpay',
    },
    fields: [
      { name: 'orderID', type: 'text', label: 'Razorpay Order ID' },
      { name: 'paymentID', type: 'text', label: 'Razorpay Payment ID' },
    ],
  }

  const initiatePayment: NonNullable<PaymentAdapter['initiatePayment']> = async ({
    data,
    req,
    transactionsSlug,
  }) => {
    if (!apiKey || !secretKey) {
      throw new Error('Set RAZORPAY_API_KEY and RAZORPAY_SECRET_KEY in your environment.')
    }

    const { billingAddress, cart, currency, customerEmail, shippingAddress } = data
    const amount = cart.subtotal

    if (!currency) throw new Error('Currency is required.')
    if (!cart?.items?.length) throw new Error('Cart is empty.')
    if (!customerEmail) throw new Error('Customer email is required.')
    if (!amount || amount <= 0) throw new Error('Invalid cart amount.')

    const items = flattenCartItems(cart)

    const order = await razorpayRequest<{ id: string; amount: number; currency: string }>(
      '/orders',
      apiKey,
      secretKey,
      {
        method: 'POST',
        body: JSON.stringify({
          amount,
          currency: currency.toUpperCase(),
          receipt: String(cart.id),
          notes: {
            cartID: String(cart.id),
            cartItemsSnapshot: JSON.stringify(items),
            shippingAddress: JSON.stringify(shippingAddress ?? billingAddress),
            customerEmail,
          },
        }),
      },
    )

    await req.payload.create({
      collection: transactionsSlug as CollectionSlug,
      data: {
        ...(req.user ? { customer: req.user.id } : { customerEmail }),
        amount: order.amount,
        billingAddress,
        cart: cart.id,
        currency: 'INR',
        items,
        paymentMethod: 'razorpay',
        status: 'pending',
        razorpay: { orderID: order.id },
      },
      req,
    })

    return {
      amount: order.amount,
      currency: order.currency,
      keyId: apiKey,
      message: 'Payment initiated successfully',
      razorpayOrderID: order.id,
    }
  }

  const confirmOrder: NonNullable<PaymentAdapter['confirmOrder']> = async ({
    cartsSlug = 'carts',
    data,
    ordersSlug = 'orders',
    req,
    transactionsSlug = 'transactions',
  }) => {
    if (!apiKey || !secretKey) {
      throw new Error('Set RAZORPAY_API_KEY and RAZORPAY_SECRET_KEY in your environment.')
    }

    const razorpayOrderID = data.razorpay_order_id as string | undefined
    const razorpayPaymentID = data.razorpay_payment_id as string | undefined
    const razorpaySignature = data.razorpay_signature as string | undefined

    if (!razorpayOrderID || !razorpayPaymentID || !razorpaySignature) {
      throw new Error('Razorpay payment details are required.')
    }

    if (!verifyPaymentSignature(razorpayOrderID, razorpayPaymentID, razorpaySignature, secretKey)) {
      throw new Error('Invalid Razorpay payment signature.')
    }

    const { docs, totalDocs } = await req.payload.find({
      collection: transactionsSlug as CollectionSlug,
      req,
      where: { 'razorpay.orderID': { equals: razorpayOrderID } },
    })

    const transaction = docs[0] as Transaction | undefined
    if (!totalDocs || !transaction) {
      throw new Error('Transaction not found for this payment.')
    }

    const payment = await razorpayRequest<{
      id: string
      status: string
      order_id: string
      amount: number
    }>(`/payments/${razorpayPaymentID}`, apiKey, secretKey)

    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      throw new Error('Payment not completed.')
    }

    if (payment.order_id !== razorpayOrderID) {
      throw new Error('Payment does not match the order.')
    }

    const cartID =
      typeof transaction.cart === 'object' ? transaction.cart?.id : transaction.cart

    if (!cartID) throw new Error('Cart not found on transaction.')
    if (!transaction.items?.length) throw new Error('Cart items missing on transaction.')

    const order = (await req.payload.create({
      collection: ordersSlug as CollectionSlug,
      data: {
        amount: payment.amount,
        currency: 'INR',
        ...(req.user
          ? { customer: req.user.id }
          : { customerEmail: (data.customerEmail as string) || transaction.customerEmail }),
        items: transaction.items,
        shippingAddress: transaction.billingAddress,
        status: 'paid',
        transactions: [transaction.id],
      },
      req,
    })) as Order

    const purchasedAt = new Date().toISOString()

    await req.payload.update({
      id: cartID,
      collection: cartsSlug as CollectionSlug,
      data: { purchasedAt },
      req,
    })

    await req.payload.update({
      id: transaction.id,
      collection: transactionsSlug as CollectionSlug,
      data: {
        order: order.id,
        status: 'succeeded',
        razorpay: {
          ...(transaction.razorpay ?? {}),
          orderID: razorpayOrderID,
          paymentID: razorpayPaymentID,
        },
      },
      req,
    })

    return {
      message: 'Order confirmed successfully',
      orderID: order.id,
      transactionID: transaction.id,
      ...(order.accessToken ? { accessToken: order.accessToken } : {}),
    }
  }

  const webhookEndpoint: Endpoint = {
    method: 'post',
    path: '/webhooks',
    handler: async (req) => {
      req.payload.logger.info('Razorpay webhook received (orders are confirmed via checkout flow).')
      return Response.json({ received: true })
    },
  }

  return {
    name: 'razorpay',
    label,
    group,
    initiatePayment,
    confirmOrder,
    endpoints: [webhookEndpoint],
  }
}

export const razorpayAdapterClient = (props?: { label?: string }): PaymentAdapterClient => ({
  name: 'razorpay',
  label: props?.label ?? 'Razorpay',
  initiatePayment: true,
  confirmOrder: true,
})

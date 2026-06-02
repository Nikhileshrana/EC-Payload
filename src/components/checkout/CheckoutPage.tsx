'use client'

import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { CheckoutAddresses } from '@/components/checkout/CheckoutAddresses'
import { FormItem } from '@/components/forms/FormItem'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Checkbox } from '@/components/ui/checkbox'
import { Address, Product, Variant } from '@/payload-types'
import { useAddresses, useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import Script from 'next/script'
import { toast } from 'sonner'

type ProductGalleryItem = NonNullable<Product['gallery']>[number]
type VariantOptionRef = Variant['options'][number]

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      on: (event: string, cb: (res: { error: { description: string } }) => void) => void
      open: () => void
    }
  }
}

type PaymentData = {
  amount: number
  currency: string
  keyId: string
  razorpayOrderID: string
}

type Props = {
  paymentsEnabled: boolean
  storeName: string
}

export const CheckoutPage: React.FC<Props> = ({ paymentsEnabled, storeName }) => {
  const { user } = useAuth()
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [error, setError] = useState<null | string>(null)
  const [email, setEmail] = useState('')
  const [emailEditable, setEmailEditable] = useState(true)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const { confirmOrder, initiatePayment } = usePayments()
  const [razorpayReady, setRazorpayReady] = useState(false)
  const [paying, setPaying] = useState(false)
  const { addresses } = useAddresses()
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [isProcessingPayment, setProcessingPayment] = useState(false)

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

  const canGoToPayment = Boolean(
    (email || user) && billingAddress && (billingAddressSameAsShipping || shippingAddress),
  )

  useEffect(() => {
    if (!shippingAddress) {
      if (addresses && addresses.length > 0) {
        const defaultAddress = addresses[0]
        if (defaultAddress) {
          setBillingAddress(defaultAddress)
        }
      }
    }
  }, [addresses, shippingAddress])

  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setBillingAddressSameAsShipping(true)
      setEmail('')
      setEmailEditable(true)
    }
  }, [])

  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      try {
        const result = (await initiatePayment(paymentID, {
          additionalData: {
            ...(email ? { customerEmail: email } : {}),
            billingAddress,
            shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
          },
        })) as Record<string, unknown>

        if (
          result &&
          typeof result.amount === 'number' &&
          typeof result.currency === 'string' &&
          typeof result.razorpayOrderID === 'string' &&
          typeof result.keyId === 'string'
        ) {
          setPaymentData({
            amount: result.amount,
            currency: result.currency,
            keyId: result.keyId,
            razorpayOrderID: result.razorpayOrderID,
          })
        }
      } catch (paymentError) {
        let errorMessage = 'An error occurred while initiating payment.'

        if (paymentError instanceof Error) {
          try {
            const errorData = JSON.parse(paymentError.message) as { cause?: { code?: string } }
            if (errorData?.cause?.code === 'OutOfStock') {
              errorMessage = 'One or more items in your cart are out of stock.'
            } else if (errorData && typeof errorData === 'object' && 'message' in errorData) {
              errorMessage = String((errorData as { message: string }).message)
            }
          } catch {
            errorMessage = paymentError.message
          }
        }

        setError(errorMessage)
        toast.error(errorMessage)
      }
    },
    [
      billingAddress,
      billingAddressSameAsShipping,
      email,
      initiatePayment,
      shippingAddress,
    ],
  )

  const openRazorpay = useCallback(() => {
    if (!paymentData || !window.Razorpay) return

    setPaying(true)
    setProcessingPayment(true)
    setError(null)

    const rzp = new window.Razorpay({
      key: paymentData.keyId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      name: storeName,
      order_id: paymentData.razorpayOrderID,
      prefill: {
        email: email || user?.email,
        contact: billingAddress?.phone ?? undefined,
        name: billingAddress
          ? [billingAddress.firstName, billingAddress.lastName].filter(Boolean).join(' ')
          : undefined,
      },
      theme: { color: '#1e293b' },
      modal: {
        ondismiss: () => {
          setPaying(false)
          setProcessingPayment(false)
        },
      },
      handler: async (response: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }) => {
        try {
          const confirmResult = await confirmOrder('razorpay', {
            additionalData: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              ...(email ? { customerEmail: email } : {}),
            },
          })

          if (
            confirmResult &&
            typeof confirmResult === 'object' &&
            'orderID' in confirmResult &&
            confirmResult.orderID
          ) {
            const query = new URLSearchParams()
            if (email) query.set('email', email)
            if ('accessToken' in confirmResult && confirmResult.accessToken) {
              query.set('accessToken', String(confirmResult.accessToken))
            }
            const qs = query.toString()
            clearCart()
            router.push(`/orders/${confirmResult.orderID}${qs ? `?${qs}` : ''}`)
            return
          }

          setError('Payment succeeded but order confirmation failed.')
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not confirm order.')
        } finally {
          setPaying(false)
          setProcessingPayment(false)
        }
      },
    })

    rzp.on('payment.failed', (res: { error: { description: string } }) => {
      setError(res.error?.description || 'Payment failed.')
      setPaying(false)
      setProcessingPayment(false)
    })

    rzp.open()
  }, [
    paymentData,
    storeName,
    email,
    user?.email,
    billingAddress,
    confirmOrder,
    clearCart,
    router,
  ])

  if (!paymentsEnabled) {
    return null
  }

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="py-12 w-full items-center justify-center">
        <div className="prose dark:prose-invert text-center max-w-none self-center mb-8">
          <p>Processing your payment...</p>
        </div>
        <LoadingSpinner />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="prose dark:prose-invert py-12 w-full items-center">
        <p>Your cart is empty.</p>
        <Link href="/search">Continue shopping?</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-stretch justify-stretch my-8 md:flex-row grow gap-10 md:gap-6 lg:gap-8">
      <div className="basis-full lg:basis-2/3 flex flex-col gap-8 justify-stretch">
        <h2 className="font-medium text-3xl">Contact</h2>
        {!user && (
          <div className=" bg-accent dark:bg-black rounded-lg p-4 w-full flex items-center">
            <div className="prose dark:prose-invert">
              <Button asChild className="no-underline text-inherit" variant="outline">
                <Link href="/login">Log in</Link>
              </Button>
              <p className="mt-0">
                <span className="mx-2">or</span>
                <Link href="/create-account">create an account</Link>
              </p>
            </div>
          </div>
        )}
        {user ? (
          <div className="bg-accent dark:bg-card rounded-lg p-4 ">
            <div>
              <p>{user.email}</p>{' '}
              <p>
                Not you?{' '}
                <Link className="underline" href="/logout">
                  Log out
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-accent dark:bg-black rounded-lg p-4 ">
            <div>
              <p className="mb-4">Enter your email to checkout as a guest.</p>

              <FormItem className="mb-6">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  disabled={!emailEditable}
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                />
              </FormItem>

              <Button
                disabled={!email || !emailEditable}
                onClick={(e) => {
                  e.preventDefault()
                  setEmailEditable(false)
                }}
                variant="default"
              >
                Continue as guest
              </Button>
            </div>
          </div>
        )}

        <h2 className="font-medium text-3xl">Address</h2>

        {billingAddress ? (
          <div>
            <AddressItem
              actions={
                <Button
                  variant={'outline'}
                  disabled={Boolean(paymentData)}
                  onClick={(e) => {
                    e.preventDefault()
                    setBillingAddress(undefined)
                  }}
                >
                  Remove
                </Button>
              }
              address={billingAddress}
            />
          </div>
        ) : user ? (
          <CheckoutAddresses heading="Billing address" setAddress={setBillingAddress} />
        ) : (
          <CreateAddressModal
            disabled={!email || Boolean(emailEditable)}
            callback={(address) => {
              setBillingAddress(address)
            }}
            skipSubmission={true}
          />
        )}

        <div className="flex gap-4 items-center">
          <Checkbox
            id="shippingTheSameAsBilling"
            checked={billingAddressSameAsShipping}
            disabled={Boolean(paymentData || (!user && (!email || Boolean(emailEditable))))}
            onCheckedChange={(state) => {
              setBillingAddressSameAsShipping(state as boolean)
            }}
          />
          <Label htmlFor="shippingTheSameAsBilling">Shipping is the same as billing</Label>
        </div>

        {!billingAddressSameAsShipping && (
          <>
            {shippingAddress ? (
              <div>
                <AddressItem
                  actions={
                    <Button
                      variant={'outline'}
                      disabled={Boolean(paymentData)}
                      onClick={(e) => {
                        e.preventDefault()
                        setShippingAddress(undefined)
                      }}
                    >
                      Remove
                    </Button>
                  }
                  address={shippingAddress}
                />
              </div>
            ) : user ? (
              <CheckoutAddresses
                heading="Shipping address"
                description="Please select a shipping address."
                setAddress={setShippingAddress}
              />
            ) : (
              <CreateAddressModal
                callback={(address) => {
                  setShippingAddress(address)
                }}
                disabled={!email || Boolean(emailEditable)}
                skipSubmission={true}
              />
            )}
          </>
        )}

        {!paymentData && (
          <Button
            className="self-start"
            disabled={!canGoToPayment}
            onClick={(e) => {
              e.preventDefault()
              void initiatePaymentIntent('razorpay')
            }}
          >
            Go to payment
          </Button>
        )}

        {!paymentData && error && (
          <div className="my-8">
            <Message error={error} />

            <Button
              onClick={(e) => {
                e.preventDefault()
                router.refresh()
              }}
              variant="default"
            >
              Try again
            </Button>
          </div>
        )}

        {paymentData && (
          <div className="pb-16">
            <Script
              src="https://checkout.razorpay.com/v1/checkout.js"
              strategy="lazyOnload"
              onLoad={() => setRazorpayReady(true)}
            />
            <h2 className="font-medium text-3xl">Payment</h2>
            {error && <Message error={error} />}
            <div className="mt-8 flex flex-col gap-4">
              <Button disabled={!razorpayReady || paying} type="button" onClick={openRazorpay}>
                {paying ? 'Processing...' : 'Pay now'}
              </Button>
              <Button variant="ghost" className="self-start" onClick={() => setPaymentData(null)}>
                Cancel payment
              </Button>
            </div>
          </div>
        )}
      </div>

      {!cartIsEmpty && (
        <div className="basis-full lg:basis-1/3 lg:pl-8 p-8 border-none bg-primary/5 flex flex-col gap-8 rounded-lg">
          <h2 className="text-3xl font-medium">Your cart</h2>
          {cart?.items?.map((item, index) => {
            if (typeof item.product === 'object' && item.product) {
              const cartProduct = item.product as Product
              const { meta, title, gallery } = cartProduct
              const { quantity, variant } = item

              if (!quantity) return null

              let image = gallery?.[0]?.image || meta?.image
              let price = cartProduct.priceInINR

              const cartVariant =
                variant && typeof variant === 'object' ? (variant as Variant) : null

              if (cartVariant) {
                price = cartVariant.priceInINR

                const imageVariant = cartProduct.gallery?.find((galleryItem: ProductGalleryItem) => {
                  if (!galleryItem.variantOption) return false
                  const variantOptionID =
                    typeof galleryItem.variantOption === 'object'
                      ? galleryItem.variantOption.id
                      : galleryItem.variantOption

                  const hasMatch = cartVariant.options?.some((option: VariantOptionRef) => {
                    if (typeof option === 'object') return option.id === variantOptionID
                    else return option === variantOptionID
                  })

                  return hasMatch
                })

                if (imageVariant && typeof imageVariant.image !== 'string') {
                  image = imageVariant.image
                }
              }

              return (
                <div className="flex items-start gap-4" key={index}>
                  <div className="flex items-stretch justify-stretch h-20 w-20 p-2 rounded-lg border">
                    <div className="relative w-full h-full">
                      {image && typeof image !== 'string' && (
                        <Media className="" fill imgClassName="rounded-lg" resource={image} />
                      )}
                    </div>
                  </div>
                  <div className="flex grow justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-lg">{title}</p>
                      {cartVariant && (
                        <p className="text-sm font-mono text-primary/50 tracking-widest">
                          {cartVariant.options
                            ?.map((option: VariantOptionRef) => {
                              if (typeof option === 'object') return option.label
                              return null
                            })
                            .join(', ')}
                        </p>
                      )}
                      <div>
                        {'x'}
                        {quantity}
                      </div>
                    </div>

                    {typeof price === 'number' && <Price amount={price} />}
                  </div>
                </div>
              )
            }
            return null
          })}
          <hr />
          <div className="flex justify-between items-center gap-2">
            <span className="uppercase">Total</span>{' '}
            <Price className="text-3xl font-medium" amount={cart.subtotal || 0} />
          </div>
        </div>
      )}
    </div>
  )
}

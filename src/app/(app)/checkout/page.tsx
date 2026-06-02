import type { Metadata } from 'next'

import { CheckoutPage } from '@/components/checkout/CheckoutPage'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React, { Fragment } from 'react'

export default function Checkout() {
  const paymentsEnabled = Boolean(process.env.RAZORPAY_API_KEY && process.env.RAZORPAY_SECRET_KEY)

  return (
    <div className="container min-h-[90vh] flex">
      {!paymentsEnabled && (
        <div>
          <Fragment>
            {'Add '}
            <code>RAZORPAY_API_KEY</code>
            {' and '}
            <code>RAZORPAY_SECRET_KEY</code>
            {' to your .env file (server only — do not use NEXT_PUBLIC_ for the secret).'}
          </Fragment>
        </div>
      )}

      <h1 className="sr-only">Checkout</h1>

      <CheckoutPage
        paymentsEnabled={paymentsEnabled}
        storeName={process.env.SITE_NAME || 'Store'}
      />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Checkout.',
  openGraph: mergeOpenGraph({
    title: 'Checkout',
    url: '/checkout',
  }),
  title: 'Checkout',
}

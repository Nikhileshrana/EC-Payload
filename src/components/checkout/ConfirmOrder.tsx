'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Razorpay confirms orders in-page via RazorpayCheckoutForm.
 * This page only handles stale visits without payment parameters.
 */
export const ConfirmOrder: React.FC = () => {
  const { cart } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!cart?.items?.length) {
      router.push('/')
    }
  }, [cart, router])

  return (
    <div className="text-center w-full flex flex-col items-center justify-start gap-4">
      <h1 className="text-2xl">Confirming Order</h1>
      <LoadingSpinner className="w-12 h-6" />
    </div>
  )
}

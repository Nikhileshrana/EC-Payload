'use client'

import { Button } from '@/components/ui/button'
import type { Product } from '@/payload-types'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'
import { toast } from 'sonner'

import { useSelectedVariant } from '@/components/product/useSelectedVariant'

type Props = {
  product: Product
}

function useAddToCartDisabled(product: Product) {
  const { cart } = useCart()
  const selectedVariant = useSelectedVariant(product)

  return useMemo(() => {
    const existingItem = cart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product
      const variantID = item.variant
        ? typeof item.variant === 'object'
          ? item.variant?.id
          : item.variant
        : undefined

      if (productID === product.id) {
        if (product.enableVariants) {
          return variantID === selectedVariant?.id
        }
        return true
      }
    })

    if (existingItem) {
      const existingQuantity = existingItem.quantity

      if (product.enableVariants) {
        return existingQuantity >= (selectedVariant?.inventory || 0)
      }
      return existingQuantity >= (product.inventory || 0)
    }

    if (product.enableVariants) {
      if (!selectedVariant) {
        return true
      }

      if (selectedVariant.inventory === 0) {
        return true
      }
    } else if (product.inventory === 0) {
      return true
    }

    return false
  }, [selectedVariant, cart?.items, product])
}

export function AddToCart({ product }: Props) {
  const { addItem, isLoading } = useCart()
  const selectedVariant = useSelectedVariant(product)
  const disabled = useAddToCartDisabled(product)

  const addToCart = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      addItem({
        product: product.id,
        variant: selectedVariant?.id ?? undefined,
      }).then(() => {
        toast.success('Item added to cart.')
      })
    },
    [addItem, product, selectedVariant],
  )

  return (
    <Button
      aria-label="Add to cart"
      variant="outline"
      className="h-12 flex-1 rounded-none border-foreground bg-white font-mono text-xs uppercase tracking-[0.2em] text-foreground hover:bg-neutral-50"
      disabled={disabled || isLoading}
      onClick={addToCart}
      type="button"
    >
      Add To Cart
    </Button>
  )
}

export function BuyItNow({ product }: Props) {
  const { addItem, isLoading } = useCart()
  const router = useRouter()
  const selectedVariant = useSelectedVariant(product)
  const disabled = useAddToCartDisabled(product)

  const buyNow = useCallback(
    async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      await addItem({
        product: product.id,
        variant: selectedVariant?.id ?? undefined,
      })

      router.push('/checkout')
    },
    [addItem, product, router, selectedVariant],
  )

  return (
    <Button
      aria-label="Buy it now"
      className="h-12 w-full rounded-none font-mono text-xs uppercase tracking-[0.2em]"
      disabled={disabled || isLoading}
      onClick={buyNow}
      type="button"
    >
      Buy It Now
    </Button>
  )
}

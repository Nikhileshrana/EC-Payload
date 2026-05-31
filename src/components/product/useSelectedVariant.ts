'use client'

import type { Product, Variant } from '@/payload-types'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export function useSelectedVariant(product: Product): Variant | undefined {
  const searchParams = useSearchParams()
  const variants = product.variants?.docs || []

  return useMemo(() => {
    if (!product.enableVariants || !variants.length) {
      return undefined
    }

    const variantId = searchParams.get('variant')
    const match = variants.find((variant) => {
      if (typeof variant === 'object') {
        return String(variant.id) === variantId
      }

      return String(variant) === variantId
    })

    return match && typeof match === 'object' ? match : undefined
  }, [product.enableVariants, searchParams, variants])
}

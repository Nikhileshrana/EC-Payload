'use client'
import type { Product } from '@/payload-types'
import { useMemo } from 'react'

import { useSelectedVariant } from './useSelectedVariant'

type Props = {
  product: Product
}

export const StockIndicator: React.FC<Props> = ({ product }) => {
  const selectedVariant = useSelectedVariant(product)

  const stockQuantity = useMemo(() => {
    if (product.enableVariants) {
      if (selectedVariant) {
        return selectedVariant.inventory || 0
      }
    }
    return product.inventory || 0
  }, [product.enableVariants, selectedVariant, product.inventory])

  if (product.enableVariants && !selectedVariant) {
    return (
      <p className="text-sm text-muted-foreground">Please select your options to check availability.</p>
    )
  }

  if (stockQuantity === 0 || !stockQuantity) {
    return <p className="text-sm font-medium text-destructive">Out of stock</p>
  }

  if (stockQuantity < 10) {
    return <p className="text-sm text-muted-foreground">Only {stockQuantity} left in stock.</p>
  }

  return <p className="text-sm text-muted-foreground">In stock and ready to ship.</p>
}

import type { Product, ProductShowcaseBlock as ProductShowcaseBlockProps } from '@/payload-types'
import React from 'react'

import { ProductShowcaseClient } from './Component.client'

export const ProductShowcaseBlock: React.FC<ProductShowcaseBlockProps> = (props) => {
  const { products: productsFromProps, ...rest } = props

  const products = (productsFromProps ?? [])
    .filter((product): product is Product => typeof product === 'object' && product !== null)
    .slice(0, 3)

  if (!products.length) {
    return null
  }

  return <ProductShowcaseClient {...rest} products={products} />
}

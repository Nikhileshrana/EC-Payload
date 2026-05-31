import type { Product, ProductShowcaseBlock as ProductShowcaseBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { ProductShowcaseClient } from './Component.client'

const productPopulate = {
  variants: {
    title: true,
    priceInINR: true,
    inventory: true,
    options: true,
  },
} as const

async function resolveProducts(props: ProductShowcaseBlockProps): Promise<Product[]> {
  const payload = await getPayload({ config: configPromise })

  if (props.productSource === 'category' && props.category) {
    const categoryId = typeof props.category === 'object' ? props.category.id : props.category

    const result = await payload.find({
      collection: 'products',
      depth: 2,
      limit: props.productLimit ?? 8,
      sort: '-createdAt',
      where: {
        and: [
          {
            categories: {
              contains: categoryId,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
      populate: productPopulate,
    })

    return result.docs
  }

  const productIds = (props.products ?? [])
    .map((product) => (typeof product === 'object' ? product.id : product))
    .filter((id): id is string => Boolean(id))

  if (!productIds.length) {
    return []
  }

  const result = await payload.find({
    collection: 'products',
    depth: 2,
    limit: productIds.length,
    pagination: false,
    where: {
      and: [
        {
          id: {
            in: productIds,
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
    populate: productPopulate,
  })

  const productsById = new Map(result.docs.map((doc) => [doc.id, doc]))

  return productIds
    .map((id) => productsById.get(id))
    .filter((product): product is Product => Boolean(product))
}

export async function ProductShowcaseBlock(props: ProductShowcaseBlockProps) {
  const { products: _products, category: _category, productLimit: _productLimit, ...rest } = props
  const products = await resolveProducts(props)

  if (!products.length) {
    return null
  }

  return <ProductShowcaseClient {...rest} products={products} />
}

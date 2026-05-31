import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Product } from '@/payload-types'

export const revalidateProduct: CollectionAfterChangeHook<Product> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context?.disableRevalidate) {
    return doc
  }

  const revalidateProductPaths = (product: Product) => {
    if (product.slug) {
      payload.logger.info(`Revalidating product: ${product.slug}`)
      revalidateTag(`product_${product.slug}`, 'max')
      revalidatePath(`/products/${product.slug}`)
    }
  }

  if (doc._status === 'published') {
    revalidateProductPaths(doc)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    revalidateProductPaths(previousDoc)
  }

  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    revalidateTag(`product_${previousDoc.slug}`, 'max')
    revalidatePath(`/products/${previousDoc.slug}`)
  }

  revalidateTag('products', 'max')
  revalidatePath('/shop')

  return doc
}

export const revalidateProductDelete: CollectionAfterDeleteHook<Product> = ({
  doc,
  req: { context },
}) => {
  if (context?.disableRevalidate) {
    return doc
  }

  if (doc?.slug) {
    revalidateTag(`product_${doc.slug}`, 'max')
    revalidatePath(`/products/${doc.slug}`)
  }

  revalidateTag('products', 'max')
  revalidatePath('/shop')

  return doc
}

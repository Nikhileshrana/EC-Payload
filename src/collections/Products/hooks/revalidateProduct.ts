import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Product } from '@/payload-types'

const revalidateStorefrontListings = () => {
  revalidateTag('products', 'max')
  // Shop listing + home (product showcase / category blocks)
  revalidatePath('/shop')
  revalidatePath('/')
}

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

  const isPublished = doc._status === 'published'
  const wasPublished = previousDoc?._status === 'published'

  // Only revalidate when storefront-visible data changes. Skip draft auto-creation
  // on /admin/collections/products/create — revalidateTag during render throws.
  if (isPublished) {
    revalidateProductPaths(doc)
    revalidateStorefrontListings()
  } else if (wasPublished) {
    revalidateProductPaths(previousDoc)
    revalidateStorefrontListings()
  }

  if (previousDoc?.slug && previousDoc.slug !== doc.slug && (isPublished || wasPublished)) {
    revalidateTag(`product_${previousDoc.slug}`, 'max')
    revalidatePath(`/products/${previousDoc.slug}`)
  }

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

  revalidateStorefrontListings()

  return doc
}

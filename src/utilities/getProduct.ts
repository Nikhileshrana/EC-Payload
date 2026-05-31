import type { Product } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

const productPopulate = {
  variants: {
    title: true,
    priceInINR: true,
    inventory: true,
    options: true,
  },
} as const

export async function queryProductBySlug({
  slug,
  draft = false,
}: {
  slug: string
  draft?: boolean
}): Promise<Product | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    populate: productPopulate,
  })

  return result.docs?.[0] || null
}

export const getCachedProductBySlug = (slug: string) =>
  unstable_cache(async () => queryProductBySlug({ slug }), ['product', slug], {
    tags: [`product_${slug}`, 'products'],
  })

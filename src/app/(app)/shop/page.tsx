import { ProductShowcaseCard } from '@/blocks/ProductShowcase/ProductShowcaseCard'
import { Grid } from '@/components/Grid'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

const productPopulate = {
  variants: {
    title: true,
    priceInINR: true,
    inventory: true,
    options: true,
  },
} as const

export const metadata = {
  description: 'Search for products in the store.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const { q: searchValue, sort, category } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 2,
    draft: false,
    overrideAccess: false,
    populate: productPopulate,
    ...(sort ? { sort } : { sort: 'title' }),
    where: {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        ...(searchValue
          ? [
              {
                or: [
                  {
                    title: {
                      like: searchValue,
                    },
                  },
                  {
                    description: {
                      like: searchValue,
                    },
                  },
                ],
              },
            ]
          : []),
        ...(category
          ? [
              {
                categories: {
                  contains: category,
                },
              },
            ]
          : []),
      ],
    },
  })

  const resultsText = products.docs.length > 1 ? 'results' : 'result'

  return (
    <div>
      {searchValue ? (
        <p className="mb-4">
          {products.docs?.length === 0
            ? 'There are no products that match '
            : `Showing ${products.docs.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {!searchValue && products.docs?.length === 0 && (
        <p className="mb-4">No products found. Please try different filters.</p>
      )}

      {products?.docs.length > 0 ? (
        <Grid className="grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3 2xl:grid-cols-4">
          {products.docs.map((product) => (
            <ProductShowcaseCard key={product.id} product={product} />
          ))}
        </Grid>
      ) : null}
    </div>
  )
}

'use client'

import type { Product, ProductShowcaseBlock } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import React from 'react'

import { ProductShowcaseCard } from './ProductShowcaseCard'

type Props = Omit<ProductShowcaseBlock, 'products'> & {
  products: Product[]
}

export const ProductShowcaseClient: React.FC<Props> = ({
  description,
  products,
  reviewsLabel,
  seeAll,
  title,
}) => {
  if (!products.length) {
    return null
  }

  return (
    <section className="container py-16 md:py-24">
      <div className="mb-6 flex items-center gap-3">
        <span aria-hidden className="size-2.5 shrink-0 bg-primary" />
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      </div>

      {description ? (
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-primary/70 md:text-base">
          {description}
        </p>
      ) : null}

      {seeAll?.label ? (
        <div className="mb-10 flex justify-end">
          <CMSLink
            {...seeAll}
            appearance="inline"
            className="font-mono text-xs uppercase tracking-widest text-primary/70 hover:text-primary"
          />
        </div>
      ) : (
        <div className="mb-10" />
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductShowcaseCard key={product.id} product={product} reviewsLabel={reviewsLabel} />
        ))}
      </div>
    </section>
  )
}

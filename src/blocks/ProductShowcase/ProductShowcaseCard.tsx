'use client'

import type { Product } from '@/payload-types'
import { Price } from '@/components/Price'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import { Heart, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {
  product: Product
  reviewsLabel?: string | null
}

function getProductPrice(product: Product): number | undefined {
  let price = product.priceInINR ?? undefined

  if (product.enableVariants && product.variants?.docs?.length) {
    const variant = product.variants.docs[0]
    if (variant && typeof variant === 'object' && typeof variant.priceInINR === 'number') {
      price = variant.priceInINR
    }
  }

  return typeof price === 'number' ? price : undefined
}

export const ProductShowcaseCard: React.FC<Props> = ({ product, reviewsLabel }) => {
  const [wishlisted, setWishlisted] = useState(false)
  const price = getProductPrice(product)
  const href = `/products/${product.slug}`

  const image =
    product.gallery?.[0]?.image && typeof product.gallery[0].image !== 'string'
      ? product.gallery[0].image
      : null

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative flex flex-col bg-muted/60 px-6 pb-6 pt-8">
        <button
          type="button"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-background shadow-sm transition hover:opacity-80"
          onClick={() => setWishlisted((value) => !value)}
        >
          <Heart
            className={cn('size-4', wishlisted ? 'fill-primary text-primary' : 'text-primary/70')}
          />
        </button>

        <Link className="relative mx-auto mb-8 mt-4 block aspect-square w-full max-w-[220px]" href={href}>
          {image ? (
            <Media
              className="relative h-full w-full"
              fill
              imgClassName="object-contain"
              resource={image}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-primary/40">
              No image
            </div>
          )}
        </Link>

        <div className="flex items-center justify-center gap-2">
          <Link
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition hover:bg-background/80"
            href={href}
          >
            Buy now
            <ShoppingBag className="size-3.5" />
          </Link>
          {typeof price === 'number' ? (
            <div className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-primary-foreground">
              <Price amount={price} as="span" />
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 border-t border-border px-5 py-4">
        <div>
          <Link className="font-medium hover:underline" href={href}>
            {product.title}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-xs text-primary/60">
            <span className="flex text-amber-500" aria-hidden>
              {'★★★★★'}
            </span>
            {reviewsLabel ? <span>{reviewsLabel}</span> : null}
          </div>
        </div>
        <Link
          className="shrink-0 font-mono text-xs uppercase tracking-widest text-primary/70 hover:text-primary"
          href={href}
        >
          Details
        </Link>
      </div>
    </article>
  )
}

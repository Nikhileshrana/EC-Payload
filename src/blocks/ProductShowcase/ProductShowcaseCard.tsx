'use client'

import type { Product } from '@/payload-types'
import { Price } from '@/components/Price'
import { Media } from '@/components/Media'
import { ProductRating } from '@/components/product/ProductRating'
import { cn } from '@/utilities/cn'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import { getProductPrice, getProductSizes } from './utils'

type Props = {
  product: Product
}

export const ProductShowcaseCard: React.FC<Props> = ({ product }) => {
  const [wishlisted, setWishlisted] = useState(false)
  const price = getProductPrice(product)
  const sizes = getProductSizes(product)
  const href = `/products/${product.slug}`

  const image =
    product.gallery?.[0]?.image && typeof product.gallery[0].image !== 'string'
      ? product.gallery[0].image
      : product.meta?.image && typeof product.meta.image !== 'string'
        ? product.meta.image
        : null

  return (
    <article className="group flex flex-col text-center">
      <div className="relative overflow-hidden bg-neutral-100">
        <Link className="relative block aspect-[3/4] w-full" href={href}>
          {image ? (
            <Media
              className="relative h-full w-full"
              fill
              imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              resource={image}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </Link>

        <button
          type="button"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 flex size-8 items-center justify-center bg-white/90 transition hover:bg-white"
          onClick={() => setWishlisted((value) => !value)}
        >
          <Heart
            className={cn('size-4', wishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-700')}
          />
        </button>

        <Link
          className="absolute inset-x-4 bottom-4 translate-y-2 bg-white px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-900 opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          href={href}
        >
          Quick view
        </Link>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 px-1">
        <Link
          className="line-clamp-2 text-sm leading-snug text-foreground hover:underline md:text-[15px]"
          href={href}
        >
          {product.title}
        </Link>

        <ProductRating rating={product.rating} reviewCount={product.reviewCount} />

        {typeof price === 'number' ? (
          <div className="text-sm font-semibold text-foreground">
            <Price amount={price} as="span" />
          </div>
        ) : null}

        {sizes.length ? (
          <p className="pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
            {sizes.join('  ')}
          </p>
        ) : null}
      </div>
    </article>
  )
}

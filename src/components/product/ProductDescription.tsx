'use client'
import type { Product } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { AddToCart, BuyItNow } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import { cn } from '@/utilities/cn'
import { Heart } from 'lucide-react'
import React, { Suspense, useState } from 'react'

import { ProductRating } from '@/components/product/ProductRating'
import { StockIndicator } from '@/components/product/StockIndicator'
import { VariantSelector } from '@/components/product/VariantSelector'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import type { Variant } from '@/payload-types'

export function ProductDescription({ product }: { product: Product }) {
  const { currency } = useCurrency()
  const [wishlisted, setWishlisted] = useState(false)
  let amount = 0
  let lowestAmount = 0
  let highestAmount = 0
  const priceField = `priceIn${currency.code}` as keyof Product
  const hasVariants = product.enableVariants && Boolean(product.variants?.docs?.length)

  if (hasVariants) {
    const variantPriceField = `priceIn${currency.code}` as keyof Variant
    const variantsOrderedByPrice = product.variants?.docs
      ?.filter((variant) => variant && typeof variant === 'object')
      .sort((a, b) => {
        if (
          typeof a === 'object' &&
          typeof b === 'object' &&
          variantPriceField in a &&
          variantPriceField in b &&
          typeof a[variantPriceField] === 'number' &&
          typeof b[variantPriceField] === 'number'
        ) {
          return a[variantPriceField] - b[variantPriceField]
        }

        return 0
      }) as Variant[]

    const lowestVariant = variantsOrderedByPrice?.[0]?.[variantPriceField]
    const highestVariant =
      variantsOrderedByPrice?.[variantsOrderedByPrice.length - 1]?.[variantPriceField]

    if (
      variantsOrderedByPrice &&
      typeof lowestVariant === 'number' &&
      typeof highestVariant === 'number'
    ) {
      lowestAmount = lowestVariant
      highestAmount = highestVariant
    }
  } else if (product[priceField] && typeof product[priceField] === 'number') {
    amount = product[priceField]
  }

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-6 break-words lg:pt-2">
      <div className="flex min-w-0 flex-col gap-3">
        <h1 className="text-2xl font-normal leading-snug break-words text-primary md:text-[28px]">
          {product.title}
        </h1>

        <div className="flex flex-wrap items-baseline gap-2 text-base text-foreground">
          {hasVariants ? (
            <Price
              as="span"
              className="font-normal"
              highestAmount={highestAmount}
              lowestAmount={lowestAmount}
            />
          ) : (
            <Price amount={amount} as="span" className="font-normal" />
          )}
          <span className="text-sm text-muted-foreground">(Inclusive of all taxes)</span>
        </div>

        <ProductRating
          className="justify-start"
          rating={product.rating}
          reviewCount={product.reviewCount}
          starClassName="size-4"
        />
      </div>

      {hasVariants ? (
        <Suspense fallback={null}>
          <VariantSelector product={product} variantTypeName="size" />
        </Suspense>
      ) : null}

      {hasVariants ? (
        <Suspense fallback={null}>
          <VariantSelector product={product} />
        </Suspense>
      ) : null}

      <Suspense fallback={null}>
        <StockIndicator product={product} />
      </Suspense>

      <p className="text-sm font-medium text-foreground">
        Product will be shipped within 2–3 days.
      </p>

      <div className="flex items-center gap-3">
        <Suspense fallback={null}>
          <AddToCart product={product} />
        </Suspense>
        <button
          type="button"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="flex size-12 shrink-0 items-center justify-center border border-neutral-200 bg-white transition hover:border-neutral-400"
          onClick={() => setWishlisted((value) => !value)}
        >
          <Heart
            className={cn('size-5', wishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-700')}
          />
        </button>
      </div>

      <Suspense fallback={null}>
        <BuyItNow product={product} />
      </Suspense>

      {product.description ? (
        <div className="border-t border-neutral-200 pt-6">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Product Details
          </h2>
          <RichText
            className="max-w-full text-sm leading-relaxed break-words text-muted-foreground prose-headings:break-words prose-p:break-words prose-li:break-words"
            data={product.description}
            enableGutter={false}
          />
        </div>
      ) : null}
    </div>
  )
}

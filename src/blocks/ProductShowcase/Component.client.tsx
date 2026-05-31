'use client'

import type { Product, ProductShowcaseBlock } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import React from 'react'

import { ProductShowcaseCard } from './ProductShowcaseCard'

type Props = Omit<
  ProductShowcaseBlock,
  'products' | 'category' | 'productLimit' | 'productSource'
> & {
  products: Product[]
}

export const ProductShowcaseClient: React.FC<Props> = ({ products, seeAll, title }) => {
  if (!products.length) {
    return null
  }

  return (
    <section className="bg-background py-14 md:py-20">
      <div className="container">
        <h2 className="mb-10 text-center font-mono text-sm uppercase tracking-[0.35em] text-foreground md:text-base">
          <span aria-hidden className="mr-3">
            *
          </span>
          {title}
          <span aria-hidden className="ml-3">
            *
          </span>
        </h2>

        <div className="relative px-0 md:px-10">
          <Carousel
            className="w-full"
            opts={{
              align: 'start',
              dragFree: true,
            }}
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-[72%] pl-4 sm:basis-1/2 md:basis-1/3 md:pl-6 lg:basis-1/4"
                >
                  <ProductShowcaseCard key={product.id} product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            {products.length > 1 ? (
              <>
                <CarouselPrevious className="left-0 top-[38%] hidden size-10 rounded-none border-border bg-white text-foreground shadow-md hover:bg-white md:inline-flex" />
                <CarouselNext className="right-0 top-[38%] hidden size-10 rounded-none border-border bg-white text-foreground shadow-md hover:bg-white md:inline-flex" />
              </>
            ) : null}
          </Carousel>
        </div>

        {seeAll?.label ? (
          <div className="mt-12 flex justify-center">
            <CMSLink
              {...seeAll}
              appearance="inline"
              className="inline-flex min-w-[220px] items-center justify-center bg-primary px-10 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground transition hover:bg-primary/90"
              label={seeAll.label}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}

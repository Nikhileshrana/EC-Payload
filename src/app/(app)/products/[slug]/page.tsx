import type { Media, Product } from '@/payload-types'

import { ProductShowcaseCard } from '@/blocks/ProductShowcase/ProductShowcaseCard'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import { ProductPageLayout } from '@/components/product/ProductPageLayout'
import { getCachedProductBySlug, queryProductBySlug } from '@/utilities/getProduct'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { ChevronLeftIcon } from 'lucide-react'
import { Metadata } from 'next'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const product = draft
    ? await queryProductBySlug({ slug, draft: true })
    : await getCachedProductBySlug(slug)()

  if (!product) return notFound()

  const gallery = product.gallery?.filter((item) => typeof item.image === 'object') || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const canIndex = product._status === 'published'

  const seoImage = metaImage || (gallery.length ? (gallery[0]?.image as Media) : undefined)

  return {
    description: product.meta?.description || '',
    openGraph: seoImage?.url
      ? {
          images: [
            {
              alt: seoImage?.alt,
              height: seoImage.height!,
              url: seoImage?.url,
              width: seoImage.width!,
            },
          ],
        }
      : null,
    robots: {
      follow: canIndex,
      googleBot: {
        follow: canIndex,
        index: canIndex,
      },
      index: canIndex,
    },
    title: product.meta?.title || product.title,
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const product = draft
    ? await queryProductBySlug({ slug, draft: true })
    : await getCachedProductBySlug(slug)()

  if (!product) return notFound()

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({
        ...item,
        image: item.image as Media,
      })) || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const hasStock = product.enableVariants
    ? product?.variants?.docs?.some((variant) => {
        if (typeof variant !== 'object') return false
        return variant.inventory && variant?.inventory > 0
      })
    : product.inventory! > 0

  let price = product.priceInINR

  if (product.enableVariants && product?.variants?.docs?.length) {
    price = product?.variants?.docs?.reduce((acc, variant) => {
      if (typeof variant === 'object' && variant?.priceInINR && acc && variant?.priceInINR > acc) {
        return variant.priceInINR
      }
      return acc
    }, price)
  }

  const productJsonLd = {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    description: product.description,
    image: metaImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: price,
      priceCurrency: 'inr',
    },
  }

  const relatedProducts =
    product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct === 'object') ?? []

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      <div className="container py-8 md:py-12">
        <Link
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
          href="/shop"
        >
          <ChevronLeftIcon className="size-4" />
          All products
        </Link>

        <ProductPageLayout
          gallery={
            <Suspense
              fallback={
                <div className="relative aspect-[3/4] w-full animate-pulse bg-neutral-100" />
              }
            >
              {Boolean(gallery?.length) && <Gallery gallery={gallery} />}
            </Suspense>
          }
          details={
            <div className="flex flex-col gap-10 pb-16 [&_*]:max-w-full [&_.container]:my-0 [&_.container]:max-w-none [&_.container]:px-0 [&_.grid]:!grid-cols-1 [&_.grid]:!gap-x-0 [&_.grid]:gap-y-6 [&_[class*='col-span']]:!col-span-1 [&_[class*='lg:col-span']]:!col-span-1 [&_img]:h-auto [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap">
              <ProductDescription product={product} />

              {product.layout?.length ? (
                <RenderBlocks blockWrapperClassName="mt-2" blocks={product.layout} />
              ) : null}

              {relatedProducts.length ? (
                <RelatedProducts products={relatedProducts as Product[]} />
              ) : null}
            </div>
          }
        />
      </div>
    </React.Fragment>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <section className="border-t border-neutral-200 pt-10">
      <h2 className="mb-8 font-mono text-xs uppercase tracking-[0.35em] text-foreground">
        Related Products
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8">
        {products.map((product) => (
          <ProductShowcaseCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

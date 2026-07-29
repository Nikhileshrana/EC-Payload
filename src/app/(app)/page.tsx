import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { homeStaticData } from '@/endpoints/seed/home-static'
import React from 'react'
import type { Page as PageType } from '@/payload-types'
import { notFound } from 'next/navigation'

export default async function HomePage() {
  const page = await queryPageBySlug({ slug: 'home' })
  const resolved = page ?? (homeStaticData() as PageType)

  if (!resolved?.layout) {
    return notFound()
  }

  return (
    <article className="pb-24">
      <RenderHero {...resolved.hero} />
      <RenderBlocks blocks={resolved.layout} />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug({ slug: 'home' })
  return generateMeta({ doc: page })
}

async function queryPageBySlug({ slug }: { slug: string }) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        { slug: { equals: slug } },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return result.docs?.[0] || null
}

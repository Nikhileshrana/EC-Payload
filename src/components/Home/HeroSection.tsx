'use client'

import type { Home } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

type HeroProps = NonNullable<Home['hero']>

export const HomeHeroSection: React.FC<{ hero: HeroProps }> = ({ hero }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const { description, heading, links, media } = hero

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  if (!media || typeof media !== 'object') {
    return null
  }

  const cta = links?.[0]?.link

  return (
    <section
      className="relative h-[75dvh] w-full overflow-hidden text-white md:h-[90dvh]"
      data-theme="dark"
    >
      <Media fill imgClassName="object-cover" priority resource={media} />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"
      />
      <div className="container relative z-10 flex h-full items-center py-16 md:py-24">
        <div className="max-w-xl">
          {heading ? (
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {heading}
            </h1>
          ) : null}
          {description ? (
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/90 md:text-lg">
              {description}
            </p>
          ) : null}
          {cta ? (
            <div className="mt-8">
              <CMSLink
                {...cta}
                appearance={cta.appearance ?? 'default'}
                className="inline-flex items-center gap-2 rounded-none bg-black px-6 py-3 font-mono text-xs uppercase tracking-widest text-white hover:bg-black/90"
                label={cta.label ? `${cta.label} →` : undefined}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

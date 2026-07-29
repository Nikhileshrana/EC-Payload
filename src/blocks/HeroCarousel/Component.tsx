'use client'

import type { HeroCarouselBlock as HeroCarouselBlockProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import { cn } from '@/utilities/cn'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useEffect, useState } from 'react'

type Slide = NonNullable<HeroCarouselBlockProps['slides']>[number]
type TextAlign = NonNullable<Slide['textAlign']>

const alignmentMap: Record<TextAlign, { container: string; content: string }> = {
  left: {
    container: 'items-center justify-start',
    content: 'text-left',
  },
  right: {
    container: 'items-center justify-end',
    content: 'text-right',
  },
  top: {
    container: 'items-start justify-center',
    content: 'text-center',
  },
  bottom: {
    container: 'items-end justify-center',
    content: 'text-center',
  },
  center: {
    container: 'items-center justify-center',
    content: 'text-center',
  },
}

function HeroSlide({ slide, priority }: { slide: Slide; priority?: boolean }) {
  const { media, heading, description, links, textAlign = 'center' } = slide
  const cta = links?.[0]?.link
  const align = alignmentMap[textAlign]

  if (!media || typeof media !== 'object') {
    return null
  }

  return (
    <div className="relative h-[75dvh] w-full md:h-[90dvh]">
      <Media fill imgClassName="object-cover" priority={priority} resource={media} />
      <div aria-hidden className="absolute inset-0 bg-black/35" />
      <div className={cn('container relative z-10 flex h-full py-16 md:py-24', align.container)}>
        <div className={cn('max-w-xl text-white', align.content)}>
          {heading ? (
            <h1 className="text-4xl font-semibold uppercase leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {heading}
            </h1>
          ) : null}
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-white/85 md:text-lg">{description}</p>
          ) : null}
          {cta ? (
            <div
              className={cn(
                'mt-8',
                textAlign === 'center' || textAlign === 'top' || textAlign === 'bottom'
                  ? 'flex justify-center'
                  : textAlign === 'right'
                    ? 'flex justify-end'
                    : 'flex justify-start',
              )}
            >
              <CMSLink
                {...cta}
                appearance={cta.appearance ?? 'default'}
                className="inline-flex items-center rounded-none bg-white px-8 py-3 font-mono text-xs uppercase tracking-widest text-black hover:bg-white/90"
                label={cta.label}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function HeroCarouselBlock(props: HeroCarouselBlockProps) {
  const { setHeaderTheme } = useHeaderTheme()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const slides = props.slides ?? []
  const slideInterval = props.slideInterval ?? 5

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    onSelect()
    api.on('select', onSelect)

    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  useEffect(() => {
    if (!api || slides.length <= 1 || slideInterval <= 0) return

    const interval = window.setInterval(() => {
      api.scrollNext()
    }, slideInterval * 1000)

    return () => window.clearInterval(interval)
  }, [api, slideInterval, slides.length])

  if (!slides.length) {
    return null
  }

  return (
    <section className="relative w-full overflow-hidden text-white" data-theme="dark">
      <Carousel
        className="w-full"
        opts={{ align: 'start', loop: slides.length > 1 }}
        setApi={setApi}
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id ?? index} className="basis-full pl-0">
              <HeroSlide slide={slide} priority={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {slides.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id ?? index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={current === index ? 'true' : undefined}
              className={cn(
                'pointer-events-auto h-1 w-8 transition-colors duration-300',
                current === index ? 'bg-white' : 'bg-white/35 hover:bg-white/60',
              )}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}

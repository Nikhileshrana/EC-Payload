'use client'

import type { PromoBannerBlock } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import { cn } from '@/utilities/cn'
import { useEffect, useState } from 'react'

type Slide = NonNullable<PromoBannerBlock['slides']>[number]
type DisplayMode = NonNullable<PromoBannerBlock['displayMode']>
type Layout = NonNullable<PromoBannerBlock['layout']>
type TextAlign = NonNullable<Slide['textAlign']>

const overlayAlignmentMap: Record<
  TextAlign,
  { container: string; content: string; cta: string }
> = {
  left: {
    container: 'items-center justify-start',
    content: 'text-left',
    cta: 'justify-start',
  },
  right: {
    container: 'items-center justify-end',
    content: 'text-right',
    cta: 'justify-end',
  },
  center: {
    container: 'items-center justify-center',
    content: 'text-center',
    cta: 'justify-center',
  },
  top: {
    container: 'items-start justify-center',
    content: 'text-center',
    cta: 'justify-center',
  },
  bottom: {
    container: 'items-end justify-center',
    content: 'text-center',
    cta: 'justify-center',
  },
}

function SlideTextContent({
  heading,
  subheading,
  cta,
  textAlign,
  overlay,
}: {
  heading?: string | null
  subheading?: string | null
  cta?: Slide['links'] extends (infer U)[] | null | undefined
    ? U extends { link: infer L }
      ? L
      : never
    : never
  textAlign: TextAlign
  overlay?: boolean
}) {
  const align = overlayAlignmentMap[textAlign]
  const isCentered = textAlign === 'center' || textAlign === 'top' || textAlign === 'bottom'

  return (
    <div
      className={cn(
        'flex max-w-xl flex-col',
        overlay
          ? cn('text-white', align.content)
          : cn(
              'items-center justify-center px-6 py-12 text-center md:px-10 md:py-16 lg:px-16',
              textAlign === 'left'
                ? 'md:items-start md:text-left'
                : textAlign === 'right'
                  ? 'md:items-end md:text-right'
                  : 'md:items-center md:text-center',
            ),
      )}
    >
      {heading ? (
        <div
          className={cn(
            'flex items-center gap-4',
            isCentered ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start',
          )}
        >
          <span
            aria-hidden
            className={cn('hidden h-px flex-1 md:block', overlay ? 'bg-white/40' : 'bg-border')}
          />
          <h2
            className={cn(
              'shrink-0 font-mono text-sm uppercase tracking-[0.35em] md:text-base',
              overlay ? 'text-white' : 'text-foreground',
            )}
          >
            {heading}
          </h2>
          <span
            aria-hidden
            className={cn('hidden h-px flex-1 md:block', overlay ? 'bg-white/40' : 'bg-border')}
          />
        </div>
      ) : null}
      {subheading ? (
        <p
          className={cn(
            'mt-4 font-mono text-xs uppercase tracking-[0.28em] md:text-sm',
            overlay ? 'text-white/85' : 'text-muted-foreground',
          )}
        >
          {subheading}
        </p>
      ) : null}
      {cta ? (
        <div className={cn('mt-8 flex', overlay ? align.cta : 'justify-center md:justify-start')}>
          <CMSLink
            {...cta}
            appearance={cta.appearance ?? 'default'}
            className={cn(
              'inline-flex items-center px-8 py-3 font-mono text-xs uppercase tracking-[0.25em] transition',
              overlay
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
            label={cta.label}
          />
        </div>
      ) : null}
    </div>
  )
}

function PromoBannerSlide({
  imageOnly,
  layout = 'overlay',
  slide,
  priority,
}: {
  imageOnly?: boolean
  layout?: Layout
  slide: Slide
  priority?: boolean
}) {
  const { media, heading, subheading, links, textAlign = 'left' } = slide
  const cta = links?.[0]?.link
  const imageOnRight = textAlign !== 'right'

  if (!media || typeof media !== 'object') {
    return null
  }

  if (imageOnly) {
    return (
      <div className="relative min-h-[320px] w-full md:min-h-[480px]">
        <Media fill imgClassName="object-cover object-center" priority={priority} resource={media} />
      </div>
    )
  }

  if (layout === 'overlay') {
    const align = overlayAlignmentMap[textAlign]

    return (
      <div className="relative min-h-[420px] w-full md:min-h-[520px]">
        <Media fill imgClassName="object-cover object-center" priority={priority} resource={media} />
        <div aria-hidden className="absolute inset-0 bg-black/30" />
        <div className={cn('container relative z-10 flex h-full min-h-[420px] py-12 md:min-h-[520px] md:py-16', align.container)}>
          <SlideTextContent
            cta={cta}
            heading={heading}
            overlay
            subheading={subheading}
            textAlign={textAlign}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-[420px] grid-cols-1 bg-background md:min-h-[480px] md:grid-cols-2">
      {imageOnRight ? (
        <>
          <SlideTextContent cta={cta} heading={heading} subheading={subheading} textAlign={textAlign} />
          <div className="relative min-h-[320px] w-full md:min-h-[420px]">
            <Media fill imgClassName="object-cover object-center" priority={priority} resource={media} />
          </div>
        </>
      ) : (
        <>
          <div className="relative min-h-[320px] w-full md:min-h-[420px]">
            <Media fill imgClassName="object-cover object-center" priority={priority} resource={media} />
          </div>
          <SlideTextContent cta={cta} heading={heading} subheading={subheading} textAlign={textAlign} />
        </>
      )}
    </div>
  )
}

export function PromoBannerClient({
  displayMode,
  layout,
  slideInterval,
  slides,
}: PromoBannerBlock) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const mode: DisplayMode = displayMode ?? 'singleSplit'
  const bannerLayout: Layout = layout ?? 'overlay'
  const isCarousel = mode === 'carousel'
  const isImageOnly = mode === 'singleImage'
  const activeSlides = isCarousel ? (slides ?? []) : (slides ?? []).slice(0, 1)
  const interval = slideInterval ?? 5

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
    if (!api || !isCarousel || activeSlides.length <= 1 || interval <= 0) return

    const timer = window.setInterval(() => {
      api.scrollNext()
    }, interval * 1000)

    return () => window.clearInterval(timer)
  }, [api, activeSlides.length, interval, isCarousel])

  if (!activeSlides.length) {
    return null
  }

  if (!isCarousel) {
    return (
      <section className="w-full overflow-hidden">
        <PromoBannerSlide
          imageOnly={isImageOnly}
          layout={bannerLayout}
          slide={activeSlides[0]}
          priority
        />
      </section>
    )
  }

  return (
    <section className="relative w-full overflow-hidden">
      <Carousel className="w-full" opts={{ align: 'start', loop: true }} setApi={setApi}>
        <CarouselContent className="ml-0">
          {activeSlides.map((slide, index) => (
            <CarouselItem key={slide.id ?? index} className="basis-full pl-0">
              <PromoBannerSlide layout={bannerLayout} slide={slide} priority={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
        {activeSlides.map((slide, index) => (
          <button
            key={slide.id ?? index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={current === index ? 'true' : undefined}
            className={cn(
              'pointer-events-auto h-1 w-8 transition-colors duration-300',
              current === index ? 'bg-primary' : 'bg-primary/30 hover:bg-primary/50',
            )}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </section>
  )
}

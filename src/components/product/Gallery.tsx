'use client'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import { useSearchParams } from 'next/navigation'
import { DefaultDocumentIDType } from 'payload'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const THUMB_SIZE = 72
const THUMB_GAP = 8
const VISIBLE_THUMBS = 4

type Props = {
  gallery: NonNullable<Product['gallery']>
}

export const Gallery: React.FC<Props> = ({ gallery }) => {
  const searchParams = useSearchParams()
  const [current, setCurrent] = useState(0)
  const thumbScrollRef = useRef<HTMLDivElement>(null)
  const [fadeTop, setFadeTop] = useState(false)
  const [fadeBottom, setFadeBottom] = useState(false)

  const scrollPanelHeight = VISIBLE_THUMBS * THUMB_SIZE + (VISIBLE_THUMBS - 1) * THUMB_GAP

  const validItems = gallery
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => typeof item.image === 'object')

  const totalImages = validItems.length
  const hasMultipleImages = totalImages > 1

  const goToImage = useCallback(
    (index: number) => {
      if (!totalImages) return
      const normalized = ((index % totalImages) + totalImages) % totalImages
      setCurrent(normalized)
    },
    [totalImages],
  )

  const goToPrevious = useCallback(() => {
    goToImage(current - 1)
  }, [current, goToImage])

  const goToNext = useCallback(() => {
    goToImage(current + 1)
  }, [current, goToImage])

  useEffect(() => {
    const values = Array.from(searchParams.values())

    if (!values.length) {
      return
    }

    const index = gallery.findIndex((item) => {
      if (!item.variantOption) return false

      let variantID: DefaultDocumentIDType

      if (typeof item.variantOption === 'object') {
        variantID = item.variantOption.id
      } else {
        variantID = item.variantOption
      }

      return Boolean(values.find((value) => value === String(variantID)))
    })

    if (index !== -1) {
      setCurrent(index)
    }
  }, [searchParams, gallery])

  useEffect(() => {
    if (!hasMultipleImages) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToPrevious()
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToNext()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goToNext, goToPrevious, hasMultipleImages])

  const updateThumbFades = useCallback(() => {
    const el = thumbScrollRef.current
    if (!el) {
      setFadeTop(false)
      setFadeBottom(false)
      return
    }

    const hasOverflow = el.scrollHeight > el.clientHeight + 1
    setFadeTop(hasOverflow && el.scrollTop > 4)
    setFadeBottom(hasOverflow && el.scrollTop + el.clientHeight < el.scrollHeight - 4)
  }, [])

  useEffect(() => {
    updateThumbFades()
    const el = thumbScrollRef.current
    el?.addEventListener('scroll', updateThumbFades, { passive: true })
    window.addEventListener('resize', updateThumbFades)

    return () => {
      el?.removeEventListener('scroll', updateThumbFades)
      window.removeEventListener('resize', updateThumbFades)
    }
  }, [gallery.length, updateThumbFades])

  useEffect(() => {
    const el = thumbScrollRef.current
    if (!el) return

    const activeThumb = el.children[current] as HTMLElement | undefined
    activeThumb?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [current])

  const scrollThumbsBy = (direction: 'down' | 'up') => {
    const el = thumbScrollRef.current
    if (!el) return

    const step = THUMB_SIZE + THUMB_GAP
    el.scrollBy({
      top: direction === 'down' ? step : -step,
      behavior: 'smooth',
    })
  }

  const activeImage = gallery[current]?.image
  const imageUrl =
    activeImage && typeof activeImage === 'object' && activeImage.url ? activeImage.url : null

  const remainingCount = Math.max(0, totalImages - VISIBLE_THUMBS)
  const showRemainingBadge = remainingCount > 0

  return (
    <div className="w-full min-w-0">
      <div className="flex items-start gap-3 md:gap-4">
        {hasMultipleImages ? (
          <div className="hidden w-[72px] shrink-0 flex-col gap-2 sm:flex">
            <div className="relative" style={{ height: scrollPanelHeight }}>
              {fadeTop ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background via-background/80 to-transparent"
                />
              ) : null}
              {fadeBottom ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-background via-background/80 to-transparent"
                />
              ) : null}

              <div
                ref={thumbScrollRef}
                className="flex h-full flex-col gap-2 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {validItems.map(({ item, index }) => {
                  const image = item.image
                  if (typeof image !== 'object') return null

                  return (
                    <button
                      key={`${image.id}-${index}`}
                      type="button"
                      aria-label={`View image ${index + 1}`}
                      aria-current={current === index ? 'true' : undefined}
                      className={cn(
                        'relative size-[72px] shrink-0 overflow-hidden border bg-neutral-50 transition',
                        current === index
                          ? 'border-foreground'
                          : 'border-neutral-200 hover:border-neutral-400',
                      )}
                      onClick={() => setCurrent(index)}
                    >
                      <Media fill imgClassName="object-cover" resource={image} />
                    </button>
                  )
                })}
              </div>
            </div>

            {showRemainingBadge ? (
              <button
                type="button"
                aria-label={`Show ${remainingCount} more images`}
                className="flex size-[72px] shrink-0 items-center justify-center border border-neutral-200 bg-neutral-50 text-sm font-medium text-foreground transition hover:border-neutral-400 hover:bg-white"
                onClick={() => scrollThumbsBy('down')}
              >
                {remainingCount}+
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="relative min-w-0 flex-1">
          {typeof activeImage === 'object' ? (
            <div className="group relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
              <Media fill imgClassName="object-cover object-center" resource={activeImage} />

              {hasMultipleImages ? (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    className="absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center bg-white/90 text-neutral-900 shadow-sm transition hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    className="absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center bg-white/90 text-neutral-900 shadow-sm transition hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                    onClick={goToNext}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              ) : null}

              {imageUrl ? (
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Zoom image"
                  className="absolute right-3 bottom-3 z-10 flex size-9 items-center justify-center bg-white text-neutral-800 shadow-sm transition hover:bg-neutral-50"
                >
                  <ZoomIn className="size-4" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {hasMultipleImages ? (
        <div className="relative mt-3 sm:hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-background to-transparent" />
          <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {validItems.slice(0, VISIBLE_THUMBS).map(({ item, index }) => {
              const image = item.image
              if (typeof image !== 'object') return null

              return (
                <button
                  key={`mobile-${image.id}-${index}`}
                  type="button"
                  aria-label={`View image ${index + 1}`}
                  aria-current={current === index ? 'true' : undefined}
                  className={cn(
                    'relative size-16 shrink-0 overflow-hidden border bg-neutral-50',
                    current === index ? 'border-foreground' : 'border-neutral-200',
                  )}
                  onClick={() => setCurrent(index)}
                >
                  <Media fill imgClassName="object-cover" resource={image} />
                </button>
              )
            })}
            {showRemainingBadge ? (
              <button
                type="button"
                aria-label={`Show ${remainingCount} more images`}
                className="flex size-16 shrink-0 items-center justify-center border border-neutral-200 bg-neutral-50 text-sm font-medium"
                onClick={() => goToImage(VISIBLE_THUMBS)}
              >
                {remainingCount}+
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

import { cn } from '@/utilities/cn'
import { Star } from 'lucide-react'
import React from 'react'

type Props = {
  rating?: number | string | null
  reviewCount?: number | null
  className?: string
  starClassName?: string
}

export function ProductRating({
  rating,
  reviewCount,
  className,
  starClassName = 'size-3.5',
}: Props) {
  const hasRating = rating != null && rating !== ''
  const hasReviewCount = typeof reviewCount === 'number'

  if (!hasRating && !hasReviewCount) {
    return null
  }

  const normalizedRating = Math.min(5, Math.max(0, Number(rating ?? 0)))

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1.5 text-xs text-muted-foreground',
        className,
      )}
    >
      {hasRating ? (
        <>
          <span className="flex items-center gap-0.5 text-amber-400" aria-hidden>
            {Array.from({ length: 5 }).map((_, index) => {
              const filled = normalizedRating >= index + 1
              const partial = !filled && normalizedRating > index

              return (
                <Star
                  key={index}
                  className={cn(
                    starClassName,
                    filled || partial
                      ? 'fill-current'
                      : 'fill-none stroke-current text-amber-400/35',
                    partial && 'opacity-60',
                  )}
                />
              )
            })}
          </span>
          <span className="font-medium text-foreground">{normalizedRating.toFixed(1)}</span>
        </>
      ) : null}
      {hasReviewCount ? (
        <span className="text-muted-foreground">({reviewCount})</span>
      ) : null}
    </div>
  )
}

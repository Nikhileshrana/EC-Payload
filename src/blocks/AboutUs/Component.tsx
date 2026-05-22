import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import { Home } from 'lucide-react'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

import type { AboutUsBlock as AboutUsBlockProps, Media as MediaType } from '@/payload-types'

type BentoCellProps = {
  media: MediaType | string | number | null | undefined
  className?: string
  priority?: boolean
}

const BentoCell: React.FC<BentoCellProps> = ({ media, className, priority }) => {
  if (!media || typeof media !== 'object') {
    return null
  }

  return (
    <div
      className={cn(
        'relative h-full min-h-[180px] overflow-hidden rounded-2xl md:rounded-3xl',
        className,
      )}
    >
      <Media fill imgClassName="object-cover" priority={priority} resource={media} />
    </div>
  )
}

export const AboutUsBlock: React.FC<
  AboutUsBlockProps & {
    id?: DefaultDocumentIDType
    className?: string
  }
> = (props) => {
  const { className, heading, images, label, subheading } = props

  if (!images) {
    return null
  }

  const { center, leftBottom, leftTop, rightBottom, rightTop } = images

  return (
    <section className={cn('bg-background', className)}>
      <div className="container">
        {/* Header — centered container, left-aligned text */}
        <div className="mx-auto max-w-3xl text-left">
          {label ? (
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Home aria-hidden className="size-4" strokeWidth={1.75} />
              <span>{label}</span>
            </div>
          ) : null}
          {heading ? (
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          ) : null}
          {subheading ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {subheading}
            </p>
          ) : null}
        </div>

        {/* Bento grid — 5 images */}
        <div className="mt-12 md:mt-16 max-w-4xl mx-auto">
          {/* Mobile */}
          <div className="flex flex-col gap-4 sm:gap-5 lg:hidden">
            <BentoCell className="aspect-[5/4] w-full" media={leftTop} priority />
            <BentoCell className="aspect-[3/4] w-full" media={center} />
            <BentoCell className="aspect-[5/4] w-full" media={rightTop} />
            <BentoCell className="aspect-[5/4] w-full" media={leftBottom} />
            <BentoCell className="aspect-[5/4] w-full" media={rightBottom} />
          </div>

          {/* Tablet */}
          <div className="hidden gap-4 md:grid md:grid-cols-2 md:gap-5">
            <BentoCell className="aspect-video" media={leftTop} priority />
            <BentoCell className="aspect-video" media={rightTop} />
            <BentoCell className="col-span-2 aspect-video min-h-[180px]" media={center} />
            <BentoCell className="aspect-video" media={leftBottom} />
            <BentoCell className="aspect-video" media={rightBottom} />
          </div>

     
        </div>
      </div>
    </section>
  )
}

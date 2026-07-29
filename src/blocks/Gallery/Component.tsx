import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

import type { GalleryBlock as GalleryBlockProps, Media as MediaType } from '@/payload-types'

export const GalleryBlock: React.FC<
  GalleryBlockProps & {
    id?: DefaultDocumentIDType
    className?: string
  }
> = (props) => {
  const { className, images } = props

  const items =
    images
      ?.map((item) => item?.image)
      .filter((image): image is MediaType => Boolean(image) && typeof image === 'object') ?? []

  if (!items.length) {
    return null
  }

  return (
    <section className={cn('bg-background', className)}>
      <div className="w-full p-3 sm:p-4 md:p-5">
        <div className="columns-1 gap-3 sm:columns-2 sm:gap-4 lg:columns-3 xl:columns-4">
          {items.map((image, index) => (
            <div
              key={image.id ?? index}
              className="mb-3 break-inside-avoid sm:mb-4"
            >
              <div className="overflow-hidden rounded-2xl md:rounded-3xl">
                <Media
                  className="w-full"
                  imgClassName="h-auto w-full object-cover"
                  priority={index < 4}
                  resource={image}
                  size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

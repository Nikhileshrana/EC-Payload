import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { GalleryBlock } from '@/blocks/Gallery/Component'
import { HeroCarouselBlock } from '@/blocks/HeroCarousel/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ProductShowcaseBlock } from '@/blocks/ProductShowcase/Component'
import { PromoBannerBlock } from '@/blocks/PromoBanner/Component'
import { ThreeItemGridBlock } from '@/blocks/ThreeItemGrid/Component'
import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page } from '../payload-types'

const blockComponents = {
  archive: ArchiveBlock,
  banner: BannerBlock,
  carousel: CarouselBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  gallery: GalleryBlock,
  heroCarousel: HeroCarouselBlock,
  mediaBlock: MediaBlock,
  productShowcase: ProductShowcaseBlock,
  promoBanner: PromoBannerBlock,
  threeItemGrid: ThreeItemGridBlock,
}

const fullBleedBlocks = new Set(['gallery', 'heroCarousel', 'promoBanner', 'productShowcase'])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  blockWrapperClassName?: string
}> = (props) => {
  const { blocks, blockWrapperClassName = 'my-16' } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div
                  className={fullBleedBlocks.has(blockType) ? undefined : blockWrapperClassName}
                  key={index}
                >
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore - weird type mismatch here */}
                  <Block id={toKebabCase(blockName!)} {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}

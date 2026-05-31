import type { Home } from '@/payload-types'
import { ProductShowcaseBlock } from '@/blocks/ProductShowcase/Component'
import { PromoBannerBlock } from '@/blocks/PromoBanner/Component'
import React, { Fragment } from 'react'

type Section = NonNullable<Home['sections']>[number]

export const RenderHomeSections: React.FC<{
  sections: Home['sections']
}> = ({ sections }) => {
  if (!sections?.length) {
    return null
  }

  return (
    <Fragment>
      {sections.map((block, index) => {
        if (!block || !('blockType' in block)) {
          return null
        }

        const key = block.id ?? index

        switch (block.blockType) {
          case 'productShowcase':
            return (
              <div key={key}>
                <ProductShowcaseBlock {...block} />
              </div>
            )
          case 'promoBanner':
            return (
              <div key={key}>
                <PromoBannerBlock {...block} />
              </div>
            )
          default:
            return null
        }
      })}
    </Fragment>
  )
}

import type { Home } from '@/payload-types'
import { ProductShowcaseBlock } from '@/blocks/ProductShowcase/Component'
import React, { Fragment } from 'react'

type Section = NonNullable<Home['sections']>[number]

const blockComponents = {
  productShowcase: ProductShowcaseBlock,
} satisfies Record<string, React.FC<Section>>

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

        const Block = blockComponents[block.blockType as keyof typeof blockComponents]

        if (!Block) {
          return null
        }

        return (
          <div key={block.id ?? index}>
            <Block {...block} />
          </div>
        )
      })}
    </Fragment>
  )
}

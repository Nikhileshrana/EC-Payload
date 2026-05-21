import type { Block } from 'payload'

import { link } from '@/fields/link'

export const ProductShowcase: Block = {
  slug: 'productShowcase',
  interfaceName: 'ProductShowcaseBlock',
  labels: {
    singular: 'Product showcase',
    plural: 'Product showcases',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Own Products',
      label: 'Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    link({
      appearances: false,
      overrides: {
        name: 'seeAll',
        label: 'See all link',
      },
    }),
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 3,
      label: 'Products',
      admin: {
        description: 'Select up to 3 products to feature in this section.',
        isSortable: true,
      },
    },
    {
      name: 'reviewsLabel',
      type: 'text',
      defaultValue: '1347 Reviews',
      label: 'Reviews label',
      admin: {
        description: 'Displayed under each product name until per-product reviews are added.',
      },
    },
  ],
}

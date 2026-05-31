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
      defaultValue: 'Shop Best Sellers',
      label: 'Section title',
    },
    link({
      appearances: false,
      overrides: {
        name: 'seeAll',
        label: 'View more link',
      },
    }),
    {
      name: 'productSource',
      type: 'select',
      label: 'Product source',
      defaultValue: 'individual',
      required: true,
      options: [
        { label: 'Individual products', value: 'individual' },
        { label: 'Category', value: 'category' },
      ],
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Products',
      admin: {
        condition: (_, siblingData) => siblingData?.productSource === 'individual',
        description: 'Search and select products to feature in this section.',
        isSortable: true,
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (siblingData?.productSource === 'individual' && (!Array.isArray(value) || !value.length)) {
          return 'Select at least one product.'
        }
        return true
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Category',
      admin: {
        condition: (_, siblingData) => siblingData?.productSource === 'category',
        description: 'Products from this category will appear in the carousel.',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (siblingData?.productSource === 'category' && !value) {
          return 'Select a category.'
        }
        return true
      },
    },
    {
      name: 'productLimit',
      type: 'number',
      label: 'Maximum products',
      defaultValue: 8,
      min: 1,
      max: 24,
      admin: {
        condition: (_, siblingData) => siblingData?.productSource === 'category',
        description: 'How many products to load from the selected category.',
        step: 1,
      },
    },
  ],
}

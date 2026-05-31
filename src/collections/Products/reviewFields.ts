import type { Field } from 'payload'

const starRatingOptions = [
  { label: '★☆☆☆☆ · 1 star', value: '1' },
  { label: '★★☆☆☆ · 2 stars', value: '2' },
  { label: '★★★☆☆ · 3 stars', value: '3' },
  { label: '★★★★☆ · 4 stars', value: '4' },
  { label: '★★★★★ · 5 stars', value: '5' },
] as const

export const productReviewSection: Field = {
  type: 'group',
  label: 'Reviews',
  admin: {
    description: 'Rating and review count shown on product cards and the product page.',
  },
  fields: [
    {
      name: 'rating',
      type: 'select',
      label: 'Rating (stars)',
      options: [...starRatingOptions],
    },
    {
      name: 'reviewCount',
      type: 'number',
      label: 'Total reviews',
      min: 0,
      defaultValue: 0,
      admin: {
        step: 1,
      },
    },
  ],
}

export function injectReviewSectionBeforeInventory(fields: Field[]): Field[] {
  return fields.flatMap((field) => {
    if ('name' in field && field.name === 'inventory') {
      return [productReviewSection, field]
    }

    return [field]
  })
}

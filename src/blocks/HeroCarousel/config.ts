import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const HeroCarousel: Block = {
  slug: 'heroCarousel',
  interfaceName: 'HeroCarouselBlock',
  labels: {
    singular: 'Hero carousel',
    plural: 'Hero carousels',
  },
  fields: [
    {
      name: 'slideInterval',
      type: 'number',
      label: 'Slide interval (seconds)',
      defaultValue: 5,
      min: 2,
      max: 30,
      admin: {
        description: 'How long each slide stays visible before advancing.',
        step: 1,
      },
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Hero slides',
      minRows: 1,
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Background image',
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          label: 'Heading',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'textAlign',
          type: 'select',
          label: 'Text alignment',
          defaultValue: 'center',
          required: true,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
            { label: 'Top', value: 'top' },
            { label: 'Bottom', value: 'bottom' },
            { label: 'Center', value: 'center' },
          ],
        },
        linkGroup({
          appearances: ['default', 'outline'],
          overrides: {
            maxRows: 1,
            labels: {
              singular: 'CTA button',
              plural: 'CTA buttons',
            },
          },
        }),
      ],
    },
  ],
}

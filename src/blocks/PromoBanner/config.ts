import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const PromoBanner: Block = {
  slug: 'promoBanner',
  interfaceName: 'PromoBannerBlock',
  labels: {
    singular: 'Promo banner',
    plural: 'Promo banners',
  },
  fields: [
    {
      name: 'displayMode',
      type: 'select',
      label: 'Banner type',
      defaultValue: 'singleSplit',
      required: true,
      options: [
        { label: 'Single banner (text + image)', value: 'singleSplit' },
        { label: 'Single image only', value: 'singleImage' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'overlay',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode !== 'singleImage',
        description: 'Overlay places text on top of the image. Split uses text and image side by side.',
      },
      options: [
        { label: 'Text on image', value: 'overlay' },
        { label: 'Split (side by side)', value: 'split' },
      ],
    },
    {
      name: 'slideInterval',
      type: 'number',
      label: 'Slide interval (seconds)',
      defaultValue: 5,
      min: 2,
      max: 30,
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode === 'carousel',
        description: 'How long each slide stays visible before advancing.',
        step: 1,
      },
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Banner slides',
      minRows: 1,
      admin: {
        description: 'For single banner types, only the first slide is shown.',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Banner image',
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          label: 'Heading',
        },
        {
          name: 'subheading',
          type: 'text',
          label: 'Subheading',
        },
        {
          name: 'textAlign',
          type: 'select',
          label: 'Text position',
          defaultValue: 'left',
          required: true,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
            { label: 'Center', value: 'center' },
            { label: 'Top', value: 'top' },
            { label: 'Bottom', value: 'bottom' },
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

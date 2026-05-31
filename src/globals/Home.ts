import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { ProductShowcase } from '@/blocks/ProductShowcase/config'
import { PromoBanner } from '@/blocks/PromoBanner/config'
import { linkGroup } from '@/fields/linkGroup'
import { createRevalidateGlobalHook } from '@/globals/hooks/revalidateGlobal'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  access: {
    read: () => true,
    update: adminOnly,
  },
  hooks: {
    afterChange: [createRevalidateGlobalHook('home', ['/'])],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: false,
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
            },
          ],
        },
        {
          label: 'Sections',
          fields: [
            {
              name: 'sections',
              type: 'blocks',
              label: 'Page sections',
              blocks: [ProductShowcase, PromoBanner],
            },
          ],
        },
      ],
    },
  ],
}

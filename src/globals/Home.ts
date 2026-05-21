import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { ProductShowcase } from '@/blocks/ProductShowcase/config'
import { linkGroup } from '@/fields/linkGroup'
import { createRevalidateGlobalHook } from '@/globals/hooks/revalidateGlobal'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Section',
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
        {
          label: 'Sections',
          fields: [
            {
              name: 'sections',
              type: 'blocks',
              label: 'Page sections',
              blocks: [ProductShowcase],
            },
          ],
        },
      ],
    },
  ],
}

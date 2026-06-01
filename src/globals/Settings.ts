import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { colorThemePresetOptions } from '@/lib/colorThemes/presets'
import { validateHexField } from '@/lib/colorThemes'
import { revalidatePath, revalidateTag } from 'next/cache'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Settings',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    description: 'Storefront branding, logo, favicon, and color theme.',
  },
  hooks: {
    afterChange: [
      ({ doc, req: { context } }) => {
        if (context?.disableRevalidate) {
          return doc
        }

        revalidateTag('global_settings', 'max')
        revalidatePath('/', 'layout')

        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branding',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              admin: {
                description: 'Used in the site header and Payload admin panel.',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
              admin: {
                description:
                  'Browser tab icon for the storefront. Square PNG, SVG, or ICO works best.',
              },
            },
          ],
        },
        {
          label: 'Color theme',
          fields: [
            {
              name: 'source',
              type: 'radio',
              label: 'Color source',
              defaultValue: 'preset',
              required: true,
              options: [
                { label: 'Preset palette', value: 'preset' },
                { label: 'Custom hex colors', value: 'custom' },
              ],
            },
            {
              name: 'preset',
              type: 'select',
              label: 'Preset theme',
              defaultValue: 'navy',
              required: true,
              options: colorThemePresetOptions,
              admin: {
                condition: (_, siblingData) => siblingData?.source === 'preset',
                description: 'Choose a curated palette for the storefront.',
              },
            },
            {
              type: 'collapsible',
              label: 'Custom colors',
              admin: {
                condition: (_, siblingData) => siblingData?.source === 'custom',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'customPrimary',
                      type: 'text',
                      label: 'Primary',
                      defaultValue: '#1e293b',
                      validate: validateHexField,
                      admin: {
                        placeholder: '#2563eb',
                        description: 'Buttons, links, and key brand accents.',
                      },
                    },
                    {
                      name: 'customPrimaryForeground',
                      type: 'text',
                      label: 'Primary foreground',
                      validate: validateHexField,
                      admin: {
                        placeholder: '#ffffff',
                        description: 'Text on primary backgrounds. Leave blank to auto-pick.',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'customSecondary',
                      type: 'text',
                      label: 'Secondary',
                      validate: validateHexField,
                      admin: {
                        placeholder: '#f1f5f9',
                        description: 'Secondary surfaces and subtle fills.',
                      },
                    },
                    {
                      name: 'customSecondaryForeground',
                      type: 'text',
                      label: 'Secondary foreground',
                      validate: validateHexField,
                      admin: {
                        placeholder: '#1e293b',
                        description: 'Text on secondary backgrounds. Leave blank to auto-pick.',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'customAccent',
                      type: 'text',
                      label: 'Accent',
                      validate: validateHexField,
                      admin: {
                        placeholder: '#e2e8f0',
                        description: 'Hover states, highlights, and accents.',
                      },
                    },
                    {
                      name: 'customAccentForeground',
                      type: 'text',
                      label: 'Accent foreground',
                      validate: validateHexField,
                      admin: {
                        placeholder: '#0f172a',
                        description: 'Text on accent backgrounds. Leave blank to auto-pick.',
                      },
                    },
                  ],
                },
                {
                  name: 'customRing',
                  type: 'text',
                  label: 'Focus ring',
                  validate: validateHexField,
                  admin: {
                    placeholder: '#64748b',
                    description: 'Optional focus ring color. Defaults to primary.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

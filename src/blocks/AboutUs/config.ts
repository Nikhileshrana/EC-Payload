import type { Block } from 'payload'

export const AboutUs: Block = {
  slug: 'aboutUs',
  interfaceName: 'AboutUsBlock',
  labels: {
    singular: 'About Us',
    plural: 'About Us Sections',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      defaultValue: 'About',
      admin: {
        description: 'Small label shown above the heading (e.g. "About").',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main heading for the section.',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Supporting text below the heading.',
      },
    },
    {
      name: 'images',
      type: 'group',
      label: 'Image gallery',
      admin: {
        description:
          'Upload 5 images: 2 left, 1 tall center, 2 right. Each field matches its position in the grid.',
      },
      fields: [
        {
          name: 'leftTop',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Left — top',
        },
        {
          name: 'leftBottom',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Left — bottom',
        },
        {
          name: 'center',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Center — tall',
        },
        {
          name: 'rightTop',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Right — top',
        },
        {
          name: 'rightBottom',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Right — bottom',
        },
      ],
    },
  ],
}

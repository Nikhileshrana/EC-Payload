import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Plugin } from 'payload'

import { razorpayAdapter } from '@/payments/razorpay'

import { OrdersCollection } from '@/collections/Orders'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { isAdmin } from '@/access/isAdmin'
import { isDocumentOwner } from '@/access/isDocumentOwner'
import { ProductsCollection } from '@/collections/Products'
import { currenciesConfig } from '@/lib/currencies'
import { Page, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { toKebabCase } from '@/utilities/toKebabCase'

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Ecommerce` : 'Ecommerce'
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  vercelBlobStorage({
    collections: {
      media: {
        prefix: toKebabCase(process.env.SITE_NAME || ''),
      },
    },
    // Bypass Vercel's 4.5MB server upload limit (media allows up to 12MB)
    clientUploads: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    // Always use RESEND_FROM_* defaults — ignore any leftover emailFrom on forms
    beforeEmail: (emails) => {
      const fromName = process.env.RESEND_FROM_NAME || process.env.SITE_NAME || 'GC Appliances'
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@gcappliances.in'
      const from = `${fromName} <${fromEmail}>`

      return emails.map(({ from: _from, ...email }) => ({
        ...email,
        from,
      }))
    },
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        group: 'Content',
      },
    },
    formOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
        create: isAdmin,
      },
      admin: {
        group: 'Content',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }

          // Hide Email From — always use RESEND_FROM_* env defaults
          if ('name' in field && field.name === 'emails' && field.type === 'array') {
            return {
              ...field,
              fields: field.fields.map((emailsField) => {
                if (emailsField.type === 'row' && 'fields' in emailsField) {
                  return {
                    ...emailsField,
                    fields: emailsField.fields.filter(
                      (f) => !('name' in f && f.name === 'emailFrom'),
                    ),
                  }
                }
                return emailsField
              }),
            }
          }

          return field
        })
      },
    },
  }),
  ecommercePlugin({
    currencies: currenciesConfig,
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    customers: {
      slug: 'users',
    },
    orders: {
      ordersCollectionOverride: OrdersCollection,
    },
    payments: {
      paymentMethods: [
        razorpayAdapter({
          apiKey: process.env.RAZORPAY_API_KEY || '',
          secretKey: process.env.RAZORPAY_SECRET_KEY || '',
        }),
      ],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
    },
  }),
]

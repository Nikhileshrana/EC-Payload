import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteSettings } from '@/components/SiteSettings'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaMimeType, getMediaURL, getMediaUrl } from '@/utilities/getMediaURL'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedGlobal('settings', 1)()
  const faviconUrl = getMediaURL(getMediaUrl(settings?.favicon), { absolute: true })

  if (!faviconUrl) {
    return {
      icons: {
        icon: [
          { url: '/favicon.ico', sizes: '32x32' },
          { url: '/favicon.svg', type: 'image/svg+xml' },
        ],
      },
    }
  }

  const faviconType = getMediaMimeType(settings?.favicon)

  return {
    icons: {
      icon: [
        {
          url: faviconUrl,
          ...(faviconType ? { type: faviconType } : {}),
        },
      ],
    },
  }
}

/* const { SITE_NAME, TWITTER_CREATOR, TWITTER_SITE } = process.env
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000'
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined
 */
/* export const metadata = {
  metadataBase: new URL(baseUrl),
  robots: {
    follow: true,
    index: true,
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite,
      },
    }),
} */

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[GeistSans.variable, GeistMono.variable].filter(Boolean).join(' ')}
      data-theme="light"
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <SiteSettings />
      </head>
      <body>
        <Providers>
          <LivePreviewListener />

          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

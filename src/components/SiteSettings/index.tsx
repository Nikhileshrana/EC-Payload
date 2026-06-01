import { buildSiteColorThemeCss } from '@/lib/colorThemes'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaMimeType, getMediaUrl } from '@/utilities/getMediaURL'
import React from 'react'

export async function SiteSettings() {
  const settings = await getCachedGlobal('settings', 0)()
  const css = buildSiteColorThemeCss(settings)
  const faviconUrl = getMediaUrl(settings?.favicon)
  const faviconType = getMediaMimeType(settings?.favicon)

  return (
    <>
      <style
        dangerouslySetInnerHTML={{ __html: css }}
        data-site-settings=""
        precedence="high"
      />
      {faviconUrl ? (
        <link href={faviconUrl} rel="icon" type={faviconType ?? 'image/png'} />
      ) : (
        <>
          <link href="/favicon.ico" rel="icon" sizes="32x32" />
          <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        </>
      )}
    </>
  )
}

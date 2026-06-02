import { buildAdminColorThemeCss } from '@/lib/colorThemes'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

export async function AdminSiteThemeProvider({ children }: { children: React.ReactNode }) {
  const settings = await getCachedGlobal('settings', 0)()
  const css = buildAdminColorThemeCss(settings)

  return (
    <>
      <style
        dangerouslySetInnerHTML={{ __html: css }}
        data-site-admin-theme=""
        precedence="high"
      />
      {children}
    </>
  )
}

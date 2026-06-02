import { buildSiteColorThemeCss } from '@/lib/colorThemes'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function SiteSettings() {
  const settings = await getCachedGlobal('settings', 0)()
  const css = buildSiteColorThemeCss(settings)

  return (
    <style
      dangerouslySetInnerHTML={{ __html: css }}
      data-site-settings=""
      precedence="high"
    />
  )
}

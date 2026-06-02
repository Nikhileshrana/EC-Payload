import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaURL, getMediaUrl } from '@/utilities/getMediaURL'

import './index.css'
import { HeaderClient } from './index.client'

export async function Header() {
  const [header, settings] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('settings', 1)(),
  ])

  const logoUrl = getMediaURL(getMediaUrl(settings?.logo))

  return <HeaderClient header={header} logoUrl={logoUrl || undefined} />
}

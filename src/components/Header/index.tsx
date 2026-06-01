import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaURL'

import './index.css'
import { HeaderClient } from './index.client'

export async function Header() {
  const [header, settings] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('settings', 1)(),
  ])

  return <HeaderClient header={header} logoUrl={getMediaUrl(settings?.logo)} />
}

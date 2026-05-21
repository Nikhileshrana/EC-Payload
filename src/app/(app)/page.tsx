import type { Metadata } from 'next'

import { HomePage } from '@/components/Home'
import { getCachedGlobal } from '@/utilities/getGlobals'

export default HomePage

export async function generateMetadata(): Promise<Metadata> {
  const home = await getCachedGlobal('home', 0)()
  const title = home.hero?.heading

  return {
    title: title ? `${title} | Ecommerce` : 'Home | Ecommerce',
    description: home.hero?.description ?? undefined,
  }
}

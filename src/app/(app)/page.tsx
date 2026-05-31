import type { Metadata } from 'next'

import { HomePage } from '@/components/Home'
import { getCachedGlobal } from '@/utilities/getGlobals'

export default HomePage

export async function generateMetadata(): Promise<Metadata> {
  const home = await getCachedGlobal('home', 0)()
  const firstSlide = home.hero?.slides?.[0]
  const title = firstSlide?.heading

  return {
    title: title ? `${title} | Ecommerce` : 'Home | Ecommerce',
    description: firstSlide?.description ?? undefined,
  }
}

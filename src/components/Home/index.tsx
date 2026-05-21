import type { Home } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

import { HomeHeroSection } from './HeroSection'
import { RenderHomeSections } from './RenderSections'

export async function HomePage() {
  const home: Home = await getCachedGlobal('home', 2)()

  return <RenderHome data={home} />
}

export function RenderHome({ data }: { data: Home }) {
  const { hero, sections } = data

  return (
    <article>
      {hero ? <HomeHeroSection hero={hero} /> : null}
      <RenderHomeSections sections={sections} />
    </article>
  )
}

'use client'

import React from 'react'

type Props = {
  gallery: React.ReactNode
  details: React.ReactNode
}

export function ProductPageLayout({ gallery, details }: Props) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-14 xl:gap-20">
      <aside className="relative w-full min-w-0 shrink-0 lg:w-[52%]">
        <div className="lg:sticky lg:top-6 lg:z-10">{gallery}</div>
      </aside>

      <div className="min-w-0 flex-1 overflow-x-clip break-words lg:w-[48%]">{details}</div>
    </div>
  )
}

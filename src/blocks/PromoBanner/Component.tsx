import type { PromoBannerBlock as PromoBannerBlockProps } from '@/payload-types'
import React from 'react'

import { PromoBannerClient } from './Component.client'

export function PromoBannerBlock(props: PromoBannerBlockProps) {
  if (!props.slides?.length) {
    return null
  }

  return <PromoBannerClient {...props} />
}

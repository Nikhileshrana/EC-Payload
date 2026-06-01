'use client'

import { Logo } from '@/components/Logo/Logo'
import React, { useEffect, useState } from 'react'

type Props = {
  className?: string
}

export function SettingsAdminLogo({ className }: Props) {
  const [logoSrc, setLogoSrc] = useState('/logo.png')

  useEffect(() => {
    let cancelled = false

    fetch('/api/globals/settings?depth=1')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled || !data?.logo || typeof data.logo !== 'object' || !data.logo.url) {
          return
        }

        setLogoSrc(data.logo.url)
      })
      .catch(() => {
        // Keep default logo fallback
      })

    return () => {
      cancelled = true
    }
  }, [])

  return <Logo className={className} src={logoSrc} />
}

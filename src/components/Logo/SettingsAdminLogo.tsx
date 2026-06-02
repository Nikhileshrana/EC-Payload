'use client'

import { getMediaURL } from '@/utilities/getMediaURL'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  className?: string
}

export function SettingsAdminLogo({ className }: Props) {
  const pathname = usePathname()
  const isLoginPage = Boolean(pathname?.includes('/login'))
  const [logoSrc, setLogoSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoginPage) {
      return
    }

    let cancelled = false

    fetch('/api/globals/settings?depth=1')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled || !data?.logo || typeof data.logo !== 'object' || !data.logo.url) {
          return
        }

        setLogoSrc(getMediaURL(data.logo.url))
      })
      .catch(() => {
        // No logo until Settings branding is configured
      })

    return () => {
      cancelled = true
    }
  }, [isLoginPage])

  if (!isLoginPage) {
    return <span className={className}>Home</span>
  }

  if (!logoSrc) {
    return null
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt="Logo"
      className={className}
      src={logoSrc}
      style={{
        maxHeight: 200,
        height: 'auto',
        width: 'auto',
        maxWidth: 'min(100%, 320px)',
        objectFit: 'contain',
        display: 'block',
        marginInline: 'auto',
      }}
    />
  )
}

'use client'

import { getMediaURL } from '@/utilities/getMediaURL'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  className?: string
}

/**
 * Payload admin graphics (Icon + Logo).
 * Logo URL comes from Globals → Settings → Branding only.
 */
export function SettingsAdminLogo({ className }: Props) {
  const [logoSrc, setLogoSrc] = useState<string | null>(null)
  const pathname = usePathname()
  const isLoginPage = Boolean(pathname?.includes('/login'))

  useEffect(() => {
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
  }, [])

  if (!logoSrc) {
    return null
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt="Logo"
      className={className}
      src={logoSrc}
      style={
        isLoginPage
          ? {
              maxHeight: 200,
              height: 'auto',
              width: 'auto',
              maxWidth: 'min(100%, 320px)',
              objectFit: 'contain',
              display: 'block',
              marginInline: 'auto',
            }
          : {
              maxHeight: 32,
              height: 'auto',
              width: 'auto',
              maxWidth: 140,
              objectFit: 'contain',
              display: 'block',
            }
      }
    />
  )
}

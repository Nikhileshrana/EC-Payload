import { getServerSideURL } from './getURL'

/**
 * Resolves a Payload media URL for use in <Image src>.
 * - Blob / external URLs are returned as-is (requires images.remotePatterns).
 * - Same-origin /api/media paths stay relative so Next.js localPatterns apply.
 */
export const getMediaURL = (url?: string | null, options?: { absolute?: boolean }): string => {
  if (!url) return ''

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const path = url.startsWith('/') ? url : `/${url}`

  if (options?.absolute) {
    return `${getServerSideURL()}${path}`
  }

  return path
}

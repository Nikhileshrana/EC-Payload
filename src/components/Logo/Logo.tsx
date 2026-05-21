import React from 'react'

type Props = {
  alt?: string
  className?: string
}

/** Brand logo from /public/logo.png — storefront (className) and Payload admin (inline styles) */
export const Logo: React.FC<Props> = ({ alt = 'Logo', className }) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className={className}
      src="/logo.png"
    />
  )
}

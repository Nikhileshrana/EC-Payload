import React from 'react'

type Props = {
  alt?: string
  className?: string
  src?: string | null
}

export const Logo: React.FC<Props> = ({ alt = 'Logo', className, src }) => {
  if (!src) {
    return null
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className={className} src={src} />
  )
}

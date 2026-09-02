import { useState } from 'react'

const HEIGHTS = {
  hero: 'h-[64px]',
  compact: 'h-[26px]',
}

export default function BrandMark({ client, size = 'hero', className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!client.logo || failed) {
    const text =
      size === 'compact'
        ? 'text-[14px] font-bold tracking-[-0.02em]'
        : 'text-[36px] font-extrabold tracking-[-0.03em]'
    return <span className={`text-bone ${text} ${className}`}>{client.name}</span>
  }

  const tintWhite = client.logoTint === 'white'

  return (
    <img
      src={client.logo}
      alt={client.name}
      onError={() => setFailed(true)}
      draggable={false}
      className={`block ${HEIGHTS[size]} w-auto max-w-full object-contain object-right select-none ${
        tintWhite ? '[filter:brightness(0)_invert(1)]' : ''
      } ${className}`}
    />
  )
}

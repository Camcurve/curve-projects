import { useEffect, useState } from 'react'

// The client's logo standing in for their name in the welcome headline.
//
// The stored logos are white-on-transparent, so they're used as a CSS mask and
// filled with the brand colour — that keeps the headline's orange accent instead
// of dropping a white mark into the middle of it, and it works for any client
// logo without needing a second recoloured file.
//
// Falls back to the plain text name if there's no logo, if it fails to load, or
// if the browser can't do masking.
export default function HeroWordmark({ client, className = '' }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    if (!client?.logo) {
      setStatus('text')
      return
    }
    const supportsMask =
      typeof CSS !== 'undefined' &&
      (CSS.supports('mask-image', 'url(x)') || CSS.supports('-webkit-mask-image', 'url(x)'))
    if (!supportsMask) {
      setStatus('text')
      return
    }
    let live = true
    const img = new Image()
    img.onload = () => live && setStatus('logo')
    img.onerror = () => live && setStatus('text')
    img.src = client.logo
    return () => {
      live = false
    }
  }, [client?.logo])

  // 'checking' renders the text too, so the headline never reflows from empty.
  if (status !== 'logo') {
    return <span className={`text-brand ${className}`}>{client.name}.</span>
  }

  const mask = {
    maskImage: `url(${client.logo})`,
    WebkitMaskImage: `url(${client.logo})`,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskPosition: 'left center',
    WebkitMaskPosition: 'left center',
  }

  return (
    <span
      role="img"
      aria-label={client.name}
      style={mask}
      className={`mt-[6px] block h-[64px] w-full bg-brand sm:h-[84px] ${className}`}
    />
  )
}

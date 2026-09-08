import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, CircleNotch, MagnifyingGlass, X } from '@phosphor-icons/react'
import { avatarColour, searchChannels, searchEnabled } from '@/lib/youtubeSearch'

// Single-select channel picker for "which channel is yours".
//
// Value shape matches what the rest of the app already expects: a channel URL
// string. The resolved id/title/avatar ride alongside via onMeta so the Access
// screen can deep-link to Studio without a second lookup.
export default function ChannelPicker({ value, onChange, onMeta, meta }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false)
  const debounceRef = useRef(null)
  const tokenRef = useRef(null)

  const picked = meta?.channelId ? meta : null

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = query.trim()
    if (picked || q.length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    // 500ms: search.list is 100 quota units, so we don't fire per keystroke.
    debounceRef.current = setTimeout(async () => {
      const token = {}
      tokenRef.current = token
      const list = await searchChannels(q)
      if (tokenRef.current === token) {
        setResults(list)
        setLoading(false)
      }
    }, 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, picked])

  const select = (ch) => {
    onMeta?.({ channelId: ch.channelId, title: ch.name, thumbnail: ch.thumbnail, subs: ch.subs })
    onChange(`https://www.youtube.com/channel/${ch.channelId}`)
    setQuery('')
    setResults([])
  }

  const clear = () => {
    onMeta?.(null)
    onChange('')
    setQuery('')
    setTouched(true)
  }

  if (picked) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-md border border-brand-glow-30 bg-brand-glow-10 p-3"
      >
        <Avatar channel={{ name: picked.title, thumbnail: picked.thumbnail }} size={40} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[15px] font-semibold text-bone">{picked.title}</span>
          <span className="text-[12px] text-bone-muted">
            {picked.subs ? `${picked.subs} subscribers` : 'Channel confirmed'}
          </span>
        </div>
        <CheckCircle size={20} weight="fill" className="shrink-0 text-brand" />
        <button
          type="button"
          onClick={clear}
          aria-label="Choose a different channel"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line text-bone-muted transition-colors hover:border-line-bright hover:text-bone"
        >
          <X size={13} weight="bold" />
        </button>
      </motion.div>
    )
  }

  // No API key, or the client would rather paste — never a dead end.
  const manual = !searchEnabled || touched

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <MagnifyingGlass
          size={16}
          weight="regular"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bone-muted"
        />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchEnabled ? 'Start typing your channel name…' : 'https://youtube.com/@…'}
          className="w-full rounded-md border border-line bg-ink-raised/60 py-[14px] pl-11 pr-4 text-[16px] text-bone placeholder:text-bone-faint transition-colors duration-200 focus:border-brand focus:bg-ink-raised focus:outline-none caret-brand"
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 px-1 text-[12px] text-bone-muted">
          <CircleNotch size={12} className="animate-spin" />
          <span>Searching YouTube…</span>
        </div>
      )}

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="flex flex-col gap-[6px]"
          >
            {results.map((ch) => (
              <button
                key={ch.channelId}
                type="button"
                onClick={() => select(ch)}
                className="flex items-center gap-3 rounded-md border border-line bg-ink-raised/40 px-3 py-[10px] text-left transition-all duration-200 hover:border-brand-glow-30 hover:bg-brand-glow-10 active:translate-y-[1px]"
              >
                <Avatar channel={ch} size={36} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[14px] font-semibold text-bone">{ch.name}</span>
                  <span className="truncate text-[11px] text-bone-muted">
                    {[ch.handle, ch.subs && `${ch.subs} subscribers`].filter(Boolean).join(' · ')}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && searchEnabled && query.trim().length >= 2 && results.length === 0 && (
        <p className="px-1 text-[12px] text-bone-muted">
          Nothing found for “{query.trim()}”. Paste your channel URL instead —{' '}
          <button
            type="button"
            onClick={() => setTouched(true)}
            className="font-semibold text-brand underline decoration-brand-glow-30 underline-offset-2"
          >
            switch to a link
          </button>
          .
        </p>
      )}

      {manual && (
        <input
          type="url"
          inputMode="url"
          value={value ?? ''}
          onChange={(e) => {
            onMeta?.(null)
            onChange(e.target.value)
          }}
          placeholder="https://youtube.com/@…"
          className="w-full rounded-md border border-line bg-ink-raised/60 px-4 py-[14px] text-[16px] text-bone placeholder:text-bone-faint transition-colors duration-200 focus:border-brand focus:bg-ink-raised focus:outline-none caret-brand"
        />
      )}
    </div>
  )
}

function Avatar({ channel, size = 36 }) {
  const [failed, setFailed] = useState(false)
  const initials = (channel.name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  if (channel.thumbnail && !failed) {
    return (
      <img
        src={channel.thumbnail}
        alt=""
        // yt3.ggpht.com 404s the avatar when a Referer header is sent from an
        // origin it doesn't know — without this every channel falls back to initials.
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover"
      />
    )
  }
  return (
    <span
      style={{ width: size, height: size, backgroundColor: avatarColour(channel.name || '') }}
      className="flex shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-ink"
    >
      {initials}
    </span>
  )
}

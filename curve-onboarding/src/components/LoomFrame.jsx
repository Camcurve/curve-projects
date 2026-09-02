import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Play } from '@phosphor-icons/react'
import { toLoomEmbed } from '@/lib/loom'

// Premium frame around the Loom walkthrough.
// - Ambient orange spotlight (outer shadow) + 1px brand-glow border.
// - Subtle 3D tilt tracking the cursor on desktop (skipped on touch).
// - Pulsing ring behind the play button when no video is loaded.
// - Meta caption row below: duration · from · recorded for <client>.
export default function LoomFrame({ client, url, duration = '03:18', from = 'Cam' }) {
  const src = toLoomEmbed(url)
  const wrapRef = useRef(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-1, 1], [3.5, -3.5]), {
    stiffness: 140,
    damping: 18,
  })
  const ry = useSpring(useTransform(mx, [-1, 1], [-3.5, 3.5]), {
    stiffness: 140,
    damping: 18,
  })

  const onMouseMove = (e) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(px * 2)
    my.set(py * 2)
  }

  const onMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      className="relative"
      style={{ perspective: '1200px' }}
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="relative overflow-hidden rounded-[14px] border border-[rgba(255,95,0,0.22)] bg-ink-raised shadow-[0_0_0_1px_rgba(255,95,0,0.10),0_30px_80px_-30px_rgba(255,95,0,0.35),0_10px_40px_-20px_rgba(0,0,0,0.6)]"
      >
        {/* Inner top-edge shimmer — simulates screen glare, subtle. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.18)] to-transparent"
        />
        {/* Corner accents */}
        <CornerMarks />

        <div className="relative aspect-video w-full">
          {src ? (
            <iframe
              title={`${client?.name ?? 'Client'} — walkthrough`}
              src={src}
              allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <PlaceholderPoster />
          )}
        </div>
      </motion.div>

      <div className="mt-4 flex items-center justify-between gap-3 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-bone-muted">
        <span className="inline-flex items-center gap-[10px]">
          <span className="tabular">{duration}</span>
          <span className="text-bone-faint">·</span>
          <span>From {from}</span>
        </span>
        {client?.name && (
          <span className="inline-flex items-center gap-[10px]">
            <span className="text-bone-faint">Recorded for</span>
            {/* normal-case so brands whose casing IS the identity survive the
                uppercase treatment on this row — e.g. "FIFA e", not "FIFA E". */}
            <span className="normal-case text-bone">{client.name}</span>
          </span>
        )}
      </div>
    </div>
  )
}

function PlaceholderPoster() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-ink-raised via-ink to-ink-sunken px-6 text-center">
      {/* Faint radial spotlight behind the play button */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,95,0,0.22), rgba(255,95,0,0.06) 55%, transparent 75%)',
        }}
      />

      <div className="relative flex h-[62px] w-[62px] items-center justify-center">
        {/* Pulsing rings */}
        <span
          aria-hidden
          className="animate-ring-pulse absolute inset-0 rounded-full border border-brand"
        />
        <span
          aria-hidden
          className="animate-ring-pulse absolute inset-0 rounded-full border border-brand"
          style={{ animationDelay: '1.1s' }}
        />
        <span className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full bg-brand text-ink shadow-[0_0_28px_rgba(255,95,0,0.45)]">
          <Play size={24} weight="fill" />
        </span>
      </div>

      <p className="relative max-w-[34ch] text-[12px] text-bone-muted">
        {import.meta.env.DEV
          ? 'dev: no walkthrough embedded — set VITE_LOOM_URL'
          : 'Your walkthrough is on its way — we\u2019ll email it across shortly.'}
      </p>
    </div>
  )
}

function CornerMarks() {
  const common =
    'pointer-events-none absolute h-[10px] w-[10px] border-brand/55'
  return (
    <>
      <span className={`${common} left-[10px] top-[10px] border-l border-t`} aria-hidden />
      <span className={`${common} right-[10px] top-[10px] border-r border-t`} aria-hidden />
      <span className={`${common} bottom-[10px] left-[10px] border-b border-l`} aria-hidden />
      <span className={`${common} bottom-[10px] right-[10px] border-b border-r`} aria-hidden />
    </>
  )
}

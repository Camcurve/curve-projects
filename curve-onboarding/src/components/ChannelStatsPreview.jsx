import { motion } from 'framer-motion'

const DEFAULT_EYEBROW = "We've already taken a look"
const DEFAULT_CAPTION = "That's where you are — not where you're going."

// Accepts either the new object shape { eyebrow, items, caption }
// or the legacy array shape (auto-wrapped for backwards compat).
function normalise(stats) {
  if (!stats) return null
  if (Array.isArray(stats)) {
    if (stats.length === 0) return null
    return { eyebrow: DEFAULT_EYEBROW, items: stats, caption: DEFAULT_CAPTION }
  }
  if (!Array.isArray(stats.items) || stats.items.length === 0) return null
  return {
    eyebrow: stats.eyebrow || DEFAULT_EYEBROW,
    items: stats.items,
    caption: stats.caption || DEFAULT_CAPTION,
  }
}

export default function ChannelStatsPreview({ stats }) {
  const data = normalise(stats)
  if (!data) return null

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 140, damping: 22 } },
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
      className="relative overflow-hidden rounded-[12px] border border-brand-glow-30 bg-ink-raised p-5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-0 h-full w-[140%] opacity-60"
        style={{
          background:
            'linear-gradient(100deg, transparent 0%, rgba(255,95,0,0.08) 45%, transparent 80%)',
        }}
      />
      <motion.div
        variants={item}
        className="relative mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand"
      >
        <span className="h-[5px] w-[5px] rounded-full bg-brand shadow-[0_0_8px_rgba(255,95,0,0.7)]" />
        <span>{data.eyebrow}</span>
      </motion.div>
      <div className="relative grid grid-cols-3 gap-3">
        {data.items.slice(0, 3).map((s) => (
          <motion.div key={s.label} variants={item} className="flex flex-col gap-[2px]">
            <span className="font-display text-[22px] font-extrabold leading-none tracking-[-0.02em] text-bone tabular">
              {s.value}
            </span>
            <span className="text-[11px] leading-tight text-bone-muted">{s.label}</span>
          </motion.div>
        ))}
      </div>
      {data.caption && (
        <motion.p variants={item} className="relative mt-4 text-[12px] text-bone-dim">
          {data.caption}
        </motion.p>
      )}
    </motion.div>
  )
}

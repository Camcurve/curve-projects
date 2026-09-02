import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const ROLES = [
  { id: 'videoEditor', label: 'Video editor' },
  { id: 'thumbnailDesigner', label: 'Thumbnail designer' },
  { id: 'producer', label: 'Producer' },
  { id: 'videographer', label: 'Videographer' },
  { id: 'scriptwriter', label: 'Scriptwriter' },
]

const MAX = 50

export default function TeamSliderStack({ value, onChange }) {
  const team = value ?? {}
  return (
    <div className="flex flex-col gap-3">
      {ROLES.map((role, i) => (
        <motion.div
          key={role.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, type: 'spring', stiffness: 130, damping: 22 }}
        >
          <RoleSlider
            label={role.label}
            count={team[role.id] ?? 0}
            onChange={(v) => onChange({ ...team, [role.id]: v })}
          />
        </motion.div>
      ))}
    </div>
  )
}

function RoleSlider({ label, count, onChange }) {
  const displayValue = count >= MAX ? `${MAX}+` : String(count)
  const pct = (count / MAX) * 100
  const lastHapticRef = useRef(count)

  useEffect(() => {
    // Light vibration on milestone crossings (10, 25, 50) for supported devices.
    const milestones = [0, 5, 10, 25, 50]
    if (
      typeof navigator?.vibrate === 'function' &&
      milestones.includes(count) &&
      count !== lastHapticRef.current
    ) {
      try {
        navigator.vibrate(6)
      } catch {
        /* noop */
      }
    }
    lastHapticRef.current = count
  }, [count])

  return (
    <div className="flex flex-col gap-[10px] rounded-[10px] border border-line bg-ink-raised/40 px-4 py-[14px] transition-colors duration-200 focus-within:border-brand-glow-30">
      <div className="flex items-baseline justify-between">
        <span className="text-[14px] font-medium text-bone">{label}</span>
        <span
          className={`tabular text-[18px] font-bold leading-none tracking-[-0.02em] transition-colors ${
            count > 0 ? 'text-brand' : 'text-bone-faint'
          }`}
        >
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={MAX}
        step={1}
        value={count}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="curve-slider"
        style={{ '--pct': `${pct}%` }}
      />
    </div>
  )
}

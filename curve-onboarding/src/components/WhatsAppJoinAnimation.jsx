import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Users } from '@phosphor-icons/react'

// Same beat as SlackJoinAnimation — a panel assembling itself — but this one
// confirms RECEIPT rather than a join. The client doesn't add themselves to the
// group; they hand us numbers and we add them once onboarding is done. So each
// number lands with a tick, then a closing line sets the expectation.
export default function WhatsAppJoinAnimation({ groupName = 'Curve', people = [], onComplete }) {
  const rows = people.filter((p) => p.name || p.phone)

  // Last row lands at 0.45 + n*0.5, then the closing line 0.5 later — hold it a
  // beat so the final state is readable before the card collapses.
  const doneAt = (0.45 + rows.length * 0.5 + 0.5 + 0.9) * 1000

  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), doneAt)
    return () => clearTimeout(t)
  }, [onComplete, doneAt])

  const spring = { type: 'spring', stiffness: 130, damping: 22 }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="overflow-hidden rounded-[12px] border border-line bg-ink-raised"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-[10px]">
        <Users size={14} weight="bold" className="text-bone-dim" />
        <span className="text-[13px] font-semibold text-bone">{groupName}</span>
        <span className="ml-auto text-[11px] text-bone-muted">
          {rows.length} {rows.length === 1 ? 'number' : 'numbers'} received
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        {rows.map((p, i) => (
          <motion.div
            key={`${p.phone}-${i}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.5, ...spring }}
            className="flex items-center gap-3 text-[13px]"
          >
            <span
              className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-ink"
              style={{ backgroundColor: i % 2 ? '#5C8D59' : '#FF7A29' }}
            >
              {(p.name || '?').trim()[0]?.toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate">
              <span className="font-semibold text-bone">{p.name}</span>{' '}
              <span className="text-bone-muted tabular">{p.phone}</span>
            </span>
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.5, type: 'spring', stiffness: 320, damping: 18 }}
              className="shrink-0 text-brand"
            >
              <Check size={14} weight="bold" />
            </motion.span>
          </motion.div>
        ))}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 + rows.length * 0.5 + 0.5, duration: 0.4 }}
          className="mt-1 border-t border-line pt-3 text-[12px] leading-[1.5] text-bone-muted"
        >
          Got them. We&apos;ll add {rows.length === 1 ? 'you' : 'everyone'} to the group once
          your onboarding&apos;s complete.
        </motion.p>
      </div>
    </motion.div>
  )
}

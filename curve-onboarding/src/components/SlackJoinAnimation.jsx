import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Hash } from '@phosphor-icons/react'

export default function SlackJoinAnimation({ channelName = 'perfectted', onComplete }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 2400)
    return () => clearTimeout(t)
  }, [onComplete])

  const lines = [
    { name: 'cam', colour: '#FF7A29', text: `joined #${channelName}` },
    { name: 'ayla', colour: '#5C8D59', text: `joined #${channelName}` },
    { name: 'you', colour: '#F5B895', text: `joined #${channelName}  —  welcome in 👋` },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 130, damping: 22 }}
      className="overflow-hidden rounded-[12px] border border-line bg-ink-raised"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-[10px]">
        <Hash size={14} weight="bold" className="text-bone-dim" />
        <span className="text-[13px] font-semibold text-bone">{channelName}</span>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {lines.map((l, i) => (
          <motion.div
            key={l.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25 + i * 0.55,
              type: 'spring',
              stiffness: 130,
              damping: 22,
            }}
            className="flex items-center gap-3 text-[13px] text-bone-dim"
          >
            <span
              className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] text-[11px] font-bold text-ink"
              style={{ backgroundColor: l.colour }}
            >
              {l.name[0].toUpperCase()}
            </span>
            <span>
              <span className="font-semibold text-bone">{l.name}</span>{' '}
              <span>{l.text}</span>
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

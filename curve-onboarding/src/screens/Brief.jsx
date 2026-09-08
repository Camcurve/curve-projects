import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import { Chip, Input, Textarea } from '@/components/Field'
import TeamSliderStack from '@/components/TeamSliderStack'
import ChannelPicker from '@/components/ChannelPicker'
import { useOnboarding } from '@/lib/useOnboarding'


const accent = (word) => <span className="text-brand">{word}</span>

const ACT_PLAN = 'The plan'
const ACT_ESSENTIALS = 'The essentials'
const ACT_DETAILS = 'The details'

// Channel picker leads: it's the moment that feels like magic, and it shouldn't
// sit behind a headcount question.
const QUESTIONS = [
  {
    id: 'youtube',
    act: ACT_PLAN,
    type: 'channel-picker',
    label: <>Which {accent('YouTube')} channel is yours?</>,
    hint: 'Start typing and pick it from the list — that way we link you straight to the right settings later.',
    required: true,
  },
  {
    id: 'team',
    act: ACT_PLAN,
    type: 'team-sliders',
    label: <>Who&apos;s on your {accent('team')}?</>,
    hint: 'Drag each row to how many of that role you have. Zero is fine.',
  },
]

function hasAnswer(value, type) {
  if (type === 'chip-multi') return Array.isArray(value) && value.length > 0
  if (type === 'chip-single') return typeof value === 'string' && value.length > 0
  if (type === 'channel-picker') return typeof value === 'string' && value.trim().length > 0
  if (type === 'team-sliders') {
    // The sliders default to an all-zero object, so an untouched brief would look
    // answered and the resume logic would skip straight past it.
    return !!value && typeof value === 'object' && Object.values(value).some((n) => Number(n) > 0)
  }
  return typeof value === 'string' && value.trim().length > 0
}

function firstUnansweredIndex(brief) {
  // Resume just past the last question they actually answered, rather than at the
  // first gap. No question is mandatory, so a client who legitimately skips one
  // (no in-house team, nothing to flag) would otherwise be sent back to it
  // every time they returned.
  let last = -1
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i]
    if (hasAnswer(brief[q.id], q.type)) last = i
  }
  return Math.min(last + 1, QUESTIONS.length - 1)
}

export default function Brief({ client }) {
  const navigate = useNavigate()
  const { state, updateBrief } = useOnboarding(client.slug)
  const [index, setIndex] = useState(() => firstUnansweredIndex(state.brief))
  const [direction, setDirection] = useState(1)
  const autoAdvanceRef = useRef(null)

  useEffect(() => {
    // Silently mirror the slug into brief.brand — Done + the webhook still read this,
    // but there's no dedicated question for it.
    if (!state.brief.brand) updateBrief({ brand: client.name })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    }
  }, [])

  const q = QUESTIONS[index]
  const value = state.brief[q.id]
  const isLast = index === QUESTIONS.length - 1
  const isFirst = index === 0
  const canAdvance = q.required ? hasAnswer(value, q.type) : true

  const goNext = () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    if (isLast) {
      navigate(`/${client.slug}/access`)
      return
    }
    setDirection(1)
    setIndex((i) => Math.min(QUESTIONS.length - 1, i + 1))
  }

  const goBack = () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    if (isFirst) {
      navigate(`/${client.slug}`)
      return
    }
    setDirection(-1)
    setIndex((i) => Math.max(0, i - 1))
  }

  const handleMeta = (m) => {
    updateBrief({ channelMeta: m, channelId: m?.channelId || '' })
  }

  const handleChange = (next) => {
    updateBrief({ [q.id]: next })
    if (q.type === 'chip-single' && next) {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
      autoAdvanceRef.current = setTimeout(goNext, 420)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && (q.type === 'text' || q.type === 'url')) {
      if (canAdvance) goNext()
    }
  }

  const progressPct = useMemo(
    () => ((index + 1) / QUESTIONS.length) * 100,
    [index]
  )

  const footer = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={goBack} className="px-4">
          Back
        </Button>
        <Button size="block" withArrow disabled={!canAdvance} onClick={goNext}>
          {isLast ? 'Continue' : 'Next'}
        </Button>
      </div>
      {!canAdvance && (
        <p className="text-center text-[12px] text-bone-muted">
          {q.type === 'channel-picker'
            ? 'Pick your channel to carry on.'
            : 'Answer this one to carry on.'}
        </p>
      )}
    </div>
  )

  return (
    <Layout client={client} currentStep="brief" footer={footer}>
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-3">
          <span className="shrink-0 font-mono text-[11px] tracking-[0.04em] text-bone-muted tabular">
            {String(index + 1).padStart(2, '0')}{' '}
            <span className="text-bone-faint">/ {String(QUESTIONS.length).padStart(2, '0')}</span>
          </span>
          <div className="relative h-[2px] flex-1 overflow-hidden bg-line">
            <div
              className="absolute inset-y-0 left-0 bg-brand transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <AnimatePresence>
          <motion.div
            key={q.act}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 140, damping: 22 }}
            className="flex items-center gap-[10px]"
          >
            <span className="h-[6px] w-[6px] rounded-full bg-brand shadow-[0_0_8px_rgba(255,95,0,0.7)]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-bone-muted">
              {q.act}
            </span>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence custom={direction}>
          <motion.div
            key={q.id}
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 26 : -22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 110, damping: 22 }}
            className="flex flex-col gap-7"
          >
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-[42px] font-extrabold leading-[1.02] tracking-[-0.035em] text-bone sm:text-[54px]">
                {q.label}
              </h1>
              {q.hint && (
                <p className="max-w-[46ch] text-[14px] leading-[1.55] text-bone-dim">
                  {q.hint}
                </p>
              )}
            </div>

            <QuestionInput
              q={q}
              value={value}
              onChange={handleChange}
              meta={state.brief.channelMeta}
              onMeta={handleMeta}
              onKeyDown={onKeyDown}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  )
}

function QuestionInput({ q, value, onChange, onKeyDown, meta, onMeta }) {
  if (q.type === 'text' || q.type === 'url') {
    return (
      <Input
        autoFocus
        type={q.type === 'url' ? 'url' : 'text'}
        inputMode={q.type === 'url' ? 'url' : undefined}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={q.placeholder}
      />
    )
  }
  if (q.type === 'textarea') {
    return (
      <Textarea
        autoFocus
        rows={4}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={q.placeholder}
      />
    )
  }
  if (q.type === 'chip-single') {
    return (
      <div className="flex flex-wrap gap-2">
        {q.options.map((opt) => (
          <Chip key={opt} active={value === opt} onClick={() => onChange(opt)}>
            {opt}
          </Chip>
        ))}
      </div>
    )
  }
  if (q.type === 'chip-multi') {
    const list = Array.isArray(value) ? value : []
    return (
      <div className="flex flex-wrap gap-2">
        {q.options.map((opt) => {
          const active = list.includes(opt)
          return (
            <Chip
              key={opt}
              active={active}
              onClick={() =>
                onChange(active ? list.filter((x) => x !== opt) : [...list, opt])
              }
            >
              {opt}
            </Chip>
          )
        })}
      </div>
    )
  }
  if (q.type === 'team-sliders') {
    return <TeamSliderStack value={value} onChange={onChange} />
  }
  if (q.type === 'channel-picker') {
    return (
      <ChannelPicker value={value} onChange={onChange} meta={meta} onMeta={onMeta} />
    )
  }
  return null
}

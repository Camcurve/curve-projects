import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadState, saveState } from './storage'

export const STEPS = [
  { key: 'welcome', path: '', label: 'Welcome' },
  { key: 'brief', path: 'brief', label: 'Brand brief' },
  { key: 'access', path: 'access', label: 'Access' },
  { key: 'booking', path: 'booking', label: 'Book kick-off' },
  { key: 'done', path: 'done', label: 'Done' },
]

export function stepIndex(key) {
  return Math.max(0, STEPS.findIndex((s) => s.key === key))
}

export function useOnboarding(slug) {
  const [state, setState] = useState(() => loadState(slug))
  // Ref mirrors state so persist() can compute next without going through setState's
  // deferred functional-updater path. Writes to localStorage are synchronous, so a
  // navigation that fires right after persist() sees the fresh value.
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const next = loadState(slug)
    stateRef.current = next
    setState(next)
  }, [slug])

  const persist = useCallback(
    (updater) => {
      const prev = stateRef.current
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      stateRef.current = next
      saveState(slug, next) // sync — write immediately so downstream route gates read fresh
      setState(next) // then re-render React
    },
    [slug]
  )

  const updateBrief = useCallback(
    (patch) => {
      persist((prev) => ({ ...prev, brief: { ...prev.brief, ...patch } }))
    },
    [persist]
  )

  // Access is 'settled' either by granting it or by naming who will.
  const ytSettled = state.ytDone || !!state.ytDelegatedTo

  const canAccess = useMemo(
    () => ({
      welcome: true,
      brief: true,
      access: true,
      booking: ytSettled && state.commsDone,
      done: ytSettled && state.commsDone && state.bookingDone,
    }),
    [ytSettled, state.commsDone, state.bookingDone]
  )

  return { state, persist, updateBrief, canAccess }
}

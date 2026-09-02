const PREFIX = 'curve:onboarding:'

const defaultState = () => ({
  brief: {
    brand: '',
    team: {
      videoEditor: 0,
      thumbnailDesigner: 0,
      producer: 0,
      videographer: 0,
      scriptwriter: 0,
    },
    website: '',
    youtube: '',
    channelId: '', // resolved from `youtube` so we can deep-link their Studio permissions
    neverDo: '',
    // Captured on the Access screen. 'email' comms fills name + email;
    // 'whatsapp' fills people[] — one row per person joining the group, so a
    // number can always be matched back to a name.
    contact: { name: '', email: '', people: [{ name: '', phone: '' }] },
  },
  ytDone: false,
  // Set when the person onboarding isn't the channel admin — { name, email }
  // of whoever is, so the step can be settled without falsely claiming access.
  ytDelegatedTo: null,
  commsDone: false, // joined Slack / WhatsApp, or confirmed email contact
  bookingDone: false,
  completed: false,
  webhookSentAt: null,
  deliveredVia: null, // { email: bool, webhook: bool } once delivered
  updatedAt: null,
})

function keyFor(slug) {
  return `${PREFIX}${slug}`
}

export function loadState(slug) {
  if (!slug || typeof window === 'undefined') return defaultState()
  try {
    const raw = window.localStorage.getItem(keyFor(slug))
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    const defaults = defaultState()
    return {
      ...defaults,
      ...parsed,
      brief: {
        ...defaults.brief,
        ...(parsed.brief || {}),
        team: { ...defaults.brief.team, ...(parsed.brief?.team || {}) },
        contact: {
          ...defaults.brief.contact,
          ...(parsed.brief?.contact || {}),
          people: parsed.brief?.contact?.people?.length
            ? parsed.brief.contact.people
            : defaults.brief.contact.people,
        },
      },
    }
  } catch {
    return defaultState()
  }
}

export function saveState(slug, state) {
  if (!slug || typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      keyFor(slug),
      JSON.stringify({ ...state, updatedAt: new Date().toISOString() })
    )
  } catch {
    // quota exceeded — fail silent rather than breaking the flow
  }
}

export function clearState(slug) {
  if (!slug || typeof window === 'undefined') return
  window.localStorage.removeItem(keyFor(slug))
}

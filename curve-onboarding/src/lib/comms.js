// How a client talks to us day-to-day. Set per client in config/clients.js.
//
//   'slack'    — they join the Curve workspace. Best for retainers: threaded,
//                searchable, and we already live there.
//   'whatsapp' — they join a WhatsApp group. Lowest friction for people who
//                won't install another app, but no threading or search.
//   'email'    — nothing to join. Right for one-off projects, and the only
//                option that reliably clears enterprise IT policy.
export const COMMS = {
  SLACK: 'slack',
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
}

export const DEFAULT_COMMS = COMMS.SLACK

export function commsOf(client) {
  const c = client?.comms
  return Object.values(COMMS).includes(c) ? c : DEFAULT_COMMS
}

// Loose but useful — catches typos without rejecting valid oddities.
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim())
}

// E.164-ish: optional +, then 7-15 digits once separators are stripped. Deliberately
// permissive — we're catching typos, not validating carrier routing.
export function normalisePhone(value) {
  return String(value || '').replace(/[\s()\-.]/g, '')
}

export function isValidPhone(value) {
  return /^\+?[0-9]{7,15}$/.test(normalisePhone(value))
}

export const COMMS_LABEL = {
  [COMMS.SLACK]: 'Slack joined',
  [COMMS.WHATSAPP]: 'WhatsApp group joined',
  [COMMS.EMAIL]: 'Contact confirmed',
}

// Completion delivery.
//
//   1. Email — Web3Forms when VITE_WEB3FORMS_KEY is set, otherwise FormSubmit.
//      Web3Forms authenticates with an access key, so it works from ANY page URL.
//      FormSubmit ties activation to the submitting URL, which breaks an app like
//      this one where every client has their own path (/fifae, /hubspot, …) —
//      each would need its own activation click before a brief could be delivered.
//   2. Webhook (VITE_WEBHOOK_URL) — optional, for Make.com / Slack automation.
//
// Both return a checkable result. Delivery counts as successful if either lands;
// if neither does, Done.jsx keeps webhookSentAt null (so a return visit retries)
// AND surfaces a manual fallback to the client, so a dropped brief can never be
// mistaken for a delivered one.

import { COMMS_LABEL, commsOf } from '@/lib/comms'

const DELIVERY_EMAIL =
  import.meta.env.VITE_DELIVERY_EMAIL || import.meta.env.VITE_CONTACT_EMAIL || 'cam@thecurve.media'

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || ''
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${DELIVERY_EMAIL}`
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

export const emailTransport = WEB3FORMS_KEY ? 'web3forms' : 'formsubmit'

const dash = (v) => {
  if (v === null || v === undefined) return '—'
  const s = String(v).trim()
  return s.length ? s : '—'
}

// Whichever details the Access screen captured — email for email-run projects,
// phone for WhatsApp, neither when they're in Slack.
function describeContact(c) {
  if (!c) return '—'
  // WhatsApp projects capture one row per person; email projects capture one contact.
  if (c.people?.length) {
    return c.people
      .filter((p) => p.name || p.phone)
      .map((p) => `${p.name} — ${p.phone}`)
      .join(' / ')
  }
  if (!c.name) return '—'
  const reach = [c.email, c.phone].filter(Boolean).join(' · ')
  return reach ? `${c.name} — ${reach}` : c.name
}

function describeTeam(team) {
  if (!team || typeof team !== 'object') return '—'
  const filled = Object.entries(team).filter(([, n]) => Number(n) > 0)
  if (!filled.length) return 'No in-house team'
  return filled
    .map(([role, n]) => `${role.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}: ${n}`)
    .join(', ')
}

// Human-readable body — this is what actually lands in the inbox, so it needs
// to be readable at a glance on a phone, not raw JSON.
function buildEmailPayload({ client, state, brief }) {
  const b = brief
  return {
    _subject: `Onboarding complete — ${client.name}`,
    _template: 'table',
    Brand: client.name,
    Slug: client.slug,
    'Completed at': new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }),
    Website: dash(b.website),
    'YouTube channel': dash(b.youtube),
    Team: describeTeam(b.team),
    'Never say or do': dash(b.neverDo),
    'Point of contact': describeContact(b.contact),
    'YouTube access granted': state.ytDone
      ? 'Yes'
      : state.ytDelegatedTo
        ? `Not yet — ${state.ytDelegatedTo.name} (${state.ytDelegatedTo.email}) manages the channel, chase them`
        : 'No',
    [COMMS_LABEL[commsOf(client)]]: state.commsDone ? 'Yes' : 'No',
    'Kick-off booked': state.bookingDone ? 'Yes' : 'No',
  }
}

async function deliverEmail(payload) {
  if (WEB3FORMS_KEY) return deliverViaWeb3Forms(payload)
  return deliverViaFormSubmit(payload)
}

// Access-key auth, no per-URL activation, CORS-enabled, returns {success: bool}.
async function deliverViaWeb3Forms(payload) {
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        from_name: 'Curve Onboarding',
        ...payload,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && data.success === true) return { ok: true }
    return { ok: false, error: data.message || `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

async function deliverViaFormSubmit(payload) {
  try {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && String(data.success) === 'true') return { ok: true }
    return { ok: false, error: data.message || `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

// Slack incoming webhooks reject arbitrary JSON — they require `text` or `blocks`.
// Posting our raw onboarding payload there returns invalid_payload and the ping
// silently never arrives, so reshape it when the URL is a Slack hook.
function isSlackWebhook(url) {
  return /^https:\/\/hooks\.slack\.com\//i.test(String(url || ''))
}

function toSlackMessage(payload, emailPayload) {
  const b = payload.brief || {}
  const line = (k, v) => `*${k}:* ${v}`
  const contact = describeContact(b.contact)
  return {
    text: `Onboarding complete — ${payload.brand}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `Onboarding complete — ${payload.brand}` },
      },
      {
        type: 'section',
        fields: [
          line('Contact', contact),
          line('Channel', b.youtube || '—'),
          line('YouTube access', payload.access.youtube ? 'Yes' : 'No'),
          line('Kick-off booked', payload.access.booked ? 'Yes' : 'No'),
        ].map((t) => ({ type: 'mrkdwn', text: t })),
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Full brief emailed to ${emailPayload ? 'the delivery inbox' : 'nobody — email delivery is off'} · slug \`${payload.slug}\``,
          },
        ],
      },
    ],
  }
}

async function deliverWebhook(url, payload, emailPayload) {
  if (!url) return { ok: false, skipped: true }
  const body = JSON.stringify(
    isSlackWebhook(url) ? toSlackMessage(payload, emailPayload) : payload
  )
  // Try a real CORS request first so a rejection is actually visible. Make.com
  // sends CORS headers; Slack does not — hence the no-cors retry, which is
  // fire-and-forget and can only be reported as "sent, unverified".
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
    if (res.ok) return { ok: true, verified: true }
    return { ok: false, error: `HTTP ${res.status}` }
  } catch {
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body,
        keepalive: true,
      })
      return { ok: true, verified: false }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  }
}

// Same fields as the delivery email, rendered as plain text for a mailto: link.
// Used only when every automated channel failed — the client hands it over by hand
// rather than the brief evaporating.
export function buildManualEmail({ client, state }) {
  const brief = { ...(state.brief || {}) }
  const payload = buildEmailPayload({ client, state, brief })
  const { _subject, _template, ...fields } = payload
  const body = Object.entries(fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
  return {
    to: DELIVERY_EMAIL,
    subject: _subject,
    body,
    href: `mailto:${DELIVERY_EMAIL}?subject=${encodeURIComponent(_subject)}&body=${encodeURIComponent(body)}`,
  }
}

export async function fireCompletionWebhook({ client, state }) {
  const brief = { ...(state.brief || {}) }

  const webhookPayload = {
    event: 'onboarding.completed',
    slug: client.slug,
    brand: client.name,
    completedAt: new Date().toISOString(),
    brief,
    comms: commsOf(client),
    access: {
      youtube: state.ytDone,
      youtubeDelegatedTo: state.ytDelegatedTo || null,
      comms: state.commsDone,
      booked: state.bookingDone,
    },
  }

  const emailPayload = buildEmailPayload({ client, state, brief })

  const [email, hook] = await Promise.all([
    deliverEmail(emailPayload),
    deliverWebhook(import.meta.env.VITE_WEBHOOK_URL, webhookPayload, emailPayload),
  ])

  // Either channel landing is enough — we never lose a brief to one dead endpoint.
  const ok = email.ok || hook.ok

  if (!ok && import.meta.env.DEV) {
    console.warn('[curve] brief delivery failed', { email, webhook: hook })
  }

  return { ok, channels: { email, webhook: hook } }
}

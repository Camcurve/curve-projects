// The only file you touch when onboarding a new client.
// Each entry is keyed by slug. The slug becomes the URL: onboarding.thecurve.media/<slug>
//
// Required:
//   name         — shown in headlines + the Done screen.
//
// Optional:
//   firstName    — used in casual addresses ("You're all set, Alex."). Derived from name if omitted.
//   logo         — path to a PNG/SVG under /public (e.g. '/logos/perfectted.png').
//                  Defaults to /logos/<slug>.png if you drop the file there.
//   logoTint     — 'white' to force-tint the logo via CSS (for dark-on-light logos).
//   slackChannelId — the `C...` ID of their dedicated channel. Grab it from the Slack URL once created.
//   comms        — how they talk to us day-to-day: 'slack' (default), 'whatsapp' or 'email'.
//                  'whatsapp' collects name + number rows and we add them to the group
//                  after onboarding. 'email' swaps the step for a point-of-contact capture.
//
//   stats — the "we did our homework" card on Welcome.
//     By default, every client sees Curve's track record (DEFAULT_STATS below).
//     Override per-client only when it's a big-name channel and showing their live numbers
//     hits harder — e.g. Noah Kagan, HubSpot. Shape:
//       stats: { eyebrow, items: [{ value, label }, …], caption }

// Default card — the confident flex. Every client gets this unless overridden.
// Update numbers here and every client updates in one move.
const DEFAULT_STATS = {
  eyebrow: "This is what we've built",
  items: [
    { value: '1B', label: 'Views delivered' },
    { value: '$3M', label: 'Revenue driven' },
    { value: '30+', label: "Channels we've scaled" },
  ],
  caption: "That's what we've done. Yours next.",
}

export const clients = {
  fifae: {
    name: 'FIFA e',
    firstName: 'team',
    comms: 'whatsapp',
  },
  perfectted: {
    name: 'PerfectTed',
    firstName: 'team',
    logo: '/logos/perfectted.png',
  },
  twix: {
    name: 'Twix',
    firstName: 'team',
    logo: '/logos/twix.png',
  },
  crunchy: {
    name: 'Crunchy',
    firstName: 'team',
  },
  hubspot: {
    name: 'HubSpot',
    firstName: 'team',
  },
  chunkz: {
    name: 'Chunkz',
    firstName: 'Chunkz',
  },
  noah: {
    name: 'Noah Kagan',
    firstName: 'Noah',
  },
  sunny: {
    name: 'Sunny Lenarduzzi',
    firstName: 'Sunny',
  },
  demo: {
    name: 'Demo Brand',
    firstName: 'team',
  },
}

export function getClient(slug) {
  if (!slug) return null
  const key = slug.toLowerCase()
  const base = clients[key]
  if (base) {
    return {
      slug: key,
      stats: DEFAULT_STATS,
      ...base,
      logo: base.logo ?? `/logos/${key}.png`,
    }
  }
  const title = key
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    slug: key,
    name: title,
    firstName: title.split(' ')[0],
    stats: DEFAULT_STATS,
    logo: `/logos/${key}.png`,
  }
}

export function firstNameOf(client) {
  if (!client) return 'there'
  return client.firstName || client.name.split(' ')[0]
}

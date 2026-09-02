# Curve · Client Onboarding

Mobile-first, 5-step onboarding flow for Curve (thecurve.media) clients.

Stack: React 19 · Vite · Tailwind v4 · React Router v7 · Framer Motion · Phosphor Icons.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173/demo` — `demo` is a sample client slug. Swap it for any slug you've configured.

## Add a new client

One file only: [`src/config/clients.js`](src/config/clients.js).

```js
export const clients = {
  hubspot: { name: 'HubSpot', firstName: 'team' },
  chunkz: { name: 'Chunkz', firstName: 'Chunkz' },
  // Add here:
  newbrand: { name: 'New Brand', firstName: 'Alex' },
}
```

The new client is live at `/<slug>`. If a slug isn't in the config, the app still works — it title-cases the slug as the display name, so `/acme` renders as "Welcome, Acme."

## Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Key | Purpose |
| --- | --- |
| `VITE_LOOM_URL` | Any Loom URL (share or embed). Embedded on Screen 1. |
| `VITE_BOOKING_URL` | Kick-off booking link opened from Screen 4 — cal.com or Calendly. (`VITE_CALENDLY_URL` still works as a fallback.) |
| `VITE_CONTACT_EMAIL` | Shown on Screen 5. Default: `cam@thecurve.media`. |
| `VITE_WEBHOOK_URL` | **Set this or you receive nothing.** Fires a POST with the brief JSON when a client hits Screen 5. Without it the brief stays in the client's browser only. |
| `VITE_YOUTUBE_API_KEY` | YouTube Data API v3 key for live channel search in the brief. Without it the search falls back to a small demo pool, and a client won't find their own channel. |
| `VITE_SLACK_WORKSPACE_ID` | Slack team ID (`T…`, from the Slack web URL). Needed for the "Open #channel" button. If blank or invalid, that step shows invite-by-email copy instead — never a dead link. |

## Comms channel

Each client picks one, via `comms` in `clients.js`. It changes step 2 of the Access screen:

| `comms` | Step 2 becomes | Use it for |
| --- | --- | --- |
| `'slack'` (default) | Join the Curve workspace | Retainers — threaded and searchable |
| `'whatsapp'` | Join the group (needs `whatsappInvite`) | Clients who won't install another app |
| `'email'` | Confirm point of contact (name + email) | One-off projects, and enterprises whose IT blocks external workspaces |

`'email'` is the only one that captures a reply-to address, because it's the only
one where we don't otherwise get a channel to reach them on.

## Flow

| Step | Route | Gate |
| --- | --- | --- |
| 01 Welcome | `/:slug` | — |
| 02 Brief | `/:slug/brief` | — |
| 03 Access | `/:slug/access` | — |
| 04 Booking | `/:slug/booking` | YouTube + Slack confirmed |
| 05 Done | `/:slug/done` | Booking confirmed |

Client progress (brief answers, access confirmations, booking state) is saved to `localStorage` under `curve:onboarding:<slug>` so returning to the link resumes where they left off.

## Brief delivery

A completed brief goes out over two independent channels, in parallel:

1. **Email via FormSubmit** — the guaranteed one, same mechanism as `contact.html`.
   Uses the CORS-enabled `/ajax/` endpoint, which returns `success:"true"` only on
   real delivery, so failure is detectable. Goes to `VITE_DELIVERY_EMAIL`
   (falls back to `VITE_CONTACT_EMAIL`).
2. **Webhook** — `VITE_WEBHOOK_URL`, for Make.com / Slack automation. Tries a real
   CORS request first so rejections are visible; falls back to `no-cors`
   fire-and-forget for endpoints like Slack that don't send CORS headers.

Delivery counts as successful if **either** channel lands, so one dead endpoint
can't lose a brief. If both fail, `webhookSentAt` stays `null` and the next visit
to Screen 5 retries. The result is recorded in `deliveredVia`.

> **FormSubmit needs one-time activation per recipient address.** The first send to
> a new inbox triggers a confirmation email you must click. Until then, nothing
> is delivered.

## Webhook payload

When `VITE_WEBHOOK_URL` is set, Screen 5 POSTs:

```json
{
  "event": "onboarding.completed",
  "slug": "hubspot",
  "brand": "HubSpot",
  "completedAt": "2026-04-21T20:00:00.000Z",
  "brief": {
    "brand": "HubSpot",
    "website": "https://hubspot.com",
    "youtube": "https://youtube.com/@hubspot",
    "toneOfVoice": ["Educational", "Direct"],
    "neverDo": "…",
    "admire": "…"
  },
  "access": { "youtube": true, "slack": true, "booked": true }
}
```

Sent with `mode: 'no-cors'` + `keepalive: true` so it fires even if the tab is closing. Point it at a Make.com webhook or Slack incoming webhook.

## Deploy

```bash
vercel
```

Set the env vars in the host's dashboard — `.env.local` is not deployed.

SPA routing is already handled: `vercel.json` rewrites all paths to `index.html`, and
`public/_redirects` does the same for Cloudflare Pages / Netlify. Without one of those,
every client deep link (`/fifae`, `/fifae/brief`) 404s on load and refresh.

### Pre-client checklist

- [ ] **Activate FormSubmit for `data@thecurve.media`** — the delivery inbox.
      The first POST to a new address triggers a one-time confirmation email that
      someone must click before anything is delivered. Until that click, briefs
      are silently dropped. (`cam@thecurve.media` is already activated via
      contact.html, but delivery is set to `data@`.)
- [ ] `VITE_WEBHOOK_URL` set and test-fired — confirm a brief actually lands
- [ ] `VITE_LOOM_URL` set, or Screen 1 shows a "walkthrough on its way" placeholder
- [ ] `VITE_CALENDLY_URL` set, or Screen 4 falls back to "we'll email you a time"
- [ ] `VITE_SLACK_WORKSPACE_ID` set + real `slackChannelId` in `clients.js`
- [ ] `VITE_YOUTUBE_API_KEY` set so the client can find their own channel
- [ ] Client added to `src/config/clients.js`, logo dropped in `public/logos/`
- [ ] Walked the whole flow on a phone at the live URL

## Design

Tokens lifted from thecurve.media: near-black `#131313`, orange `#FF5F00`, Cabinet Grotesk + Cormorant Garamond italic + Manrope + JetBrains Mono, sharp 0px corners.

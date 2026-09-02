// Turning whatever the client pastes into a direct link to THEIR Studio
// permissions page — the step where they grant us Manager access.

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

// Extract a channel ID (UC...) from any URL shape we can recognise without a
// network call. Handles youtube.com/channel/UC..., studio.youtube.com/channel/UC...,
// and bare UC... strings.
export function extractChannelId(url) {
  if (!url) return null
  const s = String(url).trim()
  const fromPath = s.match(/channel\/(UC[A-Za-z0-9_-]{22})/i)
  if (fromPath) return fromPath[1]
  const bare = s.match(/^(UC[A-Za-z0-9_-]{22})$/)
  if (bare) return bare[1]
  return null
}

// Most people paste a handle (youtube.com/@fifae), which carries no channel ID.
export function extractHandle(url) {
  if (!url) return null
  const m = String(url).trim().match(/@([A-Za-z0-9._-]{3,30})/)
  return m ? m[1] : null
}

// Resolve a handle to its channel ID via the Data API. Needs VITE_YOUTUBE_API_KEY —
// without it we simply can't turn @handle into UC..., and the caller falls back to
// the generic Studio link. Returns null rather than throwing so onboarding never
// breaks on a quota error or a typo'd handle.
export async function resolveChannelId(channelUrl) {
  const direct = extractChannelId(channelUrl)
  if (direct) return direct
  if (!API_KEY) return null

  const handle = extractHandle(channelUrl)
  if (!handle) return null

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/channels')
    url.searchParams.set('part', 'id')
    url.searchParams.set('forHandle', `@${handle}`)
    url.searchParams.set('key', API_KEY)
    const res = await fetch(url.toString())
    if (!res.ok) return null
    const data = await res.json()
    return data.items?.[0]?.id ?? null
  } catch {
    return null
  }
}

// Straight to the permissions tab when we know the channel ID; otherwise the
// generic Studio entry point, which still lands them one navigation away.
export function buildStudioPermissionsUrl(channelUrlOrId) {
  const id = extractChannelId(channelUrlOrId)
  if (id) return `https://studio.youtube.com/channel/${id}/settings/permissions`
  return 'https://studio.youtube.com/'
}

// True when we managed a direct deep link — lets the UI word the step honestly.
export function isDeepLink(channelUrlOrId) {
  return !!extractChannelId(channelUrlOrId)
}

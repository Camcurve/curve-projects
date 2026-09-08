// Live channel search for the "which channel is yours" step.
//
// QUOTA: search.list costs 100 units per call against a 10,000/day free quota,
// where almost every other call costs 1. That's ~100 searches a day for the whole
// app, so this module debounces hard (500ms), ignores queries under 2 characters,
// and caches every result set for the session. A second channels.list call
// (1 unit) hydrates subscriber counts and proper avatars, which is what makes a
// client confident they've picked the right channel.

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
export const searchEnabled = !!API_KEY

const cache = new Map()

function compactSubs(n) {
  const v = Number(n)
  if (!Number.isFinite(v)) return null
  if (v >= 1e9) return `${(v / 1e9).toFixed(1).replace(/\.0$/, '')}B`
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace(/\.0$/, '')}M`
  if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace(/\.0$/, '')}K`
  return String(v)
}

// Deterministic colour for the fallback avatar when a thumbnail won't load.
const AVATAR_COLOURS = ['#ff5f00', '#ff7a29', '#f5b895', '#5c8d59', '#3b82f6', '#8b5cf6', '#ec4899']
export function avatarColour(name = '') {
  const hash = [...name].reduce((h, c) => h + c.charCodeAt(0), 0)
  return AVATAR_COLOURS[hash % AVATAR_COLOURS.length]
}

// Second call: real avatars, subscriber counts and handles. 1 unit for up to 50 ids.
async function hydrate(ids) {
  if (!ids.length) return {}
  const url = new URL('https://www.googleapis.com/youtube/v3/channels')
  url.searchParams.set('part', 'snippet,statistics')
  url.searchParams.set('id', ids.join(','))
  url.searchParams.set('maxResults', '10')
  url.searchParams.set('key', API_KEY)
  const res = await fetch(url.toString())
  if (!res.ok) return {}
  const data = await res.json()
  const out = {}
  for (const item of data.items || []) {
    out[item.id] = {
      handle: item.snippet?.customUrl || null,
      thumbnail:
        item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || null,
      subs: item.statistics?.hiddenSubscriberCount
        ? null
        : compactSubs(item.statistics?.subscriberCount),
    }
  }
  return out
}

export async function searchChannels(query, { signal } = {}) {
  const q = (query || '').trim()
  if (!API_KEY || q.length < 2) return []
  if (cache.has(q)) return cache.get(q)

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search')
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('type', 'channel')
    url.searchParams.set('maxResults', '6')
    url.searchParams.set('q', q)
    url.searchParams.set('key', API_KEY)

    const res = await fetch(url.toString(), { signal })
    if (!res.ok) return []
    const data = await res.json()

    const base = (data.items || []).map((item) => ({
      channelId: item.id?.channelId ?? item.snippet?.channelId,
      name: item.snippet?.channelTitle || item.snippet?.title || '',
      thumbnail: item.snippet?.thumbnails?.default?.url || null,
    }))

    const extra = await hydrate(base.map((c) => c.channelId).filter(Boolean))
    const merged = base.map((c) => ({ ...c, ...(extra[c.channelId] || {}) }))

    cache.set(q, merged)
    return merged
  } catch {
    // Quota, network, aborted request — an empty list degrades to manual entry.
    return []
  }
}

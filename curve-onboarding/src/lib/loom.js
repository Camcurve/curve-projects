// Accepts any Loom URL format and returns the embed URL.
// Supported: /share/<id>, /embed/<id>, raw id string.
export function toLoomEmbed(urlOrId) {
  if (!urlOrId) return null
  const str = String(urlOrId).trim()
  const match = str.match(/([a-f0-9]{20,})/i)
  const id = match ? match[1] : null
  if (!id) return null
  const params = new URLSearchParams({
    hide_owner: 'true',
    hide_share: 'true',
    hide_title: 'true',
    hideEmbedTopBar: 'true',
  })
  return `https://www.loom.com/embed/${id}?${params.toString()}`
}

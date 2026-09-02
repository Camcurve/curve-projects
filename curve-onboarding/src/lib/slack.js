// Slack workspace team ID (the `T...` segment after `/client/` in the Slack web URL).
// Set VITE_SLACK_WORKSPACE_ID in the environment. If it's missing or still a
// placeholder, buildSlackChannelUrl returns null and the Access screen falls back
// to "check your inbox for the invite" — never a dead link in front of a client.
const RAW_WORKSPACE_ID = import.meta.env.VITE_SLACK_WORKSPACE_ID ?? ''

// A real Slack team ID is T + 8-12 alphanumerics. Reject the old T00000000 stub
// and anything else that doesn't look real.
const VALID_TEAM_ID = /^T[A-Z0-9]{7,11}$/i
const PLACEHOLDERS = new Set(['T00000000'])

export const SLACK_WORKSPACE_ID =
  VALID_TEAM_ID.test(RAW_WORKSPACE_ID) && !PLACEHOLDERS.has(RAW_WORKSPACE_ID.toUpperCase())
    ? RAW_WORKSPACE_ID
    : null

// Channel IDs are C + 8-11 alphanumerics. Guards against leftover stubs
// like 'C08XXXXXXXX' or hand-invented IDs.
const VALID_CHANNEL_ID = /^C[A-Z0-9]{7,10}$/

export function isValidChannelId(channelId) {
  if (!channelId) return false
  const id = String(channelId).toUpperCase()
  if (id.includes('XXXX')) return false
  return VALID_CHANNEL_ID.test(id)
}

// Build a direct URL to a Slack channel. Opens the native Slack app when installed,
// otherwise falls back to Slack web. Returns null unless BOTH the workspace and the
// channel ID are real — the caller then shows the invite-by-email copy instead.
export function buildSlackChannelUrl(channelId) {
  if (!SLACK_WORKSPACE_ID) return null
  if (!isValidChannelId(channelId)) return null
  return `https://app.slack.com/client/${SLACK_WORKSPACE_ID}/${String(channelId).toUpperCase()}`
}

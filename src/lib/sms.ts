// Telnyx REST API — no SDK needed, just fetch
// Env vars needed:
//   TELNYX_API_KEY      — your Telnyx API v2 key (starts with KEY...)
//   TELNYX_PHONE_NUMBER — your Telnyx number in E.164, e.g. +15551234567
//   OPERATOR_PHONE_NUMBER — your personal number for the dial-through call feature

const TELNYX_API = 'https://api.telnyx.com/v2'

/**
 * Whether Telnyx A2P (application-to-person) SMS is enabled.
 * Defaults to FALSE while we're in 10DLC carrier review.
 * Flip the Vercel env var TELNYX_A2P_ENABLED=true after approval to re-enable.
 *
 * When disabled:
 *   - All Telnyx SMS send functions throw a friendly error
 *   - Drip cron skips sends and does NOT advance the sequence
 *   - UI buttons show the disabled state
 * P2P "open Messages app" sends are unaffected.
 */
export function isA2pEnabled(): boolean {
  const v = (process.env.TELNYX_A2P_ENABLED ?? 'false').toLowerCase()
  return v === 'true' || v === '1' || v === 'yes'
}

export class A2pDisabledError extends Error {
  code = 'a2p-disabled'
  constructor() {
    super('Telnyx SMS is paused while 10DLC is in carrier review. Use P2P "Text" (opens Messages app) instead.')
    this.name = 'A2pDisabledError'
  }
}

/**
 * Detect what kind of number TELNYX_PHONE_NUMBER is.
 *   - 'toll-free'  → US toll-free prefixes (800, 833, 844, 855, 866, 877, 888)
 *   - 'short-code' → 5–6 digit codes
 *   - 'long-code'  → standard 10-digit number (default for 10DLC)
 */
export function getNumberType(): 'toll-free' | 'short-code' | 'long-code' | 'unknown' {
  const n = (process.env.TELNYX_PHONE_NUMBER ?? '').replace(/\D/g, '')
  if (!n) return 'unknown'
  if (n.length <= 6) return 'short-code'
  // E.164 US: starts with 1, then 10 digits. Toll-free prefixes:
  const npa = n.length === 11 && n.startsWith('1') ? n.slice(1, 4) : n.slice(0, 3)
  if (['800', '833', '844', '855', '866', '877', '888'].includes(npa)) return 'toll-free'
  return 'long-code'
}

/** Max messages per second to attempt, per Telnyx documentation. */
export function ratePerSecond(): number {
  switch (getNumberType()) {
    case 'toll-free':  return 3    // Verified TFN: ~3 msg/s, ~2k/day
    case 'short-code': return 100  // Short code: high throughput
    case 'long-code':  return 10   // Registered 10DLC long code (T-Mobile rate)
    default:           return 1
  }
}

function telnyxHeaders() {
  return {
    'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

export async function sendSms(to: string, body: string): Promise<{ sid: string; status: string }> {
  if (!isA2pEnabled()) throw new A2pDisabledError()
  const from = process.env.TELNYX_PHONE_NUMBER
  if (!from) throw new Error('TELNYX_PHONE_NUMBER not set')
  if (!process.env.TELNYX_API_KEY) throw new Error('TELNYX_API_KEY not set')

  // Append opt-out language if not already present (A2P compliance)
  const hasStop = /\b(stop|opt[- ]?out|unsubscribe)\b/i.test(body)
  const text = hasStop ? body : `${body}\n\nReply STOP to opt out.`

  const res = await fetch(`${TELNYX_API}/messages`, {
    method: 'POST',
    headers: telnyxHeaders(),
    body: JSON.stringify({ from, to, text }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Telnyx SMS failed: ${JSON.stringify(err)}`)
  }

  const data = await res.json()
  const msg = data.data
  return { sid: msg.id, status: msg.to?.[0]?.status ?? 'queued' }
}

export async function initiateCall(to: string): Promise<{ sid: string; status: string }> {
  const from = process.env.TELNYX_PHONE_NUMBER
  const operatorPhone = process.env.OPERATOR_PHONE_NUMBER
  if (!from) throw new Error('TELNYX_PHONE_NUMBER not set')
  if (!operatorPhone) throw new Error('OPERATOR_PHONE_NUMBER not set')
  if (!process.env.TELNYX_API_KEY) throw new Error('TELNYX_API_KEY not set')

  // Always use the public Vercel URL for webhooks — localhost isn't reachable by Telnyx
  const baseUrl = process.env.TELNYX_WEBHOOK_BASE_URL ?? 'https://landline-pink.vercel.app'

  // If calling from Telnyx number to itself (test mode), call operator directly
  const isSelfTest = to === from
  const callTo   = isSelfTest ? operatorPhone : operatorPhone
  const payload: Record<string, string> = {
    connection_id: process.env.TELNYX_CONNECTION_ID ?? '',
    from,
    to: callTo,
    webhook_url: `${baseUrl}/api/telnyx/voice`,
  }
  if (!isSelfTest) {
    payload.client_state = Buffer.from(JSON.stringify({ leadPhone: to })).toString('base64')
  }

  const res = await fetch(`${TELNYX_API}/calls`, {
    method: 'POST',
    headers: telnyxHeaders(),
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Telnyx call failed: ${JSON.stringify(err)}`)
  }

  const data = await res.json()
  const call = data.data
  return { sid: call.call_control_id, status: call.state ?? 'initiated' }
}

export function buildPreviewMessage(businessName: string, previewUrl: string) {
  return `Hey — I tried reaching you about ${businessName}. I put together a quick website demo so you can see what an updated online presence could look like.

Preview: ${previewUrl}

Reply STOP to opt out.`
}

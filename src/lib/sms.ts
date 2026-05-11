// Telnyx REST API — no SDK needed, just fetch
// Env vars needed:
//   TELNYX_API_KEY      — your Telnyx API v2 key (starts with KEY...)
//   TELNYX_PHONE_NUMBER — your Telnyx number in E.164, e.g. +15551234567
//   OPERATOR_PHONE_NUMBER — your personal number for the dial-through call feature

const TELNYX_API = 'https://api.telnyx.com/v2'

function telnyxHeaders() {
  return {
    'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

export async function sendSms(to: string, body: string): Promise<{ sid: string; status: string }> {
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

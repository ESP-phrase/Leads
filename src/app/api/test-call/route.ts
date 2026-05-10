import { NextResponse } from 'next/server'

// Calls OPERATOR_PHONE_NUMBER directly via Telnyx.
// When answered, /api/test-call/webhook speaks a confirmation message.
export async function POST() {
  const apiKey = process.env.TELNYX_API_KEY
  const from   = process.env.TELNYX_PHONE_NUMBER
  const to     = process.env.OPERATOR_PHONE_NUMBER
  const connId = process.env.TELNYX_CONNECTION_ID
  const base   = process.env.NEXT_PUBLIC_APP_URL ?? 'https://landline-pink.vercel.app'

  if (!apiKey || !from || !to || !connId) {
    return NextResponse.json({ error: 'Missing Telnyx env vars' }, { status: 503 })
  }

  const res = await fetch('https://api.telnyx.com/v2/calls', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      connection_id: connId,
      from,
      to,
      webhook_url: `${base}/api/test-call/webhook`,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: 'Telnyx call failed', detail: err }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ status: 'calling', callId: data.data?.call_control_id })
}

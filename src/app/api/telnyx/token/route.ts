import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

// Generates a short-lived Telnyx WebRTC login token for the browser dialer.
// Requires a Credential Connection in your Telnyx portal.
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.TELNYX_API_KEY
  const connectionId = process.env.TELNYX_SIP_CONNECTION_ID

  if (!apiKey || !connectionId) {
    return NextResponse.json({ error: 'TELNYX_API_KEY or TELNYX_SIP_CONNECTION_ID not set' }, { status: 503 })
  }

  // Create a short-lived telephony credential (token expires in ~1h)
  const res = await fetch('https://api.telnyx.com/v2/telephony_credentials', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ connection_id: connectionId }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: 'Failed to get Telnyx token', detail: err }, { status: 500 })
  }

  const data = await res.json()
  const token = data.data?.token ?? null

  return NextResponse.json({ token })
}

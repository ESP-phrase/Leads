import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

// Generates a short-lived Telnyx WebRTC JWT for the browser dialer.
// Step 1: POST /telephony_credentials → get credential id
// Step 2: GET  /telephony_credentials/{id}/token → get JWT
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.TELNYX_API_KEY
  const connectionId = process.env.TELNYX_SIP_CONNECTION_ID

  if (!apiKey || !connectionId) {
    return NextResponse.json({ error: 'TELNYX_API_KEY or TELNYX_SIP_CONNECTION_ID not set' }, { status: 503 })
  }

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  // Step 1: create ephemeral credential
  const credRes = await fetch('https://api.telnyx.com/v2/telephony_credentials', {
    method: 'POST',
    headers,
    body: JSON.stringify({ connection_id: connectionId }),
  })

  if (!credRes.ok) {
    const err = await credRes.json().catch(() => ({}))
    return NextResponse.json({ error: 'Failed to create Telnyx credential', detail: err }, { status: 500 })
  }

  const credData = await credRes.json()
  const credId = credData.data?.id

  if (!credId) {
    return NextResponse.json({ error: 'No credential ID returned' }, { status: 500 })
  }

  // Step 2: exchange credential for a short-lived JWT
  const tokenRes = await fetch(`https://api.telnyx.com/v2/telephony_credentials/${credId}/token`, {
    method: 'POST',
    headers,
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.json().catch(() => ({}))
    return NextResponse.json({ error: 'Failed to get Telnyx JWT', detail: err }, { status: 500 })
  }

  // Telnyx returns the raw JWT as plain text
  const token = await tokenRes.text()

  return NextResponse.json({ token: token.replace(/"/g, '') })
}

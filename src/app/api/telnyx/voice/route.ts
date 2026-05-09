import { NextResponse } from 'next/server'

// Telnyx Call Control webhook — fires when operator answers.
// Reads leadPhone from client_state and bridges the call to the lead.
export async function POST(req: Request) {
  const body = await req.json()
  const { event_type, payload } = body

  if (event_type === 'call.answered') {
    const clientState = payload?.client_state
    let leadPhone = ''

    try {
      const decoded = Buffer.from(clientState, 'base64').toString('utf-8')
      leadPhone = JSON.parse(decoded).leadPhone
    } catch { /* ignore */ }

    if (!leadPhone) return NextResponse.json({ ok: true })

    // Bridge to the lead
    await fetch(`https://api.telnyx.com/v2/calls/${payload.call_control_id}/actions/transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: leadPhone }),
    })
  }

  return NextResponse.json({ ok: true })
}

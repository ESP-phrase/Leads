import { NextResponse } from 'next/server'

// Telnyx Call Control webhook — fires when operator answers.
// Reads leadPhone from client_state and bridges the call to the lead.
export async function POST(req: Request) {
  const body = await req.json()
  const { event_type, payload } = body

  console.log('[voice webhook] event:', event_type, 'call_control_id:', payload?.call_control_id, 'state:', payload?.state)

  if (event_type === 'call.answered') {
    const clientState = payload?.client_state
    let leadPhone = ''

    try {
      const decoded = Buffer.from(clientState, 'base64').toString('utf-8')
      leadPhone = JSON.parse(decoded).leadPhone
      console.log('[voice webhook] bridging to:', leadPhone)
    } catch { console.log('[voice webhook] no client_state / not a bridged call') }

    if (!leadPhone) return NextResponse.json({ ok: true })

    const transferRes = await fetch(`https://api.telnyx.com/v2/calls/${payload.call_control_id}/actions/transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: leadPhone }),
    })
    const transferData = await transferRes.json().catch(() => ({}))
    console.log('[voice webhook] transfer result:', transferRes.status, JSON.stringify(transferData).slice(0, 120))
  }

  return NextResponse.json({ ok: true })
}

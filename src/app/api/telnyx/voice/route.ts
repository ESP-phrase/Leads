import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const TELNYX_API = 'https://api.telnyx.com/v2'

function telnyxHeaders() {
  return {
    'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

async function callAction(callControlId: string, action: string, body: Record<string, unknown>) {
  const res = await fetch(`${TELNYX_API}/calls/${callControlId}/actions/${action}`, {
    method: 'POST',
    headers: telnyxHeaders(),
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  console.log(`[voice] ${action} → ${res.status}`, JSON.stringify(data).slice(0, 120))
  return { status: res.status, data }
}

// Telnyx Call Control webhook — handles both inbound operator calls and answered events
export async function POST(req: Request) {
  const body = await req.json()
  const { event_type, payload } = body

  console.log('[voice webhook] event:', event_type,
    'call_control_id:', payload?.call_control_id?.slice(0, 30),
    'from:', payload?.from,
    'to:', payload?.to,
    'state:', payload?.state)

  const callControlId = payload?.call_control_id

  // ── Inbound call from operator ──────────────────────────────────────────
  if (event_type === 'call.initiated') {
    const operatorPhone = process.env.OPERATOR_PHONE_NUMBER ?? ''
    const fromNumber = payload?.from?.replace(/[^\d+]/g, '') ?? ''
    const normalizedOperator = operatorPhone.replace(/[^\d+]/g, '')

    // Only handle calls from the operator's phone
    if (!fromNumber.endsWith(normalizedOperator.replace('+1', '')) &&
        fromNumber !== normalizedOperator) {
      console.log('[voice] ignoring call from unknown number:', fromNumber)
      return NextResponse.json({ ok: true })
    }

    // Read pending lead
    const pending = await db.pendingCall.findFirst({ orderBy: { createdAt: 'desc' } })
    if (!pending) {
      console.log('[voice] no pending call — hanging up')
      await callAction(callControlId, 'reject', { cause: 'USER_BUSY' })
      return NextResponse.json({ ok: true })
    }

    console.log('[voice] operator calling in — will bridge to:', pending.leadPhone)

    // Answer the call, store leadPhone in client_state
    const clientState = Buffer.from(JSON.stringify({ leadPhone: pending.leadPhone })).toString('base64')
    await callAction(callControlId, 'answer', { client_state: clientState })

    // Clear the pending call
    await db.pendingCall.deleteMany({})

    return NextResponse.json({ ok: true })
  }

  // ── Operator answered → bridge to lead ──────────────────────────────────
  if (event_type === 'call.answered') {
    const clientState = payload?.client_state
    if (!clientState) {
      console.log('[voice] call.answered with no client_state — nothing to bridge')
      return NextResponse.json({ ok: true })
    }

    let leadPhone = ''
    try {
      const decoded = Buffer.from(clientState, 'base64').toString('utf-8')
      leadPhone = JSON.parse(decoded).leadPhone
      console.log('[voice] bridging answered call to:', leadPhone)
    } catch {
      console.log('[voice] could not decode client_state')
      return NextResponse.json({ ok: true })
    }

    if (!leadPhone) return NextResponse.json({ ok: true })

    await callAction(callControlId, 'transfer', { to: leadPhone })
    return NextResponse.json({ ok: true })
  }

  // ── Hangup / destroyed ───────────────────────────────────────────────────
  if (event_type === 'call.hangup' || event_type === 'call.destroyed') {
    console.log('[voice] call ended:', event_type)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: true })
}

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Telnyx inbound SMS webhook.
// When a lead replies, auto-stop their drip sequence.
// Set this URL in your Telnyx Messaging Profile as the "Webhook URL".
export async function POST(req: Request) {
  const body = await req.json()

  const eventType = body?.data?.event_type ?? body?.event_type
  const payload = body?.data?.payload ?? body?.payload

  if (eventType !== 'message.received') {
    return NextResponse.json({ ok: true })
  }

  const fromNumber: string = payload?.from?.phone_number ?? ''
  if (!fromNumber) return NextResponse.json({ ok: true })

  // Find lead by phone and stop their sequence
  const lead = await db.lead.findFirst({
    where: { phone: fromNumber },
    include: { sequence: true },
  })

  if (lead?.sequence?.status === 'active') {
    await db.smsSequence.update({
      where: { id: lead.sequence.id },
      data: { status: 'stopped', stoppedAt: new Date() },
    })
    console.log(`Sequence stopped for ${lead.name} — they replied`)
  }

  // Log the inbound message
  if (lead) {
    await db.smsLog.create({
      data: {
        leadId: lead.id,
        message: `[INBOUND] ${payload?.text ?? ''}`,
        status: 'received',
        messageSid: payload?.id ?? null,
      },
    })

    // If they replied, mark as INTERESTED (unless already further along)
    if (['FOUND', 'CALLED', 'TEXTED'].includes(lead.status)) {
      await db.lead.update({ where: { id: lead.id }, data: { status: 'INTERESTED' } })
    }
  }

  return NextResponse.json({ ok: true })
}

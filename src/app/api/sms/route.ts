import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendSms, buildPreviewMessage } from '@/lib/sms'

export async function POST(req: Request) {
  const body = await req.json()
  const { leadId, message } = body

  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

  const lead = await db.lead.findUnique({ where: { id: leadId } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  if (!lead.phone) return NextResponse.json({ error: 'Lead has no phone' }, { status: 400 })

  const previewUrl = lead.previewUrl ?? `${process.env.PREVIEW_BASE_URL}/preview/${lead.slug}`
  const text = message ?? buildPreviewMessage(lead.name, previewUrl)

  let twilioSid: string | null = null
  let status = 'sent'

  try {
    const result = await sendSms(lead.phone, text)
    twilioSid = result.sid
    status = result.status
  } catch (err) {
    console.error('SMS error:', err)
    status = 'failed'
  }

  const log = await db.smsLog.create({
    data: { leadId, message: text, status, twilioSid },
  })

  await db.lead.update({ where: { id: leadId }, data: { status: 'TEXTED' } })

  return NextResponse.json({ log, previewUrl })
}

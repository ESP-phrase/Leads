import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendSms, buildPreviewMessage, isA2pEnabled } from '@/lib/sms'
import { SMS_TEMPLATES, renderTemplate } from '@/lib/sms-templates'
import { pickTierForLead } from '@/lib/pricing'

// Sequence steps: [templateId, hoursUntilNextStep]
// Step 0 fires immediately, then we schedule step 1 for +24h, etc.
// IDs MUST match entries in src/lib/sms-templates.ts
const STEPS = [
  { templateId: 'preview-soft',    nextHours: 24  },  // Day 0 → first touch with preview link
  { templateId: 'follow-up-24h',   nextHours: 72  },  // Day 1 → light nudge
  { templateId: 'follow-up-week',  nextHours: 96  },  // Day 4 → check-in
  { templateId: 'follow-up-final', nextHours: null }, // Day 7 → last chance
]

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isA2pEnabled()) {
    return NextResponse.json({
      error: 'Telnyx SMS is paused while 10DLC is in carrier review. Drip sequences will resume after approval.',
      code: 'a2p-disabled',
    }, { status: 503 })
  }
  const { id } = await params

  const lead = await db.lead.findUnique({ where: { id }, include: { site: true, sequence: true } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  if (!lead.phone) return NextResponse.json({ error: 'Lead has no phone' }, { status: 400 })

  // Stop existing sequence if any
  if (lead.sequence) {
    await db.smsSequence.delete({ where: { leadId: id } })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org'
  const previewUrl = lead.slug ? `${baseUrl}/s/${lead.slug}` : (lead.site?.vercelUrl ?? `${baseUrl}/preview/${lead.id}`)

  const step = STEPS[0]
  const tmpl = SMS_TEMPLATES.find(t => t.id === step.templateId)
  const text = tmpl
    ? renderTemplate(tmpl.body, { name: lead.name?.split(' ')[0] ?? null, business: lead.name, link: previewUrl, city: lead.city, category: lead.category, price: pickTierForLead(lead).priceDisplay })
    : buildPreviewMessage(lead.name, previewUrl)

  // Send step 0 immediately
  let messageSid: string | null = null
  let status = 'sent'
  try {
    const result = await sendSms(lead.phone, text)
    messageSid = result.sid
    status = result.status
  } catch (err) {
    console.error('Sequence step 0 failed:', err)
    status = 'failed'
  }

  await db.smsLog.create({ data: { leadId: id, message: text, status, messageSid } })

  // Schedule next step
  const nextSendAt = new Date(Date.now() + (step.nextHours ?? 0) * 60 * 60 * 1000)

  const sequence = await db.smsSequence.create({
    data: {
      leadId: id,
      status: 'active',
      currentStep: 0,
      nextSendAt,
    },
  })

  if (['FOUND', 'CALLED'].includes(lead.status)) {
    await db.lead.update({ where: { id }, data: { status: 'TEXTED' } })
  }

  return NextResponse.json({ ok: true, sequence, sentText: text })
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.smsSequence.updateMany({
    where: { leadId: id, status: 'active' },
    data: { status: 'stopped', stoppedAt: new Date() },
  })
  return NextResponse.json({ ok: true })
}

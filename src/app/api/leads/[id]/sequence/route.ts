import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendSms, buildPreviewMessage } from '@/lib/sms'
import { SMS_TEMPLATES, renderTemplate } from '@/lib/sms-templates'

// Sequence steps: [templateId, hoursUntilNextStep]
// Step 0 fires immediately, then we schedule step 1 for +24h, etc.
const STEPS = [
  { templateId: 'first-touch-preview', nextHours: 24  },  // Day 0 → next at Day 1
  { templateId: 'follow-up-24h',       nextHours: 48  },  // Day 1 → next at Day 3
  { templateId: 'follow-up-value',     nextHours: 96  },  // Day 3 → next at Day 7
  { templateId: 'closing-last-chance', nextHours: null },  // Day 7 → done
]

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const lead = await db.lead.findUnique({ where: { id }, include: { site: true, sequence: true } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  if (!lead.phone) return NextResponse.json({ error: 'Lead has no phone' }, { status: 400 })

  // Stop existing sequence if any
  if (lead.sequence) {
    await db.smsSequence.delete({ where: { leadId: id } })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://siteforge.app'
  const previewUrl = lead.slug ? `${baseUrl}/s/${lead.slug}` : (lead.site?.vercelUrl ?? `${baseUrl}/preview/${lead.id}`)

  const step = STEPS[0]
  const tmpl = SMS_TEMPLATES.find(t => t.id === step.templateId)
  const text = tmpl
    ? renderTemplate(tmpl.body, { name: lead.name?.split(' ')[0] ?? null, business: lead.name, link: previewUrl, city: lead.city, category: lead.category })
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

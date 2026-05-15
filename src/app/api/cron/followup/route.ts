import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendSms, isA2pEnabled } from '@/lib/sms'
import { renderTemplate, SMS_TEMPLATES } from '@/lib/sms-templates'

// Sequence step definitions — must match /api/leads/[id]/sequence/route.ts
const STEPS = [
  { templateId: 'first-touch-preview', nextHours: 24  },
  { templateId: 'follow-up-24h',       nextHours: 48  },
  { templateId: 'follow-up-value',     nextHours: 96  },
  { templateId: 'closing-last-chance', nextHours: null },
]

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pause sends while 10DLC is in carrier review.
  // We do NOT advance sequences while paused — when A2P is re-enabled, drips pick up where they left off.
  if (!isA2pEnabled()) {
    return NextResponse.json({
      skipped: true,
      reason: 'A2P SMS disabled (10DLC pending). Drip sends paused.',
    })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org'
  const now = new Date()
  const sent: { leadId: string; step: number; status: string }[] = []
  const failed: { leadId: string; error: string }[] = []

  // ── 1. Advance active drip sequences ──────────────────────────────
  const dueSequences = await db.smsSequence.findMany({
    where: { status: 'active', nextSendAt: { lte: now } },
    include: { lead: { include: { site: true } } },
    take: 50,
  })

  for (const seq of dueSequences) {
    const lead = seq.lead
    if (!lead.phone) continue

    const nextStep = seq.currentStep + 1
    if (nextStep >= STEPS.length) {
      // Sequence complete
      await db.smsSequence.update({ where: { id: seq.id }, data: { status: 'completed' } })
      continue
    }

    const step = STEPS[nextStep]
    const tmpl = SMS_TEMPLATES.find(t => t.id === step.templateId)
    if (!tmpl) continue

    const previewUrl = lead.slug
      ? `${baseUrl}/s/${lead.slug}`
      : (lead.site?.vercelUrl ?? `${baseUrl}/preview/${lead.id}`)

    const text = renderTemplate(tmpl.body, {
      name: lead.name?.split(' ')[0] ?? null,
      business: lead.name,
      link: previewUrl,
      city: lead.city,
      category: lead.category,
    })

    try {
      const result = await sendSms(lead.phone, text)
      await db.smsLog.create({
        data: { leadId: lead.id, message: text, status: result.status, messageSid: result.sid },
      })

      const nextSendAt = step.nextHours
        ? new Date(Date.now() + step.nextHours * 60 * 60 * 1000)
        : now

      await db.smsSequence.update({
        where: { id: seq.id },
        data: {
          currentStep: nextStep,
          status: nextStep === STEPS.length - 1 ? 'completed' : 'active',
          nextSendAt,
        },
      })

      sent.push({ leadId: lead.id, step: nextStep, status: result.status })
    } catch (err) {
      failed.push({ leadId: lead.id, error: String(err) })
    }
  }

  // ── 2. Legacy: one-off follow-up for TEXTED leads with no sequence ─
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const legacyLeads = await db.lead.findMany({
    where: {
      status: 'TEXTED',
      phone: { not: null },
      sequence: null,   // skip leads already in a sequence
      smsLogs: {
        some: { sentAt: { lt: cutoff } },
        none: { sentAt: { gt: cutoff } },
      },
    },
    include: { site: true, smsLogs: { orderBy: { sentAt: 'desc' }, take: 1 } },
    take: 50,
  })

  const followUpTmpl = SMS_TEMPLATES.find(t => t.id === 'follow-up-24h')!
  for (const lead of legacyLeads) {
    const previewUrl = lead.slug
      ? `${baseUrl}/s/${lead.slug}`
      : (lead.site?.vercelUrl ?? lead.previewUrl ?? `${baseUrl}/preview/${lead.id}`)

    const text = renderTemplate(followUpTmpl.body, {
      name: lead.name?.split(' ')[0] ?? null,
      business: lead.name,
      link: previewUrl,
      city: lead.city,
      category: lead.category,
    })

    try {
      const result = await sendSms(lead.phone!, text)
      await db.smsLog.create({
        data: { leadId: lead.id, message: text, status: result.status, messageSid: result.sid },
      })
      sent.push({ leadId: lead.id, step: -1, status: result.status })
    } catch (err) {
      failed.push({ leadId: lead.id, error: String(err) })
    }
  }

  return NextResponse.json({
    sequences: dueSequences.length,
    legacy: legacyLeads.length,
    sent: sent.length,
    failed: failed.length,
    details: { sent, failed },
  })
}

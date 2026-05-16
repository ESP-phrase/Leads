import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendSms, isA2pEnabled } from '@/lib/sms'
import { SMS_TEMPLATES, renderTemplate } from '@/lib/sms-templates'

export const maxDuration = 60

export async function POST(req: Request) {
  if (!isA2pEnabled()) {
    return NextResponse.json({
      error: 'Telnyx SMS is paused while 10DLC is in carrier review. Use the per-row "Text" button to send P2P from your phone.',
      code: 'a2p-disabled',
    }, { status: 503 })
  }
  const { leadIds, templateId, customMessage } = await req.json()
  if (!Array.isArray(leadIds) || leadIds.length === 0) {
    return NextResponse.json({ error: 'leadIds required' }, { status: 400 })
  }
  if (!templateId && !customMessage) {
    return NextResponse.json({ error: 'templateId or customMessage required' }, { status: 400 })
  }

  const tmpl = templateId ? SMS_TEMPLATES.find(t => t.id === templateId) : null
  if (templateId && !tmpl) return NextResponse.json({ error: 'Unknown template' }, { status: 400 })

  const leads = await db.lead.findMany({
    where: { id: { in: leadIds } },
    include: { site: true },
  })

  const results: { leadId: string; name: string; ok: boolean; error?: string }[] = []

  for (const lead of leads) {
    if (!lead.phone) {
      results.push({ leadId: lead.id, name: lead.name, ok: false, error: 'No phone' })
      continue
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.PREVIEW_BASE_URL ?? 'https://www.webhustle.org'
    const previewUrl = lead.slug
      ? `${baseUrl}/s/${lead.slug}`
      : (lead.site?.vercelUrl ?? lead.previewUrl ?? `${baseUrl}/preview/${lead.slug}`)
    const link = templateId === 'closing-payment' && lead.invoiceUrl ? lead.invoiceUrl : previewUrl

    const body = tmpl ? tmpl.body : customMessage
    const text = renderTemplate(body, {
      name: lead.name?.split(' ')[0] ?? null,
      business: lead.name,
      link,
      city: lead.city,
      category: lead.category,
    })

    try {
      const result = await sendSms(lead.phone, text)
      await db.smsLog.create({
        data: { leadId: lead.id, message: text, status: result.status, messageSid: result.sid },
      })
      if (['FOUND', 'CALLED'].includes(lead.status)) {
        await db.lead.update({ where: { id: lead.id }, data: { status: 'TEXTED' } })
      }
      results.push({ leadId: lead.id, name: lead.name, ok: true })
    } catch (err) {
      results.push({ leadId: lead.id, name: lead.name, ok: false, error: String(err) })
    }
  }

  return NextResponse.json({
    total: results.length,
    sent: results.filter(r => r.ok).length,
    failed: results.filter(r => !r.ok).length,
    results,
  })
}

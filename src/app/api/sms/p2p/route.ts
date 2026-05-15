// P2P "Send from your phone" SMS preparation.
// Returns the recipient + pre-formatted body so the client can open the agent's
// native Messages app via an `sms:` URL. The agent then taps Send on their own
// phone — this is person-to-person (P2P) messaging, exempt from 10DLC A2P rules.
//
// We still log the message to SmsLog (status='p2p-pending') so the lead's
// SMS history reflects the outreach, and we update lead status to TEXTED.

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SMS_TEMPLATES, renderTemplate } from '@/lib/sms-templates'

export async function POST(req: Request) {
  const { leadId, templateId, message } = await req.json()
  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

  const lead = await db.lead.findUnique({ where: { id: leadId }, include: { site: true } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  if (!lead.phone) return NextResponse.json({ error: 'Lead has no phone' }, { status: 400 })

  // Build branded preview link (hides vercel domain)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org'
  const previewUrl = lead.slug
    ? `${baseUrl}/s/${lead.slug}`
    : (lead.site?.vercelUrl ?? lead.previewUrl ?? `${baseUrl}/preview/${lead.slug ?? ''}`)
  const paymentLink = lead.invoiceUrl
  const link = templateId?.startsWith('closing-payment') && paymentLink ? paymentLink : previewUrl

  // Compose body
  let text: string
  if (templateId) {
    const tmpl = SMS_TEMPLATES.find(t => t.id === templateId)
    if (!tmpl) return NextResponse.json({ error: 'Template not found' }, { status: 400 })
    text = renderTemplate(tmpl.body, {
      name: lead.name?.split(' ')[0] ?? null,
      business: lead.name,
      link,
      city: lead.city,
      category: lead.category,
    })
  } else if (message) {
    text = renderTemplate(message, {
      name: lead.name?.split(' ')[0] ?? null,
      business: lead.name,
      link,
      city: lead.city,
      category: lead.category,
    })
    if (!text.includes(link) && !text.includes('http')) text += `\n\n${link}`
  } else {
    text = `Hey ${lead.name?.split(' ')[0] ?? 'there'} — I built a free website preview for ${lead.name}. Take a look: ${link}`
  }

  // Log the outreach attempt (status reflects this is P2P, not Telnyx-sent)
  const log = await db.smsLog.create({
    data: { leadId, message: text, status: 'p2p-pending', messageSid: null },
  })

  // Update lead status to TEXTED (only if not in a more advanced state)
  if (['FOUND', 'CALLED'].includes(lead.status)) {
    await db.lead.update({ where: { id: leadId }, data: { status: 'TEXTED' } })
  }

  return NextResponse.json({
    log,
    phone: lead.phone,
    text,
    smsUrl: `sms:${lead.phone}?&body=${encodeURIComponent(text)}`,   // iOS + Android compatible
    previewUrl,
  })
}

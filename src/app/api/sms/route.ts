import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendSms, buildPreviewMessage } from '@/lib/sms'
import { SMS_TEMPLATES, renderTemplate } from '@/lib/sms-templates'

export async function POST(req: Request) {
  const body = await req.json()
  const { leadId, message, templateId, isFollowUp } = body

  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

  const lead = await db.lead.findUnique({ where: { id: leadId }, include: { site: true } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  if (!lead.phone) return NextResponse.json({ error: 'Lead has no phone' }, { status: 400 })

  // Use a branded /s/{slug} link that redirects to the underlying Vercel URL.
  // This hides the *.vercel.app domain so recipients see a SiteForge URL.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.PREVIEW_BASE_URL ?? 'https://siteforge.app'
  const previewUrl = lead.slug
    ? `${baseUrl}/s/${lead.slug}`
    : (lead.site?.vercelUrl ?? lead.previewUrl ?? `${baseUrl}/preview/${lead.slug}`)
  const paymentLink = lead.invoiceUrl
  const link = templateId?.startsWith('closing-payment') && paymentLink ? paymentLink : previewUrl

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
    // Render any user-typed message that uses placeholders
    text = renderTemplate(message, {
      name: lead.name?.split(' ')[0] ?? null,
      business: lead.name,
      link,
      city: lead.city,
      category: lead.category,
    })
    // If the message doesn't already have the link, append it
    if (!text.includes(link) && !text.includes('http')) {
      text += `\n\n${link}`
    }
  } else {
    text = buildPreviewMessage(lead.name, previewUrl)
  }

  let messageSid: string | null = null
  let status = 'sent'

  try {
    const result = await sendSms(lead.phone, text)
    messageSid = result.sid
    status = result.status
  } catch (err) {
    console.error('SMS error:', err)
    status = 'failed'
  }

  const log = await db.smsLog.create({
    data: { leadId, message: text, status, messageSid },
  })

  // Don't downgrade status — only set TEXTED if not already in a more advanced stage
  if (!isFollowUp && ['FOUND', 'CALLED'].includes(lead.status)) {
    await db.lead.update({ where: { id: leadId }, data: { status: 'TEXTED' } })
  }

  return NextResponse.json({ log, previewUrl, sentText: text })
}

// GET → return all available templates for the UI
export async function GET() {
  return NextResponse.json({ templates: SMS_TEMPLATES })
}

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendSms } from '@/lib/sms'
import { renderTemplate, SMS_TEMPLATES } from '@/lib/sms-templates'

// This route is hit by Vercel Cron once an hour
// It finds TEXTED leads that haven't received a follow-up in 24h+
// and sends them the 24-hour follow-up template automatically

export async function GET(req: Request) {
  // Optional auth: require CRON_SECRET so only Vercel/you can trigger it
  const auth = req.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24h ago

  // Find leads that were texted 24h+ ago and haven't been followed up since
  const leads = await db.lead.findMany({
    where: {
      status: 'TEXTED',
      phone: { not: null },
      smsLogs: {
        some: { sentAt: { lt: cutoff } },
        none: { sentAt: { gt: cutoff } }, // no SMS in last 24h
      },
    },
    include: { site: true, smsLogs: { orderBy: { sentAt: 'desc' }, take: 1 } },
    take: 50, // safety cap
  })

  const followUpTmpl = SMS_TEMPLATES.find(t => t.id === 'follow-up-24h')!
  const sent: { leadId: string; status: string }[] = []
  const failed: { leadId: string; error: string }[] = []

  for (const lead of leads) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.PREVIEW_BASE_URL ?? 'https://siteforge.app'
    const previewUrl = lead.slug
      ? `${baseUrl}/s/${lead.slug}`
      : (lead.site?.vercelUrl ?? lead.previewUrl ?? `${baseUrl}/preview/${lead.slug}`)
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
        data: { leadId: lead.id, message: text, status: result.status, twilioSid: result.sid },
      })
      sent.push({ leadId: lead.id, status: result.status })
    } catch (err) {
      failed.push({ leadId: lead.id, error: String(err) })
    }
  }

  return NextResponse.json({
    checked: leads.length,
    sent: sent.length,
    failed: failed.length,
    details: { sent, failed },
  })
}

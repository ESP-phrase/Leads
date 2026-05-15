import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { trackRedditConversion } from '@/lib/reddit-pixel'

// Inbound lead from the B2B homepage form.
// Saves to DB and optionally emails the operator via Resend (if RESEND_API_KEY set).

const SPAM_HONEYPOT = '__hp__'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'aubreynicholsacc@gmail.com'

async function sendNotification(payload: {
  id: string; businessName: string; ownerName: string | null; email: string | null;
  phone: string | null; city: string | null; category: string | null; notes: string | null
}) {
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: 'no RESEND_API_KEY' }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? 'WebHustle <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `🚀 New preview request — ${payload.businessName}`,
        html: `<h2>New preview request</h2>
<p><strong>Business:</strong> ${payload.businessName}</p>
<p><strong>Owner:</strong> ${payload.ownerName ?? '—'}</p>
<p><strong>Email:</strong> ${payload.email ?? '—'}</p>
<p><strong>Phone:</strong> ${payload.phone ?? '—'}</p>
<p><strong>City:</strong> ${payload.city ?? '—'}</p>
<p><strong>Category:</strong> ${payload.category ?? '—'}</p>
<p><strong>Notes:</strong> ${payload.notes ?? '—'}</p>
<p><a href="https://www.webhustle.org/dashboard">Open dashboard</a></p>`,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { sent: false, reason: `Resend error: ${JSON.stringify(err).slice(0, 200)}` }
    }
    return { sent: true }
  } catch (e) {
    return { sent: false, reason: String(e).slice(0, 200) }
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>))

  // Honeypot
  if (body[SPAM_HONEYPOT]) {
    return NextResponse.json({ ok: true })   // pretend success to spam bots
  }

  // Validate required
  const businessName = String(body.businessName ?? '').trim()
  if (!businessName) {
    return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
  }
  const email = String(body.email ?? '').trim() || null
  const phone = String(body.phone ?? '').trim() || null
  if (!email && !phone) {
    return NextResponse.json({ error: 'Email or phone is required so we can send your preview' }, { status: 400 })
  }

  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ?? null
  const userAgent = req.headers.get('user-agent') ?? null

  const created = await db.previewRequest.create({
    data: {
      businessName,
      ownerName:   (body.ownerName as string | undefined)?.trim() || null,
      email,
      phone,
      city:        (body.city as string | undefined)?.trim() || null,
      category:    (body.category as string | undefined)?.trim() || null,
      websiteUrl:  (body.websiteUrl as string | undefined)?.trim() || null,
      notes:       (body.notes as string | undefined)?.trim() || null,
      smsOptIn:    Boolean(body.smsOptIn),
      source:      (body.source as string | undefined) ?? 'organic',
      utmCampaign: (body.utmCampaign as string | undefined) ?? null,
      utmSource:   (body.utmSource as string | undefined) ?? null,
      utmMedium:   (body.utmMedium as string | undefined) ?? null,
      ipAddress,
      userAgent,
    },
  })

  // Fire-and-forget email notification
  sendNotification({
    id: created.id,
    businessName: created.businessName,
    ownerName: created.ownerName,
    email: created.email,
    phone: created.phone,
    city: created.city,
    category: created.category,
    notes: created.notes,
  }).catch(() => {})

  // Fire-and-forget Reddit CAPI Lead event (server-side conversion tracking)
  trackRedditConversion({
    type: 'Lead',
    conversionId: created.id,
    email: created.email,
    phone: created.phone,
    ipAddress,
    userAgent,
    clickId: (body.rdt_cid as string | undefined) ?? null,
    externalId: created.id,
    screenWidth:  typeof body.screenWidth  === 'number' ? body.screenWidth  : null,
    screenHeight: typeof body.screenHeight === 'number' ? body.screenHeight : null,
    actionSource: 'website',
  }).catch(() => {})

  return NextResponse.json({ ok: true, id: created.id })
}

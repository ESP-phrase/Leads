import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getStripe } from '@/lib/stripe'
import { sendSms } from '@/lib/sms'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { action, notes } = body

  const application = await db.application.findUnique({ where: { id } })
  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // ── REJECT: refund the $5 deposit (if paid) + send SMS ──
  if (action === 'reject') {
    let refundedSid: string | null = null

    if (application.stripePaymentIntent && process.env.STRIPE_SECRET_KEY) {
      try {
        const refund = await getStripe().refunds.create({
          payment_intent: application.stripePaymentIntent,
        })
        refundedSid = refund.id
      } catch (err) {
        console.error('Refund failed:', err)
      }
    }

    await db.application.update({
      where: { id },
      data: {
        status: refundedSid ? 'rejected_refunded' : 'rejected',
        reviewNotes: notes ?? null,
        reviewedAt: new Date(),
      },
    })

    try {
      await sendSms(application.phone,
        `Hi ${application.name.split(' ')[0]} — thanks for applying to SiteForge. We can't move forward this time. Your $5 deposit has been refunded automatically (5–10 business days). Best of luck!`)
    } catch { /* ignore */ }

    return NextResponse.json({ ok: true, status: 'rejected', refunded: !!refundedSid })
  }

  // ── APPROVE: create Worker + activate, send welcome SMS ──
  if (action === 'approve') {
    // If Stripe is configured, require they paid the deposit first.
    // If Stripe isn't configured, allow approval directly so the flow still works in dev.
    if (application.status === 'pending' && process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Application has not paid the deposit yet' }, { status: 400 })
    }

    let workerId = application.workerId
    if (!workerId) {
      const worker = await db.worker.create({
        data: {
          name: application.name,
          phone: application.phone,
          email: application.email,
          role: 'Agent',
          active: true,
          paidAt: application.paidAt ?? new Date(),
          stripeSessionId: application.stripeSessionId,
        },
      })
      workerId = worker.id
    }

    await db.application.update({
      where: { id },
      data: {
        status: 'approved',
        reviewNotes: notes ?? null,
        reviewedAt: new Date(),
        workerId,
      },
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://siteforge.app'
    try {
      await sendSms(application.phone,
        `🎉 ${application.name.split(' ')[0]}, you've been approved for SiteForge! Sign in here: ${baseUrl}/login\n\nUse the phone number you applied with. Your first leads are waiting. Every closed sale = $119. Welcome to the team!`)
    } catch { /* ignore */ }

    return NextResponse.json({ ok: true, status: 'approved', workerId })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.application.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

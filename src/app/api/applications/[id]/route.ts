import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getStripe, WORKER_FEE } from '@/lib/stripe'
import { sendSms } from '@/lib/sms'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { action, notes } = body

  const application = await db.application.findUnique({ where: { id } })
  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (action === 'reject') {
    await db.application.update({
      where: { id },
      data: { status: 'rejected', reviewNotes: notes ?? null, reviewedAt: new Date() },
    })

    // Send polite rejection SMS
    try {
      await sendSms(application.phone,
        `Hi ${application.name.split(' ')[0]}, thanks for applying to Website Hustle. Unfortunately we can't move forward with your application at this time. Best of luck!`)
    } catch { /* ignore */ }

    return NextResponse.json({ ok: true, status: 'rejected' })
  }

  if (action === 'approve') {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.PREVIEW_BASE_URL ?? 'http://localhost:3002'

    let paymentLink = application.paymentLink

    // Create a Stripe checkout session keyed to this application
    if (!paymentLink) {
      try {
        const session = await getStripe().checkout.sessions.create({
          mode: 'payment',
          line_items: [{
            price_data: {
              currency: 'usd',
              unit_amount: WORKER_FEE,
              product_data: {
                name: 'Website Hustle — Worker Activation',
                description: `Welcome ${application.name}! This $5 activation locks in your account and gets you access to leads.`,
              },
            },
            quantity: 1,
          }],
          metadata: {
            applicationId: id,
            name: application.name,
            phone: application.phone,
            email: application.email ?? '',
          },
          success_url: `${baseUrl}/join/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/join`,
        })
        paymentLink = session.url
      } catch (err) {
        return NextResponse.json({ error: `Stripe error: ${err}` }, { status: 500 })
      }
    }

    await db.application.update({
      where: { id },
      data: {
        status: 'approved',
        reviewNotes: notes ?? null,
        reviewedAt: new Date(),
        paymentLink,
      },
    })

    // Text the candidate the activation link
    try {
      await sendSms(application.phone,
        `🎉 ${application.name.split(' ')[0]}, you've been approved for Website Hustle! Activate your account ($5) here: ${paymentLink}\n\nEvery sale you close = $119. Welcome to the team!`)
    } catch { /* ignore */ }

    return NextResponse.json({ ok: true, status: 'approved', paymentLink })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.application.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

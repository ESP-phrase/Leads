import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    event = webhookSecret
      ? getStripe().webhooks.constructEvent(body, sig, webhookSecret)
      : JSON.parse(body)
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const md = session.metadata ?? {}

    // Worker activation flow (after approval)
    if (md.applicationId) {
      const application = await db.application.findUnique({ where: { id: md.applicationId } })
      if (application && application.status !== 'paid') {
        const worker = await db.worker.create({
          data: {
            name: application.name,
            phone: application.phone,
            email: application.email,
            role: 'Agent',
            active: true,
            stripeSessionId: session.id,
            paidAt: new Date(),
          },
        })
        await db.application.update({
          where: { id: application.id },
          data: { status: 'paid', paidAt: new Date(), workerId: worker.id },
        })
      }
    } else if (md.name) {
      // Legacy direct-signup flow (no application)
      await db.worker.create({
        data: {
          name: md.name,
          phone: md.phone || null,
          email: md.email || null,
          role: 'Agent',
          active: true,
          stripeSessionId: session.id,
          paidAt: new Date(),
        },
      })
    }

    // Invoice payment for a lead
    if (md.leadId && session.payment_status === 'paid') {
      await db.lead.update({
        where: { id: md.leadId },
        data: { invoicePaid: true, status: 'CLOSED' },
      })
    }
  }

  return NextResponse.json({ received: true })
}

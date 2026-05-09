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

    // Application deposit paid → mark as paid_pending review
    // Worker is NOT created until admin approves
    if (md.applicationId) {
      const application = await db.application.findUnique({ where: { id: md.applicationId } })
      if (application && application.status === 'pending') {
        await db.application.update({
          where: { id: application.id },
          data: {
            status: 'paid_pending',
            paidAt: new Date(),
            stripeSessionId: session.id,
            stripePaymentIntent: typeof session.payment_intent === 'string' ? session.payment_intent : null,
          },
        })
      }
    }

    // Lead invoice paid → mark closed
    if (md.leadId && session.payment_status === 'paid') {
      await db.lead.update({
        where: { id: md.leadId },
        data: { invoicePaid: true, status: 'CLOSED' },
      })
    }
  }

  return NextResponse.json({ received: true })
}

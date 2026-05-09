import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    event = webhookSecret
      ? stripe.webhooks.constructEvent(body, sig, webhookSecret)
      : JSON.parse(body)
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { name, phone, email } = session.metadata ?? {}

    if (name) {
      await db.worker.create({
        data: {
          name,
          phone: phone || null,
          email: email || null,
          role: 'Agent',
          active: true,
          stripeSessionId: session.id,
          paidAt: new Date(),
        },
      })
    }
  }

  if (event.type === 'payment_link.payment_link' || event.type === 'checkout.session.completed') {
    // Also handle invoice payments for leads
    const session = event.data.object
    if (session.metadata?.leadId && session.payment_status === 'paid') {
      await db.lead.update({
        where: { id: session.metadata.leadId },
        data: { invoicePaid: true },
      })
    }
  }

  return NextResponse.json({ received: true })
}

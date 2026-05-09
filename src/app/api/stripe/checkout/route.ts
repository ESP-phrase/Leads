import { NextResponse } from 'next/server'
import { stripe, WORKER_FEE } from '@/lib/stripe'

// Creates a $5 Stripe checkout session for worker signup
export async function POST(req: Request) {
  const { name, phone, email } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.PREVIEW_BASE_URL ?? 'http://localhost:3002'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        unit_amount: WORKER_FEE,
        product_data: {
          name: 'Canvass Worker Signup',
          description: 'One-time activation fee to join the Canvass team. You earn 40% on every site sold.',
        },
      },
      quantity: 1,
    }],
    metadata: { name: name.trim(), phone: phone?.trim() ?? '', email: email?.trim() ?? '' },
    success_url: `${baseUrl}/join/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/join`,
  })

  return NextResponse.json({ url: session.url })
}

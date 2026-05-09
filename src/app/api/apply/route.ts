import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getStripe, WORKER_FEE } from '@/lib/stripe'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, phone, email, state, hoursPerWeek, experience, whyJoin, referralSource } = body

  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
  }
  if (!whyJoin?.trim() || whyJoin.trim().length < 20) {
    return NextResponse.json({ error: 'Tell us a bit more about why you want to join' }, { status: 400 })
  }

  // Step 1: Create the application record
  const application = await db.application.create({
    data: {
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      state: state?.trim() || null,
      hoursPerWeek: hoursPerWeek ? parseInt(hoursPerWeek) : null,
      experience: experience || null,
      whyJoin: whyJoin.trim(),
      referralSource: referralSource || null,
      status: 'pending',
    },
  })

  // Step 2: Immediately create a Stripe checkout session for $5 (refunded if rejected)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.PREVIEW_BASE_URL ?? 'http://localhost:3002'

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: WORKER_FEE,
          product_data: {
            name: 'Website Hustle — Application Deposit',
            description: 'Refundable $5 deposit. We review your application within 24 hours. Approved → $5 covers your activation. Rejected → fully refunded automatically.',
          },
        },
        quantity: 1,
      }],
      metadata: { applicationId: application.id, name: application.name, phone: application.phone, email: application.email ?? '' },
      success_url: `${baseUrl}/join/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/join`,
    })

    await db.application.update({
      where: { id: application.id },
      data: { paymentLink: session.url },
    })

    return NextResponse.json({ ok: true, applicationId: application.id, url: session.url })
  } catch (err) {
    return NextResponse.json({ error: `Stripe error: ${err}` }, { status: 500 })
  }
}

export async function GET() {
  const applications = await db.application.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  return NextResponse.json(applications)
}

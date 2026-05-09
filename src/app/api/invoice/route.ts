import { NextResponse } from 'next/server'
import { stripe, SITE_PRICE } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const { leadId } = await req.json()
  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

  const lead = await db.lead.findUnique({ where: { id: leadId }, include: { site: true } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  if (!lead.site) return NextResponse.json({ error: 'No site built yet' }, { status: 400 })

  // Create a Stripe payment link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{
      price_data: {
        currency: 'usd',
        unit_amount: SITE_PRICE,
        product_data: {
          name: `Professional Website — ${lead.name}`,
          description: `Custom website for ${lead.name} in ${lead.city ?? 'your area'}. Includes hosting, mobile-optimized design, and SEO setup.`,
        },
      },
      quantity: 1,
    }],
    metadata: { leadId },
    after_completion: {
      type: 'redirect',
      redirect: { url: lead.site.vercelUrl ?? `https://canvass.app` },
    },
  })

  // Save invoice URL to lead
  await db.lead.update({
    where: { id: leadId },
    data: { invoiceUrl: paymentLink.url, invoicedAt: new Date() },
  })

  return NextResponse.json({ invoiceUrl: paymentLink.url })
}

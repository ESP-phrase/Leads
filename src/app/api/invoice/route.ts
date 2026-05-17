import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { pickTier, TIERS, type TierId } from '@/lib/pricing'

export async function POST(req: Request) {
  const body = await req.json() as { leadId?: string; tierOverride?: TierId }
  const { leadId, tierOverride } = body
  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

  const lead = await db.lead.findUnique({ where: { id: leadId }, include: { site: true } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  if (!lead.site) return NextResponse.json({ error: 'No site built yet' }, { status: 400 })

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({
      error: 'Stripe not configured yet. Add STRIPE_SECRET_KEY to env vars to send invoices.',
    }, { status: 503 })
  }

  // Wealth-based tier — agent can override via tierOverride for negotiation
  const tier = tierOverride && TIERS[tierOverride]
    ? TIERS[tierOverride]
    : pickTier({ wealthScore: lead.wealthScore, ownerIncomeRange: lead.ownerIncomeRange })

  const paymentLink = await getStripe().paymentLinks.create({
    line_items: [{
      price_data: {
        currency: 'usd',
        unit_amount: tier.priceCents,
        product_data: {
          name: `${tier.productName} — ${lead.name}`,
          description: `${tier.productDescription} Built for ${lead.name}${lead.city ? ` in ${lead.city}` : ''}.`,
        },
      },
      quantity: 1,
    }],
    metadata: { leadId, tier: tier.id, wealthScore: String(lead.wealthScore ?? '') },
    after_completion: {
      type: 'redirect',
      redirect: { url: lead.site.vercelUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org' },
    },
  })

  await db.lead.update({
    where: { id: leadId },
    data: { invoiceUrl: paymentLink.url, invoicedAt: new Date() },
  })

  return NextResponse.json({
    invoiceUrl: paymentLink.url,
    tier: tier.id,
    priceDisplay: tier.priceDisplay,
    workerShareCents: tier.workerShareCents,
  })
}

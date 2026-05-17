// Wealth-based dynamic pricing for the website sale.
// Drives invoice amount + product name + suggested SMS pitch price.
//
// Inputs: enrich.ts already writes Lead.wealthScore (0-100) and
// deep-enrich writes Lead.ownerIncomeRange ('<$50k' | '$50-100k' | ...).
// Output: a Tier with price (cents), worker share (cents), and product name.

export type TierId = 'starter' | 'standard' | 'pro' | 'premium'

export interface Tier {
  id: TierId
  label: string
  productName: string
  productDescription: string
  priceCents: number
  workerShareCents: number    // 40% rounded to nearest dollar
  ownerShareCents: number     // price - workerShare
  priceDisplay: string        // "$149" — for SMS and UI
}

export const TIERS: Record<TierId, Tier> = {
  starter: {
    id: 'starter',
    label: 'Starter',
    productName: 'Starter Website',
    productDescription: 'Mobile-optimized single-page website with hosting and a custom domain.',
    priceCents: 14900,
    workerShareCents: 6000,
    ownerShareCents: 8900,
    priceDisplay: '$149',
  },
  standard: {
    id: 'standard',
    label: 'Standard',
    productName: 'Professional Website',
    productDescription: 'Multi-section professional website with hosting, mobile design, and SEO setup.',
    priceCents: 29900,
    workerShareCents: 11900,
    ownerShareCents: 18000,
    priceDisplay: '$299',
  },
  pro: {
    id: 'pro',
    label: 'Pro',
    productName: 'Pro Business Website + Google Setup',
    productDescription: 'Professional website plus Google Business Profile setup and local-SEO optimization for better Maps ranking.',
    priceCents: 49900,
    workerShareCents: 19900,
    ownerShareCents: 30000,
    priceDisplay: '$499',
  },
  premium: {
    id: 'premium',
    label: 'Premium',
    productName: 'Premium Custom Website + 90-Day Support',
    productDescription: 'Custom-designed professional website, Google Business Profile setup, local-SEO optimization, and 90 days of priority edits and support.',
    priceCents: 79900,
    workerShareCents: 31900,
    ownerShareCents: 48000,
    priceDisplay: '$799',
  },
}

// Maps the deep-enrich income range string to a numeric tier boost.
// Higher income ranges can bump a borderline lead up one tier.
const INCOME_TIER_FLOOR: Record<string, TierId> = {
  '<$50k': 'starter',
  '$50-100k': 'standard',
  '$100-250k': 'pro',
  '$250-500k': 'premium',
  '$500k+': 'premium',
}

const TIER_ORDER: TierId[] = ['starter', 'standard', 'pro', 'premium']

/**
 * Pick a tier from the wealth score, optionally boosted by income range.
 * Both inputs are optional (lead may not be enriched yet) — defaults to standard.
 */
export function pickTier(input: {
  wealthScore?: number | null
  ownerIncomeRange?: string | null
}): Tier {
  const score = input.wealthScore ?? null
  const income = input.ownerIncomeRange ?? null

  // Base tier from wealth score
  let baseTier: TierId
  if (score == null) baseTier = 'standard'
  else if (score >= 81) baseTier = 'premium'
  else if (score >= 56) baseTier = 'pro'
  else if (score >= 26) baseTier = 'standard'
  else baseTier = 'starter'

  // Income floor — if deep-enrich gave us a higher income tier, lift to that
  let finalTier: TierId = baseTier
  if (income && INCOME_TIER_FLOOR[income]) {
    const incomeTier = INCOME_TIER_FLOOR[income]
    if (TIER_ORDER.indexOf(incomeTier) > TIER_ORDER.indexOf(baseTier)) {
      finalTier = incomeTier
    }
  }

  return TIERS[finalTier]
}

/** Cheap helper for UI components that have wealth fields directly on a lead. */
export function pickTierForLead(lead: {
  wealthScore?: number | null
  ownerIncomeRange?: string | null
}): Tier {
  return pickTier({ wealthScore: lead.wealthScore, ownerIncomeRange: lead.ownerIncomeRange })
}

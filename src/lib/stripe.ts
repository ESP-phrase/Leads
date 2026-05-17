import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY not set')
    _stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' })
  }
  return _stripe
}

export const WORKER_FEE = 500      // $5.00 in cents — worker activation deposit

// Website pricing is now wealth-tier-based — see src/lib/pricing.ts
// (Starter $149 / Standard $299 / Pro $499 / Premium $799). Worker share is 40%
// of whichever tier the lead lands in.

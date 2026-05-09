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

export const WORKER_FEE = 500      // $5.00 in cents
export const SITE_PRICE = 29900    // $299.00 in cents
export const WORKER_SHARE = 11900  // $119.00 — worker 40%
export const OWNER_SHARE = 17900   // $180.00 — you 60% (after rounding)

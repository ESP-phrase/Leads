import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export const WORKER_FEE = 500      // $5.00 in cents
export const SITE_PRICE = 29900    // $299.00 in cents
export const WORKER_SHARE = 11900  // $119.00 — worker 40%
export const OWNER_SHARE = 17900   // $180.00 — you 60% (after rounding)

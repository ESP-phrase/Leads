import { NextResponse } from 'next/server'

// Returns boolean configured-ness of each external integration.
// Never returns actual env values — admin-only by middleware.
export async function GET() {
  const telnyxNumberType = (() => {
    const n = (process.env.TELNYX_PHONE_NUMBER ?? '').replace(/\D/g, '')
    if (!n) return null
    if (n.length <= 6) return 'short-code'
    const npa = n.length === 11 && n.startsWith('1') ? n.slice(1, 4) : n.slice(0, 3)
    if (['800', '833', '844', '855', '866', '877', '888'].includes(npa)) return 'toll-free'
    return 'long-code'
  })()

  return NextResponse.json({
    telnyx: {
      apiKey:     Boolean(process.env.TELNYX_API_KEY),
      fromNumber: Boolean(process.env.TELNYX_PHONE_NUMBER),
      a2pEnabled: (process.env.TELNYX_A2P_ENABLED ?? '').toLowerCase() === 'true',
      numberType: telnyxNumberType,
      webhookBase: Boolean(process.env.TELNYX_WEBHOOK_BASE_URL),
    },
    resend: {
      apiKey:     Boolean(process.env.RESEND_API_KEY),
      from:       Boolean(process.env.RESEND_FROM),
      adminEmail: Boolean(process.env.ADMIN_EMAIL),
    },
    stripe: {
      secretKey:     Boolean(process.env.STRIPE_SECRET_KEY),
      webhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    },
    reddit: {
      pixelId:   Boolean(process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID),
      capiToken: Boolean(process.env.REDDIT_CAPI_TOKEN),
      testMode:  Boolean(process.env.REDDIT_CAPI_TEST_ID),
    },
    meta: {
      pixelId: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
    },
    google: {
      analytics:    Boolean(process.env.NEXT_PUBLIC_GA_ID),
      placesApiKey: Boolean(process.env.GOOGLE_PLACES_API_KEY),
    },
    clarity: {
      projectId: Boolean(process.env.NEXT_PUBLIC_CLARITY_ID),
    },
    tiktok: {
      pixelId: Boolean(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID),
    },
    openai: {
      apiKey: Boolean(process.env.OPENAI_API_KEY),
    },
    vercel: {
      token: Boolean(process.env.VERCEL_TOKEN),
    },
  })
}

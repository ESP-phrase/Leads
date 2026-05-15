import { NextResponse } from 'next/server'
import { trackRedditConversion } from '@/lib/reddit-pixel'

// One-shot Reddit CAPI test — fire a Lead event to verify the integration.
// Hit: GET https://www.webhustle.org/api/test/reddit-capi
// Requires REDDIT_CAPI_TOKEN and NEXT_PUBLIC_REDDIT_PIXEL_ID env vars.
// If REDDIT_CAPI_TEST_ID is set, the event shows in Reddit's test panel and won't persist.
export async function GET(req: Request) {
  const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip') ?? null
  const userAgent = req.headers.get('user-agent') ?? null

  const conversionId = `test-${Date.now()}`
  const result = await trackRedditConversion({
    type: 'Lead',
    conversionId,
    email: 'test@webhustle.org',
    phone: '+15551234567',
    ipAddress,
    userAgent,
    externalId: conversionId,
    screenWidth: 1920,
    screenHeight: 1080,
    actionSource: 'website',
  })

  return NextResponse.json({
    ...result,
    pixelId: process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID ?? 'NOT_SET',
    capiTokenConfigured: Boolean(process.env.REDDIT_CAPI_TOKEN),
    testMode: Boolean(process.env.REDDIT_CAPI_TEST_ID),
    testId: process.env.REDDIT_CAPI_TEST_ID ?? null,
    conversionId,
    hint: result.ok
      ? 'Check Reddit Test Events panel. If REDDIT_CAPI_TEST_ID is set, the event should appear there within ~30s.'
      : 'Failed. Check env vars and Vercel logs.',
  })
}

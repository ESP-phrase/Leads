import { NextResponse } from 'next/server'
import { isA2pEnabled, getNumberType, ratePerSecond } from '@/lib/sms'

export async function GET() {
  const enabled = isA2pEnabled()
  const type = getNumberType()
  return NextResponse.json({
    a2pEnabled: enabled,
    numberType: type,
    rps: ratePerSecond(),
    fromNumber: process.env.TELNYX_PHONE_NUMBER ?? null,
    reason: enabled
      ? null
      : type === 'toll-free'
        ? 'Toll-free SMS paused — set TELNYX_A2P_ENABLED=true once your TFN is verified by carriers.'
        : '10DLC carrier review pending — use P2P "Text" button or switch to a verified toll-free number.',
  })
}

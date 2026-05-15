import { NextResponse } from 'next/server'
import { isA2pEnabled } from '@/lib/sms'

export async function GET() {
  return NextResponse.json({
    a2pEnabled: isA2pEnabled(),
    reason: isA2pEnabled() ? null : '10DLC carrier review in progress — use P2P "Text" button (sends from your phone, not Telnyx).',
  })
}

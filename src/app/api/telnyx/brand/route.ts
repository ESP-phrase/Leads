import { NextResponse } from 'next/server'

// Telnyx 10DLC brand/campaign status webhook
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  console.log('[telnyx/brand] webhook:', JSON.stringify(body).slice(0, 300))
  return NextResponse.json({ ok: true })
}

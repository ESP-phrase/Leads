import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  await db.pendingCall.deleteMany({})
  return NextResponse.json({ ok: true })
}

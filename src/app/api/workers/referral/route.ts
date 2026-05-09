import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

const WORKER_SHARE = 119   // $ per closed deal
const REFERRAL_PCT = 0.15  // 15% of recruit's earnings go to referrer

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const workerId = session.workerId
  if (!workerId) return NextResponse.json({ error: 'Workers only' }, { status: 403 })

  const worker = await db.worker.findUnique({
    where: { id: workerId },
    include: {
      referrals: {
        include: {
          leads: true,
        },
      },
    },
  })

  if (!worker) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Tally referral earnings
  const recruits = worker.referrals.map(r => {
    const closed = r.leads.filter((l) => l.invoicePaid).length
    const earned = closed * WORKER_SHARE
    const yourCut = Math.round(earned * REFERRAL_PCT)
    return {
      id: r.id,
      name: r.name,
      joinedAt: r.createdAt,
      closedDeals: closed,
      theirEarnings: earned,
      yourCut,
    }
  })

  const totalReferralEarnings = recruits.reduce((s, r) => s + r.yourCut, 0)

  return NextResponse.json({
    referralCode: worker.referralCode,
    referralCount: recruits.length,
    recruits,
    totalReferralEarnings,
    referralPct: REFERRAL_PCT * 100,
  })
}

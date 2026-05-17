import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { pickTierForLead } from '@/lib/pricing'

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
    const closedLeads = r.leads.filter((l) => l.invoicePaid)
    const closed = closedLeads.length
    // Per-deal tier-based earnings — Premium closes pay more than Starter
    const earned = closedLeads.reduce(
      (sum, l) => sum + Math.round(pickTierForLead(l).workerShareCents / 100),
      0,
    )
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

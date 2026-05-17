import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { pickTierForLead } from '@/lib/pricing'

const REFERRAL_PCT = 0.15  // referrer earns 15% of each recruit's closed-deal share

type LeadForEarnings = {
  invoicePaid: boolean
  invoiceUrl: string | null
  status: string
  wealthScore: number | null
  ownerIncomeRange: string | null
}

/** Worker share (dollars) for a single lead at its computed tier. */
function workerShareDollars(lead: LeadForEarnings): number {
  return Math.round(pickTierForLead(lead).workerShareCents / 100)
}

/** Sum of worker shares for leads matching a predicate. */
function sumShares(leads: LeadForEarnings[], match: (l: LeadForEarnings) => boolean): number {
  return leads.reduce((sum, l) => match(l) ? sum + workerShareDollars(l) : sum, 0)
}

// GET → returns earnings for the logged-in worker, or all workers (admin)
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Admin: return earnings for all workers
  if (session.role === 'admin') {
    const workers = await db.worker.findMany({
      where: { active: true },
      include: {
        leads: { include: { site: true } },
        referrals: { include: { leads: true } },
      },
    })

    const summary = workers.map(w => {
      const closedDeals     = w.leads.filter(l => l.invoicePaid).length
      const pendingDeals    = w.leads.filter(l => l.invoiceUrl && !l.invoicePaid).length
      const interestedDeals = w.leads.filter(l => l.status === 'INTERESTED').length

      const directEarned = sumShares(w.leads, l => l.invoicePaid)

      // Referral earnings: 15% of each recruit's per-tier closed-deal share
      const referralEarned = w.referrals.reduce((sum, r) => {
        return sum + Math.round(sumShares(r.leads, l => l.invoicePaid) * REFERRAL_PCT)
      }, 0)

      return {
        workerId: w.id,
        name: w.name,
        phone: w.phone,
        email: w.email,
        referralCode: w.referralCode,
        referralCount: w.referrals.length,
        leadsAssigned: w.leads.length,
        closedDeals,
        pendingDeals,
        interestedDeals,
        earned:          directEarned + referralEarned,
        directEarned,
        referralEarned,
        pending:         sumShares(w.leads, l => Boolean(l.invoiceUrl) && !l.invoicePaid),
        potential:       sumShares(w.leads, l => l.status === 'INTERESTED'),
      }
    })

    return NextResponse.json({ workers: summary })
  }

  // Worker: just their stats
  if (session.workerId) {
    const w = await db.worker.findUnique({
      where: { id: session.workerId },
      include: {
        leads: { include: { site: true } },
        referrals: { include: { leads: true } },
      },
    })
    if (!w) return NextResponse.json({ error: 'Worker not found' }, { status: 404 })

    const closedDeals     = w.leads.filter(l => l.invoicePaid).length
    const pendingDeals    = w.leads.filter(l => l.invoiceUrl && !l.invoicePaid).length
    const interestedDeals = w.leads.filter(l => l.status === 'INTERESTED').length

    const directEarned = sumShares(w.leads, l => l.invoicePaid)
    const referralEarned = w.referrals.reduce((sum, r) => {
      return sum + Math.round(sumShares(r.leads, l => l.invoicePaid) * REFERRAL_PCT)
    }, 0)

    return NextResponse.json({
      workerId: w.id,
      name: w.name,
      referralCode: w.referralCode,
      referralCount: w.referrals.length,
      leadsAssigned: w.leads.length,
      closedDeals,
      pendingDeals,
      interestedDeals,
      earned:        directEarned + referralEarned,
      directEarned,
      referralEarned,
      pending:       sumShares(w.leads, l => Boolean(l.invoiceUrl) && !l.invoicePaid),
      potential:     sumShares(w.leads, l => l.status === 'INTERESTED'),
      // Headline numbers for the dashboard — reflect the "default" Standard tier.
      // Actual per-deal pay scales with each lead's wealth tier ($60–$319).
      sitePrice:     299,
      yourShare:     119,
      referralPct:   REFERRAL_PCT * 100,
    })
  }

  return NextResponse.json({ error: 'No worker session' }, { status: 401 })
}

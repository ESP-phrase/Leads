import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

const WORKER_SHARE_DOLLARS = 119  // 40% of $299
const SITE_PRICE_DOLLARS = 299
const REFERRAL_PCT = 0.15         // referrer earns 15% of each recruit's closed deals

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
      const directEarned    = closedDeals * WORKER_SHARE_DOLLARS

      // Referral earnings: 15% of each recruit's closed deals
      const referralEarned = w.referrals.reduce((sum, r) => {
        const rClosed = r.leads.filter((l) => l.invoicePaid).length
        return sum + Math.round(rClosed * WORKER_SHARE_DOLLARS * REFERRAL_PCT)
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
        pending:         pendingDeals * WORKER_SHARE_DOLLARS,
        potential:       interestedDeals * WORKER_SHARE_DOLLARS,
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
    const directEarned    = closedDeals * WORKER_SHARE_DOLLARS

    const referralEarned = w.referrals.reduce((sum, r) => {
      const rClosed = r.leads.filter((l) => l.invoicePaid).length
      return sum + Math.round(rClosed * WORKER_SHARE_DOLLARS * REFERRAL_PCT)
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
      pending:       pendingDeals * WORKER_SHARE_DOLLARS,
      potential:     interestedDeals * WORKER_SHARE_DOLLARS,
      sitePrice:     SITE_PRICE_DOLLARS,
      yourShare:     WORKER_SHARE_DOLLARS,
      referralPct:   REFERRAL_PCT * 100,
    })
  }

  return NextResponse.json({ error: 'No worker session' }, { status: 401 })
}

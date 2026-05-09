import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

const WORKER_SHARE_DOLLARS = 119  // 40% of $299
const SITE_PRICE_DOLLARS = 299

// GET → returns earnings for the logged-in worker, or all workers (admin)
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Admin: return earnings for all workers
  if (session.role === 'admin') {
    const workers = await db.worker.findMany({
      where: { active: true },
      include: { leads: { include: { site: true } } },
    })

    const summary = workers.map(w => {
      const closedDeals  = w.leads.filter(l => l.invoicePaid).length
      const pendingDeals = w.leads.filter(l => l.invoiceUrl && !l.invoicePaid).length
      const interestedDeals = w.leads.filter(l => l.status === 'INTERESTED').length

      return {
        workerId: w.id,
        name: w.name,
        phone: w.phone,
        email: w.email,
        leadsAssigned: w.leads.length,
        closedDeals,
        pendingDeals,
        interestedDeals,
        earned:   closedDeals  * WORKER_SHARE_DOLLARS,
        pending:  pendingDeals * WORKER_SHARE_DOLLARS,
        potential: interestedDeals * WORKER_SHARE_DOLLARS,
      }
    })

    return NextResponse.json({ workers: summary })
  }

  // Worker: just their stats
  if (session.workerId) {
    const w = await db.worker.findUnique({
      where: { id: session.workerId },
      include: { leads: { include: { site: true } } },
    })
    if (!w) return NextResponse.json({ error: 'Worker not found' }, { status: 404 })

    const closedDeals  = w.leads.filter(l => l.invoicePaid).length
    const pendingDeals = w.leads.filter(l => l.invoiceUrl && !l.invoicePaid).length
    const interestedDeals = w.leads.filter(l => l.status === 'INTERESTED').length

    return NextResponse.json({
      workerId: w.id,
      name: w.name,
      leadsAssigned: w.leads.length,
      closedDeals,
      pendingDeals,
      interestedDeals,
      earned: closedDeals * WORKER_SHARE_DOLLARS,
      pending: pendingDeals * WORKER_SHARE_DOLLARS,
      potential: interestedDeals * WORKER_SHARE_DOLLARS,
      sitePrice: SITE_PRICE_DOLLARS,
      yourShare: WORKER_SHARE_DOLLARS,
    })
  }

  return NextResponse.json({ error: 'No worker session' }, { status: 401 })
}

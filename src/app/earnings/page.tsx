'use client'

import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, CheckCircle, Clock, Users, Trophy } from 'lucide-react'
import Sidebar from '@/components/Sidebar'

interface WorkerSummary {
  workerId: string
  name: string
  phone?: string | null
  email?: string | null
  referralCode?: string | null
  referralCount: number
  leadsAssigned: number
  closedDeals: number
  pendingDeals: number
  interestedDeals: number
  earned: number
  directEarned: number
  referralEarned: number
  pending: number
  potential: number
}

export default function EarningsPage() {
  const [workers, setWorkers] = useState<WorkerSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/workers/earnings')
      .then(r => r.json())
      .then(data => {
        setWorkers(data.workers ?? (data.workerId ? [data] : []))
        setLoading(false)
      })
  }, [])

  const totals = workers.reduce(
    (acc, w) => ({
      earned: acc.earned + w.earned,
      pending: acc.pending + w.pending,
      potential: acc.potential + w.potential,
      closedDeals: acc.closedDeals + w.closedDeals,
      pendingDeals: acc.pendingDeals + w.pendingDeals,
    }),
    { earned: 0, pending: 0, potential: 0, closedDeals: 0, pendingDeals: 0 },
  )

  const sorted = [...workers].sort((a, b) => b.earned - a.earned)
  const topEarner = sorted[0]

  return (
    <div className="flex min-h-screen" style={{ background: '#0d0e0b', color: '#d4dfc4' }}>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2218]">
          <div>
            <h1 className="font-bold text-white text-base flex items-center gap-2">
              <DollarSign size={15} style={{ color: '#c8f135' }} /> Earnings
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#4a5a3a' }}>Track every worker's commissions and pipeline</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <p className="text-center text-sm py-12" style={{ color: '#3a4a2a' }}>Loading…</p>
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total paid out', value: `$${totals.earned.toLocaleString()}`, icon: CheckCircle, color: '#c8f135', sub: `${totals.closedDeals} deals closed` },
                  { label: 'Pending', value: `$${totals.pending.toLocaleString()}`, icon: Clock, color: '#d4a44a', sub: `${totals.pendingDeals} invoices sent` },
                  { label: 'In pipeline', value: `$${totals.potential.toLocaleString()}`, icon: TrendingUp, color: '#9b6fd4', sub: `interested leads` },
                  { label: 'Active workers', value: workers.length, icon: Users, color: '#4a9eff', sub: 'on the team' },
                ].map(({ label, value, icon: Icon, color, sub }) => (
                  <div key={label} className="rounded-xl p-5 border border-[#1e2218]" style={{ background: '#111310' }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium" style={{ color: '#4a5a3a' }}>{label}</span>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                        <Icon size={13} style={{ color }} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-white mb-1">{value}</p>
                    <p className="text-xs" style={{ color: '#3a4a2a' }}>{sub}</p>
                  </div>
                ))}
              </div>

              {/* Top earner highlight */}
              {topEarner && topEarner.earned > 0 && (
                <div className="rounded-xl p-5 border" style={{ background: 'linear-gradient(135deg, #c8f13510, #c8f13503)', borderColor: '#c8f13530' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Trophy size={28} style={{ color: '#c8f135' }} />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7a5a' }}>Top earner this month</p>
                        <p className="text-xl font-black text-white mt-1">{topEarner.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black" style={{ color: '#c8f135' }}>${topEarner.earned.toLocaleString()}</p>
                      <p className="text-xs" style={{ color: '#6b7a5a' }}>{topEarner.closedDeals} deal{topEarner.closedDeals !== 1 ? 's' : ''} closed</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Worker leaderboard */}
              <div className="rounded-xl border border-[#1e2218] overflow-hidden" style={{ background: '#111310' }}>
                <div className="px-5 py-3 border-b border-[#1e2218]">
                  <p className="text-sm font-semibold text-white">Worker leaderboard</p>
                </div>

                <div className="grid border-b border-[#1a1e14]"
                  style={{ gridTemplateColumns: '40px 1.8fr 0.8fr 0.8fr 0.8fr 1fr 1.2fr' }}>
                  {['#', 'Worker', 'Leads', 'Closed', 'Recruits', 'Referral $', 'Total Earned'].map(h => (
                    <div key={h} className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#2a3a1a' }}>
                      {h}
                    </div>
                  ))}
                </div>

                {sorted.length === 0 ? (
                  <p className="text-center text-sm py-12" style={{ color: '#3a4a2a' }}>No active workers yet.</p>
                ) : sorted.map((w, i) => (
                  <div key={w.workerId} className="grid items-center border-b border-[#161a11] hover:bg-[#ffffff02] transition-colors"
                    style={{ gridTemplateColumns: '40px 1.8fr 0.8fr 0.8fr 0.8fr 1fr 1.2fr', background: i % 2 === 0 ? 'transparent' : '#0f1009' }}>
                    <div className="px-3 py-3.5">
                      <span className="text-sm font-bold" style={{ color: i === 0 ? '#c8f135' : i === 1 ? '#a0b8a0' : i === 2 ? '#b89060' : '#3a4a2a' }}>
                        {i + 1}
                      </span>
                    </div>
                    <div className="px-3 py-3.5">
                      <p className="text-sm font-semibold text-white">{w.name}</p>
                      {w.phone && <p className="text-xs mt-0.5" style={{ color: '#3a4a2a' }}>{w.phone}</p>}
                      {w.referralCode && <p className="text-xs mt-0.5 font-mono" style={{ color: '#2a4a2a' }}>{w.referralCode}</p>}
                    </div>
                    <div className="px-3 py-3.5">
                      <p className="text-sm" style={{ color: '#6b7a5a' }}>{w.leadsAssigned}</p>
                    </div>
                    <div className="px-3 py-3.5">
                      <p className="text-sm font-bold" style={{ color: w.closedDeals > 0 ? '#c8f135' : '#3a4a2a' }}>{w.closedDeals}</p>
                    </div>
                    <div className="px-3 py-3.5">
                      <p className="text-sm" style={{ color: w.referralCount > 0 ? '#4a9eff' : '#3a4a2a' }}>{w.referralCount}</p>
                    </div>
                    <div className="px-3 py-3.5">
                      <p className="text-sm font-bold" style={{ color: w.referralEarned > 0 ? '#4a9eff' : '#3a4a2a' }}>
                        {w.referralEarned > 0 ? `$${w.referralEarned}` : '—'}
                      </p>
                    </div>
                    <div className="px-3 py-3.5">
                      <p className="text-base font-black" style={{ color: w.earned > 0 ? '#c8f135' : '#3a4a2a' }}>${w.earned}</p>
                      {w.referralEarned > 0 && (
                        <p className="text-xs" style={{ color: '#2a4a2a' }}>${w.directEarned} + ${w.referralEarned} ref</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

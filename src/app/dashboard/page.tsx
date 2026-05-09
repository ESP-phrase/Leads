'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Globe, MessageSquare, ExternalLink, Star, Phone,
  RefreshCw, Plus, ChevronDown, TrendingUp, Users,
  DollarSign, Zap, PhoneCall, ArrowRight, BarChart3,
  Search, CheckCircle2, Receipt,
} from 'lucide-react'
import type { Lead, LeadStatus } from '@/types'
import { statusLabel, formatPhone } from '@/lib/utils'
import Sidebar from '@/components/Sidebar'
import clsx from 'clsx'

const STATUSES: LeadStatus[] = ['FOUND', 'CALLED', 'TEXTED', 'INTERESTED', 'CLOSED', 'NOT_INTERESTED']

const STATUS_STYLE: Record<LeadStatus, string> = {
  FOUND:          'text-[#7a9a5a] bg-[#1e2318]',
  CALLED:         'text-[#4a7fd4] bg-[#131a2e]',
  TEXTED:         'text-[#9b6fd4] bg-[#1e1530]',
  INTERESTED:     'text-[#d4a44a] bg-[#2a1f0a]',
  CLOSED:         'text-[#c8f135] bg-[#0d2218]',
  NOT_INTERESTED: 'text-[#d45a5a] bg-[#2a0d0d]',
}

const MONTHLY_VALUE = 149 // assumed MRR per closed client

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [workers, setWorkers] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [invoicingId, setInvoicingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL')
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 8000)
  }

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    const [leadsRes, workersRes] = await Promise.all([fetch('/api/leads'), fetch('/api/workers')])
    if (leadsRes.ok) setLeads(await leadsRes.json())
    if (workersRes.ok) setWorkers(await workersRes.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  async function updateStatus(leadId: string, status: LeadStatus) {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l))
    await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  async function assignWorker(leadId: string, workerId: string | null) {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, workerId } as Lead : l))
    await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerId }),
    })
  }

  async function generateSite(lead: Lead) {
    setGeneratingId(lead.id)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(`Build failed: ${data.error ?? 'unknown error'} — ${data.detail ?? ''}`, false)
      } else if (data.deployError) {
        showToast(`Site saved but deploy failed: ${data.deployError}`, false)
      } else {
        showToast(`Site built! Opening…`)
        if (data.previewUrl) window.open(data.previewUrl, '_blank')
      }
      await fetchLeads()
    } catch (err) {
      showToast(`Network error: ${String(err)}`, false)
    }
    setGeneratingId(null)
  }

  async function sendInvoice(lead: Lead) {
    setInvoicingId(lead.id)
    try {
      const res = await fetch('/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      })
      const data = await res.json()
      if (res.ok && data.invoiceUrl) {
        await fetchLeads()
        window.open(data.invoiceUrl, '_blank')
        showToast('Invoice created — $299 payment link opened!')
      } else {
        showToast(`Invoice failed: ${data.error ?? 'unknown'}`, false)
      }
    } catch (err) {
      showToast(`Error: ${String(err)}`, false)
    }
    setInvoicingId(null)
  }

  async function sendSms(lead: Lead) {
    setSendingId(lead.id)
    await fetch('/api/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: lead.id }),
    })
    await fetchLeads()
    setSendingId(null)
  }

  const filtered = statusFilter === 'ALL' ? leads : leads.filter(l => l.status === statusFilter)

  const closedCount   = leads.filter(l => l.status === 'CLOSED').length
  const interestedCount = leads.filter(l => l.status === 'INTERESTED').length
  const mrrClosed     = closedCount * MONTHLY_VALUE
  const mrrPipeline   = (closedCount + interestedCount) * MONTHLY_VALUE

  const stats = [
    { label: 'Total Leads',  value: leads.length,                                                                       icon: Users,      color: '#c8f135', sub: 'in pipeline' },
    { label: 'Sites Built',  value: leads.filter(l => l.site).length,                                                   icon: Globe,      color: '#4a9eff', sub: 'ready to send' },
    { label: 'In Pipeline',  value: leads.filter(l => ['TEXTED','CALLED','INTERESTED'].includes(l.status)).length,       icon: TrendingUp, color: '#9b6fd4', sub: 'active conversations' },
    { label: 'MRR Closed',   value: `$${mrrClosed.toLocaleString()}`,                                                   icon: DollarSign, color: '#c8f135', sub: `$${mrrPipeline.toLocaleString()} potential` },
  ]

  const isEmpty = !loading && leads.length === 0

  return (
    <div className="flex min-h-screen" style={{ background: '#0d0e0b', color: '#d4dfc4' }}>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm px-4 py-3 rounded-xl text-sm font-medium shadow-xl"
          style={{
            background: toast.ok ? '#1a3020' : '#3a1515',
            color: toast.ok ? '#c8f135' : '#f07070',
            border: `1px solid ${toast.ok ? '#2a5030' : '#5a2020'}`,
          }}>
          {toast.msg}
        </div>
      )}
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2218] sticky top-0 z-10" style={{ background: '#0d0e0b' }}>
          <div>
            <h1 className="font-bold text-white text-base">Dashboard</h1>
            <p className="text-xs mt-0.5" style={{ color: '#4a5a3a' }}>Your lead pipeline at a glance</p>
          </div>
          <div className="flex gap-2">
            <Link href="/leads"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: '#c8f135', color: '#0d0e0b' }}>
              <Plus size={14} /> Find Leads
            </Link>
            <button onClick={fetchLeads}
              className="p-2 rounded-lg border border-[#1e2218] hover:border-[#2e3828] transition-colors"
              style={{ color: '#4a5a3a' }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, color, sub }) => (
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

          {/* MRR progress bar */}
          {leads.length > 0 && (
            <div className="rounded-xl p-5 border border-[#1e2218]" style={{ background: '#111310' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-white">Revenue Pipeline</p>
                  <p className="text-xs mt-0.5" style={{ color: '#4a5a3a' }}>
                    ${mrrClosed.toLocaleString()} closed · ${mrrPipeline.toLocaleString()} potential MRR at $149/client
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#c8f13515', color: '#c8f135' }}>
                  {mrrPipeline > 0 ? `${Math.round((mrrClosed / mrrPipeline) * 100)}% closed` : '0% closed'}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1e2218' }}>
                <div className="h-full rounded-full transition-all duration-700"
                     style={{ width: mrrPipeline > 0 ? `${(mrrClosed / mrrPipeline) * 100}%` : '0%', background: '#c8f135' }} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs" style={{ color: '#3a4a2a' }}>$0</span>
                <span className="text-xs" style={{ color: '#3a4a2a' }}>${mrrPipeline.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Empty state onboarding */}
          {isEmpty ? (
            <div className="rounded-xl border border-[#1e2218] p-10 text-center" style={{ background: '#111310' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                   style={{ background: '#c8f13515', border: '1px solid #c8f13525' }}>
                <Zap size={24} style={{ color: '#c8f135' }} />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Welcome to Canvass</h2>
              <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: '#4a5a3a' }}>
                You&apos;re 3 steps away from your first closed deal. Here&apos;s how to get started.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                {[
                  { step: '1', icon: Search, title: 'Find leads', desc: 'Search by city + category', href: '/leads' },
                  { step: '2', icon: Globe,  title: 'Build sites', desc: 'AI generates each site', href: '/leads' },
                  { step: '3', icon: PhoneCall, title: 'Call & close', desc: 'Use DialFlow to pitch', href: '/dialer' },
                ].map(({ step, icon: Icon, title, desc, href }) => (
                  <Link key={step} href={href}
                    className="rounded-xl p-5 border border-[#1e2218] hover:border-[#2e3828] transition-colors text-left group"
                    style={{ background: '#0d0e0b', textDecoration: 'none' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-black" style={{ color: '#3a4a2a' }}>{step}</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#c8f13515' }}>
                        <Icon size={14} style={{ color: '#c8f135' }} />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white mb-1">{title}</p>
                    <p className="text-xs" style={{ color: '#3a4a2a' }}>{desc}</p>
                  </Link>
                ))}
              </div>
              <Link href="/leads"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: '#c8f135', color: '#0d0e0b', textDecoration: 'none' }}>
                Find your first leads <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            /* Leads table */
            <div className="rounded-xl border border-[#1e2218] overflow-hidden" style={{ background: '#111310' }}>
              {/* Table topbar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e2218]">
                <p className="text-sm font-semibold text-white">
                  {filtered.length} lead{filtered.length !== 1 ? 's' : ''}
                  {statusFilter !== 'ALL' && <span className="font-normal" style={{ color: '#4a5a3a' }}> · {statusLabel(statusFilter)}</span>}
                </p>
                <div className="flex items-center gap-2">
                  <Link href="/dialer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#1e2218] hover:border-[#2e3828] transition-colors"
                    style={{ color: '#6b7a5a' }}>
                    <PhoneCall size={12} /> Open DialFlow
                  </Link>
                  {/* Filter */}
                  <div className="relative">
                    <button onClick={() => setShowStatusMenu(m => !m)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-[#1e2218] rounded-lg hover:border-[#2e3828] transition-colors"
                      style={{ color: '#6b7a5a' }}>
                      {statusFilter === 'ALL' ? 'All statuses' : statusLabel(statusFilter)}
                      <ChevronDown size={11} />
                    </button>
                    {showStatusMenu && (
                      <div className="absolute right-0 top-full mt-1 z-50 rounded-xl border border-[#2e3828] shadow-2xl overflow-hidden min-w-[160px]"
                           style={{ background: '#181a14' }}>
                        {(['ALL', ...STATUSES] as const).map(s => (
                          <button key={s} onClick={() => { setStatusFilter(s); setShowStatusMenu(false) }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-[#ffffff06]"
                            style={{ color: statusFilter === s ? '#c8f135' : '#6b7a5a' }}>
                            {s === 'ALL' ? 'All statuses' : statusLabel(s)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Column headers */}
              <div className="grid border-b border-[#1a1e14]"
                   style={{ gridTemplateColumns: '2fr 1.2fr 0.8fr 0.9fr 1fr 0.7fr 230px' }}>
                {['Business', 'Location', 'Rating', 'Status', 'Assigned', 'Site', 'Actions'].map(h => (
                  <div key={h} className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#2a3a1a' }}>
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {filtered.map((lead, i) => (
                <Row key={lead.id} lead={lead} statuses={STATUSES} workers={workers} isEven={i % 2 === 0}
                     generatingId={generatingId} sendingId={sendingId} invoicingId={invoicingId}
                     onStatusChange={updateStatus} onAssign={assignWorker} onGenerate={generateSite} onSms={sendSms} onInvoice={sendInvoice} />
              ))}

              {/* Add leads prompt */}
              <div className="px-5 py-4 border-t border-[#161a11] flex items-center justify-between">
                <p className="text-xs" style={{ color: '#2a3a1a' }}>
                  {leads.length} total · {leads.filter(l => l.site).length} sites built
                </p>
                <Link href="/leads" className="flex items-center gap-1 text-xs font-medium transition-colors"
                      style={{ color: '#4a5a3a', textDecoration: 'none' }}>
                  <Plus size={12} /> Add more leads
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function Row({ lead, statuses, workers, isEven, generatingId, sendingId, invoicingId, onStatusChange, onAssign, onGenerate, onSms, onInvoice }: {
  lead: Lead; statuses: LeadStatus[]; workers: { id: string; name: string }[]; isEven: boolean
  generatingId: string | null; sendingId: string | null; invoicingId: string | null
  onStatusChange: (id: string, s: LeadStatus) => void
  onAssign: (id: string, workerId: string | null) => void
  onGenerate: (l: Lead) => void; onSms: (l: Lead) => void; onInvoice: (l: Lead) => void
}) {
  const isGen = generatingId === lead.id
  const isSms = sendingId === lead.id
  const isInv = invoicingId === lead.id

  return (
    <div className="grid items-center border-b border-[#161a11] hover:bg-[#ffffff02] transition-colors"
         style={{ gridTemplateColumns: '2fr 1.2fr 0.8fr 0.9fr 1fr 0.7fr 230px', background: isEven ? 'transparent' : '#0f1009' }}>

      <div className="px-3 py-3.5">
        <p className="text-sm font-semibold text-white leading-tight">{lead.name}</p>
        {lead.phone && (
          <div className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: '#3a4a2a' }}>
            <Phone size={9} />
            <a href={`tel:${lead.phone}`} className="hover:text-[#6b7a5a] transition-colors">{formatPhone(lead.phone)}</a>
          </div>
        )}
      </div>

      <div className="px-3 py-3.5">
        <p className="text-sm" style={{ color: '#6b7a5a' }}>{lead.city ?? '—'}</p>
        {lead.category && <p className="text-xs mt-0.5" style={{ color: '#3a4a2a' }}>{lead.category}</p>}
      </div>

      <div className="px-3 py-3.5">
        {lead.rating ? (
          <div className="flex items-center gap-1.5">
            <Star size={11} fill="#c8f135" stroke="none" />
            <span className="text-sm font-bold text-white">{lead.rating}</span>
            <span className="text-xs" style={{ color: '#2a3a1a' }}>({lead.reviewCount})</span>
          </div>
        ) : <span className="text-sm" style={{ color: '#2a3a1a' }}>—</span>}
      </div>

      <div className="px-3 py-3.5">
        <select value={lead.status} onChange={e => onStatusChange(lead.id, e.target.value as LeadStatus)}
          className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full focus:outline-none cursor-pointer appearance-none', STATUS_STYLE[lead.status])}
          style={{ background: 'inherit', border: 'none' }}>
          {statuses.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
      </div>

      {/* Assigned worker */}
      <div className="px-3 py-3.5">
        <select
          value={(lead as Lead & { workerId?: string | null }).workerId ?? ''}
          onChange={e => onAssign(lead.id, e.target.value || null)}
          className="text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#c8f13540] w-full max-w-[120px]"
          style={{ background: '#0d0e0b', border: '1px solid #1e2218', color: '#6b7a5a' }}>
          <option value="">Unassigned</option>
          {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      {/* Site */}
      <div className="px-3 py-3.5">
        {lead.site ? (
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#c8f135' }}>
            <CheckCircle2 size={11} /> Built
          </span>
        ) : (
          <span className="text-xs" style={{ color: '#2a3a1a' }}>Not built</span>
        )}
      </div>

      <div className="px-3 py-3.5 flex items-center gap-1">
        {!lead.site ? (
          <button onClick={() => onGenerate(lead)} disabled={isGen}
            title="Build website with AI"
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-bold transition-all disabled:opacity-40 flex-shrink-0"
            style={{ background: '#c8f135', color: '#0d0e0b' }}>
            <Globe size={10} />{isGen ? '…' : 'Build'}
          </button>
        ) : (
          <a href={lead.site.vercelUrl ?? lead.previewUrl ?? `/preview/${lead.slug}`} target="_blank"
             title="Open site in new tab"
             className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-bold transition-all flex-shrink-0"
             style={{ background: '#c8f135', color: '#0d0e0b', textDecoration: 'none' }}>
            <ExternalLink size={10} /> Show
          </a>
        )}
        <button onClick={() => onSms(lead)} disabled={isSms || !lead.site || !lead.phone}
          title={!lead.site ? 'Build site first' : !lead.phone ? 'No phone' : 'Send SMS with preview link'}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium border border-[#1e2218] hover:border-[#2e3828] disabled:opacity-25 transition-all flex-shrink-0"
          style={{ color: '#4a5a3a' }}>
          <MessageSquare size={10} />{isSms ? '…' : 'SMS'}
        </button>
        <button onClick={() => onInvoice(lead)} disabled={isInv || !lead.site}
          title={!lead.site ? 'Build site first' : lead.invoicePaid ? 'Already paid' : 'Send $299 invoice'}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium border disabled:opacity-25 transition-all flex-shrink-0"
          style={{
            borderColor: lead.invoicePaid ? '#2a5030' : '#1e2218',
            color: lead.invoicePaid ? '#c8f135' : '#4a5a3a',
          }}>
          <Receipt size={10} />{isInv ? '…' : lead.invoicePaid ? '✓' : 'Bill'}
        </button>
        <Link href="/dialer"
          title="Open dialer"
          className="flex items-center px-1.5 py-1.5 rounded-md border border-[#1e2218] hover:border-[#2e3828] transition-all flex-shrink-0"
          style={{ color: '#4a5a3a' }}>
          <PhoneCall size={11} />
        </Link>
      </div>
    </div>
  )
}

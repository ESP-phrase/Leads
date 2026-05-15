'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Globe, MessageSquare, ExternalLink, Star, Phone,
  RefreshCw, Plus, ChevronDown, TrendingUp, Users,
  DollarSign, Zap, PhoneCall, ArrowRight, BarChart3,
  Search, CheckCircle2, Receipt, Check, X as XIcon, Layers, Repeat2, Sparkles,
} from 'lucide-react'
import { SMS_TEMPLATES } from '@/lib/sms-templates'
import type { Lead, LeadStatus } from '@/types'
import { statusLabel, formatPhone } from '@/lib/utils'
import Sidebar from '@/components/Sidebar'
import clsx from 'clsx'
import dynamic from 'next/dynamic'

const Dialer = dynamic(() => import('@/components/Dialer'), { ssr: false })

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkBuilding, setBulkBuilding] = useState(false)
  const [bulkSmsing, setBulkSmsing] = useState(false)
  const [bulkEnriching, setBulkEnriching] = useState(false)
  const [bulkEnrichProgress, setBulkEnrichProgress] = useState<{ done: number; total: number } | null>(null)
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null)
  const [bulkSmsTemplate, setBulkSmsTemplate] = useState('preview-soft')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL')
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [dialerLead, setDialerLead] = useState<Lead | null>(null)
  const [sequencingId, setSequencingId] = useState<string | null>(null)
  const [enrichingId, setEnrichingId] = useState<string | null>(null)
  const [deepEnrichingId, setDeepEnrichingId] = useState<string | null>(null)

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

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function selectAllVisible() {
    setSelectedIds(new Set(filtered.map(l => l.id)))
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  async function bulkBuild() {
    const ids = [...selectedIds].filter(id => {
      const lead = leads.find(l => l.id === id)
      return lead && !lead.site
    })
    if (ids.length === 0) {
      showToast('No unbuilt leads selected', false); return
    }

    setBulkBuilding(true)
    setBulkProgress({ done: 0, total: ids.length })

    try {
      const res = await fetch('/api/leads/bulk-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: ids }),
      })
      if (!res.body) throw new Error('No stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let done = 0
      let succeeded = 0

      while (true) {
        const { done: streamDone, value } = await reader.read()
        if (streamDone) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const ev = JSON.parse(line.slice(6))
          if (ev.type === 'success') { done++; succeeded++; setBulkProgress({ done, total: ids.length }) }
          else if (ev.type === 'fail' || ev.type === 'skip') { done++; setBulkProgress({ done, total: ids.length }) }
          else if (ev.type === 'done') { showToast(`Built ${ev.succeeded} sites · ${ev.failed} failed`, ev.failed === 0) }
        }
      }
      await fetchLeads()
      showToast(`Bulk build done: ${succeeded}/${ids.length} sites built!`)
    } catch (err) {
      showToast(`Bulk build failed: ${String(err)}`, false)
    }
    setBulkBuilding(false)
    setBulkProgress(null)
    clearSelection()
  }

  async function bulkSms() {
    const ids = [...selectedIds].filter(id => {
      const lead = leads.find(l => l.id === id)
      return lead && lead.phone && lead.site
    })
    if (ids.length === 0) {
      showToast('Select leads with phone + built site', false); return
    }

    setBulkSmsing(true)
    try {
      const res = await fetch('/api/leads/bulk-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: ids, templateId: bulkSmsTemplate }),
      })
      const data = await res.json()
      if (res.ok) {
        await fetchLeads()
        showToast(`Sent ${data.sent} SMS · ${data.failed} failed`, data.failed === 0)
      } else {
        showToast(`Bulk SMS failed: ${data.error}`, false)
      }
    } catch (err) {
      showToast(`Bulk SMS failed: ${String(err)}`, false)
    }
    setBulkSmsing(false)
    clearSelection()
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

  async function handleSequence(lead: Lead) {
    setSequencingId(lead.id)
    const res = await fetch(`/api/leads/${lead.id}/sequence`, { method: 'POST' })
    if (res.ok) {
      showToast(`Drip sequence started for ${lead.name}`)
      await fetchLeads()
    } else {
      const { error } = await res.json().catch(() => ({ error: 'Failed' }))
      showToast(error ?? 'Failed to start sequence', false)
    }
    setSequencingId(null)
  }

  async function handleEnrich(lead: Lead) {
    setEnrichingId(lead.id)
    try {
      const res = await fetch(`/api/leads/${lead.id}/enrich`, { method: 'POST' })
      if (res.ok) {
        const { result } = await res.json()
        const conf = result?.confidence ?? 'none'
        const owner = result?.ownerName ?? 'no owner found'
        const wealth = result?.wealthScore != null ? ` · score ${result.wealthScore}` : ''
        showToast(`Enriched ${lead.name}: ${owner} (${conf})${wealth}`)
        await fetchLeads()
      } else {
        const { error } = await res.json().catch(() => ({ error: 'Failed' }))
        showToast(error ?? 'Enrichment failed', false)
      }
    } catch {
      showToast('Enrichment failed', false)
    }
    setEnrichingId(null)
  }

  async function bulkEnrich() {
    const ids = [...selectedIds]
    if (ids.length === 0) { showToast('No leads selected', false); return }

    setBulkEnriching(true)
    setBulkEnrichProgress({ done: 0, total: ids.length })

    let succeeded = 0
    let failed = 0
    const CONCURRENCY = 3   // 3 parallel requests — gentle on OpenAI rate limits
    let cursor = 0

    async function worker() {
      while (cursor < ids.length) {
        const i = cursor++
        const id = ids[i]
        try {
          const res = await fetch(`/api/leads/${id}/enrich`, { method: 'POST' })
          if (res.ok) succeeded++; else failed++
        } catch {
          failed++
        }
        setBulkEnrichProgress({ done: succeeded + failed, total: ids.length })
      }
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, worker))
    await fetchLeads()

    showToast(`Enriched ${succeeded} leads · ${failed} failed`, failed === 0)
    setBulkEnriching(false)
    setBulkEnrichProgress(null)
    clearSelection()
  }

  async function handleDeepEnrich(lead: Lead) {
    setDeepEnrichingId(lead.id)
    try {
      const res = await fetch(`/api/leads/${lead.id}/deep-enrich`, { method: 'POST' })
      if (res.ok) {
        const { result } = await res.json()
        const income = result?.ownerIncomeRange ?? 'unknown'
        const legal = result?.legalName ?? 'no SoS match'
        showToast(`Deep: ${legal} · income ${income}`)
        await fetchLeads()
      } else {
        const { error } = await res.json().catch(() => ({ error: 'Failed' }))
        showToast(error ?? 'Deep enrichment failed', false)
      }
    } catch {
      showToast('Deep enrichment failed', false)
    }
    setDeepEnrichingId(null)
  }

  const baseFiltered = statusFilter === 'ALL' ? leads : leads.filter(l => l.status === statusFilter)
  // Sort by wealthScore desc when any lead has it, otherwise keep original order
  const anyWealth = baseFiltered.some(l => (l as Lead & { wealthScore?: number | null }).wealthScore != null)
  const filtered = anyWealth
    ? [...baseFiltered].sort((a, b) => {
        const aS = (a as Lead & { wealthScore?: number | null }).wealthScore ?? -1
        const bS = (b as Lead & { wealthScore?: number | null }).wealthScore ?? -1
        return bS - aS
      })
    : baseFiltered

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
    <div className="flex min-h-screen pb-20 md:pb-0" style={{ background: '#0d0e0b', color: '#d4dfc4' }}>
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
              <h2 className="text-xl font-black text-white mb-2">Welcome to SiteForge</h2>
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
              {/* Bulk action bar */}
              {selectedIds.size > 0 && (
                <div className="flex items-center justify-between px-5 py-3 border-b" style={{ background: '#c8f13510', borderColor: '#c8f13530' }}>
                  <div className="flex items-center gap-3">
                    <Layers size={14} style={{ color: '#c8f135' }} />
                    <p className="text-sm font-semibold" style={{ color: '#c8f135' }}>
                      {selectedIds.size} lead{selectedIds.size !== 1 ? 's' : ''} selected
                    </p>
                    <button onClick={clearSelection} className="text-xs hover:underline" style={{ color: '#6b7a5a' }}>
                      Clear
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={bulkBuild} disabled={bulkBuilding}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40"
                      style={{ background: '#c8f135', color: '#0d0e0b' }}>
                      <Globe size={11} />
                      {bulkBuilding && bulkProgress
                        ? `Building ${bulkProgress.done}/${bulkProgress.total}…`
                        : `Build All Sites (${[...selectedIds].filter(id => !leads.find(l => l.id === id)?.site).length})`}
                    </button>
                    <select value={bulkSmsTemplate} onChange={e => setBulkSmsTemplate(e.target.value)}
                      className="text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                      style={{ background: '#0d0e0b', border: '1px solid #2a3a1a', color: '#a0b080' }}>
                      <optgroup label="First touch">
                        {SMS_TEMPLATES.filter(t => t.stage === 'first-touch').map(t => (
                          <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Follow-up">
                        {SMS_TEMPLATES.filter(t => t.stage === 'follow-up').map(t => (
                          <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Closing">
                        {SMS_TEMPLATES.filter(t => t.stage === 'closing').map(t => (
                          <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
                        ))}
                      </optgroup>
                    </select>
                    <button onClick={bulkSms} disabled={bulkSmsing}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all disabled:opacity-40"
                      style={{ borderColor: '#c8f13540', color: '#c8f135' }}>
                      <MessageSquare size={11} />
                      {bulkSmsing
                        ? 'Sending…'
                        : `Send SMS to All (${[...selectedIds].filter(id => { const l = leads.find(l => l.id === id); return l?.phone && l?.site }).length})`}
                    </button>
                    <button onClick={bulkEnrich} disabled={bulkEnriching}
                      title="Find owner + wealth score for all selected leads (free, ~5s/lead)"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all disabled:opacity-40"
                      style={{ borderColor: '#9b6fd440', color: '#9b6fd4' }}>
                      <Sparkles size={11} />
                      {bulkEnriching && bulkEnrichProgress
                        ? `Enriching ${bulkEnrichProgress.done}/${bulkEnrichProgress.total}…`
                        : `Enrich All (${selectedIds.size})`}
                    </button>
                  </div>
                </div>
              )}

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
                   style={{ gridTemplateColumns: '36px 2fr 1.2fr 0.8fr 0.9fr 1fr 0.7fr 230px' }}>
                <div className="px-3 py-2.5 flex items-center">
                  <input type="checkbox"
                    checked={filtered.length > 0 && filtered.every(l => selectedIds.has(l.id))}
                    onChange={() => filtered.length > 0 && filtered.every(l => selectedIds.has(l.id)) ? clearSelection() : selectAllVisible()}
                    className="cursor-pointer accent-[#c8f135]"
                    style={{ width: 14, height: 14 }} />
                </div>
                {['Business', 'Location', 'Rating', 'Status', 'Assigned', 'Site', 'Actions'].map(h => (
                  <div key={h} className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#2a3a1a' }}>
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {filtered.map((lead, i) => (
                <Row key={lead.id} lead={lead} statuses={STATUSES} workers={workers} isEven={i % 2 === 0}
                     generatingId={generatingId} sendingId={sendingId} invoicingId={invoicingId} sequencingId={sequencingId} enrichingId={enrichingId} deepEnrichingId={deepEnrichingId}
                     selected={selectedIds.has(lead.id)} onToggleSelect={toggleSelect}
                     onStatusChange={updateStatus} onAssign={assignWorker} onGenerate={generateSite}
                     onSms={sendSms} onInvoice={sendInvoice}
                     onCall={(l) => setDialerLead(l)}
                     onSequence={handleSequence}
                     onEnrich={handleEnrich}
                     onDeepEnrich={handleDeepEnrich} />
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

      {/* Test call button — fixed bottom right */}
      <button
        onClick={() => setDialerLead({ id: 'test', name: 'Test Call', phone: '+15127967462' } as Lead)}
        className="fixed bottom-24 right-4 md:bottom-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold shadow-lg transition-all hover:scale-105"
        style={{ background: '#c8f13520', border: '1px solid #c8f13550', color: '#c8f135' }}
        title="Call yourself to test the dialer"
      >
        <PhoneCall size={13} /> Test call
      </button>

      {/* WebRTC Dialer modal */}
      {dialerLead && (
        <Dialer lead={dialerLead} onClose={() => setDialerLead(null)} />
      )}
    </div>
  )
}

function Row({ lead, statuses, workers, isEven, generatingId, sendingId, invoicingId, sequencingId, enrichingId, deepEnrichingId, selected, onToggleSelect, onStatusChange, onAssign, onGenerate, onSms, onInvoice, onCall, onSequence, onEnrich, onDeepEnrich }: {
  lead: Lead; statuses: LeadStatus[]; workers: { id: string; name: string }[]; isEven: boolean
  generatingId: string | null; sendingId: string | null; invoicingId: string | null; sequencingId: string | null; enrichingId: string | null; deepEnrichingId: string | null
  selected: boolean; onToggleSelect: (id: string) => void
  onStatusChange: (id: string, s: LeadStatus) => void
  onAssign: (id: string, workerId: string | null) => void
  onGenerate: (l: Lead) => void; onSms: (l: Lead) => void; onInvoice: (l: Lead) => void
  onCall: (l: Lead) => void; onSequence: (l: Lead) => void; onEnrich: (l: Lead) => void; onDeepEnrich: (l: Lead) => void
}) {
  const isGen = generatingId === lead.id
  const isSms = sendingId === lead.id
  const isInv = invoicingId === lead.id
  const isSeq = sequencingId === lead.id
  const isEnr = enrichingId === lead.id
  const isDeep = deepEnrichingId === lead.id
  const leadAny = lead as Lead & {
    ownerName?: string | null
    enrichmentConfidence?: string | null
    wealthScore?: number | null
    wealthSignals?: string | null
    ownerLegalName?: string | null
    ownerIncomeRange?: string | null
    ownerLinkedinUrl?: string | null
    ownerNewsSignals?: string | null
  }
  // Color the wealth badge: red < 30, orange < 50, yellow < 70, green ≥ 70
  const wealthColor = (s: number | null | undefined) =>
    s == null ? '#3a4a2a'
    : s >= 70 ? '#c8f135'
    : s >= 50 ? '#e8c84a'
    : s >= 30 ? '#d49a4a'
    : '#7a5a3a'

  return (
    <div className="grid items-center border-b border-[#161a11] hover:bg-[#ffffff02] transition-colors cursor-pointer"
         onClick={() => onToggleSelect(lead.id)}
         style={{ gridTemplateColumns: '36px 2fr 1.2fr 0.8fr 0.9fr 1fr 0.7fr 230px', background: selected ? '#c8f1350c' : isEven ? 'transparent' : '#0f1009' }}>

      <div className="px-3 py-3.5 flex items-center" onClick={e => e.stopPropagation()}>
        <input type="checkbox" checked={selected} onChange={() => onToggleSelect(lead.id)}
          className="cursor-pointer accent-[#c8f135]"
          style={{ width: 14, height: 14 }} />
      </div>

      <div className="px-3 py-3.5">
        <p className="text-sm font-semibold text-white leading-tight">{lead.name}</p>
        {lead.phone && (
          <div className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: '#3a4a2a' }} onClick={e => e.stopPropagation()}>
            <Phone size={9} />
            <a href={`tel:${lead.phone}`} className="hover:text-[#6b7a5a] transition-colors">{formatPhone(lead.phone)}</a>
          </div>
        )}
        {leadAny.ownerName && (
          <button type="button"
            onClick={e => { e.stopPropagation(); onEnrich(lead) }}
            disabled={isEnr}
            className="flex items-center gap-1 mt-0.5 text-xs cursor-pointer bg-transparent border-0 p-0 hover:opacity-80 transition-opacity disabled:opacity-50"
            title={`Owner (${leadAny.enrichmentConfidence ?? 'unknown'}) — click to re-enrich`}>
            <Sparkles size={9} style={{ color: '#c8f135' }} />
            <span style={{ color: leadAny.enrichmentConfidence === 'high' ? '#c8f135' : leadAny.enrichmentConfidence === 'medium' ? '#9b6fd4' : '#4a5a3a' }}>
              {leadAny.ownerName}
            </span>
          </button>
        )}
        {leadAny.wealthScore != null && (
          <div className="flex items-center gap-1 mt-0.5 text-xs">
            <button type="button"
              onClick={e => { e.stopPropagation(); onEnrich(lead) }}
              disabled={isEnr}
              title={leadAny.wealthSignals ? `Signals: ${leadAny.wealthSignals} — click to re-enrich` : 'Wealth proxy score (0-100) — click to re-enrich'}
              style={{
                padding: '1px 6px',
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                background: `${wealthColor(leadAny.wealthScore)}20`,
                color: wealthColor(leadAny.wealthScore),
                border: `1px solid ${wealthColor(leadAny.wealthScore)}40`,
                cursor: 'pointer',
              }}
              className="hover:opacity-80 transition-opacity disabled:opacity-50">
              ${leadAny.wealthScore}
            </button>
            {leadAny.wealthSignals && (
              <span style={{ color: '#3a4a2a', fontSize: 10 }} className="truncate max-w-[140px]">
                {leadAny.wealthSignals.split(',').slice(0, 2).join(',')}
              </span>
            )}
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

      <div className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
        <select value={lead.status} onChange={e => onStatusChange(lead.id, e.target.value as LeadStatus)}
          className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full focus:outline-none cursor-pointer appearance-none', STATUS_STYLE[lead.status])}
          style={{ background: 'inherit', border: 'none' }}>
          {statuses.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
      </div>

      {/* Assigned worker */}
      <div className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
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

      <div className="px-3 py-3.5 flex items-center gap-1" onClick={e => e.stopPropagation()}>
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
        <button onClick={() => onCall(lead)} disabled={!lead.phone}
          title={lead.phone ? 'Call in browser' : 'No phone number'}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium border border-[#1e2218] hover:border-[#2e3828] disabled:opacity-25 transition-all flex-shrink-0"
          style={{ color: '#4a9eff' }}>
          <PhoneCall size={10} />Call
        </button>
        <button onClick={() => onSequence(lead)} disabled={isSeq || !lead.phone}
          title={!lead.phone ? 'No phone' : 'Start 4-step SMS drip (Day 0→1→3→7)'}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium border border-[#1e2218] hover:border-[#2e3828] disabled:opacity-25 transition-all flex-shrink-0"
          style={{ color: '#9b6fd4' }}>
          <Repeat2 size={10} />{isSeq ? '…' : 'Drip'}
        </button>
        <button onClick={() => onEnrich(lead)} disabled={isEnr}
          title={leadAny.ownerName ? `Owner: ${leadAny.ownerName} (${leadAny.enrichmentConfidence})` : 'Find owner name + contact info'}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium border border-[#1e2218] hover:border-[#2e3828] disabled:opacity-25 transition-all flex-shrink-0"
          style={{ color: leadAny.ownerName ? '#c8f135' : '#4a5a3a' }}>
          <Sparkles size={10} />{isEnr ? '…' : leadAny.ownerName ? '✓' : 'Find'}
        </button>
        <button onClick={() => onDeepEnrich(lead)} disabled={isDeep}
          title={leadAny.ownerIncomeRange
            ? `Income tier: ${leadAny.ownerIncomeRange} · ${leadAny.ownerLegalName ?? 'no SoS'}`
            : 'Deep lookup: SoS legal owner + news/wealth signals (NY/TX only)'}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium border border-[#1e2218] hover:border-[#2e3828] disabled:opacity-25 transition-all flex-shrink-0"
          style={{ color: leadAny.ownerIncomeRange ? '#d4dfc4' : '#4a5a3a' }}>
          <Layers size={10} />{isDeep ? '…' : leadAny.ownerIncomeRange ? leadAny.ownerIncomeRange : 'Deep'}
        </button>
      </div>
    </div>
  )
}

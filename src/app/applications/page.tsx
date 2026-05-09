'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  CheckCircle, XCircle, Clock, RefreshCw, Phone, Mail, MapPin,
  Briefcase, MessageSquare, ChevronDown, ChevronRight, DollarSign,
  Trash2, Copy, ExternalLink,
} from 'lucide-react'
import Sidebar from '@/components/Sidebar'

interface Application {
  id: string
  name: string
  phone: string
  email: string | null
  state: string | null
  hoursPerWeek: number | null
  experience: string | null
  whyJoin: string | null
  referralSource: string | null
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  reviewNotes: string | null
  paymentLink: string | null
  reviewedAt: string | null
  paidAt: string | null
  workerId: string | null
  createdAt: string
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:  { bg: '#2a1f0a', color: '#d4a44a', label: 'Pending review' },
  approved: { bg: '#0d2218', color: '#c8f135', label: 'Approved · awaiting payment' },
  paid:     { bg: '#0d2218', color: '#c8f135', label: 'Paid · active worker' },
  rejected: { bg: '#2a0d0d', color: '#d45a5a', label: 'Rejected' },
}

const EXP_LABEL: Record<string, string> = {
  none: 'None',
  some: 'Some',
  lots: 'Lots',
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'paid' | 'rejected'>('pending')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [actingId, setActingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchApps = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/apply')
    if (res.ok) setApps(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchApps() }, [fetchApps])

  async function review(id: string, action: 'approve' | 'reject', notes?: string) {
    setActingId(id)
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, notes }),
    })
    const data = await res.json()
    if (res.ok) {
      showToast(action === 'approve' ? 'Approved! Payment link sent via SMS.' : 'Application rejected.')
      await fetchApps()
    } else {
      showToast(data.error ?? 'Action failed', false)
    }
    setActingId(null)
  }

  async function deleteApp(id: string) {
    if (!confirm('Delete this application permanently?')) return
    await fetch(`/api/applications/${id}`, { method: 'DELETE' })
    await fetchApps()
    showToast('Application deleted.')
  }

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)
  const counts = {
    pending:  apps.filter(a => a.status === 'pending').length,
    approved: apps.filter(a => a.status === 'approved').length,
    paid:     apps.filter(a => a.status === 'paid').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#0d0e0b', color: '#d4dfc4' }}>
      <Sidebar />

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

      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2218]">
          <div>
            <h1 className="font-bold text-white text-base">Applications</h1>
            <p className="text-xs mt-0.5" style={{ color: '#4a5a3a' }}>Review candidates · Approve sends a $5 activation SMS</p>
          </div>
          <button onClick={fetchApps}
            className="p-2 rounded-lg border border-[#1e2218] hover:border-[#2e3828] transition-colors"
            style={{ color: '#4a5a3a' }}>
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {([
              ['pending',  `Pending · ${counts.pending}`,  '#d4a44a'],
              ['approved', `Approved · ${counts.approved}`, '#c8f135'],
              ['paid',     `Paid · ${counts.paid}`,         '#c8f135'],
              ['rejected', `Rejected · ${counts.rejected}`, '#d45a5a'],
              ['all',      `All · ${apps.length}`,          '#6b7a5a'],
            ] as const).map(([k, label, color]) => (
              <button key={k} onClick={() => setFilter(k)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                style={{
                  background: filter === k ? `${color}18` : 'transparent',
                  borderColor: filter === k ? `${color}50` : '#1e2218',
                  color: filter === k ? color : '#6b7a5a',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Applications list */}
          {loading ? (
            <p className="text-center text-sm py-12" style={{ color: '#3a4a2a' }}>Loading…</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-[#1e2218] p-12 text-center" style={{ background: '#111310' }}>
              <Clock size={32} style={{ color: '#3a4a2a' }} className="mx-auto mb-3" />
              <p className="text-sm" style={{ color: '#4a5a3a' }}>No applications in this view.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(app => (
                <ApplicationRow
                  key={app.id}
                  app={app}
                  expanded={expandedId === app.id}
                  acting={actingId === app.id}
                  onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
                  onApprove={() => review(app.id, 'approve')}
                  onReject={() => review(app.id, 'reject')}
                  onDelete={() => deleteApp(app.id)}
                  onCopyLink={(link) => {
                    navigator.clipboard.writeText(link)
                    showToast('Payment link copied!')
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function ApplicationRow({
  app, expanded, acting, onToggle, onApprove, onReject, onDelete, onCopyLink,
}: {
  app: Application; expanded: boolean; acting: boolean
  onToggle: () => void; onApprove: () => void; onReject: () => void; onDelete: () => void
  onCopyLink: (l: string) => void
}) {
  const status = STATUS_STYLE[app.status] ?? STATUS_STYLE.pending
  const ageDays = Math.floor((Date.now() - new Date(app.createdAt).getTime()) / 86_400_000)
  const ageLabel = ageDays === 0 ? 'today' : ageDays === 1 ? 'yesterday' : `${ageDays}d ago`

  return (
    <div className="rounded-xl border border-[#1e2218] overflow-hidden" style={{ background: '#111310' }}>
      {/* Summary bar */}
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#ffffff03] transition-colors">
        <div className="flex items-center gap-4 min-w-0">
          {expanded ? <ChevronDown size={14} style={{ color: '#4a5a3a' }} /> : <ChevronRight size={14} style={{ color: '#4a5a3a' }} />}
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{app.name}</p>
            <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: '#4a5a3a' }}>
              <span>{app.phone}</span>
              {app.state && <span>· {app.state}</span>}
              {app.hoursPerWeek && <span>· {app.hoursPerWeek}+ hrs/wk</span>}
              <span>· {ageLabel}</span>
            </div>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ background: status.bg, color: status.color }}>
          {status.label}
        </span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-[#1a1e14] space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm pt-4">
            <div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#3a4a2a' }}>Contact</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2"><Phone size={11} style={{ color: '#6b7a5a' }} /><span className="text-white text-sm">{app.phone}</span></div>
                {app.email && <div className="flex items-center gap-2"><Mail size={11} style={{ color: '#6b7a5a' }} /><span className="text-white text-sm">{app.email}</span></div>}
                {app.state && <div className="flex items-center gap-2"><MapPin size={11} style={{ color: '#6b7a5a' }} /><span className="text-white text-sm">{app.state}</span></div>}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#3a4a2a' }}>Profile</p>
              <div className="space-y-1.5">
                {app.hoursPerWeek && <div className="flex items-center gap-2"><Clock size={11} style={{ color: '#6b7a5a' }} /><span className="text-white text-sm">{app.hoursPerWeek} hrs/week</span></div>}
                {app.experience && <div className="flex items-center gap-2"><Briefcase size={11} style={{ color: '#6b7a5a' }} /><span className="text-white text-sm">{EXP_LABEL[app.experience] ?? app.experience} sales experience</span></div>}
                {app.referralSource && <div className="flex items-center gap-2"><MessageSquare size={11} style={{ color: '#6b7a5a' }} /><span className="text-white text-sm capitalize">via {app.referralSource}</span></div>}
              </div>
            </div>
          </div>

          {app.whyJoin && (
            <div>
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#3a4a2a' }}>Why they want to join</p>
              <p className="text-sm leading-relaxed p-3 rounded-lg" style={{ color: '#d4dfc4', background: '#0d0e0b', border: '1px solid #1e2218' }}>
                {app.whyJoin}
              </p>
            </div>
          )}

          {app.paymentLink && (app.status === 'approved' || app.status === 'paid') && (
            <div>
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#3a4a2a' }}>Activation link</p>
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}>
                <DollarSign size={13} style={{ color: '#c8f135' }} />
                <span className="text-xs flex-1 truncate font-mono" style={{ color: '#a0b080' }}>{app.paymentLink}</span>
                <button onClick={() => onCopyLink(app.paymentLink!)}
                  className="p-1.5 rounded-md hover:bg-[#ffffff06] transition-colors"
                  title="Copy link" style={{ color: '#6b7a5a' }}>
                  <Copy size={12} />
                </button>
                <a href={app.paymentLink} target="_blank"
                  className="p-1.5 rounded-md hover:bg-[#ffffff06] transition-colors"
                  title="Open" style={{ color: '#6b7a5a' }}>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}

          {/* Actions */}
          {app.status === 'pending' && (
            <div className="flex items-center gap-2 pt-2">
              <button onClick={onApprove} disabled={acting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-40"
                style={{ background: '#c8f135', color: '#0d0e0b' }}>
                <CheckCircle size={13} /> {acting ? 'Sending…' : 'Approve & send link'}
              </button>
              <button onClick={onReject} disabled={acting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-40"
                style={{ borderColor: '#401515', color: '#d45a5a' }}>
                <XCircle size={13} /> Reject
              </button>
              <button onClick={onDelete}
                className="ml-auto p-2 rounded-lg border border-[#1e2218] hover:border-[#3a4a2a] transition-colors"
                title="Delete" style={{ color: '#3a4a2a' }}>
                <Trash2 size={12} />
              </button>
            </div>
          )}
          {app.status !== 'pending' && (
            <div className="flex items-center gap-2 pt-2 text-xs" style={{ color: '#3a4a2a' }}>
              {app.reviewedAt && <span>Reviewed {new Date(app.reviewedAt).toLocaleDateString()}</span>}
              {app.paidAt && <span>· Paid {new Date(app.paidAt).toLocaleDateString()}</span>}
              <button onClick={onDelete}
                className="ml-auto p-2 rounded-lg border border-[#1e2218] hover:border-[#3a4a2a] transition-colors"
                title="Delete" style={{ color: '#3a4a2a' }}>
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

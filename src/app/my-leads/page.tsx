'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, MessageSquare, PhoneCall, CheckCircle, Globe, LogOut, Phone } from 'lucide-react'
import type { Lead } from '@/types'
import { formatPhone } from '@/lib/utils'

interface Toast { id: number; message: string; ok: boolean }

export default function MyLeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [callingId, setCallingId] = useState<string | null>(null)
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [calledIds, setCalledIds] = useState<Set<string>>(new Set())
  const [toasts, setToasts] = useState<Toast[]>([])
  const [workerName, setWorkerName] = useState('')

  function addToast(message: string, ok = true) {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, ok }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  useEffect(() => {
    fetch('/api/leads').then(r => r.json()).then(data => { setLeads(data); setLoading(false) })
    // Get name from cookie (non-httpOnly part isn't available — use a whoami endpoint instead)
    fetch('/api/auth/whoami').then(r => r.ok ? r.json() : null).then(d => { if (d?.name) setWorkerName(d.name) })
  }, [])

  async function handleSms(lead: Lead) {
    if (!lead.phone) return
    setSendingId(lead.id)
    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      })
      if (res.ok) { setSentIds(prev => new Set(prev).add(lead.id)); addToast(`SMS sent to ${lead.name}`) }
      else { addToast('SMS failed', false) }
    } catch { addToast('SMS failed', false) }
    setSendingId(null)
  }

  async function handleCall(lead: Lead) {
    if (!lead.phone) return
    setCallingId(lead.id)
    await fetch('/api/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: lead.id }),
    })
    setCalledIds(prev => new Set(prev).add(lead.id))
    setCallingId(null)
    addToast(`Call initiated to ${lead.name}`)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className="min-h-screen" style={{ background: '#0d0e0b', color: '#d4dfc4' }}>

      {/* Header */}
      <div className="border-b border-[#1e2218] px-6 py-4 flex items-center justify-between sticky top-0 z-10"
           style={{ background: '#0d0e0b' }}>
        <div>
          <span className="font-black text-lg" style={{ color: '#c8f135' }}>Can<span className="text-white">vass</span></span>
          {workerName && <span className="text-sm ml-3" style={{ color: '#4a5a3a' }}>Welcome, {workerName}</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-white">{leads.length} leads assigned</p>
            <p className="text-xs" style={{ color: '#4a5a3a' }}>
              {leads.filter(l => sentIds.has(l.id)).size ?? [...sentIds].filter(id => leads.find(l => l.id === id)).length} SMS sent · {[...calledIds].filter(id => leads.find(l => l.id === id)).length} called
            </p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-[#1e2218] transition-colors hover:border-[#2e3828]"
            style={{ color: '#4a5a3a' }}>
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#c8f135' }} />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white font-bold text-lg mb-2">No leads assigned yet</p>
            <p className="text-sm" style={{ color: '#3a4a2a' }}>Your admin will assign leads to you soon.</p>
          </div>
        ) : leads.map(lead => (
          <div key={lead.id}
            className="rounded-xl border border-[#1e2218] p-5"
            style={{ background: '#111310' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-bold text-white">{lead.name}</p>
                  {lead.site && <CheckCircle size={13} style={{ color: '#c8f135' }} />}
                </div>
                <p className="text-sm" style={{ color: '#4a5a3a' }}>
                  {[lead.category, lead.city].filter(Boolean).join(' · ')}
                </p>
                {lead.phone && (
                  <a href={`tel:${lead.phone}`}
                    className="flex items-center gap-1 mt-1.5 text-sm"
                    style={{ color: '#6b7a5a', textDecoration: 'none' }}>
                    <Phone size={12} />{formatPhone(lead.phone)}
                  </a>
                )}
                {lead.rating && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star size={11} fill="#c8f135" stroke="none" />
                    <span className="text-sm font-bold text-white">{lead.rating}</span>
                    <span className="text-xs" style={{ color: '#2a3a1a' }}>({lead.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                {lead.site && (
                  <a href={`/preview/${lead.slug}`} target="_blank"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#1e2218]"
                    style={{ color: '#c8f135', textDecoration: 'none' }}>
                    <Globe size={11} /> View Site
                  </a>
                )}
                <button onClick={() => handleSms(lead)}
                  disabled={sendingId === lead.id || !lead.phone}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40"
                  style={sentIds.has(lead.id)
                    ? { background: '#0d2218', color: '#c8f135', borderColor: '#1a3520' }
                    : { background: 'transparent', color: '#6b7a5a', borderColor: '#1e2218' }}>
                  <MessageSquare size={11} />
                  {sendingId === lead.id ? '…' : sentIds.has(lead.id) ? 'SMS Sent' : 'Send SMS'}
                </button>
                <button onClick={() => handleCall(lead)}
                  disabled={callingId === lead.id || !lead.phone}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40"
                  style={calledIds.has(lead.id)
                    ? { background: '#131a2e', color: '#4a9eff', borderColor: '#1d2840' }
                    : { background: 'transparent', color: '#6b7a5a', borderColor: '#1e2218' }}>
                  <PhoneCall size={11} />
                  {callingId === lead.id ? '…' : calledIds.has(lead.id) ? 'Called' : 'Call'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium pointer-events-auto"
            style={{ background: t.ok ? '#0d2218' : '#2a0d0d', color: t.ok ? '#c8f135' : '#d45a5a', border: `1px solid ${t.ok ? '#1a3520' : '#401515'}` }}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}

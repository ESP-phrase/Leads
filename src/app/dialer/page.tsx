'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import {
  Phone, PhoneMissed, PhoneCall, Star, MapPin,
  SkipForward, RefreshCw, CheckCircle, XCircle, Voicemail,
  MessageSquare, X, ChevronRight,
} from 'lucide-react'
import type { Lead, LeadStatus } from '@/types'
import { formatPhone } from '@/lib/utils'
import Sidebar from '@/components/Sidebar'

const DIAL_STATUSES: LeadStatus[] = ['FOUND', 'CALLED']

const OUTCOMES: { label: string; status: LeadStatus; icon: React.ElementType; style: string }[] = [
  { label: 'Voicemail',      status: 'CALLED',         icon: Voicemail,    style: 'border-[#2a2e20] text-[#6b7a5a] hover:border-[#3a4a2a] hover:text-[#a0b080]' },
  { label: 'No Answer',      status: 'CALLED',         icon: PhoneMissed,  style: 'border-[#2a2e20] text-[#6b7a5a] hover:border-[#3a4a2a] hover:text-[#a0b080]' },
  { label: 'Not Interested', status: 'NOT_INTERESTED', icon: XCircle,      style: 'border-[#401515] text-[#d45a5a] hover:border-[#601515]' },
  { label: 'Interested',     status: 'INTERESTED',     icon: CheckCircle,  style: 'border-[#1a3520] text-[#c8f135] hover:border-[#2a5530]' },
]

type Toast = { id: number; msg: string; ok: boolean }

export default function DialerPage() {
  const [queue, setQueue] = useState<Lead[]>([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [callState, setCallState] = useState<'idle' | 'calling' | 'ok' | 'error'>('idle')
  const [note, setNote] = useState('')
  const [smsOpen, setSmsOpen] = useState(false)
  const [smsText, setSmsText] = useState('')
  const [smsSending, setSmsSending] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  const toast = useCallback((msg: string, ok = true) => {
    const id = ++toastId.current
    setToasts(t => [...t, { id, msg, ok }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  const fetchQueue = useCallback(async () => {
    setLoading(true)
    setCallState('idle')
    const res = await fetch('/api/leads')
    const all: Lead[] = await res.json()
    setQueue(all.filter(l => DIAL_STATUSES.includes(l.status) && l.phone))
    setIndex(0)
    setLoading(false)
  }, [])

  useEffect(() => { fetchQueue() }, [fetchQueue])

  const current = queue[index] ?? null
  const progress = queue.length > 0 ? Math.round((index / queue.length) * 100) : 0

  function advance() {
    setNote('')
    setSmsOpen(false)
    setSmsText('')
    setCallState('idle')
    setIndex(i => i + 1)
  }

  async function handleOutcome(status: LeadStatus) {
    if (!current) return
    await fetch(`/api/leads/${current.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...(note.trim() && { notes: note.trim() }) }),
    })
    // Update local queue so status is reflected
    setQueue(q => q.map((l, i) => i === index ? { ...l, status } : l))
    if (status === 'INTERESTED') {
      setSmsOpen(true)
    } else {
      advance()
    }
  }

  async function handleCall() {
    if (!current) return
    setCallState('calling')
    try {
      const res = await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: current.id }),
      })
      const data = await res.json()
      if (!res.ok || data.callStatus === 'failed') {
        throw new Error(data.error ?? 'Call failed')
      }
      setCallState('ok')
      setQueue(q => q.map((l, i) => i === index ? { ...l, status: 'CALLED' } : l))
      toast(`Calling ${formatPhone(current.phone!)}…`)
    } catch (err: unknown) {
      setCallState('error')
      toast(err instanceof Error ? err.message : 'Call failed', false)
    }
  }

  async function handleSms() {
    if (!current || !smsText.trim()) return
    setSmsSending(true)
    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: current.id, message: smsText.trim() }),
      })
      if (!res.ok) throw new Error('SMS failed')
      toast('SMS sent!')
      advance()
    } catch {
      toast('SMS failed to send', false)
    } finally {
      setSmsSending(false)
    }
  }

  return (
    <div className="flex min-h-screen pb-20 md:pb-0" style={{ background: '#0d0e0b', color: '#d4dfc4' }}>
      <Sidebar />

      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className="px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl pointer-events-auto"
            style={{
              background: t.ok ? '#1a3020' : '#3a1515',
              color: t.ok ? '#c8f135' : '#f07070',
              border: `1px solid ${t.ok ? '#2a5030' : '#5a2020'}`,
            }}>
            {t.msg}
          </div>
        ))}
      </div>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2218]">
          <div>
            <h1 className="font-bold text-white text-base flex items-center gap-2">
              <PhoneCall size={15} style={{ color: '#c8f135' }} /> DialFlow
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#4a5a3a' }}>Auto-advance call queue</p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xl font-black text-white">{Math.max(0, queue.length - index)}</span>
              <span className="text-xs ml-1.5" style={{ color: '#4a5a3a' }}>remaining</span>
            </div>
            <div>
              <span className="text-xl font-black" style={{ color: '#c8f135' }}>{index}</span>
              <span className="text-xs ml-1.5" style={{ color: '#4a5a3a' }}>called</span>
            </div>
            <div className="w-32">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1e2218' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: '#c8f135' }} />
              </div>
              <p className="text-xs mt-1" style={{ color: '#3a4a2a' }}>{progress}%</p>
            </div>
            <button onClick={fetchQueue} className="p-2 rounded-lg border border-[#1e2218] hover:border-[#2e3828] transition-colors" style={{ color: '#4a5a3a' }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Queue list */}
          <div className="w-64 flex-shrink-0 flex flex-col overflow-y-auto border-r border-[#1e2218]" style={{ background: '#0f1009' }}>
            <div className="px-4 py-3 border-b border-[#1e2218]">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3a4a2a' }}>Queue</p>
            </div>
            {loading ? (
              <p className="text-center text-xs py-8" style={{ color: '#2a3a1a' }}>Loading…</p>
            ) : queue.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Phone size={28} className="mx-auto mb-3" style={{ color: '#1e2a14' }} />
                <p className="text-sm" style={{ color: '#3a4a2a' }}>No leads to call</p>
                <a href="/leads" className="text-xs mt-2 block" style={{ color: '#c8f135' }}>Find leads →</a>
              </div>
            ) : queue.map((lead, i) => (
              <button key={lead.id} onClick={() => { setIndex(i); setCallState('idle'); setNote(''); setSmsOpen(false) }}
                className="w-full text-left px-4 py-3 border-b border-[#161a11] transition-colors"
                style={{
                  background: i === index ? '#c8f13510' : 'transparent',
                  borderLeft: i === index ? '2px solid #c8f135' : '2px solid transparent',
                  opacity: i < index ? 0.35 : 1,
                }}>
                <p className="text-sm font-medium text-white truncate">{lead.name}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: '#4a5a3a' }}>
                  {lead.phone ? formatPhone(lead.phone) : 'No phone'}
                </p>
                {lead.status === 'INTERESTED' && (
                  <span className="text-xs mt-1 inline-block px-1.5 py-0.5 rounded" style={{ background: '#c8f13520', color: '#c8f135' }}>Interested</span>
                )}
              </button>
            ))}
          </div>

          {/* Active lead */}
          <div className="flex-1 flex items-start justify-center pt-12 px-8 overflow-y-auto">
            {loading ? null : !current ? (
              <div className="text-center">
                <CheckCircle size={44} style={{ color: '#c8f135' }} className="mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Queue complete</h2>
                <p className="text-sm mb-6" style={{ color: '#4a5a3a' }}>All {queue.length} leads called.</p>
                <button onClick={fetchQueue}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-[#1e2218] hover:border-[#2e3828] mx-auto transition-colors"
                  style={{ color: '#6b7a5a' }}>
                  <RefreshCw size={13} /> Reload queue
                </button>
              </div>
            ) : (
              <div className="w-full max-w-sm pb-12">
                {/* Lead card */}
                <div className="rounded-2xl border border-[#1e2218] p-6 mb-4" style={{ background: '#111310' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-black text-white">{current.name}</h2>
                      <p className="text-sm mt-0.5" style={{ color: '#4a5a3a' }}>
                        {[current.city, current.category].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    {current.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={14} fill="#c8f135" stroke="none" />
                        <span className="font-black text-white">{current.rating}</span>
                        <span className="text-xs" style={{ color: '#3a4a2a' }}>({current.reviewCount})</span>
                      </div>
                    )}
                  </div>

                  {current.phone && (
                    <div className="rounded-xl p-4 mb-4 flex items-center justify-between" style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}>
                      <div className="flex items-center gap-3">
                        <Phone size={16} style={{ color: '#c8f135' }} />
                        <span className="font-mono font-bold text-white text-lg">{formatPhone(current.phone)}</span>
                      </div>
                      <a href={`tel:${current.phone}`}
                         className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                         style={{ background: '#c8f135', color: '#0d0e0b' }}>
                        <Phone size={13} /> Call
                      </a>
                    </div>
                  )}

                  {current.address && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#4a5a3a' }}>
                      <MapPin size={12} /><span>{current.address}</span>
                    </div>
                  )}
                  {current.notes && (
                    <div className="mt-3 px-3 py-2 rounded-lg text-xs" style={{ background: '#2a1f0a', color: '#d4a44a', border: '1px solid #3a2d10' }}>
                      {current.notes}
                    </div>
                  )}
                </div>

                {/* Call button */}
                <button onClick={handleCall}
                  disabled={callState === 'calling'}
                  className="w-full flex items-center justify-center gap-2 py-3 mb-4 rounded-xl text-sm font-medium border transition-all disabled:opacity-50"
                  style={{
                    border: `1px solid ${callState === 'ok' ? '#2a5030' : callState === 'error' ? '#501515' : '#1e2218'}`,
                    color: callState === 'ok' ? '#c8f135' : callState === 'error' ? '#f07070' : '#6b7a5a',
                    background: callState === 'ok' ? '#c8f13508' : 'transparent',
                  }}>
                  <PhoneCall size={15} />
                  {callState === 'calling' ? 'Connecting…'
                    : callState === 'ok' ? 'Call initiated ✓'
                    : callState === 'error' ? 'Failed — retry?'
                    : 'Auto-call'}
                </button>

                {/* Outcomes */}
                <p className="text-xs mb-2 text-center" style={{ color: '#3a4a2a' }}>Log outcome</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {OUTCOMES.map(({ label, status, icon: Icon, style }) => (
                    <button key={label} onClick={() => handleOutcome(status)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-colors ${style}`}>
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>

                <button onClick={advance}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm transition-colors"
                  style={{ color: '#3a4a2a' }}>
                  <SkipForward size={13} /> Skip
                </button>

                {/* Note */}
                <div className="mt-4">
                  <textarea value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Add a note…" rows={2}
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540] resize-none"
                    style={{ background: '#111310', border: '1px solid #1e2218' }} />
                </div>

                <p className="text-center text-xs mt-3" style={{ color: '#2a3a1a' }}>
                  {index + 1} of {queue.length}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* SMS panel — slides in when Interested */}
      {smsOpen && current && (
        <div className="w-80 flex-shrink-0 border-l border-[#1e2218] flex flex-col" style={{ background: '#111310' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2218]">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} style={{ color: '#c8f135' }} />
              <span className="text-sm font-semibold text-white">Send Follow-up SMS</span>
            </div>
            <button onClick={() => { setSmsOpen(false); advance() }} style={{ color: '#4a5a3a' }}>
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 flex flex-col p-5 gap-4">
            <div>
              <p className="text-xs mb-1" style={{ color: '#4a5a3a' }}>To</p>
              <p className="text-sm font-mono text-white">{formatPhone(current.phone!)}</p>
              <p className="text-xs mt-0.5" style={{ color: '#3a4a2a' }}>{current.name}</p>
            </div>

            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color: '#4a5a3a' }}>Message</p>
              <textarea
                value={smsText}
                onChange={e => setSmsText(e.target.value)}
                rows={6}
                placeholder={`Hey, this is [your name] — you mentioned you might be interested in upgrading your online presence for ${current.name}. Want me to send over a quick preview?`}
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540] resize-none h-40"
                style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}
              />
              <p className="text-xs mt-1 text-right" style={{ color: '#3a4a2a' }}>{smsText.length}/160</p>
            </div>

            <button onClick={handleSms} disabled={smsSending || !smsText.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              style={{ background: '#c8f135', color: '#0d0e0b' }}>
              <MessageSquare size={14} />
              {smsSending ? 'Sending…' : 'Send SMS'}
            </button>

            <button onClick={() => { setSmsOpen(false); advance() }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm"
              style={{ color: '#3a4a2a' }}>
              <ChevronRight size={13} /> Skip SMS, next lead
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

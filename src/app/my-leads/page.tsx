'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, MessageSquare, PhoneCall, CheckCircle, Globe, LogOut, Phone, Copy, Users, DollarSign, Link2, ChevronDown, ChevronUp } from 'lucide-react'
import Logo from '@/components/Logo'
import type { Lead } from '@/types'
import { formatPhone } from '@/lib/utils'

interface Toast { id: number; message: string; ok: boolean }

interface Recruit {
  id: string
  name: string
  joinedAt: string
  closedDeals: number
  theirEarnings: number
  yourCut: number
}

interface ReferralData {
  referralCode: string | null
  referralCount: number
  recruits: Recruit[]
  totalReferralEarnings: number
  referralPct: number
}

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
  const [referral, setReferral] = useState<ReferralData | null>(null)
  const [showRecruits, setShowRecruits] = useState(false)
  const [copied, setCopied] = useState(false)

  function addToast(message: string, ok = true) {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, ok }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  useEffect(() => {
    fetch('/api/leads').then(r => r.json()).then(data => { setLeads(data); setLoading(false) })
    fetch('/api/auth/whoami').then(r => r.ok ? r.json() : null).then(d => { if (d?.name) setWorkerName(d.name) })
    fetch('/api/workers/referral').then(r => r.ok ? r.json() : null).then(d => { if (d?.referralCode !== undefined) setReferral(d) })
  }, [])

  async function handleSms(lead: Lead) {
    if (!lead.phone) return
    setSendingId(lead.id)
    try {
      const res = await fetch('/api/sms', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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
    await fetch('/api/call', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId: lead.id }) })
    setCalledIds(prev => new Set(prev).add(lead.id))
    setCallingId(null)
    addToast(`Call initiated to ${lead.name}`)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  function copyReferralLink() {
    if (!referral?.referralCode) return
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin
    navigator.clipboard.writeText(`${baseUrl}/join?ref=${referral.referralCode}`)
    setCopied(true)
    addToast('Referral link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const referralLink = referral?.referralCode
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/join?ref=${referral.referralCode}`
    : null

  return (
    <div className="min-h-screen" style={{ background: '#0d0e0b', color: '#d4dfc4' }}>

      {/* Header */}
      <div className="border-b border-[#1e2218] px-6 py-4 flex items-center justify-between sticky top-0 z-10"
           style={{ background: '#0d0e0b' }}>
        <div>
          <Logo size={24} textSize="md" />
          {workerName && <span className="text-sm ml-3" style={{ color: '#4a5a3a' }}>Welcome, {workerName}</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-white">{leads.length} leads assigned</p>
            <p className="text-xs" style={{ color: '#4a5a3a' }}>
              {[...sentIds].filter(id => leads.find(l => l.id === id)).length} SMS sent · {[...calledIds].filter(id => leads.find(l => l.id === id)).length} called
            </p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-[#1e2218] transition-colors hover:border-[#2e3828]"
            style={{ color: '#4a5a3a' }}>
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-4">

        {/* ── Referral Card ── */}
        {referral && (
          <div className="rounded-xl border border-[#c8f13525] overflow-hidden" style={{ background: '#111310' }}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#1e2218]" style={{ background: 'linear-gradient(135deg, #c8f13508, transparent)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#c8f13520' }}>
                    <Link2 size={14} style={{ color: '#c8f135' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Invite & Earn 15%</p>
                    <p className="text-xs" style={{ color: '#4a5a3a' }}>
                      Get 15% of every sale your recruits close — forever
                    </p>
                  </div>
                </div>
                {referral.totalReferralEarnings > 0 && (
                  <div className="text-right">
                    <p className="text-lg font-black" style={{ color: '#c8f135' }}>${referral.totalReferralEarnings}</p>
                    <p className="text-xs" style={{ color: '#4a5a3a' }}>referral earnings</p>
                  </div>
                )}
              </div>
            </div>

            {/* Link + stats */}
            <div className="p-5 space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Your code', value: referral.referralCode ?? '—', icon: Link2, color: '#c8f135' },
                  { label: 'Recruits', value: referral.referralCount, icon: Users, color: '#4a9eff' },
                  { label: 'Earned', value: `$${referral.totalReferralEarnings}`, icon: DollarSign, color: '#c8f135' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="rounded-lg p-3 text-center" style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}>
                    <Icon size={13} style={{ color, margin: '0 auto 4px' }} />
                    <p className="text-base font-black" style={{ color }}>{value}</p>
                    <p className="text-xs" style={{ color: '#3a4a2a' }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Referral link */}
              {referralLink && (
                <div>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#3a4a2a' }}>Your invite link</p>
                  <div className="flex gap-2">
                    <div className="flex-1 rounded-lg px-3 py-2.5 text-xs font-mono truncate"
                         style={{ background: '#0d0e0b', border: '1px solid #1e2218', color: '#6b7a5a' }}>
                      {referralLink}
                    </div>
                    <button onClick={copyReferralLink}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex-shrink-0"
                      style={copied
                        ? { background: '#0d2218', color: '#c8f135', border: '1px solid #1a3520' }
                        : { background: '#c8f135', color: '#0d0e0b' }}>
                      <Copy size={11} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#2a3a1a' }}>
                    Share this link. When someone applies and gets approved, you earn 15% of every sale they close.
                  </p>
                </div>
              )}

              {/* Recruits list toggle */}
              {referral.referralCount > 0 && (
                <div>
                  <button
                    onClick={() => setShowRecruits(v => !v)}
                    className="flex items-center gap-1.5 text-xs font-semibold w-full py-2 border-t border-[#1e2218] mt-2 pt-3"
                    style={{ color: '#4a5a3a' }}>
                    <Users size={12} />
                    Your {referral.referralCount} recruit{referral.referralCount !== 1 ? 's' : ''}
                    {showRecruits ? <ChevronUp size={12} className="ml-auto" /> : <ChevronDown size={12} className="ml-auto" />}
                  </button>

                  {showRecruits && (
                    <div className="mt-2 space-y-2">
                      {referral.recruits.map(r => (
                        <div key={r.id} className="flex items-center justify-between rounded-lg px-3 py-2.5"
                             style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}>
                          <div>
                            <p className="text-sm font-semibold text-white">{r.name}</p>
                            <p className="text-xs" style={{ color: '#3a4a2a' }}>
                              {r.closedDeals} deal{r.closedDeals !== 1 ? 's' : ''} closed · joined {new Date(r.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black" style={{ color: r.yourCut > 0 ? '#c8f135' : '#3a4a2a' }}>
                              +${r.yourCut}
                            </p>
                            <p className="text-xs" style={{ color: '#2a3a1a' }}>your cut</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Lead list ── */}
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
          <div key={lead.id} className="rounded-xl border border-[#1e2218] p-5" style={{ background: '#111310' }}>
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
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1 mt-1.5 text-sm" style={{ color: '#6b7a5a', textDecoration: 'none' }}>
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
                <button onClick={() => handleSms(lead)} disabled={sendingId === lead.id || !lead.phone}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40"
                  style={sentIds.has(lead.id)
                    ? { background: '#0d2218', color: '#c8f135', borderColor: '#1a3520' }
                    : { background: 'transparent', color: '#6b7a5a', borderColor: '#1e2218' }}>
                  <MessageSquare size={11} />
                  {sendingId === lead.id ? '…' : sentIds.has(lead.id) ? 'SMS Sent' : 'Send SMS'}
                </button>
                <button onClick={() => handleCall(lead)} disabled={callingId === lead.id || !lead.phone}
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

'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Tag, Star, ChevronRight, Globe, X, CheckCircle, MessageSquare, PhoneCall } from 'lucide-react'
import type { Lead } from '@/types'
import Sidebar from '@/components/Sidebar'
import { formatPhone } from '@/lib/utils'

const CATEGORIES = [
  // Home services
  'Plumber', 'Electrician', 'HVAC', 'Roofer', 'Painter', 'Handyman',
  'House cleaning', 'Landscaping', 'Pest control', 'Carpet cleaning',
  'Window cleaning', 'Pool service', 'Fence company', 'Garage door repair',
  // Auto
  'Auto repair shop', 'Auto detailer', 'Towing service', 'Auto body shop',
  'Oil change', 'Tire shop',
  // Health & Beauty
  'Barber shop', 'Nail salon', 'Hair salon', 'Massage therapy', 'Tattoo shop',
  'Spa', 'Dentist', 'Chiropractor', 'Optometrist',
  // Food & Hospitality
  'Restaurant', 'Food truck', 'Bakery', 'Coffee shop', 'Catering',
  // Fitness
  'Gym', 'Personal trainer', 'Yoga studio', 'Martial arts',
  // Professional
  'Accountant', 'Law firm', 'Real estate agent', 'Insurance agent',
  'Financial advisor', 'Marketing agency', 'IT support',
  // Retail & Other
  'Florist', 'Pet grooming', 'Dry cleaner', 'Photographer', 'Videographer',
  'Moving company', 'Storage facility', 'Printing shop', 'Tutoring',
]

type FeedItem =
  | { kind: 'lead'; lead: Lead; key: string }
  | { kind: 'skip'; name: string; reason: string; key: string }
interface Toast { id: number; message: string; ok: boolean }

export default function LeadsPage() {
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [minRating, setMinRating] = useState(4.0)
  const [minReviews, setMinReviews] = useState(10)
  const [loading, setLoading] = useState(false)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [started, setStarted] = useState(false)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [callingId, setCallingId] = useState<string | null>(null)
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [calledIds, setCalledIds] = useState<Set<string>>(new Set())
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [smsTemplate, setSmsTemplate] = useState('')
  const feedRef = useRef<HTMLDivElement>(null)

  const leads = feed.filter((i): i is Extract<FeedItem, { kind: 'lead' }> => i.kind === 'lead').map(i => i.lead)

  useEffect(() => {
    const el = feedRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [feed])

  function addToast(message: string, ok = true) {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, ok }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  async function handleSms(lead: Lead) {
    if (!lead.phone) return
    setSendingId(lead.id)
    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, message: smsTemplate.trim() || undefined }),
      })
      if (res.ok) {
        setSentIds(prev => new Set(prev).add(lead.id))
        addToast(`SMS sent to ${lead.name}`)
      } else {
        const { error } = await res.json().catch(() => ({ error: 'Unknown error' }))
        addToast(error ?? 'SMS failed', false)
      }
    } catch {
      addToast('SMS failed — check Twilio config', false)
    }
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
  }

  async function streamCategory(cat: string, controller: AbortController) {
    const res = await fetch('/api/leads/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: city.trim(), category: cat, minRating, minReviews }),
      signal: controller.signal,
    })
    if (!res.ok || !res.body) { setError('Request failed'); return }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done: streamDone, value } = await reader.read()
      if (streamDone) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        try {
          const event = JSON.parse(line.slice(6))
          if (event.type === 'lead') {
            setFeed(prev => [...prev, { kind: 'lead', lead: event.lead, key: event.lead.id }])
          } else if (event.type === 'skip' || event.type === 'existing') {
            setFeed(prev => [...prev, { kind: 'skip', name: event.lead?.name ?? event.name, reason: event.reason ?? 'duplicate', key: `skip-${Date.now()}-${Math.random()}` }])
          } else if (event.type === 'error') {
            setError(event.message)
          }
        } catch { /* malformed line */ }
      }
    }
  }

  async function handleScrape() {
    if (!city.trim() || !category) { setError('City and category are required'); return }

    setFeed([]); setDone(false); setError(null); setStarted(true)
    setLoading(true); setCurrentCategory(null)

    const controller = new AbortController()
    setAbortController(controller)

    const isAll = category.toLowerCase() === 'all' || category.toLowerCase() === 'all categories'
    const queue = isAll ? CATEGORIES : [category]

    try {
      for (const cat of queue) {
        if (controller.signal.aborted) break
        setCurrentCategory(cat)
        await streamCategory(cat, controller)
      }
    } catch (err: unknown) {
      if ((err as { name?: string }).name !== 'AbortError') {
        setError((err as Error).message)
      }
    }

    if (!controller.signal.aborted) setDone(true)
    setLoading(false)
  }

  const leadCount = leads.length
  const skipCount = feed.filter(i => i.kind === 'skip').length

  return (
    <div className="flex min-h-screen" style={{ background: '#0d0e0b', color: '#d4dfc4' }}>
      <Sidebar />
      <main className="flex-1 flex min-w-0">

        {/* Left: search form */}
        <div className="w-80 flex-shrink-0 border-r border-[#1e2218] flex flex-col" style={{ background: '#0f100d' }}>
          <div className="px-5 py-4 border-b border-[#1e2218]">
            <h1 className="font-bold text-white text-base">Find Leads</h1>
            <p className="text-xs mt-0.5" style={{ color: '#4a5a3a' }}>
              Search Google Places for businesses without websites
            </p>
          </div>

          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a5a3a' }}>
                <MapPin size={11} className="inline mr-1" />CITY
              </label>
              <input
                type="text" value={city}
                onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScrape()}
                placeholder="Austin, TX"
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540]"
                style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a5a3a' }}>
                <Tag size={11} className="inline mr-1" />CATEGORY
              </label>
              <input
                list="category-list"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Plumber, Barber, Restaurant…"
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540]"
                style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}
              />
              <datalist id="category-list">
                <option value="All Categories" />
                {CATEGORIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a5a3a' }}>
                  <Star size={11} className="inline mr-1" />MIN ★
                </label>
                <input type="number" value={minRating} min={1} max={5} step={0.5}
                  onChange={e => setMinRating(parseFloat(e.target.value))}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c8f13540]"
                  style={{ background: '#0d0e0b', border: '1px solid #1e2218' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a5a3a' }}>MIN REV.</label>
                <input type="number" value={minReviews} min={0}
                  onChange={e => setMinReviews(parseInt(e.target.value))}
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c8f13540]"
                  style={{ background: '#0d0e0b', border: '1px solid #1e2218' }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a5a3a' }}>
                <MessageSquare size={11} className="inline mr-1" />SMS MESSAGE
              </label>
              <textarea
                value={smsTemplate}
                onChange={e => setSmsTemplate(e.target.value)}
                placeholder="Leave blank to use the default preview link message…"
                rows={3}
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540] resize-none"
                style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}
              />
              <p className="text-xs mt-1" style={{ color: '#2a3a1a' }}>
                {smsTemplate.length > 0 ? `${smsTemplate.length} chars · custom` : 'Using default template'}
              </p>
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-lg text-xs" style={{ background: '#2a0d0d', color: '#d45a5a', border: '1px solid #401515' }}>
                {error}
              </div>
            )}

            {loading ? (
              <button
                onClick={() => { abortController?.abort(); setLoading(false) }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all"
                style={{ background: '#2a0d0d', color: '#d45a5a', border: '1px solid #401515' }}>
                <span className="w-2 h-2 rounded-sm bg-current" />
                Stop
              </button>
            ) : (
              <button onClick={handleScrape}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all"
                style={{ background: '#c8f135', color: '#0d0e0b' }}>
                <Search size={14} />
                Find Leads
              </button>
            )}

            {started && (
              <div className="space-y-1.5 pt-2 border-t border-[#1e2218]">
                {[
                  { label: 'Leads found', val: leadCount, color: '#c8f135' },
                  { label: 'Skipped',     val: skipCount, color: '#3a4a2a' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#3a4a2a' }}>{s.label}</span>
                    <span className="text-xs font-bold" style={{ color: s.color }}>{s.val}</span>
                  </div>
                ))}
              </div>
            )}

            {leads.length > 0 && (
              <a href="/dashboard"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-sm font-semibold border border-[#1e2218] hover:border-[#2e3828] transition-colors"
                style={{ color: '#c8f135', textDecoration: 'none' }}>
                View in pipeline <ChevronRight size={13} />
              </a>
            )}
          </div>
        </div>

        {/* Right: live feed */}
        <div className="flex-1 flex min-w-0">
          <div className="flex-1 flex flex-col min-w-0">
          {/* Progress bar */}
          {started && (
            <div className="border-b border-[#1e2218] px-6 py-3 flex items-center gap-4" style={{ background: '#111310' }}>
              {loading && (
                <div className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: '#c8f135' }} />
              )}
              <span className="text-xs font-mono flex-1 truncate" style={{ color: done ? '#c8f135' : '#4a5a3a' }}>
                {done
                  ? `Done — ${leadCount} leads, ${skipCount} skipped`
                  : currentCategory
                    ? `Scanning ${currentCategory}…`
                    : 'Starting…'}
              </span>
              <span className="text-xs flex-shrink-0" style={{ color: '#2a3a1a' }}>
                {leadCount} leads · {skipCount} skipped
              </span>
            </div>
          )}

          <div ref={feedRef} className="flex-1 overflow-y-auto p-6">
            {!started ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                     style={{ background: '#c8f13510', border: '1px solid #c8f13520' }}>
                  <Search size={28} style={{ color: '#c8f135' }} />
                </div>
                <p className="text-white font-bold text-lg mb-2">Find businesses without websites</p>
                <p className="text-sm max-w-sm" style={{ color: '#3a4a2a' }}>
                  Enter a city and category on the left. Leads appear here as they&apos;re found.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {feed.map(item => item.kind === 'lead' ? (
                  <div key={item.key}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 border border-[#1e2218] cursor-pointer"
                    onClick={() => setSelectedLead(item.lead)}
                    style={{ background: selectedLead?.id === item.lead.id ? '#181f12' : '#111310', animation: 'slideIn 0.15s ease-out', borderColor: selectedLead?.id === item.lead.id ? '#3a5020' : '#1e2218' }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                           style={{ background: '#c8f13515' }}>
                        <CheckCircle size={15} style={{ color: '#c8f135' }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{item.lead.name}</p>
                        <p className="text-xs truncate" style={{ color: '#4a5a3a' }}>
                          {[item.lead.category, item.lead.city].filter(Boolean).join(' · ')}
                          {item.lead.phone && <span className="ml-2">{formatPhone(item.lead.phone)}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4" onClick={e => e.stopPropagation()}>
                      {item.lead.rating && (
                        <div className="flex items-center gap-1 mr-1">
                          <Star size={11} fill="#c8f135" stroke="none" />
                          <span className="text-xs font-bold text-white">{item.lead.rating}</span>
                          <span className="text-xs" style={{ color: '#2a3a1a' }}>({item.lead.reviewCount})</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleSms(item.lead)}
                        disabled={sendingId === item.lead.id || !item.lead.phone}
                        title={!item.lead.phone ? 'No phone number' : 'Send SMS'}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40"
                        style={sentIds.has(item.lead.id)
                          ? { background: '#0d2218', color: '#c8f135', borderColor: '#1a3520' }
                          : { background: 'transparent', color: '#6b7a5a', borderColor: '#1e2218' }}
                      >
                        <MessageSquare size={11} />
                        {sendingId === item.lead.id ? '…' : sentIds.has(item.lead.id) ? 'Sent' : 'SMS'}
                      </button>
                      <button
                        onClick={() => handleCall(item.lead)}
                        disabled={callingId === item.lead.id || !item.lead.phone}
                        title={!item.lead.phone ? 'No phone number' : 'Call via Twilio'}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40"
                        style={calledIds.has(item.lead.id)
                          ? { background: '#131a2e', color: '#4a9eff', borderColor: '#1d2840' }
                          : { background: 'transparent', color: '#6b7a5a', borderColor: '#1e2218' }}
                      >
                        <PhoneCall size={11} />
                        {callingId === item.lead.id ? '…' : calledIds.has(item.lead.id) ? 'Called' : 'Call'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={item.key} className="flex items-center gap-3 px-4 py-2" style={{ opacity: 0.3 }}>
                    <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: '#1e2218' }}>
                      {item.reason === 'website' ? <Globe size={10} style={{ color: '#d45a5a' }} /> : <X size={10} style={{ color: '#6b7a5a' }} />}
                    </div>
                    <p className="text-xs text-white truncate flex-1">{item.name}</p>
                    <span className="text-xs flex-shrink-0" style={{ color: '#2a3a1a' }}>
                      {item.reason === 'website' ? 'has website' : item.reason === 'rating' ? 'low rating' : item.reason === 'duplicate' ? 'in CRM' : 'filtered'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>  {/* end flex-col feed */}

        {/* Detail panel */}
        {selectedLead && (
          <div className="w-72 flex-shrink-0 flex flex-col border-l border-[#1e2218]" style={{ background: '#0f100d' }}>
            <div className="px-5 py-4 border-b border-[#1e2218] flex items-center justify-between">
              <p className="text-sm font-bold text-white truncate pr-2">{selectedLead.name}</p>
              <button onClick={() => setSelectedLead(null)} className="flex-shrink-0" style={{ color: '#4a5a3a' }}>
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Info rows */}
              <div className="space-y-3">
                {[
                  { label: 'Category', value: selectedLead.category },
                  { label: 'City',     value: selectedLead.city },
                  { label: 'Phone',    value: selectedLead.phone ? formatPhone(selectedLead.phone) : null },
                  { label: 'Address',  value: selectedLead.address },
                ].filter(r => r.value).map(r => (
                  <div key={r.label}>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#2a3a1a' }}>{r.label.toUpperCase()}</p>
                    <p className="text-sm text-white">{r.value}</p>
                  </div>
                ))}
                {selectedLead.rating && (
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#2a3a1a' }}>RATING</p>
                    <div className="flex items-center gap-1.5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={13} fill={i <= Math.round(selectedLead.rating!) ? '#c8f135' : 'none'} stroke="#c8f135" />
                      ))}
                      <span className="text-sm font-bold text-white ml-1">{selectedLead.rating}</span>
                      <span className="text-xs" style={{ color: '#3a4a2a' }}>({selectedLead.reviewCount})</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status badges */}
              <div className="flex gap-2 flex-wrap">
                {sentIds.has(selectedLead.id) && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: '#0d2218', color: '#c8f135', border: '1px solid #1a3520' }}>
                    SMS Sent
                  </span>
                )}
                {calledIds.has(selectedLead.id) && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: '#131a2e', color: '#4a9eff', border: '1px solid #1d2840' }}>
                    Called
                  </span>
                )}
              </div>

              {/* SMS text for this lead */}
              <div>
                <p className="text-xs font-semibold mb-1.5" style={{ color: '#2a3a1a' }}>SMS MESSAGE</p>
                <textarea
                  value={smsTemplate}
                  onChange={e => setSmsTemplate(e.target.value)}
                  placeholder="Leave blank to use default preview link message…"
                  rows={4}
                  className="w-full rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540] resize-none"
                  style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}
                />
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => handleSms(selectedLead)}
                  disabled={sendingId === selectedLead.id || !selectedLead.phone}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-all disabled:opacity-40"
                  style={sentIds.has(selectedLead.id)
                    ? { background: '#0d2218', color: '#c8f135', borderColor: '#1a3520' }
                    : { background: '#c8f135', color: '#0d0e0b', borderColor: 'transparent' }}>
                  <MessageSquare size={13} />
                  {sendingId === selectedLead.id ? 'Sending…' : sentIds.has(selectedLead.id) ? 'Resend SMS' : 'Send SMS'}
                </button>
                <button
                  onClick={() => handleCall(selectedLead)}
                  disabled={callingId === selectedLead.id || !selectedLead.phone}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-all disabled:opacity-40"
                  style={calledIds.has(selectedLead.id)
                    ? { background: '#131a2e', color: '#4a9eff', borderColor: '#1d2840' }
                    : { background: 'transparent', color: '#6b7a5a', borderColor: '#1e2218' }}>
                  <PhoneCall size={13} />
                  {callingId === selectedLead.id ? 'Calling…' : calledIds.has(selectedLead.id) ? 'Call Again' : 'Call Now'}
                </button>
                {selectedLead.slug && (
                  <a href={`/preview/${selectedLead.slug}`} target="_blank"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border border-[#1e2218] transition-all"
                    style={{ color: '#6b7a5a', textDecoration: 'none' }}>
                    View Site Preview
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
        </div> {/* end flex-1 flex min-w-0 */}
      </main>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-lg pointer-events-auto"
            style={{
              background: t.ok ? '#0d2218' : '#2a0d0d',
              color: t.ok ? '#c8f135' : '#d45a5a',
              border: `1px solid ${t.ok ? '#1a3520' : '#401515'}`,
              animation: 'toastIn 0.2s ease-out',
            }}>
            <MessageSquare size={13} />
            {t.message}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

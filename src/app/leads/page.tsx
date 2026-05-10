'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, MapPin, Tag, Star, ChevronRight, Globe, X, CheckCircle, MessageSquare, PhoneCall, Loader2 } from 'lucide-react'
import type { Lead } from '@/types'
import Sidebar from '@/components/Sidebar'
import { formatPhone } from '@/lib/utils'
import { SMS_TEMPLATES } from '@/lib/sms-templates'

const POPULAR_CITIES = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'Jacksonville, FL',
  'Austin, TX', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'Indianapolis, IN',
  'San Francisco, CA', 'Seattle, WA', 'Denver, CO', 'Nashville, TN', 'Oklahoma City, OK',
  'El Paso, TX', 'Washington, DC', 'Las Vegas, NV', 'Louisville, KY', 'Memphis, TN',
  'Portland, OR', 'Baltimore, MD', 'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ',
  'Fresno, CA', 'Sacramento, CA', 'Kansas City, MO', 'Mesa, AZ', 'Atlanta, GA',
  'Omaha, NE', 'Colorado Springs, CO', 'Raleigh, NC', 'Miami, FL', 'Minneapolis, MN',
  'Cleveland, OH', 'Tampa, FL', 'Tulsa, OK', 'Arlington, TX', 'New Orleans, LA',
  'Bakersfield, CA', 'Wichita, KS', 'Aurora, CO', 'Anaheim, CA', 'Santa Ana, CA',
]

const CATEGORIES = [
  'Plumber', 'Electrician', 'HVAC', 'Roofer', 'Painter', 'Handyman',
  'House cleaning', 'Landscaping', 'Pest control', 'Carpet cleaning',
  'Window cleaning', 'Pool service', 'Fence company', 'Garage door repair',
  'Auto repair shop', 'Auto detailer', 'Towing service', 'Auto body shop',
  'Oil change', 'Tire shop',
  'Barber shop', 'Nail salon', 'Hair salon', 'Massage therapy', 'Tattoo shop',
  'Spa', 'Dentist', 'Chiropractor', 'Optometrist',
  'Restaurant', 'Food truck', 'Bakery', 'Coffee shop', 'Catering',
  'Gym', 'Personal trainer', 'Yoga studio', 'Martial arts',
  'Accountant', 'Law firm', 'Real estate agent', 'Insurance agent',
  'Financial advisor', 'Marketing agency', 'IT support',
  'Florist', 'Pet grooming', 'Dry cleaner', 'Photographer', 'Videographer',
  'Moving company', 'Storage facility', 'Printing shop', 'Tutoring',
]

function buildCategoryVariants(category: string): string[] {
  const cat = category.toLowerCase().trim()
  const map: Record<string, string[]> = {
    plumber:            ['plumber', 'plumbing service', 'plumbing contractor', 'plumbing company'],
    electrician:        ['electrician', 'electrical contractor', 'electrical service', 'electric company'],
    hvac:               ['hvac', 'air conditioning repair', 'heating and cooling', 'ac repair', 'hvac contractor'],
    roofing:            ['roofing contractor', 'roofer', 'roof repair', 'roofing company'],
    roofer:             ['roofing contractor', 'roofer', 'roof repair', 'roofing company'],
    landscaping:        ['landscaping', 'lawn care', 'lawn service', 'landscape company', 'yard maintenance'],
    cleaning:           ['cleaning service', 'house cleaning', 'maid service', 'janitorial service', 'cleaning company'],
    'pest control':     ['pest control', 'exterminator', 'pest management', 'pest removal'],
    painting:           ['painter', 'painting contractor', 'house painter', 'painting company'],
    'pool service':     ['pool service', 'pool cleaning', 'pool maintenance', 'pool repair', 'swimming pool service'],
    'auto repair':      ['auto repair', 'car repair', 'auto mechanic', 'mechanic shop', 'automotive repair'],
    locksmith:          ['locksmith', 'lock service', 'lock repair', 'locksmith service'],
    moving:             ['moving company', 'movers', 'moving service', 'local movers'],
    handyman:           ['handyman', 'handyman service', 'home repair', 'handyman contractor'],
    flooring:           ['flooring', 'floor installation', 'hardwood flooring', 'carpet installation'],
    concrete:           ['concrete contractor', 'concrete service', 'concrete company', 'concrete repair'],
    fencing:            ['fence contractor', 'fencing company', 'fence installation', 'fence repair'],
    'fence company':    ['fence contractor', 'fencing company', 'fence installation', 'fence repair'],
    'pressure washing': ['pressure washing', 'power washing', 'pressure cleaning'],
    'tree service':     ['tree service', 'tree trimming', 'tree removal', 'arborist'],
    'garage door':      ['garage door repair', 'garage door service', 'garage door installation'],
    'appliance repair': ['appliance repair', 'appliance service', 'appliance technician'],
    drywall:            ['drywall contractor', 'drywall repair', 'drywall installation'],
    gutters:            ['gutter cleaning', 'gutter installation', 'gutter repair', 'gutter service'],
    'carpet cleaning':  ['carpet cleaning', 'carpet cleaner', 'upholstery cleaning'],
    'window cleaning':  ['window cleaning', 'window washer', 'window cleaning service'],
    solar:              ['solar installer', 'solar panel installation', 'solar company', 'solar contractor'],
    remodeling:         ['remodeling contractor', 'home remodeling', 'kitchen remodeling', 'bathroom remodeling'],
  }
  for (const [key, variants] of Object.entries(map)) {
    if (cat.includes(key)) return variants
  }
  return [category, `${category} service`, `${category} company`, `${category} contractor`]
}

const DIRECTIONS = ['North', 'South', 'East', 'West', 'Downtown', 'Central', 'Northeast', 'Northwest', 'Southeast', 'Southwest']

function buildQueries(category: string, city: string): string[] {
  const catVariants = buildCategoryVariants(category)
  const queries: string[] = []
  for (const cat of catVariants) queries.push(`${cat} in ${city}`)
  for (const dir of DIRECTIONS) queries.push(`${category} in ${dir} ${city}`)
  queries.push(`best ${category} ${city}`, `local ${category} ${city}`, `affordable ${category} ${city}`, `top rated ${category} ${city}`)
  return [...new Set(queries)]
}

type FeedItem =
  | { kind: 'lead'; lead: Lead; key: string }
  | { kind: 'skip'; name: string; reason: string; key: string }
interface Toast { id: number; message: string; ok: boolean }

// Queue item for the scrape job
interface QueueItem { query: string; pageToken?: string; city?: string; category?: string }

export default function LeadsPage() {
  const [showPanel, setShowPanel] = useState(true)
  const [city, setCity] = useState('')
  const [cityLoading, setCityLoading] = useState(false)
  const [addedCities, setAddedCities] = useState<string[]>([])
  const [citySuggestions, setCitySuggestions] = useState<string[]>([])
  const [cityFocused, setCityFocused] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const cityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cityInputRef = useRef<HTMLInputElement>(null)
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
  const [currentLabel, setCurrentLabel] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [smsTemplate, setSmsTemplate] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const feedRef = useRef<HTMLDivElement>(null)

  // Use a ref for the running flag so we can cancel without stale closures
  const runningRef = useRef(false)

  // Auto-detect city on mount using IP geolocation (no permission needed)
  useEffect(() => {
    setCityLoading(true)
    fetch('https://ipapi.co/json/', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const detected = d.city && d.region_code ? `${d.city}, ${d.region_code}` : d.city
        if (detected) setAddedCities([detected])
      })
      .catch(() => {})
      .finally(() => setCityLoading(false))
  }, [])

  // Debounced city autocomplete
  function handleCityChange(val: string) {
    setCity(val)
    setActiveSuggestion(-1)
    if (cityDebounceRef.current) clearTimeout(cityDebounceRef.current)
    if (val.trim().length < 2) { setCitySuggestions([]); return }
    cityDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/leads/cities?q=${encodeURIComponent(val)}`)
        if (res.ok) setCitySuggestions(await res.json())
      } catch { /* ignore */ }
    }, 220)
  }

  function addCity(s: string) {
    const trimmed = s.trim()
    if (!trimmed) return
    setAddedCities(prev => prev.includes(trimmed) ? prev : [...prev, trimmed])
    setCity('')
    setCitySuggestions([])
    setActiveSuggestion(-1)
    cityInputRef.current?.focus()
  }

  function selectCity(s: string) { addCity(s) }

  function removeCity(c: string) {
    setAddedCities(prev => prev.filter(x => x !== c))
  }

  function handleCityKeyDown(e: React.KeyboardEvent) {
    if (!citySuggestions.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSuggestion(i => Math.min(i + 1, citySuggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveSuggestion(i => Math.max(i - 1, -1)) }
    else if (e.key === 'Enter' && activeSuggestion >= 0) { e.preventDefault(); selectCity(citySuggestions[activeSuggestion]) }
    else if (e.key === 'Escape') { setCitySuggestions([]); setActiveSuggestion(-1) }
  }

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
      const payload: { leadId: string; message?: string; templateId?: string } = { leadId: lead.id }
      if (selectedTemplateId) payload.templateId = selectedTemplateId
      else if (smsTemplate.trim()) payload.message = smsTemplate.trim()
      const res = await fetch('/api/sms', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) { setSentIds(prev => new Set(prev).add(lead.id)); addToast(`SMS sent to ${lead.name}`) }
      else { const { error } = await res.json().catch(() => ({ error: 'Unknown error' })); addToast(error ?? 'SMS failed', false) }
    } catch { addToast('SMS failed — check Telnyx config', false) }
    setSendingId(null)
  }

  async function handleCall(lead: Lead) {
    if (!lead.phone) return
    setCallingId(lead.id)
    await fetch('/api/call', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId: lead.id }) })
    setCalledIds(prev => new Set(prev).add(lead.id))
    setCallingId(null)
  }

  // Run up to CONCURRENCY queries in parallel.
  // Uses a ref flag so tab-switching never aborts the loop.
  const CONCURRENCY = 5
  const processQueue = useCallback(async (
    queue: QueueItem[],
    cityVal: string,
    catVal: string,
    minRatingVal: number,
    minReviewsVal: number,
    totalQueries: number,
  ) => {
    let doneCount = 0

    async function runOne(item: QueueItem): Promise<void> {
      if (!runningRef.current) return
      try {
        const res = await fetch('/api/leads/scrape/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            city: item.city ?? cityVal,
            category: item.category ?? catVal,
            query: item.query,
            minRating: minRatingVal,
            minReviews: minReviewsVal,
            pageToken: item.pageToken,
          }),
        })

        if (!res.ok) {
          const { error: err } = await res.json().catch(() => ({ error: 'Request failed' }))
          setError(err ?? 'Request failed')
          return
        }

        const data = await res.json()

        if (data.leads?.length) {
          setFeed(prev => [
            ...prev,
            ...data.leads.map((lead: Lead) => ({ kind: 'lead' as const, lead, key: lead.id })),
          ])
        }
        if (data.skipped?.length) {
          setFeed(prev => [
            ...prev,
            ...data.skipped.map((s: { name: string; reason: string }) => ({
              kind: 'skip' as const, name: s.name, reason: s.reason,
              key: `skip-${Date.now()}-${Math.random()}`,
            })),
          ])
        }

        if (data.nextPageToken && runningRef.current) {
          await new Promise(r => setTimeout(r, 2000))
          queue.push({ ...item, pageToken: data.nextPageToken })
        }

        if (data.error) setError(data.error)

      } catch (err: unknown) {
        console.error('Query failed:', err)
      }
    }

    while (queue.length > 0 && runningRef.current) {
      const batch = queue.splice(0, CONCURRENCY)
      doneCount += batch.length
      setCurrentLabel(`${doneCount}/${totalQueries} queries — ${batch.length} running in parallel`)
      setProgress({ done: doneCount, total: totalQueries })
      await Promise.allSettled(batch.map(runOne))
    }

    if (runningRef.current) {
      setDone(true)
      setCurrentLabel(null)
    }
    setLoading(false)
    runningRef.current = false
  }, [])

  async function handleScrape() {
    const activeCities = addedCities.length > 0 ? addedCities : city.trim() ? [city.trim()] : []
    if (!activeCities.length || !category) { setError('City and category are required'); return }

    setFeed([]); setDone(false); setError(null); setStarted(true)
    setLoading(true); setCurrentLabel(null); runningRef.current = true

    const cities = activeCities
    const isAll = category.toLowerCase() === 'all' || category.toLowerCase() === 'all categories'
    const allQueries: QueueItem[] = []

    for (const c of cities) {
      if (isAll) {
        for (const cat of CATEGORIES)
          for (const q of buildQueries(cat, c)) allQueries.push({ query: q, city: c, category: cat })
      } else {
        for (const q of buildQueries(category, c)) allQueries.push({ query: q, city: c, category })
      }
    }

    setProgress({ done: 0, total: allQueries.length })
    await processQueue(allQueries, cities[0], isAll ? 'mixed' : category, minRating, minReviews, allQueries.length)
  }

  function handleStop() {
    runningRef.current = false
    setLoading(false)
    setCurrentLabel(null)
  }

  const leadCount = leads.length
  const skipCount = feed.filter(i => i.kind === 'skip').length

  return (
    <div className="flex min-h-screen pb-20 md:pb-0" style={{ background: '#0d0e0b', color: '#d4dfc4' }}>
      <Sidebar />
      <main className="flex-1 flex min-w-0">

        {/* Left: search form */}
        <div className={`${showPanel ? 'flex' : 'hidden'} w-full md:w-80 md:flex flex-shrink-0 border-r border-[#1e2218] flex-col`} style={{ background: '#0f100d' }}>
          <div className="px-5 py-4 border-b border-[#1e2218] flex items-center justify-between">
            <div>
              <h1 className="font-bold text-white text-base">Find Leads</h1>
              <p className="text-xs mt-0.5" style={{ color: '#4a5a3a' }}>
                Keeps running even when you switch tabs
              </p>
            </div>
            <button
              onClick={() => setShowPanel(false)}
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#1e2218]"
              style={{ color: '#6b7a5a' }}>
              View Results
            </button>
          </div>

          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            <div className="relative">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a5a3a' }}>
                <MapPin size={11} className="inline mr-1" />CITIES
              </label>

              {/* City pills */}
              {addedCities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {addedCities.map(c => (
                    <span key={c} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: '#c8f13518', border: '1px solid #c8f13535', color: '#c8f135' }}>
                      {c}
                      <button onClick={() => removeCity(c)} className="ml-0.5 opacity-60 hover:opacity-100" style={{ lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                  {addedCities.length > 1 && (
                    <button onClick={() => setAddedCities([])} className="text-xs px-2 py-1 rounded-lg"
                      style={{ color: '#4a5a3a', border: '1px solid #1e2218' }}>
                      clear all
                    </button>
                  )}
                </div>
              )}

              {/* Input */}
              <div className="relative">
                <input
                  ref={cityInputRef}
                  type="text" value={city}
                  onChange={e => handleCityChange(e.target.value)}
                  onFocus={() => setCityFocused(true)}
                  onBlur={() => setTimeout(() => { setCityFocused(false); setCitySuggestions([]) }, 150)}
                  onKeyDown={e => {
                    handleCityKeyDown(e)
                    if (e.key === 'Enter' && activeSuggestion < 0 && city.trim()) {
                      e.preventDefault()
                      addCity(city.trim())
                    } else if (e.key === 'Enter' && activeSuggestion < 0 && !city.trim()) {
                      handleScrape()
                    }
                  }}
                  placeholder={cityLoading ? 'Detecting location…' : 'Type a city, press Enter to add…'}
                  autoComplete="off"
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#3a4a2a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540]"
                  style={{ background: '#0d0e0b', border: '1px solid #1e2218', paddingRight: 32 }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {cityLoading
                    ? <Loader2 size={13} className="animate-spin" style={{ color: '#3a4a2a' }} />
                    : city
                      ? <MapPin size={13} style={{ color: '#c8f13560' }} />
                      : <MapPin size={13} style={{ color: '#2a3a1a' }} />}
                </span>
              </div>

              {/* Autocomplete dropdown */}
              {cityFocused && citySuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden shadow-2xl"
                     style={{ background: '#161810', border: '1px solid #2a3420' }}>
                  {citySuggestions.map((s, i) => (
                    <button
                      key={s}
                      onMouseDown={() => selectCity(s)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors"
                      style={{
                        background: i === activeSuggestion ? '#c8f13515' : 'transparent',
                        color: i === activeSuggestion ? '#c8f135' : '#a0b890',
                        borderBottom: i < citySuggestions.length - 1 ? '1px solid #1e2218' : 'none',
                      }}>
                      <MapPin size={11} style={{ color: '#3a5a2a', flexShrink: 0 }} />
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs mt-1.5" style={{ color: '#2a3a1a' }}>
                Press Enter after each city. Add as many as you want.
              </p>
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
                <MessageSquare size={11} className="inline mr-1" />SMS TEMPLATE
              </label>
              <select
                value={selectedTemplateId}
                onChange={e => { setSelectedTemplateId(e.target.value); if (e.target.value) setSmsTemplate('') }}
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c8f13540] mb-2"
                style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}>
                <option value="">— Default (preview link) —</option>
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
              <textarea
                value={selectedTemplateId ? SMS_TEMPLATES.find(t => t.id === selectedTemplateId)?.body ?? '' : smsTemplate}
                onChange={e => { if (selectedTemplateId) setSelectedTemplateId(''); setSmsTemplate(e.target.value) }}
                placeholder="Or write a custom message — use {name}, {business}, {link}, {city}…"
                rows={4}
                disabled={!!selectedTemplateId}
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540] resize-none disabled:opacity-70"
                style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}
              />
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-lg text-xs" style={{ background: '#2a0d0d', color: '#d45a5a', border: '1px solid #401515' }}>
                {error}
              </div>
            )}

            {loading ? (
              <button onClick={handleStop}
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
                {loading && progress.total > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1" style={{ color: '#3a4a2a' }}>
                      <span>Progress</span>
                      <span>{progress.done}/{progress.total}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1e2218' }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ background: '#c8f135', width: `${Math.round((progress.done / progress.total) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
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
        <div className={`${showPanel ? 'hidden md:flex' : 'flex'} flex-1 min-w-0`}>
          <div className="flex-1 flex flex-col min-w-0">
            <div className="md:hidden border-b border-[#1e2218] px-4 py-2 flex items-center gap-2" style={{ background: '#111310' }}>
              <button
                onClick={() => setShowPanel(p => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#1e2218]"
                style={{ color: '#c8f135', background: '#c8f13510' }}>
                {showPanel ? 'View Results' : 'Find Leads'}
              </button>
            </div>
            {started && (
              <div className="border-b border-[#1e2218] px-6 py-3 flex items-center gap-4" style={{ background: '#111310' }}>
                {loading && <div className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: '#c8f135' }} />}
                <span className="text-xs font-mono flex-1 truncate" style={{ color: done ? '#c8f135' : '#4a5a3a' }}>
                  {done
                    ? `Done — ${leadCount} leads, ${skipCount} skipped`
                    : currentLabel
                      ? `Scanning: ${currentLabel}…`
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
                    Enter a city and category. Leads appear here as they&apos;re found — switch tabs freely, the search keeps going.
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
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#c8f13515' }}>
                          <CheckCircle size={15} style={{ color: '#c8f135' }} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            <p className="text-sm font-semibold text-white truncate">{item.lead.name}</p>
                            {item.lead.hasShopify && (
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: '#96bf48', color: '#fff', fontSize: 9 }}>SHOPIFY</span>
                            )}
                          </div>
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
                        <button onClick={() => handleSms(item.lead)} disabled={sendingId === item.lead.id || !item.lead.phone}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40"
                          style={sentIds.has(item.lead.id)
                            ? { background: '#0d2218', color: '#c8f135', borderColor: '#1a3520' }
                            : { background: 'transparent', color: '#6b7a5a', borderColor: '#1e2218' }}>
                          <MessageSquare size={11} />
                          {sendingId === item.lead.id ? '…' : sentIds.has(item.lead.id) ? 'Sent' : 'SMS'}
                        </button>
                        <button onClick={() => handleCall(item.lead)} disabled={callingId === item.lead.id || !item.lead.phone}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40"
                          style={calledIds.has(item.lead.id)
                            ? { background: '#131a2e', color: '#4a9eff', borderColor: '#1d2840' }
                            : { background: 'transparent', color: '#6b7a5a', borderColor: '#1e2218' }}>
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
          </div>

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

                <div className="flex gap-2 flex-wrap">
                  {sentIds.has(selectedLead.id) && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: '#0d2218', color: '#c8f135', border: '1px solid #1a3520' }}>SMS Sent</span>
                  )}
                  {calledIds.has(selectedLead.id) && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: '#131a2e', color: '#4a9eff', border: '1px solid #1d2840' }}>Called</span>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: '#2a3a1a' }}>SMS MESSAGE</p>
                  <textarea value={smsTemplate} onChange={e => setSmsTemplate(e.target.value)}
                    placeholder="Leave blank to use default preview link message…"
                    rows={4}
                    className="w-full rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540] resize-none"
                    style={{ background: '#0d0e0b', border: '1px solid #1e2218' }}
                  />
                </div>

                <div className="space-y-2">
                  <button onClick={() => handleSms(selectedLead)} disabled={sendingId === selectedLead.id || !selectedLead.phone}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-all disabled:opacity-40"
                    style={sentIds.has(selectedLead.id)
                      ? { background: '#0d2218', color: '#c8f135', borderColor: '#1a3520' }
                      : { background: '#c8f135', color: '#0d0e0b', borderColor: 'transparent' }}>
                    <MessageSquare size={13} />
                    {sendingId === selectedLead.id ? 'Sending…' : sentIds.has(selectedLead.id) ? 'Resend SMS' : 'Send SMS'}
                  </button>
                  <button onClick={() => handleCall(selectedLead)} disabled={callingId === selectedLead.id || !selectedLead.phone}
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
        </div>
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

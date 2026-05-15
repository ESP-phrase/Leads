'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react'

export default function PreviewRequestForm({ compact = false }: { compact?: boolean }) {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    city: '',
    category: '',
    websiteUrl: '',
    notes: '',
    smsOptIn: false,
  })

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.businessName.trim()) { setError('Business name is required'); return }
    if (!form.email.trim() && !form.phone.trim()) {
      setError('Please provide an email or phone so we can send your preview')
      return
    }

    setSubmitting(true)
    try {
      // Capture UTM from URL if present
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      const res = await fetch('/api/preview-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          utmCampaign: params?.get('utm_campaign'),
          utmSource:   params?.get('utm_source'),
          utmMedium:   params?.get('utm_medium'),
          source:      params?.get('utm_source') ? 'ad' : 'organic',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
      } else {
        setDone(true)
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setSubmitting(false)
  }

  if (done) {
    return (
      <div style={{
        padding: '40px 32px', borderRadius: 16, background: '#111310',
        border: '1px solid #2a5030', textAlign: 'center', maxWidth: 520, margin: '0 auto',
      }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#c8f13520', border: '1px solid #c8f13560', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <CheckCircle size={26} style={{ color: '#c8f135' }} />
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 10 }}>You&apos;re on the list!</h3>
        <p style={{ fontSize: 15, color: '#8a9a7a', lineHeight: 1.7 }}>
          We&apos;ll build your free website preview within 24 hours and send the link to the contact info you provided.
          No payment until you see it and love it.
        </p>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', fontSize: 14, color: '#d4dfc4',
    background: '#0a0b09', border: '1px solid #1e2218', borderRadius: 10,
    outline: 'none', fontFamily: 'inherit',
  }

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: 560, margin: '0 auto', padding: compact ? '0' : '32px 28px',
      borderRadius: 16, background: compact ? 'transparent' : '#111310',
      border: compact ? 'none' : '1px solid #1e2218',
    }}>
      {/* Honeypot — hidden from humans, bots fill it */}
      <input type="text" name="__hp__" tabIndex={-1} autoComplete="off"
             style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
             onChange={e => update('businessName' as never, e.target.value as never)} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{ gridColumn: '1 / 3' }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8a9a7a', marginBottom: 6, display: 'block' }}>
            Business name <span style={{ color: '#c8f135' }}>*</span>
          </label>
          <input type="text" required value={form.businessName}
                 onChange={e => update('businessName', e.target.value)}
                 placeholder="e.g. Mike's Plumbing"
                 style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8a9a7a', marginBottom: 6, display: 'block' }}>
            Your name
          </label>
          <input type="text" value={form.ownerName}
                 onChange={e => update('ownerName', e.target.value)}
                 placeholder="Optional" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8a9a7a', marginBottom: 6, display: 'block' }}>
            City
          </label>
          <input type="text" value={form.city}
                 onChange={e => update('city', e.target.value)}
                 placeholder="Austin, TX" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8a9a7a', marginBottom: 6, display: 'block' }}>
            Email <span style={{ color: '#5a6a4a' }}>(or phone)</span>
          </label>
          <input type="email" value={form.email}
                 onChange={e => update('email', e.target.value)}
                 placeholder="you@example.com" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8a9a7a', marginBottom: 6, display: 'block' }}>
            Phone <span style={{ color: '#5a6a4a' }}>(or email)</span>
          </label>
          <input type="tel" value={form.phone}
                 onChange={e => update('phone', e.target.value)}
                 placeholder="(512) 555-0100" style={inputStyle} />
        </div>
        <div style={{ gridColumn: '1 / 3' }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8a9a7a', marginBottom: 6, display: 'block' }}>
            Type of business
          </label>
          <input type="text" value={form.category}
                 onChange={e => update('category', e.target.value)}
                 placeholder="Restaurant, plumber, salon, etc." style={inputStyle} />
        </div>
        <div style={{ gridColumn: '1 / 3' }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8a9a7a', marginBottom: 6, display: 'block' }}>
            Anything else? <span style={{ color: '#5a6a4a' }}>(services, hours, style preferences)</span>
          </label>
          <textarea value={form.notes}
                    onChange={e => update('notes', e.target.value)}
                    rows={3}
                    placeholder="Optional"
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 78 }} />
        </div>
      </div>

      <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 18, fontSize: 13, color: '#8a9a7a', lineHeight: 1.5 }}>
        <input type="checkbox" checked={form.smsOptIn}
               onChange={e => update('smsOptIn', e.target.checked)}
               style={{ marginTop: 3, accentColor: '#c8f135' }} />
        <span>
          I agree to receive text messages from WebHustle about my website preview.
          Msg &amp; data rates may apply. Reply STOP to opt out.
        </span>
      </label>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, background: '#3a1515', border: '1px solid #5a2020', color: '#f08080', fontSize: 13, marginBottom: 14 }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={submitting}
              style={{
                width: '100%', padding: '14px 24px', borderRadius: 12,
                background: submitting ? '#5a6a35' : '#c8f135', color: '#0a0b09',
                fontWeight: 900, fontSize: 15, border: 'none', cursor: submitting ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all .15s',
              }}>
        {submitting ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                    : <>Request my free preview <ArrowRight size={16} /></>}
      </button>

      <p style={{ fontSize: 11, color: '#3a4a2a', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
        No upfront cost. No spam. We&apos;ll only contact you about your website preview.
      </p>
    </form>
  )
}

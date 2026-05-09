'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DollarSign, Phone, CheckCircle, Zap, Clock, ArrowRight, Star } from 'lucide-react'

const EARNINGS = [
  { deals: 5,  monthly: 445,  label: 'Part-time' },
  { deals: 15, monthly: 1335, label: 'Side hustle' },
  { deals: 30, monthly: 2670, label: 'Full-time' },
  { deals: 60, monthly: 5340, label: 'Top performer' },
]

const STEPS = [
  { n: '01', title: 'Get your lead list', body: 'We send you a list of local businesses in your area that need a website. No cold sourcing — the work is already done.' },
  { n: '02', title: 'Make the call', body: 'Call the business, show them a live preview of their new site, and explain the value. We give you a script — no sales experience needed.' },
  { n: '03', title: 'Close & get paid', body: 'When they sign up, you earn 60% of the monthly revenue — every single month they stay on. Recurring income, not a one-time bonus.' },
]

const FAQS = [
  { q: 'Do I need sales experience?', a: "No. We give you a proven script, a live preview link to show the business, and training. If you can have a friendly conversation, you can do this." },
  { q: 'How do I get paid?', a: 'Via direct deposit or PayPal, weekly. You earn 60% of every client you close, every month they stay — so one closed deal keeps paying you.' },
  { q: 'How many hours do I need to work?', a: "As many or as few as you want. Most reps start with 1–2 hours per day and scale from there. There's no minimum requirement." },
  { q: 'What if a client cancels?', a: "You stop earning that client's share. But your other clients keep paying. That's why we encourage you to build a portfolio of 10–20+ clients over time." },
  { q: 'Is there a cost to join?', a: 'There is a one-time $5 activation fee to join. This covers account setup and access to our lead tools. After that, there are no recurring fees — we only make money when you make money.' },
]

export default function JoinPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) { setError('Name and phone are required'); return }
    setLoading(true); setError(null)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email }),
    })
    const data = await res.json()
    if (res.ok && data.url) {
      window.location.href = data.url
    } else {
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#0d0e0b', color: '#d4dfc4', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1e2218', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 900, fontSize: 20, color: '#c8f135' }}>Website<span style={{ color: '#fff' }}>Hustle</span></span>
          </Link>
          <Link href="/join#apply"
            style={{ background: '#c8f135', color: '#0d0e0b', padding: '9px 20px', borderRadius: 9999, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            Apply Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '96px 1.5rem 80px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#c8f13515', border: '1px solid #c8f13525',
                      borderRadius: 9999, padding: '6px 16px', marginBottom: 28 }}>
          <Zap size={13} style={{ color: '#c8f135' }} />
          <span style={{ color: '#c8f135', fontSize: 13, fontWeight: 600 }}>60% commission · Recurring monthly income</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.75rem)', fontWeight: 900, color: '#fff', lineHeight: 1.08, marginBottom: 20 }}>
          Get Paid to Help Local<br />Businesses Get Online
        </h1>
        <p style={{ fontSize: 18, color: '#4a5a3a', lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
          We build the website. You make the call. When they sign up, you earn 60% every month — not a one-time cut.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#apply"
             style={{ background: '#c8f135', color: '#0d0e0b', padding: '15px 32px', borderRadius: 9999, fontWeight: 800, fontSize: 17, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Start Earning <ArrowRight size={17} />
          </a>
          <a href="#how"
             style={{ background: 'transparent', border: '1px solid #2e3828', color: '#6b7a5a', padding: '15px 28px', borderRadius: 9999, fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>
            See how it works
          </a>
        </div>
      </section>

      {/* Earnings calculator */}
      <section style={{ padding: '0 1.5rem 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ background: '#111310', border: '1px solid #1e2218', borderRadius: 24, padding: '40px 40px 32px' }}>
            <p style={{ color: '#4a5a3a', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Your potential earnings</p>
            <p style={{ color: '#fff', fontSize: 17, marginBottom: 32 }}>At $149/month per client — you keep <span style={{ color: '#c8f135', fontWeight: 800 }}>$89.40/month</span> per closed deal, forever.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              {EARNINGS.map(({ deals, monthly, label }) => (
                <div key={deals} style={{ background: '#0d0e0b', border: '1px solid #1e2218', borderRadius: 16, padding: '20px 16px' }}>
                  <p style={{ color: '#4a5a3a', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{label}</p>
                  <p style={{ color: '#c8f135', fontSize: 28, fontWeight: 900, lineHeight: 1 }}>${monthly.toLocaleString()}</p>
                  <p style={{ color: '#2a3a1a', fontSize: 11, marginTop: 6 }}>/month · {deals} clients</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '80px 1.5rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ color: '#4a5a3a', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, textAlign: 'center' }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 52 }}>
            Three steps. That&apos;s it.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {STEPS.map(({ n, title, body }) => (
              <div key={n} style={{ background: '#111310', border: '1px solid #1e2218', borderRadius: 20, padding: '32px 28px' }}>
                <p style={{ color: '#c8f135', fontSize: 32, fontWeight: 900, marginBottom: 16, opacity: 0.4 }}>{n}</p>
                <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{title}</h3>
                <p style={{ color: '#4a5a3a', fontSize: 15, lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section style={{ padding: '40px 1.5rem 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', background: '#111310', border: '1px solid #1e2218', borderRadius: 24, padding: '48px 40px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 900, color: '#fff', marginBottom: 28 }}>This is for you if…</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'You want extra income without a rigid schedule',
              'You\'re comfortable making phone calls or want to get better at it',
              'You want recurring income — not just a one-time paycheck',
              'You\'re hungry and want unlimited earning potential',
              'You\'re a student, stay-at-home parent, or side-hustler',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <CheckCircle size={18} style={{ color: '#c8f135', flexShrink: 0, marginTop: 1 }} />
                <p style={{ color: '#6b7a5a', fontSize: 16, lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 1.5rem 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 900, color: '#fff', marginBottom: 36, textAlign: 'center' }}>Common questions</h2>
          <div>
            {FAQS.map(({ q, a }) => (
              <div key={q} style={{ borderTop: '1px solid #1e2218', padding: '24px 0' }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{q}</p>
                <p style={{ color: '#4a5a3a', fontSize: 15, lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #1e2218' }} />
          </div>
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" style={{ padding: '0 1.5rem 100px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ background: '#111310', border: '1px solid #1e2218', borderRadius: 24, padding: '48px 40px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#c8f13515', border: '1px solid #c8f13530',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle size={28} style={{ color: '#c8f135' }} />
                </div>
                <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginBottom: 10 }}>You&apos;re on the list!</h3>
                <p style={{ color: '#4a5a3a', fontSize: 15, lineHeight: 1.7 }}>
                  We&apos;ll reach out within 24 hours to get you set up. Keep your phone on.
                </p>
              </div>
            ) : (
              <>
                <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Apply to join</h2>
                <p style={{ color: '#4a5a3a', fontSize: 15, marginBottom: 32 }}>Takes 60 seconds. We&apos;ll reach out within 24 hours.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', color: '#4a5a3a', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Full name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith"
                      style={{ width: '100%', background: '#0d0e0b', border: '1px solid #1e2218', borderRadius: 12,
                               padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#4a5a3a', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Phone number *</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 000 0000" type="tel"
                      style={{ width: '100%', background: '#0d0e0b', border: '1px solid #1e2218', borderRadius: 12,
                               padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#4a5a3a', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Email <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" type="email"
                      style={{ width: '100%', background: '#0d0e0b', border: '1px solid #1e2218', borderRadius: 12,
                               padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  {error && (
                    <p style={{ background: '#2a0d0d', border: '1px solid #401515', color: '#d45a5a', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
                      {error}
                    </p>
                  )}
                  <button type="submit" disabled={loading}
                    style={{ background: '#c8f135', color: '#0d0e0b', padding: '14px', borderRadius: 12, fontWeight: 800,
                             fontSize: 16, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
                             display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
                    {loading ? 'Submitting…' : <><Phone size={16} />Apply Now — It&apos;s Free</>}
                  </button>
                </form>
              </>
            )}
          </div>
          <p style={{ textAlign: 'center', color: '#2a3a1a', fontSize: 13, marginTop: 20 }}>
            No fees. No experience required. Cancel anytime.
          </p>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #1e2218', padding: '24px 1.5rem', textAlign: 'center' }}>
        <span style={{ fontWeight: 900, fontSize: 16, color: '#c8f135' }}>Website<span style={{ color: '#fff' }}>Hustle</span></span>
        <p style={{ color: '#2a3a1a', fontSize: 12, marginTop: 8 }}>© {new Date().getFullYear()} Website Hustle. All rights reserved.</p>
      </footer>
    </div>
  )
}

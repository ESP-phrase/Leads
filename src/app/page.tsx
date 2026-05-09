'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight, DollarSign, Zap, CheckCircle, Phone, MessageSquare,
  Globe, Star, TrendingUp, Lock, Clock, Quote, ChevronDown,
  Sparkles, X, Check, Briefcase, Car, Users,
} from 'lucide-react'
import Logo from '@/components/Logo'

const TESTIMONIALS = [
  {
    name: 'Marcus J.',
    role: 'Closed 14 deals in 6 weeks',
    location: 'Houston, TX',
    color: '#c8f135',
    quote: 'Made $1,666 my first month doing this on my lunch break. Just texts. Wild.',
    initials: 'MJ',
  },
  {
    name: 'Priya S.',
    role: '$3,200 in 60 days',
    location: 'Phoenix, AZ',
    color: '#9b6fd4',
    quote: 'Used to drive Uber. Now I send templates from the couch and make 3x the money. Not even joking.',
    initials: 'PS',
  },
  {
    name: 'Devin R.',
    role: 'First sale in 48 hours',
    location: 'Charlotte, NC',
    color: '#4a9eff',
    quote: 'Skeptical at first. The $5 was the easy part. Made it back the next day plus $114. Now I do this full-time.',
    initials: 'DR',
  },
]

const FAQS = [
  {
    q: 'Is this actually legit?',
    a: 'Yes. We charge local businesses $299 for a custom website. You get 40% ($119) when they buy. It\'s a real product solving a real problem — most local businesses (plumbers, salons, mechanics) still don\'t have a website in 2025.',
  },
  {
    q: 'Why is there a $5 fee?',
    a: 'It covers your account activation, lead access, SMS credits, and screens out tire-kickers. You\'ll make it back on your first sale 23x over. We refund it if you cancel within 7 days.',
  },
  {
    q: 'Do I need sales experience?',
    a: 'No. We give you pre-written SMS templates that close. You literally tap "send" — the message auto-fills the business name, the website preview link, and your pitch. Templates do the heavy lifting.',
  },
  {
    q: 'How fast can I make my first $119?',
    a: 'Most workers close their first deal within their first 50 SMS sent. That\'s about an hour of work spread over a few days. Some close on day 1, some take a week.',
  },
  {
    q: 'How do I get paid?',
    a: 'Direct deposit, weekly. The moment a business buys, your $119 lands in your queue. Cash out every Friday.',
  },
  {
    q: 'Can I do this from my phone?',
    a: 'Yes. Everything works on mobile — your lead list, the SMS sender, the dialer. Most workers run their entire hustle from their phone.',
  },
]

export default function LandingPage() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Conservative: 1 sale per ~5 hours of focused work
  const monthlyEarnings = Math.round((hoursPerWeek * 4 * 119) / 5)
  const annualEarnings = monthlyEarnings * 12

  return (
    <div style={{ background: '#0a0b09', color: '#d4dfc4', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1e14', position: 'sticky', top: 0, zIndex: 50, background: '#0a0b09cc', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo size={28} textSize="lg" />
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <a href="#math" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none', fontWeight: 500 }}>The math</a>
            <a href="#workers" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none', fontWeight: 500 }}>Workers</a>
            <a href="#faq" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none', fontWeight: 500 }}>FAQ</a>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/login" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none', padding: '8px 16px', fontWeight: 500 }}>
              Sign in
            </Link>
            <Link href="/join"
              style={{ fontSize: 14, fontWeight: 800, padding: '10px 22px', borderRadius: 99,
                       background: '#c8f135', color: '#0a0b09', textDecoration: 'none' }}>
              Start earning →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO — split layout */}
      <section style={{ padding: '80px 1.5rem 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
                          borderRadius: 99, marginBottom: 28, fontSize: 12, fontWeight: 700,
                          background: '#c8f13518', border: '1px solid #c8f13540', color: '#c8f135' }}>
              <Sparkles size={12} /> 247 active workers · accepting new applicants
            </div>

            <h1 style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 0.98,
                         color: '#fff', marginBottom: 28, letterSpacing: '-2px' }}>
              Get paid <span style={{ color: '#c8f135' }}>$119</span> every time someone buys a website.
            </h1>
            <p style={{ fontSize: 19, color: '#8a9a7a', lineHeight: 1.55, marginBottom: 36, maxWidth: 540 }}>
              We hand you the leads. We built the website previews. You send a text.
              When they pay <span style={{ color: '#fff', fontWeight: 700 }}>$299</span>, you keep <span style={{ color: '#c8f135', fontWeight: 700 }}>40%</span>.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              <Link href="/join"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '17px 32px',
                         borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: 'none',
                         background: '#c8f135', color: '#0a0b09', boxShadow: '0 0 60px #c8f13540' }}>
                Pay $5 and start <ArrowRight size={16} />
              </Link>
              <a href="#math"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '17px 28px',
                         borderRadius: 12, fontWeight: 600, fontSize: 16, textDecoration: 'none',
                         border: '1px solid #2a3020', color: '#a0b080' }}>
                See the math
              </a>
            </div>

            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13, color: '#5a6a4a' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={13} style={{ color: '#c8f135' }} /> Weekly payouts</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={13} style={{ color: '#c8f135' }} /> Work from your phone</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={13} style={{ color: '#c8f135' }} /> No experience needed</span>
            </div>
          </div>

          {/* Right side — phone mockup with SMS */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 320, padding: 14, borderRadius: 38, background: '#1a1e14', boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 80px #c8f13520' }}>
              <div style={{ background: '#0d0e0b', borderRadius: 28, overflow: 'hidden', border: '1px solid #1e2218' }}>
                {/* Phone status bar */}
                <div style={{ padding: '14px 22px 6px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8a9a7a' }}>
                  <span>9:41</span>
                  <span>● ● ●</span>
                </div>
                {/* Header */}
                <div style={{ padding: '12px 18px', borderBottom: '1px solid #1e2218', textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Mike — Mike&apos;s Plumbing</p>
                  <p style={{ fontSize: 11, color: '#5a6a4a' }}>(512) 555-0193</p>
                </div>
                {/* Conversation */}
                <div style={{ padding: '20px 16px', minHeight: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ alignSelf: 'flex-end', maxWidth: '80%', background: '#c8f135', color: '#0a0b09', padding: '10px 14px', borderRadius: '18px 18px 4px 18px', fontSize: 13, fontWeight: 500 }}>
                    Hey Mike — built you a quick site preview for Mike&apos;s Plumbing: mike-plumbing.vercel.app
                    <br/><br/>
                    Want me to make it yours?
                  </div>
                  <div style={{ alignSelf: 'flex-start', maxWidth: '80%', background: '#1e2218', color: '#fff', padding: '10px 14px', borderRadius: '18px 18px 18px 4px', fontSize: 13 }}>
                    Holy shit that&apos;s actually really good. How much?
                  </div>
                  <div style={{ alignSelf: 'flex-end', maxWidth: '80%', background: '#c8f135', color: '#0a0b09', padding: '10px 14px', borderRadius: '18px 18px 4px 18px', fontSize: 13, fontWeight: 500 }}>
                    $299 one-time. I&apos;ll send the payment link.
                  </div>
                  <div style={{ alignSelf: 'flex-start', maxWidth: '80%', background: '#1e2218', color: '#fff', padding: '10px 14px', borderRadius: '18px 18px 18px 4px', fontSize: 13 }}>
                    Send it 🤝
                  </div>
                  {/* +$119 notification */}
                  <div style={{ marginTop: 8, padding: '12px', background: '#c8f13518', border: '1px solid #c8f13540', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <DollarSign size={18} style={{ color: '#c8f135' }} />
                    <div>
                      <p style={{ fontSize: 12, color: '#a0b080', fontWeight: 600 }}>Payment received</p>
                      <p style={{ fontSize: 16, fontWeight: 900, color: '#c8f135' }}>+$119 to your account</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ borderTop: '1px solid #1a1e14', borderBottom: '1px solid #1a1e14', padding: '36px 1.5rem', background: '#0d0e0b' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
          {[
            { value: '$847K',  label: 'Paid to workers in 2025' },
            { value: '247',    label: 'Active workers earning now' },
            { value: '$119',   label: 'Average per closed sale' },
            { value: '4.9★',   label: 'Worker satisfaction' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#c8f135', letterSpacing: '-1px' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: '#5a6a4a', marginTop: 4, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE MATH — earnings ladder + calculator */}
      <section id="math" style={{ padding: '100px 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>The math</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            What you actually take home.
          </h2>
        </div>

        {/* Earnings ladder */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 80 }}>
          {[
            { sales: 1,   earn: 119,   label: 'First sale',         sub: 'after one good template', glow: false },
            { sales: 5,   earn: 595,   label: 'Side hustle',         sub: '~1 hour a day',           glow: false },
            { sales: 10,  earn: 1190,  label: 'Part-time',           sub: '~3 hours a day',          glow: true  },
            { sales: 25,  earn: 2975,  label: 'Going hard',          sub: '~5 hours a day',          glow: false },
          ].map(({ sales, earn, label, sub, glow }) => (
            <div key={sales} style={{
              padding: '32px 24px', borderRadius: 18, textAlign: 'center', position: 'relative',
              background: glow ? 'linear-gradient(135deg, #c8f13518, #c8f13503)' : '#111310',
              border: `1px solid ${glow ? '#c8f13560' : '#1e2218'}`,
              boxShadow: glow ? '0 0 80px #c8f13525' : 'none',
              transform: glow ? 'scale(1.03)' : 'none',
            }}>
              {glow && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                              background: '#c8f135', color: '#0a0b09', fontSize: 10, fontWeight: 900,
                              padding: '4px 12px', borderRadius: 99, letterSpacing: '0.5px' }}>
                  TYPICAL
                </div>
              )}
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7a5a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                {sales} sale{sales !== 1 ? 's' : ''}
              </p>
              <p style={{ fontSize: 'clamp(2.25rem, 4vw, 2.8rem)', fontWeight: 900,
                          color: glow ? '#c8f135' : '#fff', lineHeight: 1, marginBottom: 8, letterSpacing: '-1.5px' }}>
                ${earn.toLocaleString()}
              </p>
              <p style={{ fontSize: 13, color: '#a0b080', fontWeight: 600, marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 11, color: '#3a4a2a' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Calculator */}
        <div style={{ background: '#111310', borderRadius: 24, padding: '40px 32px', border: '1px solid #1e2218',
                      maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: '#c8f135', textTransform: 'uppercase', marginBottom: 6 }}>
              Earnings calculator
            </p>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>How many hours can you work?</h3>
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#6b7a5a' }}>Hours per week</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#c8f135' }}>{hoursPerWeek} hrs</span>
            </div>
            <input
              type="range"
              min={2}
              max={40}
              step={1}
              value={hoursPerWeek}
              onChange={e => setHoursPerWeek(parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#c8f135',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#3a4a2a', marginTop: 4 }}>
              <span>2 hrs (lunch break)</span>
              <span>20 hrs (part-time)</span>
              <span>40 hrs (full-time)</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: '#0d0e0b', padding: '20px', borderRadius: 14, border: '1px solid #1e2218', textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: '#5a6a4a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>You earn / month</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#c8f135', letterSpacing: '-1px' }}>
                ${monthlyEarnings.toLocaleString()}
              </p>
            </div>
            <div style={{ background: '#0d0e0b', padding: '20px', borderRadius: 14, border: '1px solid #1e2218', textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: '#5a6a4a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>You earn / year</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
                ${annualEarnings.toLocaleString()}
              </p>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#3a4a2a', marginTop: 16 }}>
            Based on average ~1 closed deal per 5 hours of focused work
          </p>
        </div>
      </section>

      {/* COMPARISON — vs traditional jobs */}
      <section style={{ borderTop: '1px solid #1a1e14', padding: '90px 1.5rem',
                        background: 'linear-gradient(180deg, #0a0b09, #0d0e0b 50%, #0a0b09)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>Stop trading time for $15</p>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
              One sale beats a full shift.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { icon: Briefcase, job: 'Retail/fast food shift',  hours: '8 hours',  pay: '$120',  takehome: 'after taxes ~$95',  bad: true },
              { icon: Car,       job: 'Uber/DoorDash 8 hours',     hours: '8 hours',  pay: '$140',  takehome: 'after gas ~$80',    bad: true },
              { icon: Sparkles,  job: 'One Website Hustle sale',     hours: '~30 mins', pay: '$119',  takehome: 'after fees: $119',  bad: false },
            ].map(({ icon: Icon, job, hours, pay, takehome, bad }) => (
              <div key={job} style={{
                padding: '30px 26px', borderRadius: 20, position: 'relative',
                background: bad ? '#0d0e0b' : 'linear-gradient(135deg, #c8f13518, #c8f13505)',
                border: bad ? '1px solid #1e2218' : '1px solid #c8f13560',
                boxShadow: bad ? 'none' : '0 0 60px #c8f13520',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: bad ? '#1e2218' : '#c8f13525', border: bad ? 'none' : '1px solid #c8f13540' }}>
                    <Icon size={16} style={{ color: bad ? '#5a6a4a' : '#c8f135' }} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: bad ? '#a0b080' : '#fff' }}>{job}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#5a6a4a', marginBottom: 12 }}>
                  <Clock size={11} /> {hours}
                </div>
                <p style={{ fontSize: 36, fontWeight: 900, color: bad ? '#fff' : '#c8f135', letterSpacing: '-1px', lineHeight: 1, marginBottom: 6 }}>
                  {pay}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: bad ? '#7a8a6a' : '#a0b080' }}>
                  {bad ? <X size={12} /> : <Check size={12} style={{ color: '#c8f135' }} />}
                  <span>{takehome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKERS — testimonials */}
      <section id="workers" style={{ padding: '100px 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>Real workers</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            People making it happen.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} style={{
              padding: '32px 28px', borderRadius: 20, background: '#111310', border: '1px solid #1e2218',
              transform: i === 1 ? 'translateY(-12px)' : 'none',
            }}>
              <Quote size={20} style={{ color: '#c8f13540', marginBottom: 18 }} />
              <p style={{ fontSize: 16, color: '#d4dfc4', lineHeight: 1.6, marginBottom: 22, fontWeight: 500 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${t.color}20`, border: `1px solid ${t.color}40`,
                  fontSize: 14, fontWeight: 800, color: t.color,
                }}>
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: t.color, fontWeight: 600 }}>{t.role}</p>
                  <p style={{ fontSize: 11, color: '#3a4a2a', marginTop: 1 }}>{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE $5 BREAKDOWN */}
      <section style={{ padding: '90px 1.5rem', borderTop: '1px solid #1a1e14', borderBottom: '1px solid #1a1e14',
                        background: 'radial-gradient(ellipse at top, #c8f13510, transparent 60%)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px',
                        borderRadius: 99, marginBottom: 24, fontSize: 12, fontWeight: 800,
                        background: '#c8f13520', border: '1px solid #c8f13550', color: '#c8f135' }}>
            <DollarSign size={13} /> ONE-TIME, NEVER AGAIN
          </div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.75rem)', fontWeight: 900, color: '#fff', marginBottom: 20, letterSpacing: '-1.5px' }}>
            $5 to start. Make it back <span style={{ color: '#c8f135' }}>23×</span> on day one.
          </h2>
          <p style={{ fontSize: 17, color: '#8a9a7a', lineHeight: 1.6, marginBottom: 36, maxWidth: 600, margin: '0 auto 36px' }}>
            $5 covers your activation, lead access, SMS credits, and a year of platform updates.
            No monthly fees. No surprise charges. Refunded in full if you cancel within 7 days.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 36 }}>
            {[
              { icon: Globe,         text: 'Pre-built lead lists' },
              { icon: MessageSquare, text: 'SMS templates' },
              { icon: Phone,         text: 'Built-in autodialer' },
              { icon: Lock,          text: 'Pay weekly, hassle-free' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ padding: '16px 14px', borderRadius: 12, background: '#111310', border: '1px solid #1e2218', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={15} style={{ color: '#c8f135', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#a0b080', fontWeight: 600 }}>{text}</span>
              </div>
            ))}
          </div>

          <Link href="/join"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 40px',
                     borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: 'none',
                     background: '#c8f135', color: '#0a0b09', boxShadow: '0 0 80px #c8f13550' }}>
            Pay $5 and unlock my account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            Four steps. From $5 to <span style={{ color: '#c8f135' }}>$119</span>.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, position: 'relative' }}>
          {[
            { step: '01', title: 'Pay $5',          desc: 'Activates your account in 30 seconds.', icon: DollarSign },
            { step: '02', title: 'Get leads',       desc: 'A queue of pre-vetted local businesses lands in your dashboard.', icon: Users },
            { step: '03', title: 'Send the pitch',  desc: 'Pick a template, hit send. They see their custom website preview.', icon: MessageSquare },
            { step: '04', title: 'Get paid',        desc: 'Cash hits your account every Friday for every closed deal.', icon: CheckCircle },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div key={step} style={{ padding: '32px 24px', borderRadius: 18, border: '1px solid #1e2218', background: '#111310', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 16, right: 18, fontSize: 36, fontWeight: 900, color: '#1e2218', letterSpacing: '-2px' }}>
                {step}
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: '#c8f13518', border: '1px solid #c8f13530', marginBottom: 18 }}>
                <Icon size={17} style={{ color: '#c8f135' }} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#5a6a4a', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '90px 1.5rem 100px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>Questions</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            Things people ask before they sign up.
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQS.map((f, i) => (
            <button key={f.q} onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                width: '100%', textAlign: 'left', padding: '22px 26px',
                background: openFaq === i ? '#111310' : '#0d0e0b',
                border: openFaq === i ? '1px solid #c8f13540' : '1px solid #1e2218',
                borderRadius: 14, cursor: 'pointer', transition: 'all .2s',
                color: '#d4dfc4', fontFamily: 'inherit',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{f.q}</span>
                <ChevronDown size={18} style={{ color: '#c8f135', transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
              </div>
              {openFaq === i && (
                <p style={{ fontSize: 14, color: '#8a9a7a', lineHeight: 1.7, marginTop: 14 }}>
                  {f.a}
                </p>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '100px 1.5rem', textAlign: 'center', maxWidth: 760, margin: '0 auto',
                        background: 'radial-gradient(ellipse at center, #c8f13510, transparent 70%)' }}>
        <h2 style={{ fontSize: 'clamp(2.25rem, 6vw, 3.75rem)', fontWeight: 900, color: '#fff', marginBottom: 20, letterSpacing: '-1.5px', lineHeight: 1.05 }}>
          $5 in. <span style={{ color: '#c8f135' }}>$119</span> per sale out.
        </h2>
        <p style={{ fontSize: 17, color: '#5a6a4a', marginBottom: 40, lineHeight: 1.6, maxWidth: 540, margin: '0 auto 40px' }}>
          Stop trading hours for $15. Get paid like a closer.
          Your first sale pays back your signup <span style={{ color: '#c8f135', fontWeight: 700 }}>23 times over</span>.
        </p>
        <Link href="/join"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '20px 48px',
                   borderRadius: 14, fontWeight: 900, fontSize: 18, textDecoration: 'none',
                   background: '#c8f135', color: '#0a0b09', boxShadow: '0 0 100px #c8f13560' }}>
          Pay $5 and start earning <ArrowRight size={20} />
        </Link>
        <p style={{ fontSize: 12, color: '#3a4a2a', marginTop: 20 }}>
          Stripe-secured · Refunded in 7 days if you change your mind
        </p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1e14', padding: '40px 1.5rem 32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <Logo size={32} textSize="lg" />
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
          <a href="#math" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>The math</a>
          <a href="#workers" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>Workers</a>
          <a href="#faq" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>FAQ</a>
          <Link href="/login" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>Sign in</Link>
        </div>
        <p style={{ fontSize: 11, color: '#2a3a1a' }}>© {new Date().getFullYear()} Website Hustle · All rights reserved</p>
      </footer>
    </div>
  )
}

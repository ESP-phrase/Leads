'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight, DollarSign, Zap, CheckCircle, Phone, MessageSquare,
  Globe, Star, TrendingUp, Lock, Clock, ChevronDown,
  Sparkles, X, Check, Briefcase, Car, Users, UserPlus, Link2,
} from 'lucide-react'
import Logo from '@/components/Logo'

const FAQS = [
  {
    q: 'Is this actually legit?',
    a: 'Yes. We charge local businesses $299 for a custom website. You get 40% ($119) when they buy. It\'s a real product solving a real problem — most local businesses (plumbers, salons, mechanics) still don\'t have a website in 2025.',
  },
  {
    q: 'Why is there a $5 deposit?',
    a: 'It screens out tire-kickers and covers your account activation. You pay $5 when you submit your app. If approved, the $5 covers your account. If rejected, we refund it automatically (5–10 business days back to your card). No risk to you.',
  },
  {
    q: 'How does the application process work?',
    a: 'Submit the 2-minute form → pay the $5 deposit → we review within 24 hours. Approved: you get a welcome text and instant access. Rejected: automatic full refund.',
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
  {
    q: 'What happens if the business wants changes to their website?',
    a: 'We handle all of that. You\'re the sales person, not the web developer. Once a business buys, our team takes over. You never deal with revisions, hosting, or support. Your job ends at the sale.',
  },
  {
    q: 'Is there a minimum number of deals I have to close?',
    a: 'No minimums, no quotas, no schedule. This is fully on your own terms. Close one deal a month or ten — you get paid the same flat $119 per deal either way. If life gets busy, just come back when you\'re ready.',
  },
  {
    q: 'What cities and states can I work in?',
    a: 'Anywhere in the United States. You can work in your own city or pull leads from any city in our database. Most workers start in their local area since they know the businesses, then expand.',
  },
  {
    q: 'Can I make money without selling anything myself?',
    a: 'Yes — through referrals. Every approved worker gets a unique invite link. Share it. When someone you referred closes a deal, you automatically earn 15% of their $119 commission ($17.85). If you refer 5 workers who each close 10 deals, that\'s $892 in passive income on top of your own sales. Forever, with no extra work.',
  },
  {
    q: 'How does the referral program work exactly?',
    a: 'After approval you get a unique link like siteforge.app/join?ref=SF-ABC123. Anyone who applies through that link gets tied to you. Once they\'re approved and start closing deals, 15% of every $119 they earn goes to you — automatically, every Friday payout. There\'s no cap and no expiration.',
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
          <div className="nav-links-desktop" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <a href="#math" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none', fontWeight: 500 }}>Earnings</a>
            <a href="#referral" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none', fontWeight: 500 }}>Referrals</a>
            <a href="#how" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none', fontWeight: 500 }}>How it works</a>
            <Link href="/pricing" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
            <a href="#faq" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none', fontWeight: 500 }}>FAQ</a>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/login" className="nav-cta-desktop" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none', padding: '8px 16px', fontWeight: 500 }}>
              Sign in
            </Link>
            <Link href="/join#apply"
              style={{ fontSize: 14, fontWeight: 800, padding: '10px 22px', borderRadius: 99,
                       background: '#c8f135', color: '#0a0b09', textDecoration: 'none' }}>
              Start earning →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '100px 1.5rem 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
                          borderRadius: 99, marginBottom: 32, fontSize: 12, fontWeight: 700,
                          background: '#c8f13518', border: '1px solid #c8f13540', color: '#c8f135' }}>
              <Sparkles size={12} /> Accepting applications now
            </div>

            <h1 style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.02,
                         color: '#fff', marginBottom: 24, letterSpacing: '-2px' }}>
              Local businesses need websites.<br />
              You have a phone.<br />
              <span style={{ color: '#c8f135' }}>We pay you $119</span> to connect them.
            </h1>
            <p style={{ fontSize: 18, color: '#6b7a5a', lineHeight: 1.7, marginBottom: 40, maxWidth: 500 }}>
              We build the site. We write the pitch. We handle payment and delivery.
              You send one text — and collect <strong style={{ color: '#fff' }}>40% of every $299 sale.</strong>
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
              <Link href="/join#apply"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 36px',
                         borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: 'none',
                         background: '#c8f135', color: '#0a0b09', boxShadow: '0 0 60px #c8f13540',
                         letterSpacing: '-0.3px' }}>
                Apply — $5 deposit <ArrowRight size={16} />
              </Link>
              <Link href="/pricing"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 28px',
                         borderRadius: 12, fontWeight: 600, fontSize: 16, textDecoration: 'none',
                         border: '1px solid #2a3020', color: '#8a9a7a' }}>
                See pricing
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                '$5 deposit — refunded automatically if you\'re not approved',
                '$119 flat per closed deal, paid every Friday via direct deposit',
                'Earn 15% of every sale your recruits close, forever',
              ].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <CheckCircle size={14} style={{ color: '#c8f135', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: '#5a6a4a', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
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
                    Hey Mike — I made a sample website for Mike&apos;s Plumbing. Take a look:
                    <br/>
                    <span style={{ fontWeight: 700, textDecoration: 'underline' }}>mike-plumbing.vercel.app</span>
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

      {/* HONEST DEAL STRIP — what we promise, not fake numbers */}
      <section style={{ borderTop: '1px solid #1a1e14', borderBottom: '1px solid #1a1e14', padding: '36px 1.5rem', background: '#0d0e0b' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[
            { icon: '✓', label: '$5 deposit · refunded if not approved' },
            { icon: '✓', label: 'We review every application in 24 hours' },
            { icon: '✓', label: '$119 per sale · paid weekly via direct deposit' },
            { icon: '✓', label: 'Earn 15% on every sale your recruits close' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 22, height: 22, borderRadius: 99, background: '#c8f13520', border: '1px solid #c8f13540',
                color: '#c8f135', fontSize: 12, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {s.icon}
              </span>
              <p style={{ fontSize: 13, color: '#a0b080', lineHeight: 1.4, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BIG STATS */}
      <section style={{ padding: '80px 1.5rem', background: '#0a0b09' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, background: '#1a1e14', borderRadius: 20, overflow: 'hidden', border: '1px solid #1a1e14' }}>
            {[
              { num: '33M+',  label: 'U.S. small businesses',       sub: 'without a working website' },
              { num: '$119',  label: 'Your cut per sale',            sub: '40% of the $299 price' },
              { num: '24h',   label: 'Application review',           sub: 'approved or refunded, fast' },
              { num: '$0',    label: 'Monthly fees',                  sub: 'one $5 deposit, done forever' },
              { num: '15%',   label: 'Referral commission',          sub: 'on every recruit sale, forever' },
            ].map(({ num, label, sub }) => (
              <div key={label} style={{ padding: '40px 28px', background: '#0d0e0b', textAlign: 'center' }}>
                <p style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, color: '#c8f135', letterSpacing: '-1.5px', lineHeight: 1, marginBottom: 10 }}>{num}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: 12, color: '#3a4a2a' }}>{sub}</p>
              </div>
            ))}
          </div>
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

      {/* WHAT YOU'RE SELLING */}
      <section style={{ padding: '100px 1.5rem', borderTop: '1px solid #1a1e14', background: '#0a0b09' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))', gap: 80, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 14, textTransform: 'uppercase' }}>The product</p>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: 20, lineHeight: 1.05 }}>
                You're selling something people <span style={{ color: '#c8f135' }}>actually need.</span>
              </h2>
              <p style={{ fontSize: 16, color: '#6b7a5a', lineHeight: 1.7, marginBottom: 32 }}>
                Most plumbers, roofers, salons, and contractors have zero web presence in 2025. Our AI builds them a real, professional one-page website in 60 seconds — with their business name, phone number, services, and photos pulled automatically from Google.
              </p>
              <p style={{ fontSize: 16, color: '#6b7a5a', lineHeight: 1.7, marginBottom: 32 }}>
                When you text a lead their preview link, they see a finished site with their real branding. Not a template. Not a pitch. Something real they can own for $299 — and you get $119 of that.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Mobile-friendly, fast-loading, SEO-ready',
                  'Their real business name, phone, hours & services',
                  'Hosted forever — no renewals, no maintenance',
                  '$299 one-time. No subscriptions to sell.',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle size={15} style={{ color: '#c8f135', flexShrink: 0 }} />
                    <p style={{ fontSize: 14, color: '#a0b080' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Website mockup */}
            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #1e2218', background: '#111310', boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 60px #c8f13515' }}>
                {/* Browser chrome */}
                <div style={{ padding: '12px 16px', background: '#0d0e0b', borderBottom: '1px solid #1e2218', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['#3a1a1a','#3a3a1a','#1a3a1a'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                  </div>
                  <div style={{ flex: 1, background: '#1a1e14', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#3a4a2a', marginLeft: 8 }}>
                    mike-plumbing.siteforge.app
                  </div>
                </div>
                {/* Mock website content */}
                <div style={{ padding: '32px 28px', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1a4fa0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Globe size={20} style={{ color: '#fff' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: 0 }}>Mike&apos;s Plumbing</p>
                      <p style={{ fontSize: 11, color: '#666', margin: 0 }}>Austin, TX · Licensed & Insured</p>
                    </div>
                  </div>
                  <div style={{ background: '#1a4fa0', borderRadius: 10, padding: '20px', marginBottom: 16, color: '#fff' }}>
                    <p style={{ fontSize: 18, fontWeight: 900, margin: '0 0 6px' }}>Fast, Reliable Plumbing</p>
                    <p style={{ fontSize: 12, opacity: 0.8, margin: '0 0 14px' }}>Same-day service · Free estimates · 20 years experience</p>
                    <div style={{ display: 'inline-block', background: '#fff', color: '#1a4fa0', padding: '8px 18px', borderRadius: 6, fontSize: 12, fontWeight: 800 }}>
                      Call (512) 555-0193
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {['Drain Cleaning', 'Water Heaters', 'Emergency'].map(s => (
                      <div key={s} style={{ background: '#f5f5f5', borderRadius: 8, padding: '10px 8px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#333' }}>{s}</div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#f59e0b" stroke="none" />)}
                    <span style={{ fontSize: 12, color: '#666', marginLeft: 4 }}>4.9 · 142 Google reviews</span>
                  </div>
                </div>
              </div>
              {/* Price tag */}
              <div style={{ position: 'absolute', bottom: -16, right: -16, background: '#c8f135', borderRadius: 12, padding: '12px 20px', boxShadow: '0 8px 32px #c8f13550' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0a0b09', margin: 0 }}>Business pays</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#0a0b09', margin: 0, letterSpacing: '-1px' }}>$299</p>
              </div>
              <div style={{ position: 'absolute', top: -16, left: -16, background: '#0d2218', border: '1px solid #c8f13540', borderRadius: 12, padding: '12px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7a5a', margin: 0 }}>You keep</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#c8f135', margin: 0, letterSpacing: '-1px' }}>$119</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOLLOW-UP DRIP SEQUENCE */}
      <section id="how" style={{ padding: '100px 1.5rem', borderTop: '1px solid #1a1e14', background: '#0d0e0b' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))', gap: 80, alignItems: 'center' }}>

            {/* Left: copy */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 14, textTransform: 'uppercase' }}>Automated follow-ups</p>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: 20, lineHeight: 1.1 }}>
                Most deals close on follow-up 2 or 3. We send them automatically.
              </h2>
              <p style={{ fontSize: 16, color: '#6b7a5a', lineHeight: 1.7, marginBottom: 28 }}>
                You send the first text. After that, our system automatically follows up with the lead over the next 7 days — so you never lose a deal to forgetfulness.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: MessageSquare, text: '4-step automated drip over 7 days' },
                  { icon: Phone,         text: 'Each message personalized with the business name' },
                  { icon: CheckCircle,   text: 'Auto-stops the moment they reply or buy' },
                  { icon: Zap,           text: 'You see every response in real time on your dashboard' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: '#c8f13518', border: '1px solid #c8f13530', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} style={{ color: '#c8f135' }} />
                    </div>
                    <span style={{ fontSize: 14, color: '#8a9a7a' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: drip sequence visual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                {
                  day: 'Day 0 — You hit send',
                  you: true,
                  msg: "Hey Mike! I put together a free website preview for Mike's Plumbing. Take a look: mike-plumbing.siteforge.app — Want me to make it yours for $299?",
                  badge: 'First touch',
                  badgeColor: '#c8f135',
                },
                {
                  day: 'Day 1 — Auto follow-up',
                  you: true,
                  msg: "Just following up, Mike — did you get a chance to check out the site? It's mobile-friendly and ready to go live today.",
                  badge: 'Auto-sent',
                  badgeColor: '#4a9eff',
                },
                {
                  day: 'Day 3 — Auto follow-up',
                  you: true,
                  msg: "Quick note: we can have this live under your own domain by tomorrow. $299 one-time, no monthly fees. Want me to send the link?",
                  badge: 'Auto-sent',
                  badgeColor: '#4a9eff',
                },
                {
                  day: 'Day 7 — Final follow-up',
                  you: true,
                  msg: "Last message, Mike — if the timing isn't right, no worries. The site will be here whenever you're ready. Just reply and I'll send the link.",
                  badge: 'Auto-sent',
                  badgeColor: '#4a9eff',
                },
              ].map(({ day, msg, badge, badgeColor }, i) => (
                <div key={day} style={{ position: 'relative', paddingBottom: i < 3 ? 0 : 0 }}>
                  {/* Connector line */}
                  {i < 3 && (
                    <div style={{ position: 'absolute', left: 16, top: 44, bottom: -8, width: 1, background: '#1e2218', zIndex: 0 }} />
                  )}
                  <div style={{ display: 'flex', gap: 14, paddingBottom: i < 3 ? 24 : 0, position: 'relative' }}>
                    {/* Dot */}
                    <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginTop: 6, zIndex: 1,
                                  background: i === 0 ? '#c8f135' : '#111310',
                                  border: `1px solid ${i === 0 ? '#c8f135' : '#2a3a1a'}`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: i === 0 ? '#0a0b09' : '#3a4a2a' }}>{i + 1}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: '#3a4a2a', fontWeight: 600 }}>{day}</span>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                                       background: `${badgeColor}20`, color: badgeColor, border: `1px solid ${badgeColor}40` }}>
                          {badge}
                        </span>
                      </div>
                      <div style={{ background: '#111310', border: '1px solid #1e2218', borderRadius: '12px 12px 12px 4px',
                                    padding: '12px 14px', fontSize: 13, color: '#8a9a7a', lineHeight: 1.6 }}>
                        {msg}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 12, background: '#0d2218', border: '1px solid #c8f13530', display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={16} style={{ color: '#c8f135', flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#a0b080', lineHeight: 1.5 }}>
                  <strong style={{ color: '#c8f135' }}>Sequence auto-stops</strong> the moment Mike replies or clicks the payment link. You always stay in control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section style={{ padding: '100px 1.5rem', borderTop: '1px solid #1a1e14', background: 'linear-gradient(180deg, #0d0e0b, #0a0b09)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>Who it's for</p>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
              If you can text, you can do this.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { who: 'College students',      why: 'Text between classes. $119 covers a week of groceries. Refer classmates and stack passive income on top.', tag: 'No schedule needed' },
              { who: 'Gig workers',           why: 'Already have your phone out between rides or deliveries? Use that idle time to build a second income stream.', tag: 'Fits any gap in your day' },
              { who: 'Stay-at-home parents',  why: 'Fully async — no calls required, no meetings. Send texts when you have 20 minutes, get paid on Fridays.', tag: 'Work on your schedule' },
              { who: 'Salespeople',           why: 'If you already know how to pitch, this removes the hard part. The product is built. You just make the intro.', tag: 'Your skills, amplified' },
              { who: 'Side hustlers',         why: 'Close one deal a week and make $476/month on top of what you\'re already doing. No quotas, no boss.', tag: 'Stack on anything' },
              { who: 'Entrepreneurs',         why: 'Recruit a team, earn 15% of their sales. Run it like a business — your network\'s work becomes your income.', tag: 'Scale with referrals' },
            ].map(({ who, why, tag }) => (
              <div key={who} style={{ padding: '28px 24px', borderRadius: 20, background: '#111310', border: '1px solid #1e2218' }}>
                <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 6, background: '#c8f13515', border: '1px solid #c8f13530', fontSize: 10, fontWeight: 700, color: '#c8f135', letterSpacing: 0.5, marginBottom: 14, textTransform: 'uppercase' }}>{tag}</div>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{who}</p>
                <p style={{ fontSize: 13, color: '#5a6a4a', lineHeight: 1.65 }}>{why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFERRAL — passive income section */}
      <section id="referral" style={{ padding: '100px 1.5rem', borderTop: '1px solid #111', background: '#000', position: 'relative', overflow: 'hidden' }}>

        {/* Floating coin — left */}
        <div style={{ position: 'absolute', left: '4%', top: '18%', pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'radial-gradient(circle at 32% 28%, #e8ff70, #c8f135 45%, #6a9000)',
            boxShadow: '0 0 60px #c8f13560, 0 12px 40px rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: 'rotate(-18deg) perspective(300px) rotateX(15deg)',
          }}>
            <Users size={40} style={{ color: '#0a0b09' }} />
          </div>
        </div>

        {/* Floating coin — right */}
        <div style={{ position: 'absolute', right: '4%', top: '12%', pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: 'radial-gradient(circle at 32% 28%, #e8ff70, #c8f135 45%, #6a9000)',
            boxShadow: '0 0 80px #c8f13570, 0 16px 48px rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: 'rotate(12deg) perspective(300px) rotateX(15deg)',
          }}>
            <DollarSign size={50} style={{ color: '#0a0b09' }} />
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px',
                        borderRadius: 99, marginBottom: 28, fontSize: 13, fontWeight: 700,
                        background: '#111', border: '1px solid #2a2a2a', color: '#c8f135' }}>
            <Users size={14} /> Referral program
          </div>

          {/* Headline */}
          <h2 style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 900, lineHeight: 1.0,
                       color: '#fff', letterSpacing: '-2px', marginBottom: 24 }}>
            Recruit once.<br />
            Get paid{' '}
            <em style={{ fontStyle: 'italic', color: '#c8f135',
                         textShadow: '0 0 60px #c8f13590, 0 0 120px #c8f13540' }}>
              forever.
            </em>
          </h2>

          {/* Subtext */}
          <p style={{ fontSize: 18, color: '#888', lineHeight: 1.65, maxWidth: 620, margin: '0 auto 60px', fontWeight: 400 }}>
            Every approved worker gets a unique invite link. Share it. When
            someone you referred closes a deal, you pocket{' '}
            <strong style={{ color: '#fff' }}>15% of their $119</strong> —
            automatically, every Friday.
          </p>

          {/* 3 Steps */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 12, alignItems: 'center', marginBottom: 40 }}>
            {/* Step 1 */}
            <div style={{ padding: '28px 20px', borderRadius: 18, textAlign: 'center', background: '#0d0e0b', border: '1px solid #1e2218', position: 'relative' }}>
              <span style={{ position: 'absolute', top: 14, left: 16, fontSize: 11, fontWeight: 800, color: '#2a3a1a', letterSpacing: 1 }}>01</span>
              <div style={{ width: 56, height: 56, borderRadius: '50%', margin: '0 auto 18px', background: '#0a0b09', border: '1px solid #c8f13540', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px #c8f13520' }}>
                <Link2 size={22} style={{ color: '#c8f135' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Share your link</p>
              <p style={{ fontSize: 13, color: '#5a6a4a', lineHeight: 1.65 }}>You get a unique invite link after approval. Post it anywhere.</p>
            </div>
            {/* Arrow */}
            <div style={{ fontSize: 22, color: '#2a3a1a', fontWeight: 700, padding: '0 4px' }}>→</div>
            {/* Step 2 */}
            <div style={{ padding: '28px 20px', borderRadius: 18, textAlign: 'center', background: '#0d0e0b', border: '1px solid #1e2218', position: 'relative' }}>
              <span style={{ position: 'absolute', top: 14, left: 16, fontSize: 11, fontWeight: 800, color: '#2a3a1a', letterSpacing: 1 }}>02</span>
              <div style={{ width: 56, height: 56, borderRadius: '50%', margin: '0 auto 18px', background: '#0a0b09', border: '1px solid #c8f13540', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px #c8f13520' }}>
                <UserPlus size={22} style={{ color: '#c8f135' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 10 }}>They apply &amp; close</p>
              <p style={{ fontSize: 13, color: '#5a6a4a', lineHeight: 1.65 }}>Your recruit applies, gets approved, and starts closing deals.</p>
            </div>
            {/* Arrow */}
            <div style={{ fontSize: 22, color: '#2a3a1a', fontWeight: 700, padding: '0 4px' }}>→</div>
            {/* Step 3 */}
            <div style={{ padding: '28px 20px', borderRadius: 18, textAlign: 'center', background: '#0d0e0b', border: '1px solid #1e2218', position: 'relative' }}>
              <span style={{ position: 'absolute', top: 14, left: 16, fontSize: 11, fontWeight: 800, color: '#2a3a1a', letterSpacing: 1 }}>03</span>
              <div style={{ width: 56, height: 56, borderRadius: '50%', margin: '0 auto 18px', background: '#0a0b09', border: '1px solid #c8f13540', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px #c8f13520' }}>
                <DollarSign size={22} style={{ color: '#c8f135' }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 10 }}>You earn 15%</p>
              <p style={{ fontSize: 13, color: '#5a6a4a', lineHeight: 1.65 }}>Every $119 they make puts $17.85 in your pocket. No cap, no expiry.</p>
            </div>
          </div>

          {/* Feature strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 32 }}>
            {[
              { icon: TrendingUp,    label: 'Lifetime earnings',   sub: 'Earn forever from every approved recruit.' },
              { icon: Zap,           label: 'Automatic payouts',   sub: 'Paid out automatically every Friday.' },
              { icon: Star,          label: 'No limits',           sub: 'No cap on earnings. Refer more, earn more.' },
              { icon: CheckCircle,   label: 'Always on',           sub: 'The system works 24/7 for you.' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px',
                                        borderRadius: 14, background: '#0d0e0b', border: '1px solid #1e2218', textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                              background: '#c8f13518', border: '1px solid #c8f13530',
                              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={15} style={{ color: '#c8f135' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{label}</p>
                  <p style={{ fontSize: 12, color: '#4a5a3a', lineHeight: 1.5 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
                        background: '#0d0e0b', border: '1px solid #1e2218', borderRadius: 20, padding: '28px 32px' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#c8f13520', border: '1px solid #c8f13535',
                               display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <TrendingUp size={20} style={{ color: '#c8f135' }} />
                </div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Turn your network</p>
                  <p style={{ fontSize: 18, fontWeight: 900, color: '#c8f135', letterSpacing: '-0.5px' }}>into your income.</p>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link href="/join#apply"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 40px',
                         borderRadius: 12, fontWeight: 900, fontSize: 16, textDecoration: 'none',
                         background: '#c8f135', color: '#0a0b09', whiteSpace: 'nowrap' }}>
                Get your invite link <ArrowRight size={16} />
              </Link>
              <p style={{ fontSize: 11, color: '#2a3a1a', marginTop: 8 }}>Start sharing. Start earning. Every Friday.</p>
            </div>
          </div>

        </div>
      </section>

      {/* INCOME STACK */}
      <section style={{ padding: '100px 1.5rem', borderTop: '1px solid #1a1e14', background: '#0a0b09' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>Two income streams</p>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
              Your sales + your recruits' sales.
            </h2>
            <p style={{ fontSize: 17, color: '#6b7a5a', marginTop: 16, maxWidth: 540, margin: '16px auto 0' }}>
              Most workers stack both. Close your own deals while your recruits close theirs.
            </p>
          </div>

          <div style={{ background: '#111310', borderRadius: 24, border: '1px solid #1e2218', overflow: 'hidden' }}>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#0d0e0b', borderBottom: '1px solid #1e2218' }}>
              {['', 'Your own sales', 'Your recruits'].map((h, i) => (
                <div key={i} style={{ padding: '16px 20px', fontSize: 12, fontWeight: 800, color: i === 0 ? '#2a3a1a' : '#c8f135', textTransform: 'uppercase', letterSpacing: 1, textAlign: i === 0 ? 'left' : 'center' }}>{h}</div>
              ))}
            </div>
            {/* Rows */}
            {[
              { label: 'Just starting',     own: '1 sale/mo',   rec: '0 recruits',   ownEarn: 119,   recEarn: 0 },
              { label: 'Getting traction',  own: '4 sales/mo',  rec: '2 recruits',   ownEarn: 476,   recEarn: 119 },
              { label: 'Part-time grind',   own: '8 sales/mo',  rec: '5 recruits',   ownEarn: 952,   recEarn: 357, highlight: true },
              { label: 'Full-time',         own: '15 sales/mo', rec: '10 recruits',  ownEarn: 1785,  recEarn: 893 },
            ].map(({ label, own, rec, ownEarn, recEarn, highlight }) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #1a1e14',
                                        background: highlight ? '#c8f13508' : 'transparent' }}>
                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {highlight && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8f135', flexShrink: 0 }} />}
                  <p style={{ fontSize: 14, fontWeight: highlight ? 800 : 600, color: highlight ? '#fff' : '#6b7a5a' }}>{label}</p>
                </div>
                <div style={{ padding: '20px', textAlign: 'center', borderLeft: '1px solid #1a1e14' }}>
                  <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>${ownEarn.toLocaleString()}</p>
                  <p style={{ fontSize: 11, color: '#3a4a2a', marginTop: 2 }}>{own}</p>
                </div>
                <div style={{ padding: '20px', textAlign: 'center', borderLeft: '1px solid #1a1e14' }}>
                  <p style={{ fontSize: 18, fontWeight: 900, color: recEarn > 0 ? '#c8f135' : '#2a3a1a', letterSpacing: '-0.5px' }}>
                    {recEarn > 0 ? `+$${recEarn.toLocaleString()}` : '—'}
                  </p>
                  <p style={{ fontSize: 11, color: '#3a4a2a', marginTop: 2 }}>{rec}</p>
                </div>
              </div>
            ))}
            {/* Total row */}
            <div style={{ padding: '20px 20px', background: '#0d0e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 12, color: '#3a4a2a' }}>Based on ~5 hrs/deal for own sales · 15% of $119 for recruits</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#c8f135' }}>Stack both streams →</p>
            </div>
          </div>
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
              { icon: Sparkles,  job: 'One SiteForge sale',     hours: '~30 mins', pay: '$119',  takehome: 'after fees: $119',  bad: false },
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

      {/* WHY THIS WORKS — replaces fake testimonials */}
      <section id="workers" style={{ padding: '100px 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>Why this works</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            We do the hard parts. <br/>You send the text.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
          {[
            {
              title: 'Real businesses, no cold-sourcing',
              body: 'We pull pre-vetted local businesses (4+ stars, no website, real phone numbers) directly from Google Maps. You never have to find leads — they\'re waiting in your dashboard.',
              icon: Globe,
            },
            {
              title: 'Sites built before you call',
              body: 'Our AI builds them a custom website in 60 seconds. When you send them the link, they see something real — not a sales pitch in the abstract.',
              icon: Sparkles,
            },
            {
              title: 'Templates do the talking',
              body: 'Send pre-written SMS messages we\'ve tested. Your name, their business, their preview link — auto-filled. You hit send.',
              icon: MessageSquare,
            },
            {
              title: 'We handle the payment',
              body: 'When the business decides to buy, we send them the payment link. No awkward Venmo. No chasing. Stripe processes the $299, and your $119 is queued for payout.',
              icon: DollarSign,
            },
            {
              title: 'You keep what you close',
              body: 'No quota, no salary clawbacks, no minimums. Every closed deal pays you $119. Period.',
              icon: CheckCircle,
            },
            {
              title: 'No experience needed',
              body: 'If you can text, you can do this. Most workers send their first 50 messages on day one. Some close on day one. Others take a week. The product sells itself.',
              icon: Lock,
            },
          ].map(({ title, body, icon: Icon }) => (
            <div key={title} style={{
              padding: '28px 26px', borderRadius: 20, background: '#111310', border: '1px solid #1e2218',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: '#c8f13518', border: '1px solid #c8f13530',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
              }}>
                <Icon size={17} style={{ color: '#c8f135' }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#5a6a4a', lineHeight: 1.65 }}>{body}</p>
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

          <Link href="/join#apply"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 40px',
                     borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: 'none',
                     background: '#c8f135', color: '#0a0b09', boxShadow: '0 0 80px #c8f13550' }}>
            Apply now <ArrowRight size={16} />
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
            { step: '01', title: 'Apply + $5 deposit', desc: 'Submit the 2-min form and put down a refundable $5 deposit.', icon: UserPlus },
            { step: '02', title: 'We review',          desc: 'Approved within 24 hours: $5 covers activation. Rejected: automatic refund.', icon: DollarSign },
            { step: '03', title: 'Send the pitch',     desc: 'Pick a template, hit send. They see their custom website preview.', icon: MessageSquare },
            { step: '04', title: 'Get paid',           desc: 'Cash hits your account every Friday for every closed deal.', icon: CheckCircle },
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

      {/* YOUR FIRST WEEK */}
      <section style={{ padding: '100px 1.5rem', borderTop: '1px solid #1a1e14', background: '#0d0e0b' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>What to expect</p>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>Your first 7 days.</h2>
          </div>
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: 19, top: 24, bottom: 24, width: 2, background: '#1e2218' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { day: 'Day 1',   title: 'Apply & deposit $5',           body: 'Fill out the 2-min form, pay the $5 deposit. You\'ll get a confirmation SMS.', done: true },
                { day: 'Day 1–2', title: 'We review your application',   body: 'A real person reads your application. Most are approved within a few hours.', done: true },
                { day: 'Day 2',   title: 'You\'re approved — access granted', body: 'You get a welcome text with login link, your lead list, SMS templates, and your unique referral code.', done: true },
                { day: 'Day 2–3', title: 'Send your first 50 texts',     body: 'Pick a template. Your city is pre-loaded. Hit send on 50 businesses. Takes under 2 hours.', done: false },
                { day: 'Day 3–7', title: 'Responses come in',            body: 'Some will ask questions. Some will say send the link. Use the reply templates. Follow the drip.', done: false },
                { day: 'Day 7',   title: 'First payout Friday',          body: 'Any deals closed this week hit your account. Workers average 1 sale in their first 50 texts.', done: false },
              ].map(({ day, title, body, done }, i) => (
                <div key={day} style={{ display: 'flex', gap: 20, paddingBottom: i < 5 ? 36 : 0 }}>
                  <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', zIndex: 1,
                                background: done ? '#c8f135' : '#111310',
                                border: `2px solid ${done ? '#c8f135' : '#2a3a1a'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {done
                      ? <CheckCircle size={18} style={{ color: '#0a0b09' }} />
                      : <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2a3a1a' }} />}
                  </div>
                  <div style={{ paddingTop: 8 }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: done ? '#c8f135' : '#3a4a2a', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{day}</p>
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{title}</p>
                    <p style={{ fontSize: 13, color: '#5a6a4a', lineHeight: 1.65 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENCY BLOCK — honest numbers, no fake testimonials */}
      <section style={{ padding: '100px 1.5rem', borderTop: '1px solid #1a1e14', background: '#0a0b09' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>Straight talk</p>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
              We&apos;ll be honest with you.
            </h2>
            <p style={{ fontSize: 17, color: '#5a6a4a', marginTop: 16, maxWidth: 540, margin: '16px auto 0', lineHeight: 1.7 }}>
              This isn&apos;t passive income out of thin air. Here&apos;s exactly what the work looks like.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              {
                icon: Check,
                color: '#c8f135',
                title: 'Most workers close in their first 50 texts',
                body: 'That\'s about 1–2 hours of work. Not every business says yes on the first message — that\'s what the automated follow-up drip is for.',
              },
              {
                icon: Check,
                color: '#c8f135',
                title: 'The average response rate is around 8–12%',
                body: 'Out of 50 texts, expect 4–6 responses. Of those, 1–2 will buy. The math works. Scale your volume, scale your income.',
              },
              {
                icon: X,
                color: '#d45a5a',
                title: 'This is not "get rich quick"',
                body: 'You have to put in the texts. Workers who close consistently are the ones who send volume and let the follow-up automation do its job.',
              },
              {
                icon: Check,
                color: '#c8f135',
                title: 'The product genuinely sells itself',
                body: 'Sending a business owner a live preview of their own website — one that already has their name, phone, and services — is the most effective pitch in local sales.',
              },
            ].map(({ icon: Icon, color, title, body }) => (
              <div key={title} style={{ padding: '28px 26px', borderRadius: 20, background: '#111310', border: '1px solid #1e2218' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 10, lineHeight: 1.3 }}>{title}</p>
                <p style={{ fontSize: 13, color: '#5a6a4a', lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
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
        <Link href="/join#apply"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '20px 48px',
                   borderRadius: 14, fontWeight: 900, fontSize: 18, textDecoration: 'none',
                   background: '#c8f135', color: '#0a0b09', boxShadow: '0 0 100px #c8f13560' }}>
          Apply now earning <ArrowRight size={20} />
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
          <Link href="/sms-consent" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>SMS Terms</Link>
          <Link href="/privacy" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/login" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>Sign in</Link>
        </div>
        <p style={{ fontSize: 11, color: '#2a3a1a' }}>© {new Date().getFullYear()} SiteForge · All rights reserved</p>
      </footer>
    </div>
  )
}

import Link from 'next/link'
import {
  ArrowRight, DollarSign, Zap, CheckCircle, Phone, MessageSquare,
  Globe, Star, TrendingUp, Lock, Clock,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div style={{ background: '#0a0b09', color: '#d4dfc4', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1e14', position: 'sticky', top: 0, zIndex: 50, background: '#0a0b09cc', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>
            <span style={{ color: '#c8f135' }}>Website</span><span style={{ color: '#fff' }}>Hustle</span>
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/login"
              style={{ fontSize: 13, color: '#8a9a7a', textDecoration: 'none', padding: '8px 16px', fontWeight: 500 }}>
              Sign in
            </Link>
            <Link href="/join"
              style={{ fontSize: 13, fontWeight: 800, padding: '9px 20px', borderRadius: 99,
                       background: '#c8f135', color: '#0a0b09', textDecoration: 'none' }}>
              Start earning →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO — earn $$ */}
      <section style={{ padding: '80px 1.5rem 60px', textAlign: 'center', maxWidth: 920, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
                      borderRadius: 99, marginBottom: 24, fontSize: 12, fontWeight: 700,
                      background: '#c8f13518', border: '1px solid #c8f13540', color: '#c8f135' }}>
          <Zap size={12} /> $5 to start · No experience needed
        </div>

        <h1 style={{ fontSize: 'clamp(2.75rem, 8vw, 5.25rem)', fontWeight: 900, lineHeight: 1.0,
                     color: '#fff', marginBottom: 28, letterSpacing: '-2px' }}>
          Make <span style={{ color: '#c8f135' }}>$119</span> per sale.
          <br />
          From your phone.
        </h1>
        <p style={{ fontSize: 20, color: '#8a9a7a', lineHeight: 1.55, marginBottom: 36,
                    maxWidth: 620, margin: '0 auto 36px' }}>
          Pay <span style={{ color: '#fff', fontWeight: 700 }}>$5</span> to activate your account.
          We hand you ready-to-call businesses that need websites.
          You text them. They pay <span style={{ color: '#fff', fontWeight: 700 }}>$299</span>.
          You keep <span style={{ color: '#c8f135', fontWeight: 700 }}>$119</span>.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <Link href="/join"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 36px',
                     borderRadius: 12, fontWeight: 800, fontSize: 17, textDecoration: 'none',
                     background: '#c8f135', color: '#0a0b09', boxShadow: '0 0 60px #c8f13540' }}>
            Pay $5 and start earning <ArrowRight size={17} />
          </Link>
        </div>
        <p style={{ fontSize: 13, color: '#4a5a3a' }}>
          ⚡ Instant activation · Cash out weekly · Cancel anytime
        </p>
      </section>

      {/* THE BIG MONEY HOOK — what you can make */}
      <section style={{ padding: '40px 1.5rem 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>The math</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            Your earnings, not theory.
          </h2>
          <p style={{ fontSize: 16, color: '#5a6a4a', marginTop: 12, maxWidth: 540, margin: '12px auto 0' }}>
            We charge $299 per website. You get 40%. Here&apos;s exactly what you take home as you scale.
          </p>
        </div>

        {/* Earnings ladder */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            { sales: 1,   earn: 119,   label: 'Your first sale',     sub: 'after one call', glow: false },
            { sales: 5,   earn: 595,   label: 'Side hustle',          sub: '~1 hour/day',   glow: false },
            { sales: 10,  earn: 1190,  label: 'Part-time pace',       sub: '~3 hours/day',  glow: true  },
            { sales: 25,  earn: 2975,  label: 'Full-time push',       sub: '~5 hours/day',  glow: false },
          ].map(({ sales, earn, label, sub, glow }) => (
            <div key={sales} style={{
              padding: '28px 22px', borderRadius: 18, textAlign: 'center', position: 'relative',
              background: glow ? 'linear-gradient(135deg, #c8f13518, #c8f13505)' : '#111310',
              border: `1px solid ${glow ? '#c8f13560' : '#1e2218'}`,
              boxShadow: glow ? '0 0 60px #c8f13520' : 'none',
            }}>
              {glow && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                              background: '#c8f135', color: '#0a0b09', fontSize: 10, fontWeight: 900,
                              padding: '3px 12px', borderRadius: 99, letterSpacing: '0.5px' }}>
                  TYPICAL
                </div>
              )}
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7a5a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                {sales} sale{sales !== 1 ? 's' : ''}
              </p>
              <p style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900,
                          color: glow ? '#c8f135' : '#fff', lineHeight: 1, marginBottom: 8, letterSpacing: '-1px' }}>
                ${earn.toLocaleString()}
              </p>
              <p style={{ fontSize: 13, color: '#a0b080', fontWeight: 600, marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 11, color: '#3a4a2a' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Sub-text under ladder */}
        <p style={{ textAlign: 'center', fontSize: 14, color: '#5a6a4a', maxWidth: 580, margin: '0 auto' }}>
          That&apos;s every <span style={{ color: '#c8f135', fontWeight: 700 }}>completed deal</span> — not commissions on a quota,
          not pay-per-click, not pyramid nonsense. We close the deal, you get paid.
        </p>
      </section>

      {/* THE $5 BREAKDOWN */}
      <section style={{ padding: '60px 1.5rem', borderTop: '1px solid #1a1e14', borderBottom: '1px solid #1a1e14',
                        background: 'linear-gradient(180deg, transparent, #c8f13505)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px',
                        borderRadius: 99, marginBottom: 24, fontSize: 13, fontWeight: 800,
                        background: '#c8f13520', border: '1px solid #c8f13550', color: '#c8f135' }}>
            <DollarSign size={13} /> ONE-TIME SIGNUP
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: 20, letterSpacing: '-1px' }}>
            $5. That&apos;s it.
          </h2>
          <p style={{ fontSize: 17, color: '#8a9a7a', lineHeight: 1.6, marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
            One $5 payment to activate your account. No monthly fees. No hidden costs.
            Make that back on your first sale — <span style={{ color: '#c8f135', fontWeight: 700 }}>23× over</span>.
          </p>

          {/* What $5 gets you */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 32 }}>
            {[
              { icon: Globe,        text: 'Pre-built lead lists' },
              { icon: MessageSquare, text: 'SMS templates that convert' },
              { icon: Phone,        text: 'Built-in autodialer' },
              { icon: Lock,         text: 'No experience needed' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ padding: '18px 14px', borderRadius: 12, background: '#111310', border: '1px solid #1e2218', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={16} style={{ color: '#c8f135', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#a0b080', fontWeight: 600 }}>{text}</span>
              </div>
            ))}
          </div>

          <Link href="/join"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px',
                     borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: 'none',
                     background: '#c8f135', color: '#0a0b09', boxShadow: '0 0 60px #c8f13540' }}>
            Pay $5 and unlock your account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS — quick */}
      <section style={{ padding: '100px 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            Four steps. From $5 to $119.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {[
            { step: '01', title: 'Pay $5',          desc: 'Activates your account in 30 seconds.', icon: DollarSign },
            { step: '02', title: 'Get leads',       desc: 'We hand you a queue of pre-vetted local businesses.', icon: TrendingUp },
            { step: '03', title: 'Send the pitch',  desc: 'Pick a template, hit send. They see their custom website preview.', icon: MessageSquare },
            { step: '04', title: 'Get paid',        desc: '$119 hits your account every time one of them buys. Cash out weekly.', icon: CheckCircle },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div key={step} style={{ padding: '32px 24px', borderRadius: 18, border: '1px solid #1e2218', background: '#111310' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#c8f135', letterSpacing: 1 }}>{step}</span>
                <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#c8f13518', border: '1px solid #c8f13530' }}>
                  <Icon size={15} style={{ color: '#c8f135' }} />
                </div>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#5a6a4a', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF / Why this works */}
      <section style={{ padding: '40px 1.5rem 100px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            Why local businesses pay <span style={{ color: '#c8f135' }}>$299</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {[
            { icon: Globe,    title: 'They have no website.', desc: 'We only target businesses without a web presence — easy yes, easy close.' },
            { icon: Star,     title: 'They have great reviews.', desc: 'We filter for 4+ stars on Google. Real businesses, real customers, real money.' },
            { icon: Clock,    title: 'They want it now.',     desc: 'A custom-built site shows up in their text. They see what they\'ve been missing in 30 seconds.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ padding: '28px 24px', borderRadius: 18, border: '1px solid #1e2218', background: '#0f100d' }}>
              <Icon size={22} style={{ color: '#c8f135', marginBottom: 16 }} />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#5a6a4a', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '100px 1.5rem', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, color: '#fff', marginBottom: 20, letterSpacing: '-1px', lineHeight: 1.1 }}>
          $5 in. <span style={{ color: '#c8f135' }}>$119</span> per sale out.
        </h2>
        <p style={{ fontSize: 17, color: '#5a6a4a', marginBottom: 40, lineHeight: 1.6 }}>
          Stop trading hours for $15. Get paid like a closer.
          Your first sale pays back your signup <span style={{ color: '#c8f135', fontWeight: 700 }}>23 times over.</span>
        </p>
        <Link href="/join"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '20px 48px',
                   borderRadius: 14, fontWeight: 900, fontSize: 18, textDecoration: 'none',
                   background: '#c8f135', color: '#0a0b09', boxShadow: '0 0 80px #c8f13550' }}>
          Pay $5 and start <ArrowRight size={20} />
        </Link>
        <p style={{ fontSize: 13, color: '#3a4a2a', marginTop: 20 }}>
          No contracts · Cancel anytime · Stripe-secured payment
        </p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1e14', padding: '32px 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>
          <span style={{ color: '#c8f135' }}>Website</span><span style={{ color: '#fff' }}>Hustle</span>
        </p>
        <p style={{ fontSize: 12, color: '#2a3a1a' }}>© {new Date().getFullYear()} Website Hustle. All rights reserved.</p>
      </footer>
    </div>
  )
}

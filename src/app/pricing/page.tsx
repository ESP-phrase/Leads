import Link from 'next/link'
import Logo from '@/components/Logo'
import { CheckCircle, Zap, Flame, Shield, Headphones, RefreshCw, Lock, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — SiteForge',
  description: 'Start for $5. Upgrade to Operator for unlimited leads, automated follow-ups, and priority tools.',
  robots: { index: false, follow: false },
}

const STARTER_FEATURES = [
  '50 fresh leads per week',
  'Pre-written SMS pitch templates',
  'Lead pipeline tracker',
  'Weekly Friday payouts',
  'Referral program (15% of recruits\' sales)',
  'In-app call button',
]

const OPERATOR_FEATURES = [
  'Unlimited leads, any city',
  'Automated 4-step drip sequences',
  'In-browser WebRTC dialer',
  'Priority lead quality (4.5★+ only)',
  'Bulk SMS campaigns',
  'Advanced earnings analytics',
  'Referral network dashboard',
  'Priority support',
]

export default function PricingPage() {
  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative', overflow: 'hidden' }}>

      {/* Background glow blobs */}
      <div style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, #c8f13512, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 100, right: -300, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, #c8f13508, transparent 70%)', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #111', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}><Logo size={24} textSize="md" /></Link>
          <Link href="/join#apply" style={{ fontSize: 13, color: '#c8f135', textDecoration: 'none', fontWeight: 700 }}>Apply now →</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '80px 1.5rem 120px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* Label */}
        <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: 3, color: '#c8f135', marginBottom: 24 }}>// PRICING</p>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.0, color: '#fff', marginBottom: 18 }}>
          Start earning.<br />
          Scale when you&apos;re{' '}
          <em style={{ fontStyle: 'italic', color: '#c8f135', textShadow: '0 0 60px #c8f13580' }}>
            winning.
          </em>
        </h1>
        <p style={{ fontSize: 18, color: '#555', marginBottom: 64 }}>No commitments. Upgrade or cancel anytime.</p>

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 40, textAlign: 'left' }}>

          {/* Starter */}
          <div style={{ borderRadius: 20, border: '1px solid #1e2218', background: '#0d0e0b', padding: '36px 32px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#c8f13520', border: '1px solid #c8f13535', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={22} style={{ color: '#c8f135' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, padding: '5px 12px', borderRadius: 99, background: '#1e2218', color: '#6b7a5a', letterSpacing: 1 }}>ONE-TIME</span>
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Starter</h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 60, fontWeight: 900, color: '#fff', letterSpacing: '-3px', lineHeight: 1 }}>$5</span>
              <span style={{ fontSize: 16, color: '#444', paddingBottom: 10 }}>one-time</span>
            </div>
            <p style={{ fontSize: 14, color: '#444', marginBottom: 32, lineHeight: 1.5 }}>
              Refunded in full if your application isn&apos;t approved. Zero risk.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
              {STARTER_FEATURES.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle size={16} style={{ color: '#c8f135', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 14, color: '#aaa', lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>

            <Link href="/join#apply" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1px solid #2a3a1a', color: '#c8f135', background: 'transparent' }}>
              Start earning <ArrowRight size={15} />
            </Link>
          </div>

          {/* Operator */}
          <div style={{ borderRadius: 20, border: '1px solid #c8f13550', background: '#0d0e0b', padding: '36px 32px', position: 'relative', boxShadow: '0 0 80px #c8f13515' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={22} style={{ color: '#0a0b09' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, padding: '5px 12px', borderRadius: 99, background: '#c8f135', color: '#0a0b09', letterSpacing: 1 }}>MOST POPULAR</span>
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Operator</h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 60, fontWeight: 900, color: '#c8f135', letterSpacing: '-3px', lineHeight: 1 }}>$29</span>
              <span style={{ fontSize: 16, color: '#555', paddingBottom: 10 }}>/month</span>
            </div>
            <p style={{ fontSize: 14, color: '#555', marginBottom: 32, lineHeight: 1.5 }}>
              For serious earners. Automation, unlimited leads, and power tools to scale.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
              {OPERATOR_FEATURES.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle size={16} style={{ color: '#c8f135', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 14, color: '#ccc', lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>

            <Link href="/join#apply" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', background: '#c8f135', color: '#0a0b09' }}>
              Start 7-day free trial <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Trust bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {[
            { icon: Shield,     label: 'No credit card',    sub: 'required for Starter' },
            { icon: RefreshCw,  label: 'Cancel anytime',    sub: 'no lock-in, ever' },
            { icon: Lock,       label: 'Stripe-secured',    sub: 'your data is safe' },
            { icon: Headphones, label: 'Human support',     sub: 'when you need it' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} style={{ padding: '18px 16px', borderRadius: 14, background: '#0d0e0b', border: '1px solid #1e2218', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#c8f13515', border: '1px solid #c8f13530', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} style={{ color: '#c8f135' }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 11, color: '#444' }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

import Link from 'next/link'
import Logo from '@/components/Logo'
import { Zap, Flame, Shield, Headphones, RefreshCw, Lock, ArrowRight, Circle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — SiteForge',
  description: 'Start free. Upgrade to Operator for unlimited leads, automated follow-ups, and priority tools.',
  robots: { index: false, follow: false },
}

const STARTER_FEATURES = [
  '50 fresh leads per week',
  'Pre-written SMS pitch templates',
  'Lead pipeline tracker',
  'Weekly Friday payouts',
  'In-app call button',
  'Referral program (15% of recruits\' sales)',
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

function CheckItem({ text, bright }: { text: string; bright?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%',
        border: `2px solid ${bright ? '#c8f135' : '#3a4a2a'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 1,
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: bright ? '#c8f135' : '#3a4a2a',
        }} />
      </span>
      <span style={{ fontSize: 14, color: bright ? '#ccc' : '#666', lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

export default function PricingPage() {
  return (
    <div style={{
      background: '#080808',
      color: '#fff',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Dot grid texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, #2a3a1a 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.45,
        pointerEvents: 'none',
      }} />

      {/* Left lightning bolt glow */}
      <div style={{
        position: 'absolute', top: '10%', left: -80,
        width: 340, height: 600,
        background: 'radial-gradient(ellipse at left, #c8f13520 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <svg
        viewBox="0 0 120 220"
        width={110} height={200}
        style={{ position: 'absolute', top: '12%', left: -20, opacity: 0.13, pointerEvents: 'none' }}
      >
        <path d="M80 10 L30 110 L60 110 L20 210 L100 90 L68 90 Z"
          fill="#c8f135" />
      </svg>

      {/* Right glow */}
      <div style={{
        position: 'absolute', top: '5%', right: -120,
        width: 500, height: 600,
        background: 'radial-gradient(ellipse at right, #c8f13518 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <svg
        viewBox="0 0 120 220"
        width={110} height={200}
        style={{ position: 'absolute', top: '15%', right: -20, opacity: 0.10, pointerEvents: 'none', transform: 'scaleX(-1)' }}
      >
        <path d="M80 10 L30 110 L60 110 L20 210 L100 90 L68 90 Z"
          fill="#c8f135" />
      </svg>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #141414', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}><Logo size={24} textSize="md" /></Link>
          <Link href="/join#apply" style={{ fontSize: 13, color: '#c8f135', textDecoration: 'none', fontWeight: 700 }}>Apply now →</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 940, margin: '0 auto', padding: '80px 1.5rem 120px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* Label */}
        <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 4, color: '#c8f135', marginBottom: 22, opacity: 0.9 }}>// PRICING</p>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5.2rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, color: '#fff', marginBottom: 16 }}>
          Start free. Upgrade when<br />you&apos;re{' '}
          <em style={{ fontStyle: 'italic', color: '#c8f135', textShadow: '0 0 80px #c8f13590' }}>
            winning.
          </em>
        </h1>
        <p style={{ fontSize: 17, color: '#444', marginBottom: 64, letterSpacing: '-0.2px' }}>No commitments. Upgrade anytime.</p>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 18, marginBottom: 36, textAlign: 'left' }}>

          {/* Starter */}
          <div style={{
            borderRadius: 22,
            border: '1px solid #1c1c1c',
            background: '#0d0d0d',
            padding: '40px 36px',
            position: 'relative',
          }}>
            {/* FREE badge */}
            <div style={{
              position: 'absolute', top: 28, right: 28,
              fontSize: 11, fontWeight: 900, padding: '5px 14px', borderRadius: 99,
              background: '#1c2b10', color: '#c8f135', letterSpacing: 2, border: '1px solid #c8f13530',
            }}>FREE</div>

            <div style={{ marginBottom: 28 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 13,
                background: '#c8f13518', border: '1px solid #c8f13530',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={22} style={{ color: '#c8f135' }} />
              </div>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 14 }}>Starter</h2>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 72, fontWeight: 900, color: '#fff', letterSpacing: '-4px', lineHeight: 1 }}>$0</span>
              <span style={{ fontSize: 16, color: '#333', paddingBottom: 12 }}>/month</span>
            </div>
            <p style={{ fontSize: 14, color: '#444', marginBottom: 34, lineHeight: 1.6 }}>
              Try it. Test the leads. No card required.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginBottom: 38 }}>
              {STARTER_FEATURES.map(f => <CheckItem key={f} text={f} />)}
            </div>

            <Link href="/join#apply" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '16px', borderRadius: 13,
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
              border: '1px solid #2a3a1a', color: '#c8f135', background: 'transparent',
              letterSpacing: '-0.2px',
            }}>
              Start for free <ArrowRight size={15} />
            </Link>
          </div>

          {/* Operator */}
          <div style={{
            borderRadius: 22,
            border: '1px solid #c8f13545',
            background: '#0d0d0b',
            padding: '40px 36px',
            position: 'relative',
            boxShadow: '0 0 100px #c8f13518, inset 0 0 60px #c8f1350a',
          }}>
            {/* MOST POPULAR badge */}
            <div style={{
              position: 'absolute', top: 28, right: 28,
              fontSize: 11, fontWeight: 900, padding: '5px 14px', borderRadius: 99,
              background: '#c8f135', color: '#080808', letterSpacing: 2,
            }}>MOST POPULAR</div>

            <div style={{ marginBottom: 28 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 13,
                background: '#c8f135',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Flame size={22} style={{ color: '#080808' }} />
              </div>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 14 }}>Operator</h2>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 72, fontWeight: 900, color: '#c8f135', letterSpacing: '-4px', lineHeight: 1 }}>$29</span>
              <span style={{ fontSize: 16, color: '#555', paddingBottom: 12 }}>/month</span>
            </div>
            <p style={{ fontSize: 14, color: '#555', marginBottom: 34, lineHeight: 1.6 }}>
              For serious cash-generators. Extra scale, more power.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginBottom: 38 }}>
              {OPERATOR_FEATURES.map(f => <CheckItem key={f} text={f} bright />)}
            </div>

            <Link href="/join#apply" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '16px', borderRadius: 13,
              fontWeight: 800, fontSize: 15, textDecoration: 'none',
              background: '#c8f135', color: '#080808',
              letterSpacing: '-0.2px',
            }}>
              Start 7-day free trial <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Trust bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 0,
          borderRadius: 16,
          border: '1px solid #161616',
          background: '#0d0d0d',
          overflow: 'hidden',
        }}>
          {[
            { icon: Shield,     label: 'No credit card',   sub: 'required for Starter' },
            { icon: RefreshCw,  label: 'Cancel anytime',   sub: 'no lock-in, ever' },
            { icon: Lock,       label: 'Secure & private', sub: 'Stripe-secured payments' },
            { icon: Headphones, label: 'Human support',    sub: 'when you need it' },
          ].map(({ icon: Icon, label, sub }, i) => (
            <div key={label} style={{
              padding: '22px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
              textAlign: 'left',
              borderRight: i < 3 ? '1px solid #161616' : undefined,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: '#c8f13510', border: '1px solid #c8f13525',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={15} style={{ color: '#c8f135' }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#ddd', marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: 11, color: '#333' }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

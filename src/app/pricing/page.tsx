import Link from 'next/link'
import Logo from '@/components/Logo'
import { Zap, Flame, Shield, Headphones, RefreshCw, Lock, ArrowRight } from 'lucide-react'
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
  'Referral program (15% of recruits\' sales)',
]

const OPERATOR_FEATURES = [
  'Unlimited leads, any city',
  'Automated drip sequences',
  'In-browser WebRTC dialer',
  'Bulk SMS campaigns',
  'Earnings analytics',
  'Priority support',
]

function CheckItem({ text, bright }: { text: string; bright?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        width: 16, height: 16, borderRadius: '50%',
        border: `2px solid ${bright ? '#c8f135' : '#2e3e1e'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: bright ? '#c8f135' : '#2e3e1e' }} />
      </span>
      <span style={{ fontSize: 13, color: bright ? '#bbb' : '#555', lineHeight: 1.4 }}>{text}</span>
    </div>
  )
}

export default function PricingPage() {
  return (
    <div style={{
      background: '#080808',
      color: '#fff',
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, #2a3a1a 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.4,
        pointerEvents: 'none',
      }} />

      {/* Left bolt glow */}
      <div style={{
        position: 'absolute', top: '8%', left: -80,
        width: 300, height: 500,
        background: 'radial-gradient(ellipse at left, #c8f13522 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <svg viewBox="0 0 120 220" width={90} height={160}
        style={{ position: 'absolute', top: '16%', left: -16, opacity: 0.12, pointerEvents: 'none' }}>
        <path d="M80 10 L30 110 L60 110 L20 210 L100 90 L68 90 Z" fill="#c8f135" />
      </svg>

      {/* Right bolt glow */}
      <div style={{
        position: 'absolute', top: '5%', right: -100,
        width: 400, height: 500,
        background: 'radial-gradient(ellipse at right, #c8f13518 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <svg viewBox="0 0 120 220" width={90} height={160}
        style={{ position: 'absolute', top: '18%', right: -16, opacity: 0.09, pointerEvents: 'none', transform: 'scaleX(-1)' }}>
        <path d="M80 10 L30 110 L60 110 L20 210 L100 90 L68 90 Z" fill="#c8f135" />
      </svg>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #141414', padding: '0 1.5rem', position: 'relative', zIndex: 10, flexShrink: 0 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}><Logo size={22} textSize="md" /></Link>
          <Link href="/join#apply" style={{ fontSize: 13, color: '#c8f135', textDecoration: 'none', fontWeight: 700 }}>Apply now →</Link>
        </div>
      </nav>

      <main style={{
        maxWidth: 960, margin: '0 auto', padding: '20px 1.5rem 16px',
        textAlign: 'center', position: 'relative', zIndex: 1,
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        width: '100%',
      }}>

        {/* Label */}
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, color: '#c8f135', marginBottom: 10, opacity: 0.9 }}>// PRICING</p>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.05, color: '#fff', marginBottom: 8 }}>
          Start free. Upgrade when you&apos;re{' '}
          <em style={{ fontStyle: 'italic', color: '#c8f135', textShadow: '0 0 60px #c8f13580' }}>winning.</em>
        </h1>
        <p style={{ fontSize: 14, color: '#444', marginBottom: 20 }}>No commitments. Upgrade anytime.</p>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 12, marginBottom: 12, textAlign: 'left' }}>

          {/* Starter */}
          <div style={{
            borderRadius: 18, border: '1px solid #1c1c1c', background: '#0d0d0d',
            padding: '18px 24px', position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: 99, background: '#1c2b10', color: '#c8f135', letterSpacing: 2, border: '1px solid #c8f13330' }}>FREE</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: '#c8f13518', border: '1px solid #c8f13330', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={19} style={{ color: '#c8f135' }} />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0 }}>Starter</h2>
                <p style={{ fontSize: 12, color: '#444', margin: 0 }}>Try it. Test the leads. No card required.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, marginBottom: 12 }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: '#fff', letterSpacing: '-3px', lineHeight: 1 }}>$0</span>
              <span style={{ fontSize: 13, color: '#333', paddingBottom: 6 }}>/month</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', marginBottom: 14 }}>
              {STARTER_FEATURES.map(f => <CheckItem key={f} text={f} />)}
            </div>

            <Link href="/join#apply" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px', borderRadius: 11, fontWeight: 700, fontSize: 14,
              textDecoration: 'none', border: '1px solid #2a3a1a', color: '#c8f135', background: 'transparent',
            }}>
              Start for free <ArrowRight size={14} />
            </Link>
          </div>

          {/* Operator */}
          <div style={{
            borderRadius: 18, border: '1px solid #c8f13545', background: '#0d0d0b',
            padding: '18px 24px', position: 'relative',
            boxShadow: '0 0 80px #c8f13515, inset 0 0 40px #c8f1350a',
          }}>
            <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: 99, background: '#c8f135', color: '#080808', letterSpacing: 2 }}>MOST POPULAR</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={19} style={{ color: '#080808' }} />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0 }}>Operator</h2>
                <p style={{ fontSize: 12, color: '#555', margin: 0 }}>For serious cash-generators. Extra scale, more power.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, marginBottom: 12 }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: '#c8f135', letterSpacing: '-3px', lineHeight: 1 }}>$29</span>
              <span style={{ fontSize: 13, color: '#555', paddingBottom: 6 }}>/month</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', marginBottom: 14 }}>
              {OPERATOR_FEATURES.map(f => <CheckItem key={f} text={f} bright />)}
            </div>

            <Link href="/join#apply" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px', borderRadius: 11, fontWeight: 800, fontSize: 14,
              textDecoration: 'none', background: '#c8f135', color: '#080808',
            }}>
              Start 7-day free trial <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Trust bar */}
        <div className="trust-bar-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          borderRadius: 13, border: '1px solid #161616', background: '#0d0d0d', overflow: 'hidden',
        }}>
          {[
            { icon: Shield,     label: 'No credit card',   sub: 'for Starter' },
            { icon: RefreshCw,  label: 'Cancel anytime',   sub: 'no lock-in' },
            { icon: Lock,       label: 'Secure & private', sub: 'Stripe payments' },
            { icon: Headphones, label: 'Human support',    sub: 'when you need it' },
          ].map(({ icon: Icon, label, sub }, i) => (
            <div key={label} style={{
              padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
              borderRight: i % 2 === 0 ? '1px solid #161616' : undefined,
              borderBottom: i < 2 ? '1px solid #161616' : undefined,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#c8f13510', border: '1px solid #c8f13522', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={13} style={{ color: '#c8f135' }} />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#ccc', margin: 0 }}>{label}</p>
                <p style={{ fontSize: 11, color: '#333', margin: 0 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

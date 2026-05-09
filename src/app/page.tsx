import Link from 'next/link'
import {
  Search, Globe, PhoneCall, MessageSquare, ArrowRight,
  Star, CheckCircle, Zap, BarChart3, Users, TrendingUp,
} from 'lucide-react'

const NAV_LINKS = ['Features', 'How it works', 'Pricing']

const STEPS = [
  {
    num: '01',
    title: 'Find businesses',
    desc: 'Search any city and category. We surface businesses on Google Maps with no website and strong reviews.',
    icon: Search,
  },
  {
    num: '02',
    title: 'Build the site',
    desc: 'One click. AI writes the copy, assembles the layout, and publishes a live preview link in under 10 seconds.',
    icon: Globe,
  },
  {
    num: '03',
    title: 'Close the deal',
    desc: 'Call with DialFlow or fire off a personalized SMS. They see their site before you even finish your pitch.',
    icon: PhoneCall,
  },
]

const FEATURES = [
  {
    icon: Search,
    title: 'Smart Scraper',
    desc: 'Filter by city, category, star rating, and review count. Only see businesses worth calling.',
  },
  {
    icon: Globe,
    title: 'AI Site Builder',
    desc: 'Generates a complete, professional site with custom copy for each business. No templates, no fuss.',
  },
  {
    icon: PhoneCall,
    title: 'DialFlow Autodialer',
    desc: 'Work through your call queue one lead at a time. Log outcomes, add notes, auto-advance.',
  },
  {
    icon: MessageSquare,
    title: 'SMS Outreach',
    desc: 'Send a personalized text with the preview link automatically. Follow up without lifting a finger.',
  },
  {
    icon: BarChart3,
    title: 'Pipeline CRM',
    desc: 'Track every lead from found to closed. See your potential MRR at a glance.',
  },
  {
    icon: Zap,
    title: 'Instant Previews',
    desc: 'Each business gets a live preview URL. Show them the site mid-call and watch conversions spike.',
  },
]

const PLANS = [
  {
    name: 'Starter',
    price: 49,
    desc: 'Test the workflow and land your first clients.',
    features: ['100 lead searches / mo', '10 AI site builds', 'DialFlow dialer', 'Email support'],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 149,
    desc: 'Run a full pipeline and close deals consistently.',
    features: ['Unlimited searches', 'Unlimited site builds', 'SMS outreach', 'DialFlow + Twilio', 'Priority support'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Agency',
    price: 299,
    desc: 'Scale across cities with a full team.',
    features: ['Everything in Pro', '5 team seats', 'White-label previews', 'Custom domain hosting', 'Dedicated support'],
    cta: 'Talk to us',
    highlight: false,
  },
]

const STATS = [
  { value: '12,000+', label: 'Leads found' },
  { value: '3,400+', label: 'Sites built' },
  { value: '$2.1M', label: 'Pipeline created' },
  { value: '4 min', label: 'Avg. time to close' },
]

export default function LandingPage() {
  return (
    <div style={{ background: '#0a0b09', color: '#d4dfc4', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1e14', position: 'sticky', top: 0, zIndex: 50, background: '#0a0b09cc', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>
            <span style={{ color: '#c8f135' }}>Land</span><span style={{ color: '#fff' }}>line</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {NAV_LINKS.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
                 style={{ fontSize: 14, color: '#6b7a5a', textDecoration: 'none', fontWeight: 500 }}>{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/dashboard"
              style={{ fontSize: 13, color: '#8a9a7a', textDecoration: 'none', padding: '8px 16px', fontWeight: 500 }}>
              Sign in
            </Link>
            <Link href="/dashboard"
              style={{ fontSize: 13, fontWeight: 700, padding: '8px 18px', borderRadius: 8,
                       background: '#c8f135', color: '#0a0b09', textDecoration: 'none' }}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 1.5rem 80px', textAlign: 'center', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
                      borderRadius: 99, marginBottom: 28, fontSize: 12, fontWeight: 600,
                      background: '#c8f13515', border: '1px solid #c8f13530', color: '#c8f135' }}>
          <Zap size={12} /> Now with AI site generation
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05,
                     color: '#fff', marginBottom: 24, letterSpacing: '-1.5px' }}>
          Turn invisible businesses<br />
          <span style={{ color: '#c8f135' }}>into paying clients</span>
        </h1>
        <p style={{ fontSize: 19, color: '#5a6a4a', lineHeight: 1.7, marginBottom: 40, maxWidth: 580, margin: '0 auto 40px' }}>
          Landline finds local businesses with no website, builds them a professional site in seconds, and helps you close the deal — before they know you exist.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px',
                     borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none',
                     background: '#c8f135', color: '#0a0b09', boxShadow: '0 0 40px #c8f13530' }}>
            Start for free <ArrowRight size={16} />
          </Link>
          <a href="#how-it-works"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px',
                     borderRadius: 10, fontWeight: 600, fontSize: 16, textDecoration: 'none',
                     border: '1px solid #2a3020', color: '#8a9a7a' }}>
            See how it works
          </a>
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 32 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="#c8f135" stroke="none" />
          ))}
          <span style={{ fontSize: 13, color: '#4a5a3a', marginLeft: 6 }}>
            Trusted by 200+ freelancers and local agencies
          </span>
        </div>
      </section>

      {/* Dashboard preview */}
      <section style={{ padding: '0 1.5rem 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #1e2218',
                      boxShadow: '0 40px 120px rgba(0,0,0,0.6)' }}>
          {/* Fake browser bar */}
          <div style={{ background: '#111310', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #1e2218' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3a4030', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3a4030', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3a4030', display: 'inline-block' }} />
            <span style={{ flex: 1, background: '#0d0e0b', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: '#3a4a2a', marginLeft: 8 }}>
              app.landline.co/dashboard
            </span>
          </div>
          {/* Fake dashboard */}
          <div style={{ background: '#0d0e0b', padding: '24px' }}>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total Leads', value: '847', color: '#c8f135' },
                { label: 'Sites Built', value: '312', color: '#4a9eff' },
                { label: 'Contacted', value: '189', color: '#9b6fd4' },
                { label: 'Closed', value: '43', color: '#c8f135' },
              ].map(s => (
                <div key={s.label} style={{ background: '#111310', borderRadius: 12, padding: '16px', border: '1px solid #1e2218' }}>
                  <p style={{ fontSize: 11, color: '#3a4a2a', marginBottom: 8 }}>{s.label}</p>
                  <p style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
            {/* Fake table */}
            <div style={{ background: '#111310', borderRadius: 12, border: '1px solid #1e2218', overflow: 'hidden' }}>
              {[
                { name: "Mike's Plumbing", city: 'Austin, TX', rating: 4.8, status: 'Interested', statusColor: '#c8f135', statusBg: '#0d2218' },
                { name: 'Premier Roofing Co', city: 'Denver, CO', rating: 4.6, status: 'Texted', statusColor: '#9b6fd4', statusBg: '#1e1530' },
                { name: 'City Electric', city: 'Chicago, IL', rating: 4.9, status: 'Site Built', statusColor: '#4a9eff', statusBg: '#131a2e' },
                { name: 'Clean Cut Barbers', city: 'Miami, FL', rating: 4.7, status: 'Found', statusColor: '#7a9a5a', statusBg: '#1e2318' },
              ].map((row, i) => (
                <div key={row.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                             padding: '12px 16px', borderBottom: i < 3 ? '1px solid #161a11' : 'none',
                                             background: i % 2 ? '#0f1009' : 'transparent' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{row.name}</p>
                    <p style={{ fontSize: 11, color: '#3a4a2a', marginTop: 2 }}>{row.city}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Star size={11} fill="#c8f135" stroke="none" />
                    <span style={{ fontSize: 12, color: '#a0b080', fontWeight: 600 }}>{row.rating}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99,
                                 color: row.statusColor, background: row.statusBg }}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid #1a1e14', borderBottom: '1px solid #1a1e14', padding: '48px 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 36, fontWeight: 900, color: '#c8f135', marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: '#4a5a3a' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '100px 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#c8f135', marginBottom: 12, textTransform: 'uppercase' }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            From zero to closed in three steps
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {STEPS.map(({ num, title, desc, icon: Icon }) => (
            <div key={num} style={{ padding: '36px 28px', borderRadius: 20, border: '1px solid #1e2218', background: '#111310' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#c8f135', letterSpacing: 1 }}>{num}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#c8f13518', border: '1px solid #c8f13528' }}>
                  <Icon size={16} style={{ color: '#c8f135' }} />
                </div>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#4a5a3a', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#c8f135', marginBottom: 12, textTransform: 'uppercase' }}>Features</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            Everything you need to close local deals
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ padding: '28px', borderRadius: 16, border: '1px solid #1e2218', background: '#0f100d',
                                       transition: 'border-color .2s' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: '#c8f13512', border: '1px solid #c8f13520', marginBottom: 16 }}>
                <Icon size={18} style={{ color: '#c8f135' }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#4a5a3a', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '100px 1.5rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#c8f135', marginBottom: 12, textTransform: 'uppercase' }}>Pricing</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: 15, color: '#4a5a3a', marginTop: 12 }}>One closed client pays for a year of Pro.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'start' }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              padding: '32px 28px', borderRadius: 20,
              background: plan.highlight ? '#111310' : '#0d0e0b',
              border: plan.highlight ? '1px solid #c8f13540' : '1px solid #1e2218',
              boxShadow: plan.highlight ? '0 0 60px #c8f13510' : 'none',
              position: 'relative',
            }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                              background: '#c8f135', color: '#0a0b09', fontSize: 11, fontWeight: 800,
                              padding: '4px 14px', borderRadius: 99, whiteSpace: 'nowrap' }}>
                  Most popular
                </div>
              )}
              <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7a5a', marginBottom: 8 }}>{plan.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: '#fff' }}>${plan.price}</span>
                <span style={{ fontSize: 14, color: '#4a5a3a' }}>/mo</span>
              </div>
              <p style={{ fontSize: 13, color: '#4a5a3a', marginBottom: 28, lineHeight: 1.5 }}>{plan.desc}</p>
              <Link href="/dashboard" style={{
                display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, fontSize: 14,
                fontWeight: 700, textDecoration: 'none', marginBottom: 24,
                background: plan.highlight ? '#c8f135' : 'transparent',
                color: plan.highlight ? '#0a0b09' : '#8a9a7a',
                border: plan.highlight ? 'none' : '1px solid #2a3020',
              }}>
                {plan.cta}
              </Link>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#6b7a5a' }}>
                    <CheckCircle size={14} style={{ color: '#c8f135', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 1.5rem', textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-1px' }}>
          Ready to start closing?
        </h2>
        <p style={{ fontSize: 16, color: '#4a5a3a', marginBottom: 32 }}>
          Your first lead search is free. No credit card required.
        </p>
        <Link href="/dashboard"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px',
                   borderRadius: 12, fontWeight: 800, fontSize: 17, textDecoration: 'none',
                   background: '#c8f135', color: '#0a0b09', boxShadow: '0 0 60px #c8f13535' }}>
          Get started free <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1e14', padding: '32px 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>
          <span style={{ color: '#c8f135' }}>Land</span><span style={{ color: '#fff' }}>line</span>
        </p>
        <p style={{ fontSize: 12, color: '#2a3a1a' }}>© {new Date().getFullYear()} Landline. All rights reserved.</p>
      </footer>
    </div>
  )
}

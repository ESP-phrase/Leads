import Link from 'next/link'
import Logo from '@/components/Logo'

export const metadata = {
  title: 'Privacy Policy — SiteForge',
  description: 'How SiteForge collects, uses, and protects your information.',
}

export default function PrivacyPage() {
  return (
    <div style={{ background: '#0a0b09', color: '#d4dfc4', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh' }}>
      <nav style={{ borderBottom: '1px solid #1a1e14', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}><Logo size={24} textSize="md" /></Link>
          <Link href="/join" style={{ fontSize: 13, color: '#c8f135', textDecoration: 'none', fontWeight: 700 }}>Apply →</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 1.5rem 100px' }}>
        <p style={{ color: '#c8f135', fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Privacy</p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: 14, letterSpacing: '-1px' }}>Privacy Policy</h1>
        <p style={{ color: '#5a6a4a', fontSize: 14, marginBottom: 40 }}>Last updated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <Section title="What we collect">
          When you apply, we collect: your name, phone number, email (optional), state, hours/week availability,
          sales experience, your written application response, referral source, and your IP address (for fraud
          prevention and SMS opt-in audit logs). After approval and activation, we also collect Stripe payment
          identifiers (we never see your card number).
        </Section>

        <Section title="How we use it">
          <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
            <li>To review your application and contact you about it</li>
            <li>To send SMS messages you&apos;ve opted into (see <Link href="/sms-consent" style={{ color: '#c8f135' }}>SMS Terms</Link>)</li>
            <li>To process your $5 deposit and refund it if you&apos;re not approved</li>
            <li>To assign leads to active workers and pay commissions</li>
            <li>To improve our product (aggregated, anonymous metrics only)</li>
          </ul>
        </Section>

        <Section title="Who we share it with">
          We share data only with service providers required to run the platform:{' '}
          <strong style={{ color: '#fff' }}>Stripe</strong> (payments and refunds),{' '}
          <strong style={{ color: '#fff' }}>Twilio</strong> (SMS delivery),{' '}
          <strong style={{ color: '#fff' }}>Vercel</strong> (hosting), and{' '}
          <strong style={{ color: '#fff' }}>Neon</strong> (database). We do <strong style={{ color: '#fff' }}>never
          sell, rent, or share your phone number</strong> for marketing purposes with anyone.
        </Section>

        <Section title="Your rights">
          You can request a copy or deletion of your data at any time by emailing{' '}
          <a href="mailto:support@siteforge.app" style={{ color: '#c8f135' }}>support@siteforge.app</a>.
          You can opt out of SMS at any time by replying <Code>STOP</Code> to any text we send.
        </Section>

        <Section title="Data retention">
          We keep applications for up to 12 months after final review. Active worker accounts are retained
          while you have an account. After deletion, anonymized aggregate metrics may be kept indefinitely.
        </Section>

        <Section title="Cookies">
          We use only essential cookies needed to keep you signed in (a single session cookie). We do not run
          any third-party tracking, advertising, or analytics that fingerprint visitors.
        </Section>

        <Section title="Contact">
          Questions? Email <a href="mailto:support@siteforge.app" style={{ color: '#c8f135' }}>support@siteforge.app</a>{' '}
          or text <strong style={{ color: '#fff' }}>+1 (512) 796-7462</strong>.
        </Section>

        <p style={{ marginTop: 40, fontSize: 12, color: '#3a4a2a', textAlign: 'center' }}>
          © {new Date().getFullYear()} SiteForge ·{' '}
          <Link href="/sms-consent" style={{ color: '#5a6a4a' }}>SMS Terms</Link> ·{' '}
          <Link href="/" style={{ color: '#5a6a4a' }}>Home</Link>
        </p>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 15, color: '#8a9a7a', lineHeight: 1.7 }}>{children}</div>
    </section>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      background: '#0d0e0b', border: '1px solid #1e2218', borderRadius: 6,
      padding: '1px 8px', fontSize: 13, fontWeight: 700, color: '#c8f135',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    }}>
      {children}
    </code>
  )
}

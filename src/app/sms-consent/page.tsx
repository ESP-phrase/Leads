import Link from 'next/link'
import Logo from '@/components/Logo'

import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://siteforge.app'

export const metadata: Metadata = {
  title: 'SMS Terms & Consent — SiteForge',
  description: 'SiteForge SMS messaging program terms, opt-in and opt-out instructions, message frequency, and consent details.',
  alternates: { canonical: `${SITE_URL}/sms-consent` },
  openGraph: { url: `${SITE_URL}/sms-consent`, title: 'SMS Terms — SiteForge' },
}

export default function SmsConsentPage() {
  return (
    <div style={{ background: '#0a0b09', color: '#d4dfc4', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh' }}>
      <nav style={{ borderBottom: '1px solid #1a1e14', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}><Logo size={24} textSize="md" /></Link>
          <Link href="/join" style={{ fontSize: 13, color: '#c8f135', textDecoration: 'none', fontWeight: 700 }}>Apply →</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 1.5rem 100px' }}>
        <p style={{ color: '#c8f135', fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
          SMS messaging program
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: 14, letterSpacing: '-1px' }}>
          SMS Terms &amp; Consent
        </h1>
        <p style={{ color: '#5a6a4a', fontSize: 14, marginBottom: 40 }}>Last updated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <Section title="Program description">
          SiteForge (&quot;we,&quot; &quot;us&quot;) operates an SMS messaging program for applicants and active workers.
          By providing your phone number and checking the consent box on our application, you opt in to receive
          SMS messages from us about your application status, account activation, lead notifications, pitch
          templates, payout updates, and account-related notices.
        </Section>

        <Section title="What you'll receive">
          <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Application status updates (approved, rejected, refund issued)</li>
            <li>Account activation links (Stripe checkout)</li>
            <li>Lead assignments and pitch templates</li>
            <li>Weekly payout notifications</li>
            <li>Important account or program changes</li>
          </ul>
        </Section>

        <Section title="Message frequency">
          Frequency varies based on your account activity and lead volume.
          Active workers can expect <strong style={{ color: '#fff' }}>up to 10 messages per week</strong>.
          Applicants typically receive <strong style={{ color: '#fff' }}>1–3 messages</strong> total during review.
        </Section>

        <Section title="Charges">
          <strong style={{ color: '#fff' }}>Message and data rates may apply.</strong> Charges depend on your
          mobile carrier and plan. SiteForge does not charge for SMS messages.
        </Section>

        <Section title="How to opt out">
          Reply <Code>STOP</Code> to any message to unsubscribe at any time. You will receive a confirmation
          message and no further texts. To resubscribe, reply <Code>START</Code> or apply again at our website.
        </Section>

        <Section title="How to get help">
          Reply <Code>HELP</Code> to any message for assistance, or contact us directly:
          <div style={{ marginTop: 12, padding: '14px 16px', borderRadius: 12, background: '#111310', border: '1px solid #1e2218' }}>
            <p style={{ color: '#a0b080', fontSize: 14 }}>
              📧 <a href="mailto:support@siteforge.app" style={{ color: '#c8f135', textDecoration: 'none' }}>support@siteforge.app</a>
            </p>
            <p style={{ color: '#a0b080', fontSize: 14, marginTop: 6 }}>
              📞 <a href="tel:+15127967462" style={{ color: '#c8f135', textDecoration: 'none' }}>+1 (512) 796-7462</a>
            </p>
          </div>
        </Section>

        <Section title="Carriers supported">
          We support all major U.S. carriers including AT&amp;T, Verizon, T-Mobile, Sprint, Boost, Cricket,
          MetroPCS, US Cellular, Virgin Mobile, and others. Carriers are not liable for delayed or undelivered messages.
        </Section>

        <Section title="Privacy">
          We will never sell, rent, or share your phone number with third parties for marketing purposes.
          Your number is used solely to operate this messaging program. See our{' '}
          <Link href="/privacy" style={{ color: '#c8f135', textDecoration: 'underline' }}>Privacy Policy</Link>
          {' '}for details.
        </Section>

        <Section title="Eligibility">
          You must be at least 18 years old and have authority over the phone line associated with the number
          you provide. By opting in, you certify both.
        </Section>

        <div style={{ marginTop: 60, padding: '24px 28px', borderRadius: 16, background: '#c8f13508', border: '1px solid #c8f13530' }}>
          <p style={{ color: '#c8f135', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Quick reference
          </p>
          <p style={{ color: '#a0b080', fontSize: 14, lineHeight: 1.7 }}>
            • Opt out: text <Code>STOP</Code> to <strong style={{ color: '#fff' }}>+1 (762) 238-7190</strong><br />
            • Get help: text <Code>HELP</Code> or email <a href="mailto:support@siteforge.app" style={{ color: '#c8f135' }}>support@siteforge.app</a><br />
            • Frequency: up to 10 msgs/week (workers), 1–3 total (applicants)<br />
            • Cost: free from us; carrier rates may apply
          </p>
        </div>

        <p style={{ marginTop: 40, fontSize: 12, color: '#3a4a2a', textAlign: 'center' }}>
          © {new Date().getFullYear()} SiteForge ·{' '}
          <Link href="/privacy" style={{ color: '#5a6a4a' }}>Privacy</Link> ·{' '}
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

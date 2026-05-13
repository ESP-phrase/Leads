import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — WebHustle',
  description: 'WebHustle Privacy Policy — how we collect, use, and protect your information.',
}

export default function PrivacyPage() {
  return (
    <main style={{ background: '#0d0e0b', minHeight: '100vh', color: '#c8d8b0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 1.5rem 100px', fontSize: 15, lineHeight: 1.8 }}>

        <div style={{ marginBottom: 40 }}>
          <Link href="/" style={{ fontSize: 13, color: '#c8f135', textDecoration: 'none' }}>← Back to WebHustle</Link>
        </div>

        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ color: '#4a5a3a', marginBottom: 48, fontSize: 13 }}>Last updated: May 13, 2026</p>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>1. Who We Are</h2>
          <p>
            <strong style={{ color: '#d4dfc4' }}>WebHustle</strong> is a sales-agent platform operated at{' '}
            <a href="https://www.webhustle.org" style={{ color: '#c8f135' }}>www.webhustle.org</a>.
            We connect independent sales agents with local businesses that need websites.
            Agents refer local businesses; WebHustle builds and delivers the website; agents earn a commission per closed sale.
            Contact us at <a href="mailto:support@webhustle.org" style={{ color: '#c8f135' }}>support@webhustle.org</a>.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>2. Information We Collect</h2>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, color: '#a0b890' }}>
            <li><strong style={{ color: '#d4dfc4' }}>Account information:</strong> name, email address, phone number, and payment information when you apply to become a sales agent.</li>
            <li><strong style={{ color: '#d4dfc4' }}>Usage data:</strong> pages visited, actions taken within the platform, and device/browser information.</li>
            <li><strong style={{ color: '#d4dfc4' }}>Lead data:</strong> business names, phone numbers, and website information that agents work with through our platform.</li>
            <li><strong style={{ color: '#d4dfc4' }}>Communications:</strong> SMS messages sent and received through the platform, and any emails or messages you send us.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>3. How We Use Your Information</h2>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, color: '#a0b890' }}>
            <li>To operate and improve the WebHustle platform</li>
            <li>To process your application and manage your agent account</li>
            <li>To send you account-related SMS notifications and updates you have opted in to receive</li>
            <li>To send local businesses a free website preview link they opted in to receive</li>
            <li>To process payments and pay commissions</li>
            <li>To respond to your support requests</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>4. SMS Messaging</h2>
          <p style={{ marginBottom: 12 }}>
            By providing your phone number and opting in, you consent to receive text messages from
            WebHustle at the number provided. Messages may include application status updates, account
            notifications, website preview links, and service-related follow-ups. Message frequency
            varies. Message &amp; data rates may apply.
          </p>
          <p style={{ marginBottom: 12 }}>
            <strong style={{ color: '#d4dfc4' }}>To opt out:</strong> Reply{' '}
            <strong style={{ color: '#c8f135' }}>STOP</strong> to any message to unsubscribe. You will
            receive one confirmation message and no further messages.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: '#d4dfc4' }}>For help:</strong> Reply{' '}
            <strong style={{ color: '#c8f135' }}>HELP</strong> to any message or email{' '}
            <a href="mailto:support@webhustle.org" style={{ color: '#c8f135' }}>support@webhustle.org</a>.
          </p>
          <div style={{ padding: '16px 20px', background: '#111310', border: '1px solid #2a3a1a', borderRadius: 10 }}>
            <strong style={{ color: '#c8f135' }}>
              Your mobile information will not be sold or shared with third parties for promotional
              or marketing purposes.
            </strong>
            {' '}All information collected is used solely to operate the WebHustle service as described
            in this policy.
          </div>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>5. Sharing of Information</h2>
          <p style={{ marginBottom: 12 }}>We do not sell your personal information. We may share information only with:</p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, color: '#a0b890' }}>
            <li><strong style={{ color: '#d4dfc4' }}>Service providers:</strong> Telnyx (SMS/calling infrastructure), Stripe (payments), Vercel (hosting), Neon (database). These providers process data only as necessary to provide their services and are contractually bound to protect your data.</li>
            <li><strong style={{ color: '#d4dfc4' }}>Legal requirements:</strong> When required by law, court order, or to protect the rights, property, or safety of WebHustle or others.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>6. Data Retention</h2>
          <p>
            We retain your account data for as long as your account is active or as needed to provide
            services. SMS logs are retained for 90 days. You may request deletion of your personal data
            by emailing <a href="mailto:support@webhustle.org" style={{ color: '#c8f135' }}>support@webhustle.org</a>.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>7. Security</h2>
          <p>
            We use industry-standard security measures including TLS encryption, secure database
            connections, and access controls to protect your information. No method of transmission
            over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>8. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal information at
            any time by contacting us at{' '}
            <a href="mailto:support@webhustle.org" style={{ color: '#c8f135' }}>support@webhustle.org</a>.
            California residents may have additional rights under the CCPA.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>9. Changes to This Policy</h2>
          <p>
            We may update this policy periodically. Material changes will be communicated via email or
            a notice on our website. Continued use of the service after changes constitutes acceptance
            of the updated policy.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>10. Contact Us</h2>
          <p>
            Questions about this Privacy Policy? Contact us:<br />
            <strong style={{ color: '#d4dfc4' }}>WebHustle</strong><br />
            Email: <a href="mailto:support@webhustle.org" style={{ color: '#c8f135' }}>support@webhustle.org</a><br />
            Website: <a href="https://www.webhustle.org" style={{ color: '#c8f135' }}>www.webhustle.org</a>
          </p>
        </section>

        <div style={{ paddingTop: 28, borderTop: '1px solid #1a1e14', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>Back to WebHustle</Link>
        </div>

      </div>
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — WebHustle',
  description: 'WebHustle Terms of Service — the rules that govern use of the WebHustle platform.',
}

export default function TermsPage() {
  return (
    <main style={{ background: '#0d0e0b', minHeight: '100vh', color: '#c8d8b0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 1.5rem 100px', fontSize: 15, lineHeight: 1.8 }}>

        <div style={{ marginBottom: 40 }}>
          <Link href="/" style={{ fontSize: 13, color: '#c8f135', textDecoration: 'none' }}>← Back to WebHustle</Link>
        </div>

        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: 8 }}>
          Terms of Service
        </h1>
        <p style={{ color: '#4a5a3a', marginBottom: 48, fontSize: 13 }}>Last updated: May 13, 2026</p>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>1. About WebHustle</h2>
          <p>
            <strong style={{ color: '#d4dfc4' }}>WebHustle</strong> (&ldquo;WebHustle,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) is a sales-agent platform at{' '}
            <a href="https://www.webhustle.org" style={{ color: '#c8f135' }}>www.webhustle.org</a>.
            We connect independent sales agents (&ldquo;Agents&rdquo;) with local businesses that need websites.
            Agents earn a $119 commission for each closed sale. By using WebHustle, you agree to these Terms.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>2. Eligibility</h2>
          <p>
            You must be at least 18 years old and legally authorized to work in the United States to
            apply as an Agent. By applying, you represent that these conditions are met.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>3. Agent Responsibilities</h2>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, color: '#a0b890' }}>
            <li>Agents may only contact businesses that have a reasonable expectation of receiving the outreach (e.g., publicly listed businesses).</li>
            <li>Agents must accurately represent WebHustle&apos;s services and must not make false or misleading claims.</li>
            <li>Agents may not use the platform to spam, harass, or contact individuals on the Do-Not-Call registry.</li>
            <li>Agents are responsible for complying with all applicable federal, state, and local laws regarding sales communications.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>4. SMS Communications</h2>
          <p style={{ marginBottom: 12 }}>
            The WebHustle platform enables agents to send SMS messages to prospective business customers.
            All SMS communications must:
          </p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, color: '#a0b890', marginBottom: 12 }}>
            <li>Be sent only to recipients who have verbally consented or who are existing business contacts</li>
            <li>Include a clear identification of WebHustle as the sender</li>
            <li>Include an opt-out mechanism (STOP)</li>
            <li>Not include deceptive, misleading, or inappropriate content</li>
          </ul>
          <p style={{ marginBottom: 12 }}>
            By providing your phone number and agreeing to receive messages, you consent to receive
            text messages from WebHustle including website preview links, account updates, and
            service-related follow-ups. Message frequency varies. Message &amp; data rates may apply.
          </p>
          <p>
            Reply <strong style={{ color: '#c8f135' }}>STOP</strong> to opt out at any time.
            Reply <strong style={{ color: '#c8f135' }}>HELP</strong> for assistance or contact{' '}
            <a href="mailto:support@webhustle.org" style={{ color: '#c8f135' }}>support@webhustle.org</a>.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>5. Free Website Previews</h2>
          <p>
            WebHustle may build a complimentary website preview for a local business as a demonstration
            of our services. This preview is provided at no charge and does not constitute a binding
            agreement for paid services. The business is under no obligation to purchase.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>6. Commissions and Payment</h2>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, color: '#a0b890' }}>
            <li>Agents earn $119 per closed sale where the business completes payment for a WebHustle website.</li>
            <li>Commissions are paid weekly (every Friday) for deals closed in the prior week.</li>
            <li>The $5 application deposit is fully refunded if an application is not approved.</li>
            <li>WebHustle reserves the right to withhold or reverse commissions for fraudulent or policy-violating activity.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>7. Intellectual Property</h2>
          <p>
            All website designs created by WebHustle remain the property of WebHustle until full
            payment is received for a contracted project. The WebHustle name, logo, and platform
            are the exclusive property of WebHustle.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>8. Termination</h2>
          <p>
            WebHustle may suspend or terminate your agent account at any time for violation of these
            Terms, fraudulent activity, or misuse of the platform. You may stop using the service at
            any time.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>9. Limitation of Liability</h2>
          <p>
            WebHustle is not liable for any indirect, incidental, special, or consequential damages
            arising from your use of the platform. Our total liability to you shall not exceed the
            amounts paid to you in the 30 days preceding any claim.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>10. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be communicated via
            email or a notice on our website. Continued use of the platform after changes constitutes
            acceptance of the updated Terms.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>11. Contact</h2>
          <p>
            Questions about these Terms? Contact us:<br />
            <strong style={{ color: '#d4dfc4' }}>WebHustle</strong><br />
            Email: <a href="mailto:support@webhustle.org" style={{ color: '#c8f135' }}>support@webhustle.org</a><br />
            Website: <a href="https://www.webhustle.org" style={{ color: '#c8f135' }}>www.webhustle.org</a>
          </p>
        </section>

        <div style={{ paddingTop: 28, borderTop: '1px solid #1a1e14', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>Back to WebHustle</Link>
        </div>

      </div>
    </main>
  )
}

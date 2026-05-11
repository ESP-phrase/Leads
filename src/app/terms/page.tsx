export const metadata = { title: 'Terms of Service — WebHustle' }

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-sm leading-relaxed" style={{ color: '#c8d8b0', background: '#0d0e0b', minHeight: '100vh' }}>
      <h1 className="text-2xl font-bold text-white mb-2">Terms of Service</h1>
      <p className="mb-8" style={{ color: '#4a5a3a' }}>Last updated: May 11, 2026</p>

      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">1. Services</h2>
        <p>WebHustle provides web design and online presence services for local businesses. By engaging with WebHustle, you agree to these terms.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">2. SMS Communications</h2>
        <p className="mb-3">By verbally consenting to receive SMS messages from WebHustle, you agree to receive text messages including website preview links and follow-up communications related to our services.</p>
        <p>You may opt out at any time by replying STOP. For help, reply HELP or contact support@webhustle.org.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">3. Free Website Previews</h2>
        <p>WebHustle may build a complimentary website mockup for your business at no charge. This preview is provided as a demonstration of our services and does not constitute a binding agreement for paid services.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">4. Intellectual Property</h2>
        <p>All website designs created by WebHustle remain the property of WebHustle until full payment is received for a contracted project.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">5. Limitation of Liability</h2>
        <p>WebHustle is not liable for any indirect, incidental, or consequential damages arising from use of our services.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">6. Contact</h2>
        <p>Questions? Email <a href="mailto:support@webhustle.org" className="underline" style={{ color: '#c8f135' }}>support@webhustle.org</a></p>
      </section>
    </main>
  )
}

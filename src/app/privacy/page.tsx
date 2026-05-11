export const metadata = { title: 'Privacy Policy — WebHustle' }

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-sm leading-relaxed" style={{ color: '#c8d8b0', background: '#0d0e0b', minHeight: '100vh' }}>
      <h1 className="text-2xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="mb-8" style={{ color: '#4a5a3a' }}>Last updated: May 11, 2026</p>

      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">1. Information We Collect</h2>
        <p className="mb-3">We may collect your name, business name, phone number, and email address to deliver our web design services. If you receive an SMS from us, your phone number is used solely to send the requested website preview link.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1 ml-2" style={{ color: '#a0b890' }}>
          <li>Send you a free website preview link you opted in to receive</li>
          <li>Follow up on web design services you expressed interest in</li>
          <li>Improve our services</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">3. SMS Messaging</h2>
        <p className="mb-3">By verbally agreeing to receive a text from a WebHustle agent, you consent to receive SMS messages at the phone number provided.</p>
        <p className="mb-3"><strong className="text-white">Your mobile information will not be sold or shared with third parties for promotional or marketing purposes.</strong></p>
        <p>Msg frequency may vary. Msg &amp; data rates may apply. Reply STOP to opt out. Reply HELP for help.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">4. Data Sharing</h2>
        <p>We do not sell or rent your personal information. We may share data with service providers (e.g., SMS platforms) solely to operate our services.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">5. Contact</h2>
        <p>Questions? Email <a href="mailto:support@webhustle.org" className="underline" style={{ color: '#c8f135' }}>support@webhustle.org</a></p>
      </section>
    </main>
  )
}

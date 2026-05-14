'use client'

import Link from 'next/link'
import {
  Globe, MessageSquare, Phone, Check, CheckCircle, ArrowRight,
  Smartphone, Zap, Shield, Star, Clock, MapPin, ChevronDown,
} from 'lucide-react'

// Clean B2B landing — WebHustle as a website-services company for local businesses.
// No MLM, no affiliate, no "$119 per sale", no recruitment language.
// Used as the public homepage during 10DLC review. Agent-recruitment content
// is preserved at /agents (not linked from this page, not in sitemap).

export default function LandingB2B() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0b09', color: '#d4dfc4', fontFamily: 'inherit' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1e14', background: '#0a0b09cc', position: 'sticky', top: 0, backdropFilter: 'blur(10px)', zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={18} style={{ color: '#0a0b09' }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>WebHustle</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <a href="#how" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none' }}>How it works</a>
            <a href="#pricing" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none' }}>Pricing</a>
            <a href="#faq" style={{ fontSize: 14, color: '#8a9a7a', textDecoration: 'none' }}>FAQ</a>
            <a href="mailto:support@webhustle.org"
               style={{ padding: '9px 18px', borderRadius: 9, background: '#c8f135', color: '#0a0b09', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 1.5rem 80px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 18, textTransform: 'uppercase' }}>
          Affordable websites for local businesses
        </p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 24 }}>
          A professional website for your business.<br />
          <span style={{ color: '#c8f135' }}>See it before you pay.</span>
        </h1>
        <p style={{ fontSize: 19, color: '#8a9a7a', maxWidth: 680, margin: '0 auto 40px', lineHeight: 1.6 }}>
          WebHustle builds modern, mobile-friendly websites for plumbers, restaurants, salons,
          and other local businesses. We&apos;ll show you a free preview of your site before
          you decide.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <a href="mailto:support@webhustle.org?subject=I'd%20like%20a%20website%20preview"
             style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '16px 32px', borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: 'none', background: '#c8f135', color: '#0a0b09' }}>
            Request a free preview <ArrowRight size={18} />
          </a>
          <a href="#how"
             style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '16px 32px', borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: 'none', background: 'transparent', border: '1px solid #2a3a1a', color: '#d4dfc4' }}>
            See how it works
          </a>
        </div>
        <p style={{ fontSize: 13, color: '#4a5a3a' }}>No upfront cost · Free preview · $299 one-time when you&apos;re happy</p>
      </section>

      {/* What we do */}
      <section style={{ padding: '70px 1.5rem', borderTop: '1px solid #1a1e14', background: '#0d0e0b' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
              Built for local businesses.
            </h2>
            <p style={{ fontSize: 17, color: '#5a6a4a', marginTop: 14, maxWidth: 600, margin: '14px auto 0' }}>
              You run your business. We&apos;ll handle the website.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {[
              { icon: Smartphone, title: 'Mobile-first', desc: 'Looks great on phones. 70% of your customers find you on mobile.' },
              { icon: Zap,        title: 'Fast to build', desc: 'Your custom preview is ready within 24 hours of your request.' },
              { icon: Shield,     title: 'Owned by you',  desc: 'You own the site and content. No subscriptions, no lock-in.' },
              { icon: MapPin,     title: 'Local SEO',     desc: 'Built to rank when locals search for businesses like yours.' },
              { icon: Phone,      title: 'Click-to-call', desc: 'Customers tap your phone number to call you directly.' },
              { icon: Star,       title: 'Reviews shown', desc: 'Your Google rating and reviews are featured prominently.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ padding: '28px 24px', borderRadius: 16, background: '#111310', border: '1px solid #1e2218' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#c8f13518', border: '1px solid #c8f13530', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={17} style={{ color: '#c8f135' }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#5a6a4a', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — covers the verbal opt-in flow for 10DLC */}
      <section id="how" style={{ padding: '90px 1.5rem', borderTop: '1px solid #1a1e14' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>How it works</p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
              From phone call to live website.
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                step: '1',
                title: 'A WebHustle representative calls your business',
                body: 'A friendly representative reaches out by phone to introduce WebHustle and ask if you\'d like a free, no-obligation preview of a custom website for your business.',
              },
              {
                step: '2',
                title: 'You give verbal consent to receive a text',
                body: 'If you\'re interested, you give verbal consent over the phone for us to text you the preview link. We confirm the number to send it to, and no further texts are sent without your permission. You can reply STOP at any time to opt out.',
              },
              {
                step: '3',
                title: 'We text you a link to your free preview',
                body: 'Within 24 hours, we build a custom website preview with your business name, photos, services, and reviews. You get a single text from us with the link. You review it, share it with anyone you want, and decide if you like it.',
              },
              {
                step: '4',
                title: 'You decide — pay only if you love it',
                body: 'If you want to keep the site, it\'s a one-time $299 payment and we publish it under your own domain. If you don\'t want it, no payment, no further contact. That\'s it.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} style={{ display: 'flex', gap: 20, padding: '24px 0', borderBottom: '1px solid #1a1e14' }}>
                <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#0a0b09' }}>
                  {step}
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 15, color: '#8a9a7a', lineHeight: 1.65 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SMS consent block — directly addresses 10DLC requirements */}
          <div style={{ marginTop: 40, padding: '24px 28px', borderRadius: 14, background: '#111310', border: '1px solid #2a3a1a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <MessageSquare size={16} style={{ color: '#c8f135' }} />
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>About our text messages</h3>
            </div>
            <p style={{ fontSize: 14, color: '#8a9a7a', lineHeight: 1.7, marginBottom: 10 }}>
              WebHustle only sends SMS to business owners who have <strong style={{ color: '#d4dfc4' }}>verbally
              opted in</strong> during a live phone call with one of our representatives. Messages contain a link
              to a free website preview built for that specific business.
            </p>
            <p style={{ fontSize: 14, color: '#8a9a7a', lineHeight: 1.7 }}>
              Reply <strong style={{ color: '#c8f135' }}>STOP</strong> to opt out at any time.
              Reply <strong style={{ color: '#c8f135' }}>HELP</strong> for help.
              Message frequency varies. Message &amp; data rates may apply.
              Your mobile information will not be sold or shared with third parties for promotional or marketing purposes.
              See our <Link href="/privacy" style={{ color: '#c8f135' }}>Privacy Policy</Link> and{' '}
              <Link href="/terms" style={{ color: '#c8f135' }}>Terms of Service</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '90px 1.5rem', borderTop: '1px solid #1a1e14', background: '#0d0e0b' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>Pricing</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>
            Simple. One-time. No subscriptions.
          </h2>
          <p style={{ fontSize: 17, color: '#8a9a7a', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.6 }}>
            See the preview first. Pay only if you want to keep the site.
          </p>
          <div style={{ padding: '40px 32px', borderRadius: 20, background: '#111310', border: '1px solid #2a3a1a', maxWidth: 440, margin: '0 auto' }}>
            <p style={{ fontSize: 14, color: '#8a9a7a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Custom website</p>
            <p style={{ fontSize: 56, fontWeight: 900, color: '#fff', letterSpacing: '-2px', marginBottom: 4 }}>
              $299
            </p>
            <p style={{ fontSize: 14, color: '#5a6a4a', marginBottom: 28 }}>one-time · you own it forever</p>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {[
                'Custom-built, mobile-friendly site',
                'Your business info, photos, services, reviews',
                'Local SEO optimized',
                'Connected to your own domain',
                'Free preview before you pay anything',
                'Unlimited revisions before going live',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Check size={16} style={{ color: '#c8f135', flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: 14, color: '#d4dfc4' }}>{item}</span>
                </li>
              ))}
            </ul>
            <a href="mailto:support@webhustle.org?subject=I'd%20like%20a%20website%20preview"
               style={{ display: 'block', padding: '14px 24px', borderRadius: 10, background: '#c8f135', color: '#0a0b09', fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
              Request a free preview
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '90px 1.5rem 100px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#c8f135', marginBottom: 10, textTransform: 'uppercase' }}>FAQ</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
            Questions, answered.
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            {
              q: 'Did I sign up for these texts?',
              a: 'Yes, if a WebHustle representative spoke with you on the phone and you said "yes" or otherwise agreed to receive a text with a website preview. If you don\'t remember consenting or want to stop receiving messages, just reply STOP to any text we send you.',
            },
            {
              q: 'What does a WebHustle website include?',
              a: 'A modern, mobile-friendly homepage built specifically for your business. Your business name, hours, services, photos, phone number with click-to-call, your Google rating and reviews, and a contact form — all SEO-optimized for local search.',
            },
            {
              q: 'Is there really no cost until I approve it?',
              a: 'Correct. We build the preview at our own expense. You only pay if you decide to keep the site and have us publish it under your own domain.',
            },
            {
              q: 'How is $299 a one-time fee? What about hosting?',
              a: 'For the first year, hosting and a basic domain are included. After that, hosting renewal is $99/year (optional — you can also export the site and host it yourself).',
            },
            {
              q: 'How long does the website stay up?',
              a: 'Forever, as long as you keep your domain registered. The $299 buys you the site permanently — there are no recurring website fees from WebHustle.',
            },
            {
              q: 'How do I opt out of text messages?',
              a: 'Reply STOP to any text from us. You will receive one confirmation message and then no further texts.',
            },
            {
              q: 'How do I reach a real person?',
              a: 'Email support@webhustle.org or call us back at the number we contacted you from. A real human will respond within one business day.',
            },
          ].map(({ q, a }) => (
            <details key={q} style={{ padding: '20px 24px', borderRadius: 12, background: '#111310', border: '1px solid #1e2218' }}>
              <summary style={{ fontSize: 15, fontWeight: 700, color: '#fff', listStyle: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span>{q}</span>
                <ChevronDown size={16} style={{ color: '#c8f135', flexShrink: 0 }} />
              </summary>
              <p style={{ fontSize: 14, color: '#8a9a7a', lineHeight: 1.7, marginTop: 14 }}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '90px 1.5rem', textAlign: 'center', maxWidth: 760, margin: '0 auto', background: 'radial-gradient(ellipse at center, #c8f13510, transparent 70%)' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: 18, letterSpacing: '-1.5px', lineHeight: 1.1 }}>
          Ready to see your website?
        </h2>
        <p style={{ fontSize: 17, color: '#8a9a7a', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
          We&apos;ll build a free preview within 24 hours. No payment until you see it and love it.
        </p>
        <a href="mailto:support@webhustle.org?subject=I'd%20like%20a%20website%20preview"
           style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 40px', borderRadius: 12, fontWeight: 900, fontSize: 17, textDecoration: 'none', background: '#c8f135', color: '#0a0b09' }}>
          Request a free preview <ArrowRight size={18} />
        </a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1e14', background: '#080908', padding: '52px 1.5rem 36px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={14} style={{ color: '#0a0b09' }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: 16, color: '#fff' }}>WebHustle</span>
          </div>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#5a6a4a', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
            WebHustle builds custom websites for local businesses. We offer free, no-obligation
            previews — you only pay if you love the result.
          </p>

          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
            <a href="#how"     style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>How it works</a>
            <a href="#pricing" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>Pricing</a>
            <a href="#faq"     style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>FAQ</a>
            <Link href="/terms"   style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="/privacy" style={{ fontSize: 13, color: '#5a6a4a', textDecoration: 'none' }}>Privacy Policy</Link>
          </div>

          <div style={{ borderTop: '1px solid #1a1e14', paddingTop: 24, marginBottom: 22 }}>
            <p style={{ fontSize: 12, color: '#3a4a2a', lineHeight: 1.8, maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
              <strong style={{ color: '#4a5a3a' }}>SMS Disclosure:</strong> WebHustle sends SMS messages only to
              business owners who have verbally opted in during a phone call with one of our representatives.
              Messages contain a link to a free website preview built for your business.
              Message frequency varies. Message &amp; data rates may apply.
              Reply <strong style={{ color: '#4a5a3a' }}>STOP</strong> to unsubscribe at any time.
              Reply <strong style={{ color: '#4a5a3a' }}>HELP</strong> for help.
              Your mobile information will not be sold or shared with third parties for promotional or marketing
              purposes. See our{' '}
              <Link href="/privacy" style={{ color: '#5a6a4a', textDecoration: 'underline' }}>Privacy Policy</Link>
              {' '}and{' '}
              <Link href="/terms" style={{ color: '#5a6a4a', textDecoration: 'underline' }}>Terms of Service</Link>.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, alignItems: 'center' }}>
            <p style={{ fontSize: 11, color: '#2a3a1a', margin: 0 }}>© {new Date().getFullYear()} WebHustle · All rights reserved</p>
            <span style={{ fontSize: 11, color: '#1e2218' }}>·</span>
            <a href="mailto:support@webhustle.org" style={{ fontSize: 11, color: '#2a3a1a', textDecoration: 'none' }}>
              support@webhustle.org
            </a>
            <span style={{ fontSize: 11, color: '#1e2218' }}>·</span>
            <p style={{ fontSize: 11, color: '#2a3a1a', margin: 0 }}>www.webhustle.org</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

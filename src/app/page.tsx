import type { Metadata } from 'next'
import LandingB2B from './_landing-b2b'
import LandingAgents from './_landing'
import Script from 'next/script'

// ============================================================================
// LANDING MODE TOGGLE
// ============================================================================
// During 10DLC carrier review, the public homepage must be a clean B2B site
// (no MLM/affiliate language). To flip back to the original agent-recruitment
// landing AFTER approval, set the env var:
//
//   NEXT_PUBLIC_LANDING_MODE=agents
//
// Or omit the var (default) to keep the B2B landing live.
// The agent-recruitment content is also always accessible at /agents
// regardless of this flag.
// ============================================================================

// Default flipped back to 'agents' after 10DLC approval (May 16 2026).
// To temporarily flip back to the B2B-clean landing (e.g. during another review),
// set NEXT_PUBLIC_LANDING_MODE=b2b in Vercel env vars.
const LANDING_MODE = (process.env.NEXT_PUBLIC_LANDING_MODE ?? 'agents').toLowerCase()
const IS_AGENTS_MODE = LANDING_MODE === 'agents'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org'

// ----- B2B metadata (used during 10DLC review) -----
const B2B_TITLE = 'WebHustle — Custom Websites for Local Businesses'
const B2B_DESC  = 'WebHustle builds modern, mobile-friendly websites for local businesses. See a free preview of your custom site before you pay anything. One-time $299.'

// ----- Agents metadata (legacy, used only when NEXT_PUBLIC_LANDING_MODE=agents) -----
const AGENTS_TITLE = 'WebHustle — Earn $119 Per Sale Selling Websites to Local Businesses'
const AGENTS_DESC  = 'Join WebHustle. We build websites for local businesses, you close sales via SMS and earn $119 per deal.'

export const metadata: Metadata = IS_AGENTS_MODE
  ? {
      title: AGENTS_TITLE,
      description: AGENTS_DESC,
      alternates: { canonical: SITE_URL },
      openGraph: {
        url: SITE_URL,
        title: AGENTS_TITLE,
        description: AGENTS_DESC,
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'WebHustle' }],
      },
    }
  : {
      title: B2B_TITLE,
      description: B2B_DESC,
      alternates: { canonical: SITE_URL },
      openGraph: {
        url: SITE_URL,
        title: B2B_TITLE,
        description: B2B_DESC,
        images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'WebHustle — Custom websites for local businesses' }],
      },
    }

// ----- B2B JSON-LD (clean, service-business schema) -----
const b2bJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'WebHustle',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
      email: 'support@webhustle.org',
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'WebHustle',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: B2B_TITLE,
      description: B2B_DESC,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service`,
      name: 'Custom Website for Local Business',
      provider: { '@id': `${SITE_URL}/#organization` },
      description:
        'Custom-built, mobile-friendly website for a local business. Includes business info, services, photos, reviews, click-to-call, and local SEO. One-time payment, no subscriptions.',
      areaServed: { '@type': 'Country', name: 'US' },
      offers: {
        '@type': 'Offer',
        price: '299',
        priceCurrency: 'USD',
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faqpage`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Did I sign up for these texts?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, if a WebHustle representative spoke with you on the phone and you said yes or otherwise agreed to receive a text with a website preview. Reply STOP to any text from us to opt out.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does a WebHustle website include?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A modern, mobile-friendly site built specifically for your business. Your business name, hours, services, photos, click-to-call phone number, your Google rating and reviews, and a contact form — all SEO-optimized for local search.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does a website cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A one-time payment of $299. There is no charge to see the preview. You only pay if you decide to keep the site. First-year hosting and a basic domain are included.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I opt out of text messages?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Reply STOP to any text from us. You will receive one confirmation message and then no further texts.',
          },
        },
      ],
    },
  ],
}

// ----- Legacy agent-recruitment JSON-LD (used only when flag is 'agents') -----
const agentsJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'WebHustle',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
    },
  ],
}

export default function Page() {
  const jsonLd = IS_AGENTS_MODE ? agentsJsonLd : b2bJsonLd
  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {IS_AGENTS_MODE ? <LandingAgents /> : <LandingB2B />}
    </>
  )
}

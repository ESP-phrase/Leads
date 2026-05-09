import type { Metadata } from 'next'
import LandingPage from './_landing'
import Script from 'next/script'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://siteforge.app'

export const metadata: Metadata = {
  title: 'SiteForge — Earn $119 Per Sale Selling Websites to Local Businesses',
  description: 'Join SiteForge and earn $119 every time a local business buys a website. We build the site, you send a text. Work from your phone, get paid weekly. $5 deposit — refunded if not approved.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: 'SiteForge — Earn $119 Per Sale Selling Websites to Local Businesses',
    description: 'Work from your phone. We build websites for local businesses — you close the sale via text and earn $119. No experience needed. Apply for $5, refunded if rejected.',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'SiteForge — Earn $119 per sale' }],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'SiteForge',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'SiteForge',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/join?ref={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'SiteForge — Earn $119 Per Sale Selling Websites to Local Businesses',
      description: 'Join SiteForge. We build websites for local businesses, you close sales via SMS and earn $119 per deal. Work from your phone.',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faqpage`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is SiteForge actually legit?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. We charge local businesses $299 for a custom website. You get 40% ($119) when they buy. Most local businesses — plumbers, salons, mechanics — still don\'t have a website in 2025.' },
        },
        {
          '@type': 'Question',
          name: 'How much can I earn with SiteForge?',
          acceptedAnswer: { '@type': 'Answer', text: 'You earn $119 per closed sale. Most workers close their first deal within their first 50 SMS sent. Working 10 hours a week you can realistically earn $1,000–$2,000/month.' },
        },
        {
          '@type': 'Question',
          name: 'Do I need sales experience to join SiteForge?',
          acceptedAnswer: { '@type': 'Answer', text: 'No sales experience needed. We give you pre-written SMS templates that close. You tap send — the message auto-fills the business name, preview link, and pitch.' },
        },
        {
          '@type': 'Question',
          name: 'How do I get paid?',
          acceptedAnswer: { '@type': 'Answer', text: 'Direct deposit, weekly. The moment a business buys, your $119 lands in your queue. Cash out every Friday.' },
        },
        {
          '@type': 'Question',
          name: 'What is the $5 deposit for?',
          acceptedAnswer: { '@type': 'Answer', text: 'The $5 covers your account activation and screens out applications. If we reject your application, the $5 is automatically refunded within 5–10 business days.' },
        },
        {
          '@type': 'Question',
          name: 'Can I do this from my phone?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. Everything works on mobile — your lead list, the SMS sender, the dialer. Most workers run their entire hustle from their phone.' },
        },
      ],
    },
    {
      '@type': 'JobPosting',
      '@id': `${SITE_URL}/#jobposting`,
      title: 'Website Sales Agent',
      description: 'Earn $119 per sale working as a website sales agent for local businesses. No experience needed. Work from your phone, flexible hours, weekly pay.',
      hiringOrganization: { '@id': `${SITE_URL}/#organization` },
      jobLocationType: 'TELECOMMUTE',
      applicantLocationRequirements: { '@type': 'Country', name: 'US' },
      employmentType: 'CONTRACTOR',
      workHours: 'Flexible',
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: { '@type': 'QuantitativeValue', value: 119, unitText: 'SALE' },
      },
      datePosted: new Date().toISOString().split('T')[0],
      validThrough: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      url: `${SITE_URL}/join`,
    },
  ],
}

export default function Page() {
  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  )
}

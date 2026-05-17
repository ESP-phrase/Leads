// JSON-LD structured data for SEO rich snippets.
// Google reads these <script type="application/ld+json"> blocks to render:
//   - Organization knowledge panel (logo, social profiles, contact)
//   - Service / Offer details (price ranges, area served)
//   - FAQPage rich results ("People also ask" boxes)
//   - BreadcrumbList (visible breadcrumbs in SERP)
//
// Schema.org refs:
//   https://schema.org/Organization
//   https://schema.org/Service
//   https://schema.org/FAQPage

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org'

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Safe — we control the input and stringify it. No untrusted text.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** Organization schema — always render in the root layout. */
export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'WebHustle',
        url: SITE_URL,
        logo: `${SITE_URL}/apple-icon`,
        description: 'WebHustle builds modern, mobile-friendly websites for local businesses across the United States — see a free preview before paying.',
        foundingDate: '2025',
        areaServed: { '@type': 'Country', name: 'United States' },
        sameAs: [
          // Add real social URLs as you create them
          'https://www.webhustle.org',
        ],
      }}
    />
  )
}

/** Website schema with sitelinks search box. */
export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'WebHustle',
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-US',
      }}
    />
  )
}

/** Service schema — the website-build product. */
export function ServiceSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE_URL}#service-website`,
        serviceType: 'Custom Website Design and Development',
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: { '@type': 'Country', name: 'United States' },
        audience: {
          '@type': 'BusinessAudience',
          audienceType: 'Local service businesses (plumbers, restaurants, salons, contractors, mechanics)',
        },
        description: 'Mobile-friendly, SEO-optimized websites for local businesses. Custom design, hosting, and Google Business Profile setup included.',
        offers: [
          {
            '@type': 'Offer',
            name: 'Starter Website',
            price: '149',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            description: 'Mobile-optimized single-page website with hosting and custom domain.',
          },
          {
            '@type': 'Offer',
            name: 'Professional Website',
            price: '299',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            description: 'Multi-section professional website with hosting, mobile design, and SEO setup.',
          },
          {
            '@type': 'Offer',
            name: 'Pro Business Website + Google Setup',
            price: '499',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            description: 'Professional website plus Google Business Profile setup and local-SEO optimization.',
          },
          {
            '@type': 'Offer',
            name: 'Premium Custom Website + 90-Day Support',
            price: '799',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            description: 'Custom-designed website, Google Business Profile setup, local-SEO, and 90 days of priority edits.',
          },
        ],
      }}
    />
  )
}

/** FAQPage schema — pass an array of {q, a} entries. */
export function FaqSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }}
    />
  )
}

/** BreadcrumbList — pass an ordered list of {name, url} crumbs. */
export function BreadcrumbSchema({ crumbs }: { crumbs: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: c.url,
        })),
      }}
    />
  )
}

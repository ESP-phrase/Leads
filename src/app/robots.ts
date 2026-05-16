import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/privacy', '/terms', '/sms-consent'],
        disallow: [
          '/agents',       // agent-recruitment content (gated during 10DLC review)
          '/join',         // agent application form
          '/dashboard',
          '/leads',
          '/earnings',
          '/applications',
          '/workers',
          '/dialer',
          '/my-leads',
          '/login',
          '/api/',
          '/preview/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/join', '/privacy', '/terms', '/sms-consent', '/agents'],
        disallow: [
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

import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Only the public B2B pages — /agents and /join are intentionally excluded
  // during 10DLC carrier review.
  return [
    { url: SITE_URL,                lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/privacy`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE_URL}/terms`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE_URL}/sms-consent`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}

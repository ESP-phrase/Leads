import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org'

// Sitemap drives both Google's crawl budget allocation and the URLs Bing/
// other engines learn about. Keep `priority` directional (1.0 = top of
// hierarchy, 0.3 = utility pages). `changeFrequency` is a hint, not a
// promise — Google largely ignores it but Bing/Yandex still use it.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    // Top-level commercial pages
    { url: SITE_URL,                       lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/join`,             lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/agents`,           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Trust + transparency pages — Google rewards sites that have these
    { url: `${SITE_URL}/privacy`,          lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE_URL}/terms`,            lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE_URL}/sms-consent`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]
}

import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org'

export const metadata: Metadata = {
  title: 'Apply to Join WebHustle — $119 Per Closed Sale',
  description: 'Apply to become a WebHustle sales agent. Earn $119 every time a local business buys a website. $5 refundable deposit. Reviewed within 24 hours.',
  alternates: { canonical: `${SITE_URL}/join` },
  openGraph: {
    url: `${SITE_URL}/join`,
    title: 'Apply to Join WebHustle — Earn $119 Per Sale',
    description: 'Submit your application in 2 minutes. Pay a $5 refundable deposit. Get approved within 24 hours and start earning $119 per closed sale from your phone.',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Apply to WebHustle' }],
  },
}

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children
}

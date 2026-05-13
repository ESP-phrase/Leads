import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org'
const SITE_NAME = 'WebHustle'
const GSC_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION
// B2B-clean defaults. The agent-recruitment landing at /agents sets its own metadata.
const DEFAULT_TITLE = 'WebHustle — Custom Websites for Local Businesses'
const DEFAULT_DESC = 'WebHustle builds modern, mobile-friendly websites for local businesses. See a free preview of your custom site before you pay anything. One-time $299.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESC,
  keywords: [
    'custom website for small business',
    'local business website',
    'affordable website design',
    'mobile-friendly website',
    'local SEO website',
    'website for plumbers',
    'website for restaurants',
    'website for salons',
    'WebHustle',
  ],
  authors: [{ name: 'WebHustle', url: SITE_URL }],
  creator: 'WebHustle',
  publisher: 'WebHustle',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.svg',
    shortcut: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'WebHustle — Custom websites for local businesses',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@webhustle',
    creator: '@webhustle',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: 'business',
  ...(GSC_VERIFICATION && {
    verification: { google: GSC_VERIFICATION },
  }),
}

export const viewport: Viewport = {
  themeColor: '#c8f135',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  )
}

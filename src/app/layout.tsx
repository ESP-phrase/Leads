import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://siteforge.app'
const SITE_NAME = 'WebHustle'
const GSC_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION
const DEFAULT_TITLE = 'WebHustle — Earn $119 Per Sale Selling Websites to Local Businesses'
const DEFAULT_DESC = 'Join WebHustle and earn $119 every time a local business buys a website. We build the site, you send a text. Work from your phone, get paid weekly. Apply for $5 — refunded if not approved.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESC,
  keywords: [
    'earn money from home',
    'make money selling websites',
    'website sales commission',
    'work from home sales',
    'earn $119 per sale',
    'sell websites to local businesses',
    'remote sales job',
    'website hustle',
    'SiteForge',
    'commission sales work from home',
    'local business website agent',
    'side hustle $119',
    'earn money from phone',
    'sales rep work from home',
  ],
  authors: [{ name: 'SiteForge', url: SITE_URL }],
  creator: 'SiteForge',
  publisher: 'SiteForge',
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
      alt: 'SiteForge — Earn $119 per sale from your phone',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@siteforge',
    creator: '@siteforge',
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

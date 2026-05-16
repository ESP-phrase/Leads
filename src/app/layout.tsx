import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

const REDDIT_PIXEL_ID = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID
const META_PIXEL_ID   = process.env.NEXT_PUBLIC_META_PIXEL_ID
const GA_ID           = process.env.NEXT_PUBLIC_GA_ID
const CLARITY_ID      = process.env.NEXT_PUBLIC_CLARITY_ID

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.webhustle.org'
const SITE_NAME = 'WebHustle'
const GSC_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION
// B2B-clean defaults during 10DLC carrier review.
// After approval, switch via NEXT_PUBLIC_LANDING_MODE=agents in Vercel env vars.
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
      <head>
        {/* Reddit Pixel — fires PageVisit; server-side CAPI fires Lead/Purchase */}
        {REDDIT_PIXEL_ID && (
          <Script id="reddit-pixel" strategy="afterInteractive">{`
            !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
            rdt('init','${REDDIT_PIXEL_ID}');
            rdt('track','PageVisit');
          `}</Script>
        )}
        {/* Meta Pixel */}
        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${META_PIXEL_ID}');
            fbq('track','PageView');
          `}</Script>
        )}
        {/* Google Analytics (GA4) */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
        {/* Microsoft Clarity — free session recordings + heatmaps */}
        {CLARITY_ID && (
          <Script id="clarity" strategy="afterInteractive">{`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}</Script>
        )}
      </head>
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  )
}

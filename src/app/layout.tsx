import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Website Hustle — Make $119 per sale from your phone',
  description: 'Apply to join Website Hustle. We hand you the leads, the templates, and pre-built websites. You send the text. You make $119 every time someone buys.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.svg',
    shortcut: '/icon.svg',
  },
  openGraph: {
    title: 'Website Hustle — Make $119 per sale from your phone',
    description: 'Apply to join Website Hustle. $5 deposit, refunded if not approved. $119 per closed sale.',
    type: 'website',
  },
  themeColor: '#c8f135',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Website Hustle',
  description: 'Build websites for local businesses. Get paid 40% of every sale.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  )
}

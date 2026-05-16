import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Application Submitted — WebHustle',
  description: 'Your WebHustle application has been received. We review within 24 hours.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

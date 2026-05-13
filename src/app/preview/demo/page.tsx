import type { Metadata } from 'next'
import ModernTemplate from '@/components/templates/ModernTemplate'

export const metadata: Metadata = {
  title: "Mike's Plumbing — Austin, TX",
  description: 'Professional plumbing services in Austin, TX. Available 24/7.',
}

// Static demo preview — no database required.
// Used as the sample link for 10DLC campaign registration.
export default function DemoPreviewPage() {
  return (
    <ModernTemplate
      businessName="Mike's Plumbing"
      headline="Austin's Trusted Plumber — Available 24/7"
      subheadline="Fast, reliable plumbing repairs and installations. Licensed & insured. Serving Austin and surrounding areas."
      services={[
        'Emergency Plumbing Repairs',
        'Drain Cleaning & Unclogging',
        'Water Heater Installation',
        'Leak Detection & Repair',
        'Pipe Replacement',
        'Toilet & Faucet Repair',
      ]}
      aboutText="Mike's Plumbing has served the Austin area for over 12 years. We show up on time, fix it right the first time, and treat your home with respect. No surprise fees — you get an upfront quote before we start any work."
      phone="(512) 555-0192"
      address="Austin, TX 78701"
      city="Austin"
      category="Plumbing"
      rating={4.9}
      reviewCount={87}
      primaryColor="#2563eb"
    />
  )
}

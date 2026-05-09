import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import ModernTemplate from '@/components/templates/ModernTemplate'

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const lead = await db.lead.findUnique({
    where: { slug },
    include: { site: true },
  })

  if (!lead?.site) notFound()

  const services = JSON.parse(lead.site.services) as string[]

  return (
    <ModernTemplate
      businessName={lead.name}
      headline={lead.site.headline}
      subheadline={lead.site.subheadline}
      services={services}
      aboutText={lead.site.aboutText}
      phone={lead.site.phone ?? lead.phone ?? null}
      address={lead.site.address ?? lead.address ?? null}
      city={lead.site.cityServed}
      category={lead.category ?? 'Local Business'}
      rating={lead.rating ?? null}
      reviewCount={lead.reviewCount ?? null}
      primaryColor={lead.site.primaryColor}
    />
  )
}

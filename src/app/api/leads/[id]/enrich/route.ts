import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { enrichLead } from '@/lib/enrich'

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const lead = await db.lead.findUnique({ where: { id } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  const result = await enrichLead({
    name: lead.name,
    city: lead.city,
    placeId: lead.placeId,
    websiteUrl: lead.websiteUrl,
    rating: lead.rating,
    reviewCount: lead.reviewCount,
    hasWebsite: lead.hasWebsite,
    phone: lead.phone,
  })

  const updated = await db.lead.update({
    where: { id },
    data: {
      ownerName: result.ownerName,
      ownerEmail: result.ownerEmail,
      ownerPhone: result.ownerPhone,
      ownerTitle: result.ownerTitle,
      aboutSnippet: result.aboutSnippet,
      enrichmentConfidence: result.confidence,
      enrichmentNotes: `sources: ${result.sources.join(',')} | ${result.notes}`.slice(0, 500),
      enrichedAt: new Date(),
      wealthScore: result.wealthScore,
      wealthSignals: result.wealthSignals.join(', ').slice(0, 500),
    },
  })

  return NextResponse.json({ lead: updated, result })
}

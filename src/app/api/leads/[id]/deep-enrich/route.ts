import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { deepEnrichOwner } from '@/lib/deep-enrich'

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const lead = await db.lead.findUnique({ where: { id } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  const result = await deepEnrichOwner({
    name: lead.name,
    city: lead.city,
    ownerName: lead.ownerName,
  })

  const updated = await db.lead.update({
    where: { id },
    data: {
      ownerLegalName:       result.legalName,
      ownerLegalAddress:    result.legalAddress,
      ownerName:            result.ownerName ?? lead.ownerName,   // don't overwrite existing if we found nothing
      ownerIncomeRange:     result.ownerIncomeRange,
      ownerLinkedinUrl:     result.ownerLinkedinUrl,
      ownerOtherBusinesses: result.ownerOtherBusinesses,
      ownerNewsSignals:     result.ownerNewsSignals,
      ownerDeepEnrichedAt:  new Date(),
      ownerDeepEnrichSource: result.sources.join(','),
    },
  })

  return NextResponse.json({ lead: updated, result })
}

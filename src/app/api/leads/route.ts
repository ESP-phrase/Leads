import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  const where = session?.role === 'worker' && session.workerId
    ? { workerId: session.workerId }
    : {}
  const leads = await db.lead.findMany({
    where,
    include: { site: true, smsLogs: { orderBy: { sentAt: 'desc' } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(leads)
}

export async function POST(req: Request) {
  const body = await req.json()
  const lead = await db.lead.create({
    data: {
      name: body.name,
      phone: body.phone ?? null,
      address: body.address ?? null,
      city: body.city ?? null,
      state: body.state ?? null,
      category: body.category ?? null,
      rating: body.rating ?? null,
      reviewCount: body.reviewCount ?? null,
      placeId: body.placeId ?? null,
      hasWebsite: body.hasWebsite ?? false,
      slug: body.slug ?? null,
    },
    include: { site: true, smsLogs: true },
  })
  return NextResponse.json(lead, { status: 201 })
}

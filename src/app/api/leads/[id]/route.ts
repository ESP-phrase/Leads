import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await db.lead.findUnique({
    where: { id },
    include: { site: true, smsLogs: { orderBy: { sentAt: 'desc' } } },
  })
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(lead)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const lead = await db.lead.update({
    where: { id },
    data: body,
    include: { site: true, smsLogs: { orderBy: { sentAt: 'desc' } } },
  })
  return NextResponse.json(lead)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.lead.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

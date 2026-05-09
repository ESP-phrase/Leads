import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, phone, email, state, hoursPerWeek, experience, whyJoin, referralSource } = body

  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
  }

  const application = await db.application.create({
    data: {
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      state: state?.trim() || null,
      hoursPerWeek: hoursPerWeek ? parseInt(hoursPerWeek) : null,
      experience: experience || null,
      whyJoin: whyJoin?.trim() || null,
      referralSource: referralSource || null,
      status: 'pending',
    },
  })

  return NextResponse.json({ ok: true, applicationId: application.id })
}

export async function GET() {
  const applications = await db.application.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  return NextResponse.json(applications)
}

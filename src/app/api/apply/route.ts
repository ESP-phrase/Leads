import { db } from '@/lib/db'

export async function POST(req: Request) {
  const { name, phone, email, message } = await req.json()
  if (!name?.trim() || !phone?.trim()) {
    return Response.json({ error: 'Name and phone are required' }, { status: 400 })
  }
  const worker = await db.worker.create({
    data: {
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      role: 'Applicant',
      active: false,
    },
  })
  return Response.json({ ok: true, id: worker.id })
}

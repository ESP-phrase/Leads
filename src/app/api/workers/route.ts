import { db } from '@/lib/db'

export async function GET() {
  const workers = await db.worker.findMany({
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { leads: true } } },
  })
  return Response.json(workers)
}

export async function POST(req: Request) {
  const { name, phone, email, role } = await req.json()
  if (!name?.trim()) return Response.json({ error: 'Name required' }, { status: 400 })
  const worker = await db.worker.create({
    data: { name: name.trim(), phone: phone?.trim() || null, email: email?.trim() || null, role: role?.trim() || 'Agent' },
  })
  return Response.json(worker)
}

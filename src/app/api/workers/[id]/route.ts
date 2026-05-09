import { db } from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const worker = await db.worker.update({
    where: { id },
    data: {
      ...(body.name  !== undefined && { name:   body.name.trim() }),
      ...(body.phone !== undefined && { phone:  body.phone?.trim() || null }),
      ...(body.email !== undefined && { email:  body.email?.trim() || null }),
      ...(body.role  !== undefined && { role:   body.role.trim() }),
      ...(body.active !== undefined && { active: body.active }),
    },
  })
  return Response.json(worker)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.worker.delete({ where: { id } })
  return Response.json({ ok: true })
}

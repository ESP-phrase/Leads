import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sessionCookie } from '@/lib/auth'

export async function POST(req: Request) {
  const { phone, password } = await req.json()

  // Admin login
  if (password) {
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }
    const res = NextResponse.json({ role: 'admin' })
    res.cookies.set(sessionCookie({ role: 'admin', name: 'Admin' }))
    return res
  }

  // Worker login via phone
  if (!phone?.trim()) {
    return NextResponse.json({ error: 'Phone or password required' }, { status: 400 })
  }
  const worker = await db.worker.findFirst({
    where: { phone: phone.trim(), active: true },
  })
  if (!worker) {
    return NextResponse.json({ error: 'No active worker found with that number' }, { status: 401 })
  }
  const res = NextResponse.json({ role: 'worker', name: worker.name })
  res.cookies.set(sessionCookie({ role: 'worker', workerId: worker.id, name: worker.name }))
  return res
}

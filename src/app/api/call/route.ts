import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { initiateCall } from '@/lib/sms'

export async function POST(req: Request) {
  const body = await req.json()
  const { leadId } = body

  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

  const lead = await db.lead.findUnique({ where: { id: leadId } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  if (!lead.phone) return NextResponse.json({ error: 'Lead has no phone' }, { status: 400 })

  let callSid: string | null = null
  let callStatus = 'initiated'

  try {
    const result = await initiateCall(lead.phone)
    callSid = result.sid
    callStatus = result.status
  } catch (err) {
    console.error('Call error:', err)
    callStatus = 'failed'
  }

  await db.lead.update({ where: { id: leadId }, data: { status: 'CALLED' } })

  return NextResponse.json({ callSid, callStatus })
}

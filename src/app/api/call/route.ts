import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { initiateCall } from '@/lib/sms'

export async function POST(req: Request) {
  const body = await req.json()
  const { leadId, phone: directPhone } = body

  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

  // Test call — skip DB lookup, call the provided phone directly
  if (leadId === 'test' && directPhone) {
    console.log('[call] test call to:', directPhone)
    try {
      const result = await initiateCall(directPhone)
      console.log('[call] test call result:', result)
      return NextResponse.json({ callSid: result.sid, callStatus: result.status })
    } catch (err) {
      console.error('[call] test call error:', err)
      return NextResponse.json({ error: String(err), callStatus: 'failed' }, { status: 500 })
    }
  }

  const lead = await db.lead.findUnique({ where: { id: leadId } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  if (!lead.phone) return NextResponse.json({ error: 'Lead has no phone' }, { status: 400 })

  let callSid: string | null = null
  let callStatus = 'initiated'

  try {
    const result = await initiateCall(lead.phone)
    callSid = result.sid
    callStatus = result.status
    console.log('[call] initiated:', callSid, callStatus)
  } catch (err) {
    console.error('[call] error:', err)
    callStatus = 'failed'
    return NextResponse.json({ error: String(err), callSid, callStatus }, { status: 500 })
  }

  await db.lead.update({ where: { id: leadId }, data: { status: 'CALLED' } })

  return NextResponse.json({ callSid, callStatus })
}

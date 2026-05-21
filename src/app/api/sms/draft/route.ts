import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getLLMClient, resolveModel, MODEL_VOICE } from '@/lib/llmClient'

const TONES: Record<string, string> = {
  warm: `You write warm, friendly SMS follow-up messages from a solo web designer to local businesses after a missed call.
- Sound like a real helpful person, not a marketer
- Start with the missed call naturally ("Just tried reaching you", "Missed you when I called", etc.)
- Mention you built them a free site preview, keep it casual ("threw together", "put together")
- One gentle value hint: easier for customers to find them, look more established, etc.
- No emojis. No exclamation points. Short and human.`,

  corporate: `You write professional SMS follow-up messages from a web design agency to local businesses after a missed call.
- Polished and concise — no slang, no casual language
- Open with the missed call ("Attempted to reach you today", "Called earlier regarding", etc.)
- Reference the complimentary website mockup you've prepared for their business
- Brief value statement: increased online visibility, professional web presence
- Formal but not stiff. No emojis.`,

  direct: `You write short, punchy SMS follow-up messages from a web designer to local businesses after a missed call.
- Get straight to the point — no fluff
- One line about the missed call, one line about the free site you built
- Lead with the value: "most people find new businesses online" angle
- Make them curious enough to click the link
- No emojis. Under 200 chars before the link.`,

  casual: `You write super casual, laid-back SMS messages from a web designer to local businesses after a missed call.
- Sound like a real person texting a friend's business
- Very short — almost too short. Think text message, not email.
- Something like "tried calling, no luck — built you a free site, worth a look"
- Zero formality. Contractions everywhere. No emojis.`,

  fomo: `You write SMS follow-up messages that create mild urgency/curiosity for local businesses after a missed call.
- Hint that you don't do this for everyone — makes it feel exclusive
- Something like "only reached out to a few businesses in [city]" or "won't keep the preview up forever"
- Don't be pushy or salesy — just create natural curiosity
- Missed call opener, then the exclusive angle, then the link
- No emojis. Sound genuine not gimmicky.`,
}

export async function POST(req: Request) {
  const { leadId, tone = 'warm' } = await req.json()
  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

  if (leadId === 'test') {
    return NextResponse.json({
      message: "Tried reaching you earlier but missed you. Put together a free website demo — worth a quick look.\n\nReply STOP to opt out.",
      previewUrl: '',
    })
  }

  const lead = await db.lead.findUnique({ where: { id: leadId }, include: { site: true } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://landline-pink.vercel.app'
  const previewUrl = lead.slug
    ? `${baseUrl}/s/${lead.slug}`
    : (lead.site?.vercelUrl ?? lead.previewUrl ?? '')

  const systemPrompt = TONES[tone] ?? TONES.warm

  const context = [
    `Business: ${lead.name}`,
    lead.category ? `Category: ${lead.category}` : null,
    lead.city ? `City: ${lead.city}` : null,
    previewUrl ? `Preview site URL: ${previewUrl}` : null,
  ].filter(Boolean).join('\n')

  const completion = await getLLMClient().chat.completions.create({
    model: resolveModel(MODEL_VOICE),
    messages: [
      { role: 'system', content: systemPrompt + '\n\nAlways end with "Reply STOP to opt out." on its own line. Include the preview URL on its own line.' },
      { role: 'user', content: context },
    ],
    max_tokens: 200,
    temperature: 0.85,
  })

  let message = completion.choices[0]?.message?.content?.trim() ?? ''
  if (previewUrl && !message.includes(previewUrl)) message += `\n\n${previewUrl}`
  if (!message.includes('STOP')) message += '\n\nReply STOP to opt out.'

  return NextResponse.json({ message, previewUrl })
}

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { leadId } = await req.json()
  if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

  const lead = await db.lead.findUnique({ where: { id: leadId }, include: { site: true } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://landline-pink.vercel.app'
  const previewUrl = lead.slug
    ? `${baseUrl}/s/${lead.slug}`
    : (lead.site?.vercelUrl ?? lead.previewUrl ?? '')

  const context = [
    `Business: ${lead.name}`,
    lead.category ? `Category: ${lead.category}` : null,
    lead.city ? `City: ${lead.city}` : null,
    previewUrl ? `Preview site URL: ${previewUrl}` : null,
  ].filter(Boolean).join('\n')

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You write short, friendly SMS follow-up messages for a web design agency.
The agency just tried calling a local business but got no answer.
Write a single SMS (under 160 chars before the link) that:
- Mentions you just tried calling
- References their business by name naturally
- Mentions you built them a free website preview
- Includes the preview URL on its own line
- Ends with "Reply STOP to opt out."
- Sounds human, not salesy. No emojis.`,
      },
      {
        role: 'user',
        content: context,
      },
    ],
    max_tokens: 200,
    temperature: 0.8,
  })

  const draft = completion.choices[0]?.message?.content?.trim() ?? ''

  // Ensure the URL is in the message
  let message = draft
  if (previewUrl && !message.includes(previewUrl)) {
    message += `\n\n${previewUrl}`
  }
  if (!message.includes('STOP')) {
    message += '\n\nReply STOP to opt out.'
  }

  return NextResponse.json({ message, previewUrl })
}

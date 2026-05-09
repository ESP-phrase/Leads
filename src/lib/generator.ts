import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export interface GeneratedContent {
  headline: string
  subheadline: string
  services: string[]
  aboutText: string
}

export async function generateSiteContent(lead: {
  name: string
  category: string
  city: string
  rating?: number | null
  reviewCount?: number | null
}): Promise<GeneratedContent> {
  const ratingLine = lead.rating
    ? `They have a ${lead.rating}-star rating with ${lead.reviewCount ?? 'many'} Google reviews.`
    : ''

  const prompt = `Generate professional website copy for a local ${lead.category} business called "${lead.name}" in ${lead.city}. ${ratingLine}

Return valid JSON with exactly these fields:
{
  "headline": "short punchy headline under 8 words",
  "subheadline": "one sentence describing what they do and where, under 20 words",
  "services": ["6 specific services this type of business offers"],
  "aboutText": "2-3 sentences about trust, local experience, and quality — do not mention the company name"
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  })

  return JSON.parse(response.choices[0].message.content!) as GeneratedContent
}

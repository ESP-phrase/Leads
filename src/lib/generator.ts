import { getLLMClient, resolveModel, MODEL_WRITER } from '@/lib/llmClient'

export interface WhyReason {
  title: string
  description: string
}

export interface ProcessStep {
  step: string
  description: string
}

export interface GeneratedContent {
  headline: string
  subheadline: string
  services: string[]
  whyChooseUs: WhyReason[]
  process: ProcessStep[]
  aboutText: string
  hours: string
  serviceArea: string
  emergencyAvailable: boolean
  ctaPrimary: string
  ctaSecondary: string
}

const BANNED_WORDS = [
  'elevate', 'unleash', 'transform', 'unlock', 'empower',
  'passionate', 'cutting-edge', 'state-of-the-art', 'world-class',
  'best-in-class', 'leverage', 'synergy', 'revolutionary',
  'one-stop-shop', 'tailored solutions', 'commitment to excellence',
  'second to none', 'unparalleled', 'seamless', 'innovative',
]

export async function generateSiteContent(lead: {
  name: string
  category: string
  city: string
  rating?: number | null
  reviewCount?: number | null
}): Promise<GeneratedContent> {
  const ratingContext = lead.rating
    ? `They have a ${lead.rating}-star rating with ${lead.reviewCount ?? 'many'} Google reviews — use this as social proof.`
    : ''

  const prompt = `You are writing copy for a real, small local business website. The owner is a tradesperson, not a marketer. Make it sound like a normal person wrote it — direct, specific, useful.

Business: "${lead.name}"
Category: ${lead.category}
City: ${lead.city}
${ratingContext}

CRITICAL RULES:
1. NO marketing fluff. Banned words: ${BANNED_WORDS.join(', ')}.
2. Be specific to this exact business type. A plumber's services are different from an electrician's.
3. Sound like a real owner — slightly conversational, plainspoken, confident but not boastful.
4. Don't repeat the business name in every sentence. Use "we" and "us" naturally.
5. Use plain English. Short sentences. No corporate-speak.

Return valid JSON with these exact fields:

{
  "headline": "5-7 word headline that names the service + outcome (e.g., 'Fast, Reliable Plumbing in Austin' not 'Excellence in Plumbing Solutions')",
  "subheadline": "ONE plain sentence (max 18 words) describing what they actually do, who they serve, and where",
  "services": [6 specific named services this exact type of business offers — concrete, not vague. e.g. for plumber: 'Drain Cleaning', 'Water Heater Repair', not 'Quality Plumbing Solutions'],
  "whyChooseUs": [
    { "title": "3-5 word reason", "description": "1 sentence concrete benefit — what makes them different in a real way" },
    ...3 reasons total, each one DIFFERENT and SPECIFIC to this trade. Examples: 'Licensed & Insured', 'Same-Day Service', 'Upfront Pricing', '20+ Years in ${lead.city}', 'Family-Owned'. Pick ones that fit this trade.
  ],
  "process": [
    { "step": "1. Call or text", "description": "1 sentence what happens" },
    ...3-4 steps total describing what happens from a customer's first call to job done. Make it specific to this trade.
  ],
  "aboutText": "2 sentences max. No clichés. Talk about local roots, specific experience, or how they work — pick ONE angle. Do NOT use the business name. Do NOT say 'passionate'.",
  "hours": "Realistic hours for this trade type. e.g. '24/7 emergency service' for plumbers, 'Mon-Fri 7am-6pm, Sat 9am-2pm' for general trades, 'By appointment' for some services.",
  "serviceArea": "Short sentence naming ${lead.city} + 2-3 nearby/surrounding areas this trade likely serves",
  "emergencyAvailable": true or false based on whether this trade typically has emergency calls (true for plumber/electrician/HVAC/locksmith, false for cleaning/landscaping/etc),
  "ctaPrimary": "3-4 word action button (e.g. 'Get a Free Quote', 'Book Service Now', 'Call for Emergency')",
  "ctaSecondary": "3-4 word alt button (e.g. 'See Our Services', 'Read Reviews')"
}

Return ONLY the JSON. No commentary.`

  const response = await getLLMClient().chat.completions.create({
    model: resolveModel(MODEL_WRITER),
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.85,  // higher temp = less canned
  })

  const raw = JSON.parse(response.choices[0].message.content!) as GeneratedContent

  // Sanity-clean any stray banned words that slipped through
  const clean = (s: string) => {
    let out = s
    for (const w of BANNED_WORDS) {
      out = out.replace(new RegExp(`\\b${w}\\b`, 'gi'), '')
    }
    return out.replace(/\s+/g, ' ').trim()
  }

  return {
    headline: clean(raw.headline),
    subheadline: clean(raw.subheadline),
    services: raw.services.map(clean),
    whyChooseUs: (raw.whyChooseUs ?? []).map(r => ({ title: clean(r.title), description: clean(r.description) })),
    process: (raw.process ?? []).map(p => ({ step: p.step, description: clean(p.description) })),
    aboutText: clean(raw.aboutText),
    hours: raw.hours ?? 'Call for hours',
    serviceArea: raw.serviceArea ?? lead.city,
    emergencyAvailable: !!raw.emergencyAvailable,
    ctaPrimary: clean(raw.ctaPrimary ?? 'Get a Free Quote'),
    ctaSecondary: clean(raw.ctaSecondary ?? 'See Services'),
  }
}

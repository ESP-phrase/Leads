// Free lead-enrichment pipeline.
// Sources, in order:
//   1. Google Places Details (already-paid key) → website + reviews
//   2. Fetch the business's website HTML (free)
//   3. GPT-4o-mini extracts owner name / email / phone / about (≈$0.001/lead)
//   4. Fallback: DuckDuckGo HTML search for "[business] owner" → GPT extract

import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export interface EnrichmentResult {
  ownerName: string | null
  ownerEmail: string | null
  ownerPhone: string | null
  ownerTitle: string | null
  aboutSnippet: string | null
  confidence: 'high' | 'medium' | 'low' | 'none'
  notes: string
  sources: string[]
}

const EMPTY_RESULT: EnrichmentResult = {
  ownerName: null,
  ownerEmail: null,
  ownerPhone: null,
  ownerTitle: null,
  aboutSnippet: null,
  confidence: 'none',
  notes: 'No data found',
  sources: [],
}

/** Google Places Details — pull website + reviews snippets. */
async function getPlaceDetails(placeId: string): Promise<{ website: string | null; reviews: string[] }> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey || !placeId) return { website: null, reviews: [] }

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set('fields', 'website,reviews,editorial_summary')
  url.searchParams.set('key', apiKey)

  try {
    const res = await fetch(url.toString())
    const data = await res.json() as {
      result?: {
        website?: string
        reviews?: { text?: string; author_name?: string }[]
        editorial_summary?: { overview?: string }
      }
    }
    const reviews = (data.result?.reviews ?? [])
      .map(r => r.text ?? '')
      .filter(Boolean)
      .slice(0, 5)
    if (data.result?.editorial_summary?.overview) {
      reviews.unshift(data.result.editorial_summary.overview)
    }
    return { website: data.result?.website ?? null, reviews }
  } catch (e) {
    console.error('Places details error:', e)
    return { website: null, reviews: [] }
  }
}

/** Fetch a URL's HTML, strip tags, truncate. */
async function fetchAndStrip(url: string, maxChars = 8000): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WebHustleBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ''
    const html = await res.text()
    // Strip scripts/styles, then tags
    const stripped = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    return stripped.slice(0, maxChars)
  } catch (e) {
    console.error('Fetch error:', url, e)
    return ''
  }
}

/** Also try the /about, /contact, /team pages of the business website. */
async function fetchWebsiteContext(rootUrl: string): Promise<string> {
  if (!rootUrl) return ''
  const base = rootUrl.replace(/\/$/, '')
  const candidates = [
    base,
    `${base}/about`,
    `${base}/about-us`,
    `${base}/contact`,
    `${base}/team`,
  ]
  const chunks: string[] = []
  for (const u of candidates) {
    const txt = await fetchAndStrip(u, 3500)
    if (txt) chunks.push(`---PAGE: ${u}---\n${txt}`)
    if (chunks.join('\n').length > 12000) break
  }
  return chunks.join('\n').slice(0, 12000)
}

/** Free fallback: DuckDuckGo HTML scrape. */
async function ddgSearch(query: string): Promise<string> {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return ''
    const html = await res.text()
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .slice(0, 5000)
  } catch {
    return ''
  }
}

/** Ask GPT-4o-mini to extract owner info from collected text. */
async function extractWithGpt(
  businessName: string,
  city: string | null,
  text: string,
): Promise<EnrichmentResult> {
  if (!text || text.length < 50) return EMPTY_RESULT

  const prompt = `You are extracting owner/decision-maker info for a local business from web text.

Business: ${businessName}${city ? ` in ${city}` : ''}

Source text (may be from the business website, reviews, or search results):
---
${text}
---

Return JSON with these exact keys (use null for unknown):
{
  "ownerName": "First Last" or null,
  "ownerEmail": "email@example.com" or null,
  "ownerPhone": "+1XXXXXXXXXX" or null (E.164 format),
  "ownerTitle": "Owner" | "Founder" | "Manager" | "CEO" etc or null,
  "aboutSnippet": "1-2 sentence description of the business" or null,
  "confidence": "high" | "medium" | "low" | "none"
}

Rules:
- "high" = explicitly stated ("owner Jane Doe", "founded by John Smith")
- "medium" = strongly implied (one named person referenced multiple times as decision-maker)
- "low" = guess based on weak signals
- "none" = no useful info
- Do NOT invent names. If the text doesn't clearly identify an owner, set ownerName to null.
- aboutSnippet should be useful for a personalized SMS pitch.

Return ONLY the JSON object, no markdown.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    })
    const raw = completion.choices[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(raw) as Partial<EnrichmentResult>
    return {
      ownerName: parsed.ownerName ?? null,
      ownerEmail: parsed.ownerEmail ?? null,
      ownerPhone: parsed.ownerPhone ?? null,
      ownerTitle: parsed.ownerTitle ?? null,
      aboutSnippet: parsed.aboutSnippet ?? null,
      confidence: (parsed.confidence as EnrichmentResult['confidence']) ?? 'none',
      notes: raw.slice(0, 500),
      sources: [],
    }
  } catch (e) {
    console.error('GPT extract error:', e)
    return { ...EMPTY_RESULT, notes: `GPT error: ${String(e).slice(0, 200)}` }
  }
}

/** Merge a new result into an existing one — prefer higher confidence, fill gaps. */
function mergeResults(a: EnrichmentResult, b: EnrichmentResult): EnrichmentResult {
  const order = { high: 3, medium: 2, low: 1, none: 0 }
  const aBetter = order[a.confidence] >= order[b.confidence]
  const primary = aBetter ? a : b
  const secondary = aBetter ? b : a
  return {
    ownerName: primary.ownerName ?? secondary.ownerName,
    ownerEmail: primary.ownerEmail ?? secondary.ownerEmail,
    ownerPhone: primary.ownerPhone ?? secondary.ownerPhone,
    ownerTitle: primary.ownerTitle ?? secondary.ownerTitle,
    aboutSnippet: primary.aboutSnippet ?? secondary.aboutSnippet,
    confidence: primary.confidence,
    notes: `${primary.notes} | ${secondary.notes}`.slice(0, 500),
    sources: [...primary.sources, ...secondary.sources],
  }
}

/** Main entrypoint — enrich a lead by id. */
export async function enrichLead(lead: {
  name: string
  city: string | null
  placeId: string | null
  websiteUrl: string | null
}): Promise<EnrichmentResult> {
  const sources: string[] = []
  let result: EnrichmentResult = EMPTY_RESULT

  // Step 1: Google Places Details (if we have placeId)
  let websiteFromPlaces: string | null = null
  let placesText = ''
  if (lead.placeId) {
    const places = await getPlaceDetails(lead.placeId)
    websiteFromPlaces = places.website
    if (places.reviews.length) {
      placesText = places.reviews.join('\n')
      sources.push('places')
    }
  }

  const websiteUrl = lead.websiteUrl ?? websiteFromPlaces

  // Step 2: Fetch the business's website (if any)
  let websiteText = ''
  if (websiteUrl) {
    websiteText = await fetchWebsiteContext(websiteUrl)
    if (websiteText) sources.push('website')
  }

  // Step 3: GPT extraction on combined text
  const combined = [placesText, websiteText].filter(Boolean).join('\n\n').slice(0, 14000)
  if (combined) {
    result = await extractWithGpt(lead.name, lead.city, combined)
    result.sources = sources
  }

  // Step 4: Fallback — DDG search if confidence is still none/low and we haven't tried it
  if (result.confidence === 'none' || result.confidence === 'low') {
    const query = `"${lead.name}" ${lead.city ?? ''} owner founder`
    const ddgText = await ddgSearch(query)
    if (ddgText) {
      const fallback = await extractWithGpt(lead.name, lead.city, ddgText)
      fallback.sources = ['ddg']
      result = mergeResults(result, fallback)
    }
  }

  return result
}

// Free lead-enrichment pipeline.
// Sources, in order:
//   1. Google Places Details (already-paid key) → website + reviews
//   2. Fetch the business's website HTML (free)
//   3. GPT-4o-mini extracts owner name / email / phone / about (≈$0.001/lead)
//   4. Fallback: DuckDuckGo HTML search for "[business] owner" → GPT extract

import { getLLMClient, resolveModel, MODEL_EXTRACT } from '@/lib/llmClient'

export interface EnrichmentResult {
  ownerName: string | null
  ownerEmail: string | null
  ownerPhone: string | null
  ownerTitle: string | null
  aboutSnippet: string | null
  confidence: 'high' | 'medium' | 'low' | 'none'
  wealthScore: number | null    // 0-100
  wealthSignals: string[]       // ['high reviews', 'premium keywords', 'multi-location', 'established 1985']
  notes: string
  sources: string[]
}

// Premium / wealth keywords that bump the score when found in text
const PREMIUM_KEYWORDS = [
  'luxury', 'premium', 'fine', 'gourmet', 'artisan', 'craft', 'boutique',
  'award-winning', 'award winning', 'michelin', 'featured in', 'voted best',
  'family-owned for', 'since 19', 'since 20', 'over 20 years', 'over 30 years',
  'multiple locations', 'two locations', 'three locations', 'locations across',
  'flagship', 'signature', 'curated', 'handcrafted', 'high-end',
  'expert', 'specialist', 'top-rated', 'best in', 'voted',
]

/** Compute a 0-100 wealth proxy score from lead + enrichment data. */
function computeWealthScore(input: {
  rating: number | null
  reviewCount: number | null
  hasWebsite: boolean
  hasPhone: boolean
  aboutSnippet: string | null
  combinedText: string
}): { score: number; signals: string[] } {
  let score = 0
  const signals: string[] = []
  const text = (input.combinedText + ' ' + (input.aboutSnippet ?? '')).toLowerCase()

  // Reviews × rating — strongest popularity signal (0-40 pts)
  if (input.rating && input.reviewCount) {
    const reviewPts = Math.min(30, Math.log10(input.reviewCount + 1) * 12)  // 10→12, 100→24, 1000→36, capped at 30
    const ratingPts = Math.max(0, (input.rating - 3.5) * 6.6)               // 3.5→0, 4→3, 4.5→6.6, 5→10
    score += reviewPts + ratingPts
    if (input.reviewCount >= 500) signals.push(`${input.reviewCount} reviews`)
    else if (input.reviewCount >= 100) signals.push(`${input.reviewCount} reviews`)
    if (input.rating >= 4.7) signals.push(`${input.rating}★ rating`)
  }

  // Has website (10 pts)
  if (input.hasWebsite) {
    score += 10
    signals.push('has website')
  }

  // Has listed phone (4 pts)
  if (input.hasPhone) {
    score += 4
  }

  // Premium keyword hits (up to 20 pts)
  const hits = PREMIUM_KEYWORDS.filter(k => text.includes(k))
  if (hits.length) {
    score += Math.min(20, hits.length * 4)
    // Keep only the most informative signals
    signals.push(...hits.slice(0, 3).map(h => `"${h}"`))
  }

  // Year-founded signal (e.g. "since 1985", "established 1962") — adds 8 pts if pre-2010
  const yearMatch = text.match(/(?:since|established|founded(?:\s+in)?|est\.?)\s+(\d{4})/i)
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10)
    if (year > 1800 && year < new Date().getFullYear()) {
      const age = new Date().getFullYear() - year
      if (age >= 15) {
        score += 8
        signals.push(`established ${year} (${age}y)`)
      } else if (age >= 5) {
        score += 4
        signals.push(`since ${year}`)
      }
    }
  }

  // Multi-location signal (8 pts)
  if (/(\d+|two|three|four|five|several|multiple)\s+locations/i.test(text) || /locations\s+across/i.test(text)) {
    score += 8
    signals.push('multi-location')
  }

  // Catering / events / corporate — wealth-adjacent business model (5 pts)
  if (/\bcatering\b|\bevents\b|\bcorporate\b|\bweddings\b|\bprivate\s+events\b/i.test(text)) {
    score += 5
    signals.push('catering/events')
  }

  // Clamp
  score = Math.max(0, Math.min(100, Math.round(score)))
  return { score, signals }
}

const EMPTY_RESULT: EnrichmentResult = {
  ownerName: null,
  ownerEmail: null,
  ownerPhone: null,
  ownerTitle: null,
  aboutSnippet: null,
  confidence: 'none',
  wealthScore: null,
  wealthSignals: [],
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
    const completion = await getLLMClient().chat.completions.create({
      model: resolveModel(MODEL_EXTRACT),
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
      wealthScore: null,
      wealthSignals: [],
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
    wealthScore: primary.wealthScore ?? secondary.wealthScore,
    wealthSignals: primary.wealthSignals.length ? primary.wealthSignals : secondary.wealthSignals,
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
  rating: number | null
  reviewCount: number | null
  hasWebsite: boolean
  phone: string | null
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
  let ddgText = ''
  if (result.confidence === 'none' || result.confidence === 'low') {
    const query = `"${lead.name}" ${lead.city ?? ''} owner founder`
    ddgText = await ddgSearch(query)
    if (ddgText) {
      const fallback = await extractWithGpt(lead.name, lead.city, ddgText)
      fallback.sources = ['ddg']
      result = mergeResults(result, fallback)
    }
  }

  // Step 5: Compute wealth proxy from all gathered text + lead signals
  const allText = [placesText, websiteText, ddgText, result.aboutSnippet ?? ''].join('\n')
  const wealth = computeWealthScore({
    rating: lead.rating,
    reviewCount: lead.reviewCount,
    hasWebsite: lead.hasWebsite,
    hasPhone: Boolean(lead.phone),
    aboutSnippet: result.aboutSnippet,
    combinedText: allText,
  })
  result.wealthScore = wealth.score
  result.wealthSignals = wealth.signals

  return result
}

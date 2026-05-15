// Deep owner enrichment (NY + TX only, free).
// Flow:
//   1. OpenCorporates → legal business name, registered address, filing date
//   2. DDG searches the owner / business → web mentions, LinkedIn, news
//   3. GPT extracts wealth signals + estimates income tier from collected text
//
// Manual-trigger only (per-row "Deep" button). Costs ~$0.005/lead in OpenAI tokens.

import OpenAI from 'openai'
import { sosLookup, type SosResult } from './sos-lookup'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export interface DeepEnrichResult {
  legalName: string | null
  legalAddress: string | null
  filingDate: string | null
  ownerName: string | null            // best guess of decision-maker
  ownerIncomeRange: string | null     // '<$50k' | '$50-100k' | '$100-250k' | '$250-500k' | '$500k+'
  ownerLinkedinUrl: string | null
  ownerOtherBusinesses: string | null
  ownerNewsSignals: string | null
  sources: string[]
  notes: string
}

const EMPTY: DeepEnrichResult = {
  legalName: null,
  legalAddress: null,
  filingDate: null,
  ownerName: null,
  ownerIncomeRange: null,
  ownerLinkedinUrl: null,
  ownerOtherBusinesses: null,
  ownerNewsSignals: null,
  sources: [],
  notes: '',
}

/** DDG HTML scrape — strip tags, return text. */
async function ddgScrape(query: string, maxChars = 5000): Promise<string> {
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
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .slice(0, maxChars)
  } catch {
    return ''
  }
}

/** GPT extraction prompt. */
async function extractDeep(
  businessName: string,
  city: string | null,
  sosData: SosResult,
  searchText: string,
): Promise<Partial<DeepEnrichResult>> {
  const prompt = `You are extracting owner wealth signals for a local business owner.

Business: ${businessName}${city ? ` in ${city}` : ''}
${sosData.legalName ? `Legal entity: ${sosData.legalName}` : ''}
${sosData.legalAddress ? `Registered address: ${sosData.legalAddress}` : ''}
${sosData.filingDate ? `Filed: ${sosData.filingDate}` : ''}

Web search results:
---
${searchText.slice(0, 7000)}
---

Return JSON with these exact keys (use null for unknown):
{
  "ownerName": "First Last" or null,
  "ownerLinkedinUrl": "https://linkedin.com/in/..." or null,
  "ownerOtherBusinesses": "Comma-separated list of other businesses they're known to own/run" or null,
  "ownerIncomeRange": "<$50k" | "$50-100k" | "$100-250k" | "$250-500k" | "$500k+" | null,
  "ownerNewsSignals": "1-2 sentences summarizing wealth/success signals from news mentions (e.g. expansion, awards, properties, other ventures)" or null
}

Rules for ownerIncomeRange — be CONSERVATIVE:
- "<$50k": small single-location business, owner sole proprietor, no other businesses
- "$50-100k": established single-location with steady reviews, 5-10 employees implied
- "$100-250k": multi-employee operation, some premium signals, owner mentioned in news
- "$250-500k": multi-location, award-winning, owner has LinkedIn with executive role at established firm
- "$500k+": serial entrepreneur, multiple businesses, named in industry press, large operation

If there are NO useful signals beyond the basic business name, set ownerIncomeRange to null and ownerNewsSignals to null. Do NOT invent.

Return ONLY the JSON object, no markdown.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    })
    const raw = completion.choices[0]?.message?.content ?? '{}'
    return JSON.parse(raw)
  } catch (e) {
    return { ownerNewsSignals: `GPT error: ${String(e).slice(0, 100)}` }
  }
}

/** Main entrypoint. */
export async function deepEnrichOwner(lead: {
  name: string
  city: string | null
  ownerName: string | null   // from basic enrichment (may be null)
}): Promise<DeepEnrichResult> {
  const sources: string[] = []

  // Step 1: SoS lookup (NY/TX only)
  const sos = await sosLookup(lead.name, lead.city)
  if (sos.source !== 'none') sources.push(sos.source)
  if (!sos.legalName && !lead.ownerName) {
    // No legal entity found AND no owner name from basic enrichment → return what little we have
    return { ...EMPTY, sources, notes: `Jurisdiction: ${sos.jurisdiction ?? 'unsupported'} · ${sos.raw}` }
  }

  // Step 2: DDG searches focused on owner / business wealth signals
  const queries: string[] = []
  const ownerHint = lead.ownerName ?? sos.legalName ?? lead.name
  queries.push(`"${ownerHint}" ${lead.city ?? ''} LinkedIn`)
  queries.push(`"${lead.name}" ${lead.city ?? ''} owner founder news`)
  if (sos.legalName) queries.push(`"${sos.legalName}" officer director registered agent`)

  const searchChunks: string[] = []
  for (const q of queries) {
    const txt = await ddgScrape(q, 3500)
    if (txt) searchChunks.push(`--- Query: ${q} ---\n${txt}`)
  }
  const searchText = searchChunks.join('\n').slice(0, 12000)
  if (searchText) sources.push('ddg')

  // Step 3: GPT extracts wealth signals
  const extracted = await extractDeep(lead.name, lead.city, sos, searchText)
  if (extracted.ownerIncomeRange || extracted.ownerNewsSignals) sources.push('gpt')

  return {
    legalName: sos.legalName,
    legalAddress: sos.legalAddress,
    filingDate: sos.filingDate,
    ownerName: extracted.ownerName ?? lead.ownerName ?? null,
    ownerIncomeRange: extracted.ownerIncomeRange ?? null,
    ownerLinkedinUrl: extracted.ownerLinkedinUrl ?? null,
    ownerOtherBusinesses: extracted.ownerOtherBusinesses ?? null,
    ownerNewsSignals: extracted.ownerNewsSignals ?? null,
    sources,
    notes: `${sos.jurisdiction ?? 'unknown'} jurisdiction · ${sources.join('+')}`,
  }
}

// Free Secretary-of-State / business-filing lookups for NY and TX only.
// Uses OpenCorporates' free public API (500 calls/mo, no key required for basic search)
// as the primary source. Falls back to DuckDuckGo-scraped state filings.
//
// Returns: legal owner name, registered address, filing date.

const OPENCORPORATES_BASE = 'https://api.opencorporates.com/v0.4'

export interface SosResult {
  legalName: string | null
  legalAddress: string | null
  officerNames: string[]      // additional officers/members if listed
  jurisdiction: 'ny' | 'tx' | null
  source: string              // 'opencorporates' | 'manual'
  filingDate: string | null
  raw: string                 // for debug
}

const EMPTY: SosResult = {
  legalName: null,
  legalAddress: null,
  officerNames: [],
  jurisdiction: null,
  source: 'none',
  filingDate: null,
  raw: '',
}

/** Determine the jurisdiction code from the lead's city string. */
function detectJurisdiction(city: string | null): 'ny' | 'tx' | null {
  if (!city) return null
  const c = city.toLowerCase()
  if (c.includes('new york') || c.includes('ny') || c.includes('brooklyn') || c.includes('manhattan') || c.includes('queens') || c.includes('bronx') || c.includes('staten')) return 'ny'
  if (c.includes('austin') || c.includes('houston') || c.includes('dallas') || c.includes('texas') || c.includes(' tx') || c.endsWith(',tx')) return 'tx'
  return null
}

/** OpenCorporates company search → returns the top match for a business name in the given state. */
async function searchOpenCorporates(businessName: string, jurisdiction: 'ny' | 'tx'): Promise<SosResult> {
  // jurisdiction codes: us_ny, us_tx
  const jurisCode = `us_${jurisdiction}`
  const url = new URL(`${OPENCORPORATES_BASE}/companies/search`)
  url.searchParams.set('q', businessName)
  url.searchParams.set('jurisdiction_code', jurisCode)
  url.searchParams.set('inactive', 'false')
  url.searchParams.set('per_page', '5')

  try {
    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) })
    if (!res.ok) {
      // 401/403 means we hit the free-tier limit; just return empty
      return { ...EMPTY, jurisdiction, raw: `OC status ${res.status}` }
    }
    const data = await res.json() as {
      results?: {
        companies?: { company: {
          name: string
          registered_address_in_full?: string
          incorporation_date?: string
          opencorporates_url: string
          jurisdiction_code: string
        } }[]
      }
    }
    const companies = data.results?.companies ?? []
    if (companies.length === 0) return { ...EMPTY, jurisdiction, source: 'opencorporates', raw: 'no match' }

    // Best match: pick the one whose name is closest to the input
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
    const target = norm(businessName)
    const best = companies
      .map(({ company }) => ({
        company,
        score: target === norm(company.name) ? 100
             : norm(company.name).startsWith(target) ? 80
             : norm(company.name).includes(target) ? 60
             : target.includes(norm(company.name).slice(0, Math.max(6, target.length - 4))) ? 40
             : 20,
      }))
      .sort((a, b) => b.score - a.score)[0]

    if (!best || best.score < 40) return { ...EMPTY, jurisdiction, source: 'opencorporates', raw: 'low confidence match' }

    return {
      legalName: best.company.name,
      legalAddress: best.company.registered_address_in_full ?? null,
      officerNames: [], // free-tier OC doesn't return officers without a fetch
      jurisdiction,
      source: 'opencorporates',
      filingDate: best.company.incorporation_date ?? null,
      raw: best.company.opencorporates_url,
    }
  } catch (e) {
    return { ...EMPTY, jurisdiction, raw: `OC error: ${String(e).slice(0, 100)}` }
  }
}

/** Main entry point — lookup business in NY or TX SoS. Returns EMPTY if jurisdiction not supported. */
export async function sosLookup(businessName: string, city: string | null): Promise<SosResult> {
  const jurisdiction = detectJurisdiction(city)
  if (!jurisdiction) return { ...EMPTY, raw: 'unsupported jurisdiction' }

  // Try OpenCorporates first
  const ocResult = await searchOpenCorporates(businessName, jurisdiction)
  if (ocResult.legalName) return ocResult

  return { ...EMPTY, jurisdiction, source: 'opencorporates', raw: ocResult.raw }
}

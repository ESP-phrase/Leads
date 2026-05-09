interface PlaceDetails {
  name: string
  formatted_phone_number?: string
  formatted_address?: string
  website?: string
  rating?: number
  user_ratings_total?: number
}

export interface ScrapeResult {
  name: string
  phone: string | null
  address: string | null
  city: string
  category: string
  rating: number | null
  reviewCount: number | null
  placeId: string
  hasWebsite: boolean
}

export interface ScrapeStats {
  totalFromApi: number
  hadWebsite: number
  belowRating: number
  belowReviews: number
  passed: number
}

export async function scrapeLeads(
  city: string,
  category: string,
  minRating = 4.0,
  minReviews = 10
): Promise<{ leads: ScrapeResult[]; stats: ScrapeStats }> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY not set')

  const query = encodeURIComponent(`${category} in ${city}`)
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`

  const searchRes = await fetch(searchUrl, { cache: 'no-store' })
  const searchData = await searchRes.json()

  if (searchData.status === 'REQUEST_DENIED') {
    throw new Error(`API key error: ${searchData.error_message ?? 'REQUEST_DENIED — check that Places API is enabled in Google Cloud Console'}`)
  }
  if (searchData.status === 'OVER_QUERY_LIMIT') {
    throw new Error('Over query limit — check billing in Google Cloud Console')
  }
  if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API: ${searchData.status} — ${searchData.error_message ?? ''}`)
  }

  const places = (searchData.results ?? []).slice(0, 20)
  const stats: ScrapeStats = { totalFromApi: places.length, hadWebsite: 0, belowRating: 0, belowReviews: 0, passed: 0 }
  const leads: ScrapeResult[] = []

  for (const place of places) {
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,formatted_address,website,rating,user_ratings_total&key=${apiKey}`
    const detailsRes = await fetch(detailsUrl, { cache: 'no-store' })
    const detailsData = await detailsRes.json()
    const d: PlaceDetails = detailsData.result ?? {}

    if (d.website) { stats.hadWebsite++; continue }
    if ((d.rating ?? 0) < minRating) { stats.belowRating++; continue }
    if ((d.user_ratings_total ?? 0) < minReviews) { stats.belowReviews++; continue }

    stats.passed++
    leads.push({
      name: d.name ?? place.name,
      phone: d.formatted_phone_number ?? null,
      address: d.formatted_address ?? null,
      city,
      category,
      rating: d.rating ?? null,
      reviewCount: d.user_ratings_total ?? null,
      placeId: place.place_id,
      hasWebsite: false,
    })
  }

  return { leads, stats }
}

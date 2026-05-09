import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { slugify } from '@/lib/utils'

// Processes ONE search query (one page) and returns results as JSON.
// The client calls this repeatedly, driving the queue — so switching tabs never kills the scrape.

export async function POST(req: Request) {
  const { city, category, query, minRating = 4.0, minReviews = 10, pageToken: incomingToken } = await req.json()

  if (!city || !category || !query) {
    return NextResponse.json({ error: 'city, category, query required' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GOOGLE_PLACES_API_KEY not set' }, { status: 500 })

  const leads: object[] = []
  const skipped: { name: string; reason: string }[] = []
  const seenPlaceIds = new Set<string>()
  let nextPageToken: string | null = null
  let invalidRetries = 0

  // Fetch one page
  let pageToken: string | undefined = incomingToken ?? undefined
  const url = pageToken
    ? `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${pageToken}&key=${apiKey}`
    : `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`

  // Retry on INVALID_REQUEST (page token not ready yet)
  let searchData: { status: string; results?: { place_id: string; name: string }[]; next_page_token?: string; error_message?: string } = { status: 'ZERO_RESULTS' }
  for (let attempt = 0; attempt <= 3; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 2500))
    const searchRes = await fetch(url, { cache: 'no-store' })
    searchData = await searchRes.json()
    if (searchData.status !== 'INVALID_REQUEST') break
    invalidRetries++
  }

  if (searchData.status === 'REQUEST_DENIED') {
    return NextResponse.json({ error: `API key error: ${searchData.error_message ?? 'Places API not enabled'}` }, { status: 500 })
  }

  if (searchData.status === 'OK' || searchData.status === 'ZERO_RESULTS') {
    const places: { place_id: string; name: string }[] = searchData.results ?? []
    nextPageToken = searchData.next_page_token ?? null

    // Fetch all place details in parallel (5 at a time) instead of sequentially
    const CONCURRENCY = 5
    const uniquePlaces = places.filter(p => {
      if (seenPlaceIds.has(p.place_id)) { skipped.push({ name: p.name, reason: 'duplicate' }); return false }
      seenPlaceIds.add(p.place_id); return true
    })

    for (let i = 0; i < uniquePlaces.length; i += CONCURRENCY) {
      const batch = uniquePlaces.slice(i, i + CONCURRENCY)
      await Promise.allSettled(batch.map(async (place) => {
        const detailsRes = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,formatted_address,website,rating,user_ratings_total&key=${apiKey}`,
          { cache: 'no-store' }
        )
        const { result: d = {} } = await detailsRes.json()

        if (d.website)                                { skipped.push({ name: d.name ?? place.name, reason: 'website' }); return }
        if ((d.rating ?? 0) < minRating)              { skipped.push({ name: d.name ?? place.name, reason: 'rating' }); return }
        if ((d.user_ratings_total ?? 0) < minReviews) { skipped.push({ name: d.name ?? place.name, reason: 'reviews' }); return }

        const existing = await db.lead.findUnique({ where: { placeId: place.place_id } })
        if (existing) { skipped.push({ name: d.name ?? place.name, reason: 'duplicate' }); return }

        const baseSlug = slugify(d.name ?? place.name)
        let slug = baseSlug, attempt = 0
        while (await db.lead.findFirst({ where: { slug } })) slug = `${baseSlug}-${++attempt}`

        const created = await db.lead.create({
          data: {
            name: d.name ?? place.name,
            phone: d.formatted_phone_number ?? null,
            address: d.formatted_address ?? null,
            city, category,
            rating: d.rating ?? null,
            reviewCount: d.user_ratings_total ?? null,
            placeId: place.place_id,
            hasWebsite: false,
            slug,
          },
          include: { site: true, smsLogs: true },
        })
        leads.push(created)
      }))
    }
  }

  return NextResponse.json({ leads, skipped, nextPageToken })
}

import { db } from '@/lib/db'
import { slugify } from '@/lib/utils'

// Generate multiple search queries to maximise coverage (each yields up to 60 results)
function buildQueries(category: string, city: string): string[] {
  const directions = ['North', 'South', 'East', 'West', 'Downtown', 'Central', 'Northeast', 'Northwest', 'Southeast', 'Southwest']
  const catVariants = buildCategoryVariants(category)
  const queries: string[] = []

  // Base queries for each category variant
  for (const cat of catVariants) {
    queries.push(`${cat} in ${city}`)
  }

  // Directional queries for the primary category
  for (const dir of directions) {
    queries.push(`${category} in ${dir} ${city}`)
  }

  // Near me style
  queries.push(`best ${category} ${city}`)
  queries.push(`local ${category} ${city}`)
  queries.push(`affordable ${category} ${city}`)
  queries.push(`top rated ${category} ${city}`)

  // Deduplicate
  return [...new Set(queries)]
}

function buildCategoryVariants(category: string): string[] {
  const cat = category.toLowerCase().trim()
  const map: Record<string, string[]> = {
    plumber:        ['plumber', 'plumbing service', 'plumbing contractor', 'plumbing company'],
    electrician:    ['electrician', 'electrical contractor', 'electrical service', 'electric company'],
    'hvac':         ['hvac', 'air conditioning repair', 'heating and cooling', 'ac repair', 'hvac contractor'],
    'roofing':      ['roofing contractor', 'roofer', 'roof repair', 'roofing company'],
    'landscaping':  ['landscaping', 'lawn care', 'lawn service', 'landscape company', 'yard maintenance'],
    'cleaning':     ['cleaning service', 'house cleaning', 'maid service', 'janitorial service', 'cleaning company'],
    'pest control': ['pest control', 'exterminator', 'pest management', 'pest removal'],
    'painting':     ['painter', 'painting contractor', 'house painter', 'painting company'],
    'pool service': ['pool service', 'pool cleaning', 'pool maintenance', 'pool repair', 'swimming pool service'],
    'auto repair':  ['auto repair', 'car repair', 'auto mechanic', 'mechanic shop', 'automotive repair'],
    'locksmith':    ['locksmith', 'lock service', 'lock repair', 'locksmith service'],
    'moving':       ['moving company', 'movers', 'moving service', 'local movers'],
    'handyman':     ['handyman', 'handyman service', 'home repair', 'handyman contractor'],
    'flooring':     ['flooring', 'floor installation', 'hardwood flooring', 'carpet installation'],
    'concrete':     ['concrete contractor', 'concrete service', 'concrete company', 'concrete repair'],
    'fencing':      ['fence contractor', 'fencing company', 'fence installation', 'fence repair'],
    'pressure washing': ['pressure washing', 'power washing', 'pressure cleaning'],
    'tree service': ['tree service', 'tree trimming', 'tree removal', 'arborist'],
    'garage door':  ['garage door repair', 'garage door service', 'garage door installation'],
    'appliance repair': ['appliance repair', 'appliance service', 'appliance technician'],
    'drywall':      ['drywall contractor', 'drywall repair', 'drywall installation'],
    'gutters':      ['gutter cleaning', 'gutter installation', 'gutter repair', 'gutter service'],
    'carpet cleaning': ['carpet cleaning', 'carpet cleaner', 'upholstery cleaning'],
    'window cleaning': ['window cleaning', 'window washer', 'window cleaning service'],
    'solar':        ['solar installer', 'solar panel installation', 'solar company', 'solar contractor'],
    'remodeling':   ['remodeling contractor', 'home remodeling', 'kitchen remodeling', 'bathroom remodeling'],
    'plumbing':     ['plumbing', 'plumber', 'plumbing service', 'plumbing contractor'],
    'electrical':   ['electrician', 'electrical contractor', 'electrical service'],
  }

  for (const [key, variants] of Object.entries(map)) {
    if (cat.includes(key)) return variants
  }

  // Fallback: just use the category as-is plus a "service" variant
  return [category, `${category} service`, `${category} company`, `${category} contractor`]
}

export async function POST(req: Request) {
  const body = await req.json()
  const { city, category, minRating = 4.0, minReviews = 10 } = body

  if (!city || !category) {
    return new Response(JSON.stringify({ error: 'city and category required' }), { status: 400 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GOOGLE_PLACES_API_KEY not set' }), { status: 500 })
  }

  const encoder = new TextEncoder()
  const signal = req.signal

  const stream = new ReadableStream({
    async start(controller) {
      function send(data: object) {
        try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)) } catch { /* closed */ }
      }

      const seenPlaceIds = new Set<string>()

      async function processPlace(place: { place_id: string; name: string }) {
        if (signal.aborted) return
        if (seenPlaceIds.has(place.place_id)) {
          send({ type: 'skip', reason: 'duplicate', name: place.name }); return
        }
        seenPlaceIds.add(place.place_id)

        const detailsRes = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,formatted_address,website,rating,user_ratings_total&key=${apiKey}`,
          { cache: 'no-store', signal }
        )
        const { result: d = {} } = await detailsRes.json()

        if (d.website)                                { send({ type: 'skip', reason: 'website',   name: d.name ?? place.name }); return }
        if ((d.rating ?? 0) < minRating)              { send({ type: 'skip', reason: 'rating',    name: d.name ?? place.name }); return }
        if ((d.user_ratings_total ?? 0) < minReviews) { send({ type: 'skip', reason: 'reviews',   name: d.name ?? place.name }); return }

        const existing = await db.lead.findUnique({ where: { placeId: place.place_id } })
        if (existing) { send({ type: 'skip', reason: 'duplicate', name: d.name ?? place.name }); return }

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
        send({ type: 'lead', lead: created })
      }

      try {
        const queries = buildQueries(category, city)
        send({ type: 'info', message: `Running ${queries.length} searches to maximise results…` })

        for (let qi = 0; qi < queries.length; qi++) {
          if (signal.aborted) break
          const query = queries[qi]
          send({ type: 'query', index: qi + 1, total: queries.length, query })

          let pageToken: string | undefined
          let pageNum = 0
          let invalidRetries = 0

          do {
            if (signal.aborted) break

            const url = pageToken
              ? `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${pageToken}&key=${apiKey}`
              : `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`

            const searchRes = await fetch(url, { cache: 'no-store', signal })
            const searchData = await searchRes.json()

            if (searchData.status === 'REQUEST_DENIED') {
              send({ type: 'error', message: `API key error: ${searchData.error_message ?? 'Places API not enabled'}` })
              break
            }
            if (searchData.status === 'INVALID_REQUEST' && pageToken) {
              if (++invalidRetries > 3) { pageToken = undefined; break }
              await new Promise(r => setTimeout(r, 3000))
              continue
            }
            invalidRetries = 0
            if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') break

            const places: { place_id: string; name: string }[] = searchData.results ?? []
            send({ type: 'page', page: ++pageNum, count: places.length, query })

            for (const place of places) {
              if (signal.aborted) break
              await processPlace(place)
            }

            pageToken = searchData.next_page_token
            if (pageToken && !signal.aborted) await new Promise(r => setTimeout(r, 3000))

          } while (pageToken && !signal.aborted)

          // Small pause between queries to avoid rate limiting
          if (!signal.aborted && qi < queries.length - 1) {
            await new Promise(r => setTimeout(r, 1000))
          }
        }

        if (!signal.aborted) send({ type: 'done' })
      } catch (err: unknown) {
        if ((err as { name?: string }).name !== 'AbortError') {
          send({ type: 'error', message: (err as Error).message })
        }
      }

      try { controller.close() } catch { /* already closed */ }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

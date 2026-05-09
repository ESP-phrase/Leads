import { db } from '@/lib/db'
import { slugify } from '@/lib/utils'

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

      async function processPlace(place: { place_id: string; name: string }) {
        if (signal.aborted) return
        const detailsRes = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,formatted_address,website,rating,user_ratings_total&key=${apiKey}`,
          { cache: 'no-store', signal }
        )
        const { result: d = {} } = await detailsRes.json()

        if (d.website)                              { send({ type: 'skip', reason: 'website',  name: d.name ?? place.name }); return }
        if ((d.rating ?? 0) < minRating)            { send({ type: 'skip', reason: 'rating',   name: d.name ?? place.name }); return }
        if ((d.user_ratings_total ?? 0) < minReviews) { send({ type: 'skip', reason: 'reviews', name: d.name ?? place.name }); return }

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
        let pageToken: string | undefined
        let pageNum = 0
        let invalidRetries = 0

        do {
          if (signal.aborted) break

          const url = pageToken
            ? `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${pageToken}&key=${apiKey}`
            : `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(`${category} in ${city}`)}&key=${apiKey}`

          const searchRes = await fetch(url, { cache: 'no-store', signal })
          const searchData = await searchRes.json()

          if (searchData.status === 'REQUEST_DENIED') {
            send({ type: 'error', message: `API key error: ${searchData.error_message ?? 'Places API not enabled'}` }); break
          }
          // next_page_token sometimes isn't ready — retry up to 3x with a longer delay
          if (searchData.status === 'INVALID_REQUEST' && pageToken) {
            if (++invalidRetries > 3) { pageToken = undefined; break }
            await new Promise(r => setTimeout(r, 3000))
            continue
          }
          invalidRetries = 0
          if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
            send({ type: 'error', message: `Places API: ${searchData.status}` }); break
          }

          const places: { place_id: string; name: string }[] = searchData.results ?? []
          send({ type: 'page', page: ++pageNum, count: places.length })

          for (const place of places) {
            if (signal.aborted) break
            await processPlace(place)
          }

          pageToken = searchData.next_page_token
          // Google requires a short delay before using next_page_token
          if (pageToken && !signal.aborted) await new Promise(r => setTimeout(r, 3000))

        } while (pageToken && !signal.aborted)

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

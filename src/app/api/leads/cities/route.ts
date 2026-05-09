import { NextResponse } from 'next/server'

// Proxies Google Places Autocomplete — keeps the API key server-side
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json([])

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return NextResponse.json([])

  const url =
    `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
    `?input=${encodeURIComponent(q)}` +
    `&types=(cities)` +
    `&key=${apiKey}`

  const res = await fetch(url, { cache: 'no-store' })
  const data = await res.json()

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    return NextResponse.json([])
  }

  // Return simplified list: "Austin, TX" style strings
  const suggestions: string[] = (data.predictions ?? [])
    .slice(0, 6)
    .map((p: { description: string }) => {
      // Strip country suffix (", United States") for cleaner display
      return p.description.replace(/, United States$/, '').replace(/, USA$/, '')
    })

  return NextResponse.json(suggestions)
}

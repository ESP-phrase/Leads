// Reddit Ads — server-side Conversions API client.
// Docs: https://ads-api.reddit.com/api/v3/pixels/{pixel_id}/conversion_events
//
// Required env vars:
//   NEXT_PUBLIC_REDDIT_PIXEL_ID   (public — also used by client-side pixel)
//   REDDIT_CAPI_TOKEN             (server-only — Bearer token from Reddit ad account)
//
// Tracking types accepted by Reddit: PageVisit, ViewContent, Search, AddToCart,
// AddToWishlist, Purchase, Lead, SignUp, Custom.
//
// Fire-and-forget: never blocks user requests.

const PIXEL_ID = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID
const CAPI_TOKEN = process.env.REDDIT_CAPI_TOKEN

export type RedditEvent =
  | 'PageVisit' | 'ViewContent' | 'Search' | 'AddToCart' | 'AddToWishlist'
  | 'Purchase' | 'Lead' | 'SignUp' | 'Custom'

export interface RedditCapiEvent {
  type: RedditEvent
  customEventName?: string
  value?: { currency: string; amount: number }      // for Purchase
  conversionId?: string                              // dedupe key (matches client pixel event_id)
  // Match keys (improve attribution accuracy)
  email?: string | null
  phone?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  clickId?: string | null                            // ?rdt_cid from URL — TOP-level on the event
  externalId?: string | null                         // your stable user/order ID (we use PreviewRequest.id)
  screenWidth?: number | null
  screenHeight?: number | null
  actionSource?: 'website' | 'app' | 'physical_store' | 'phone_call' | 'chat' | 'email' | 'system_generated' | 'business_messaging' | 'other'
}

/** SHA-256 hash for PII hashing (Reddit requires hashed email/phone). */
async function sha256(s: string): Promise<string> {
  const data = new TextEncoder().encode(s.trim().toLowerCase())
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

/** Send a conversion event to Reddit CAPI. Returns ok=false silently on failure. */
export async function trackRedditConversion(event: RedditCapiEvent): Promise<{ ok: boolean; reason?: string }> {
  if (!PIXEL_ID || !CAPI_TOKEN) {
    return { ok: false, reason: 'reddit_capi_not_configured' }
  }

  // Build hashed/normalized user match keys (Reddit nests these under "user")
  const user: Record<string, unknown> = {}
  if (event.email) user.email = await sha256(event.email)
  if (event.phone) {
    // Normalize phone: strip non-digits, prefix +
    const digits = event.phone.replace(/\D/g, '')
    if (digits.length >= 10) user.phone_number = await sha256(`+${digits}`)
  }
  if (event.ipAddress)  user.ip_address  = event.ipAddress
  if (event.userAgent)  user.user_agent  = event.userAgent
  if (event.externalId) user.external_id = await sha256(event.externalId)
  if (event.screenWidth && event.screenHeight) {
    user.screen_dimensions = { width: event.screenWidth, height: event.screenHeight }
  }

  // Build event body — note: click_id is TOP-level, not nested under user
  const eventBody: Record<string, unknown> = {
    event_at_ms: Date.now(),
    action_source: event.actionSource ?? 'website',
    type: {
      tracking_type: event.type,
      ...(event.type === 'Custom' && event.customEventName ? { custom_event_name: event.customEventName } : {}),
    },
    user,
  }
  if (event.clickId) eventBody.click_id = event.clickId
  if (event.conversionId) eventBody.event_metadata = { conversion_id: event.conversionId }
  if (event.value) {
    eventBody.event_metadata = {
      ...(eventBody.event_metadata as object ?? {}),
      currency: event.value.currency,
      value_decimal: event.value.amount,
    }
  }

  try {
    const res = await fetch(`https://ads-api.reddit.com/api/v3/pixels/${PIXEL_ID}/conversion_events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { events: [eventBody] } }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
      const err = await res.text().catch(() => '')
      console.error('Reddit CAPI failed:', res.status, err.slice(0, 200))
      return { ok: false, reason: `reddit_capi_${res.status}` }
    }
    return { ok: true }
  } catch (e) {
    console.error('Reddit CAPI error:', e)
    return { ok: false, reason: String(e).slice(0, 100) }
  }
}

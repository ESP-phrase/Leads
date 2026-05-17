import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC = [
  // Public pages (visible to anyone, no auth needed)
  '/login', '/join', '/agents', '/pricing', '/sms-consent', '/privacy', '/terms',
  // Public link redirector + previews
  '/s/', '/preview',
  // Public webhook + public-facing API
  '/api/auth', '/api/stripe', '/api/apply', '/api/telnyx', '/api/preview-request', '/api/sms/status',
  // SEO + static files
  '/robots.txt', '/sitemap.xml', '/opengraph-image', '/apple-icon', '/icon',
  '/_next', '/favicon',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Public landing page
  if (pathname === '/') return NextResponse.next()
  if (PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next()

  const session = req.cookies.get('siteforge_session')?.value
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { role, workerId } = JSON.parse(session)

    // Workers can only access /my-leads and /api/leads (filtered server-side)
    if (role === 'worker') {
      const workerAllowed = ['/my-leads', '/api/leads', '/api/sms', '/api/call', '/api/auth']
      if (!workerAllowed.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL('/my-leads', req.url))
      }
    }
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  // Skip middleware entirely for Telnyx webhooks, Stripe webhooks, static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/telnyx|api/stripe).*)'],
}

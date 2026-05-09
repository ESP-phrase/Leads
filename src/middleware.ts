import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC = ['/login', '/join', '/sms-consent', '/privacy', '/s/', '/api/auth', '/api/stripe', '/api/apply', '/preview', '/_next', '/favicon']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Public landing page
  if (pathname === '/') return NextResponse.next()
  if (PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next()

  const session = req.cookies.get('canvass_session')?.value
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

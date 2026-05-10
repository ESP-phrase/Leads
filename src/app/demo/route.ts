import { NextResponse } from 'next/server'
import { sessionCookie } from '@/lib/auth'

// One-click demo login — navigating to /demo instantly logs you in as admin
// and redirects to the dashboard. Remove or gate this in production.
export async function GET() {
  const res = NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL ?? 'https://landline-pink.vercel.app'))
  res.cookies.set(sessionCookie({ role: 'admin', name: 'Admin' }))
  return res
}

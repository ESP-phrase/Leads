import { cookies } from 'next/headers'

export interface Session {
  role: 'admin' | 'worker'
  workerId?: string
  name: string
}

const COOKIE = 'canvass_session'

export async function getSession(): Promise<Session | null> {
  const store = await cookies()
  const raw = store.get(COOKIE)?.value
  if (!raw) return null
  try { return JSON.parse(raw) as Session } catch { return null }
}

export function sessionCookie(session: Session) {
  return {
    name: COOKIE,
    value: JSON.stringify(session),
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  }
}

export function clearCookie() {
  return { name: COOKIE, value: '', maxAge: 0, path: '/' }
}

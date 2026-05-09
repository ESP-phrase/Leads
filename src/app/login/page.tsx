'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Phone, LogIn } from 'lucide-react'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'worker' | 'admin'>('worker')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const body = mode === 'admin' ? { password } : { phone }
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    router.push(data.role === 'admin' ? '/dashboard' : '/my-leads')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: '#0d0e0b' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div className="text-center mb-8 flex justify-center">
          <Logo size={42} textSize="xl" />
          <p className="text-sm mt-2" style={{ color: '#3a4a2a' }}>Sign in to continue</p>
        </div>

        {/* Demo shortcut */}
        <button onClick={async () => {
            setLoading(true); setError(null)
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: 'canvass2025' }),
            })
            if (res.ok) { router.push('/dashboard'); router.refresh() }
            else { setError('Demo login failed'); setLoading(false) }
          }}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm mb-4 border-2 transition-all"
          style={{ borderColor: '#c8f135', color: '#c8f135', background: '#c8f13510' }}>
          ⚡ Enter Demo (Admin)
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: '#1e2218' }} />
          <span className="text-xs" style={{ color: '#2a3a1a' }}>or sign in manually</span>
          <div className="flex-1 h-px" style={{ background: '#1e2218' }} />
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl p-1 mb-6" style={{ background: '#111310', border: '1px solid #1e2218' }}>
          {(['worker', 'admin'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(null) }}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
              style={mode === m
                ? { background: '#c8f135', color: '#0d0e0b' }
                : { background: 'transparent', color: '#4a5a3a' }}>
              {m === 'admin' ? 'Admin' : 'Worker'}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin}
              className="rounded-2xl p-8 space-y-5"
              style={{ background: '#111310', border: '1px solid #1e2218' }}>

          {mode === 'worker' ? (
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: '#4a5a3a' }}>
                PHONE NUMBER
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#3a4a2a' }} />
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+1 555 000 0000" autoFocus
                  className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540]"
                  style={{ background: '#0d0e0b', border: '1px solid #1e2218' }} />
              </div>
              <p className="text-xs mt-2" style={{ color: '#2a3a1a' }}>
                Use the phone number your admin registered you with.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: '#4a5a3a' }}>
                ADMIN PASSWORD
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#3a4a2a' }} />
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoFocus
                  className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-[#2a3a1a] focus:outline-none focus:ring-1 focus:ring-[#c8f13540]"
                  style={{ background: '#0d0e0b', border: '1px solid #1e2218' }} />
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs px-3 py-2.5 rounded-lg" style={{ background: '#2a0d0d', color: '#d45a5a', border: '1px solid #401515' }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all"
            style={{ background: '#c8f135', color: '#0d0e0b' }}>
            <LogIn size={15} />
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: '#2a3a1a' }}>
          Want to join as a worker?{' '}
          <a href="/join" style={{ color: '#4a5a3a', textDecoration: 'underline' }}>Apply here</a>
        </p>
      </div>
    </div>
  )
}

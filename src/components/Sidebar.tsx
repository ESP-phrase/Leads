'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Search, PhoneCall, Users, LogOut, DollarSign, UserPlus, Settings } from 'lucide-react'
import clsx from 'clsx'
import Logo from '@/components/Logo'
import { useEffect, useState } from 'react'

const links = [
  { href: '/dashboard',     label: 'Pipeline',     icon: LayoutDashboard },
  { href: '/leads',         label: 'Find Leads',   icon: Search },
  { href: '/dialer',        label: 'DialFlow',     icon: PhoneCall },
  { href: '/applications',  label: 'Applications', icon: UserPlus,    badge: 'pending' },
  { href: '/workers',       label: 'Workers',      icon: Users },
  { href: '/earnings',      label: 'Earnings',     icon: DollarSign },
  { href: '/integrations',  label: 'Integrations', icon: Settings },
]

export default function Sidebar() {
  const path = usePathname()
  const router = useRouter()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function loadCount() {
      try {
        const res = await fetch('/api/apply')
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setPendingCount(data.filter((a: { status: string }) => a.status === 'pending').length)
      } catch { /* ignore */ }
    }
    loadCount()
    const interval = setInterval(loadCount, 60_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <>
      <aside className="hidden md:flex w-[220px] flex-shrink-0 flex-col h-screen sticky top-0"
             style={{ background: '#111310', borderRight: '1px solid #1e2218' }}>
        <div className="px-5 py-5 border-b border-[#1e2218]">
          <Logo size={24} textSize="md" />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {links.map(({ href, label, icon: Icon, badge }) => (
            <Link key={href} href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                path.startsWith(href)
                  ? 'text-[#c8f135] bg-[#c8f13510]'
                  : 'text-[#6b7a5a] hover:text-[#a0b080] hover:bg-[#ffffff06]'
              )}>
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {badge === 'pending' && pendingCount > 0 && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#d4a44a', color: '#0d0e0b', minWidth: 20, textAlign: 'center' }}>
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mx-3 mb-4 rounded-xl p-4" style={{ background: '#c8f13510', border: '1px solid #c8f13520' }}>
          <p className="text-xs font-bold mb-1" style={{ color: '#c8f135' }}>Pro tip</p>
          <p className="text-xs leading-relaxed" style={{ color: '#5a6a4a' }}>
            Build site first, then SMS — response rate is 3× higher.
          </p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t"
           style={{ background: '#111310', borderColor: '#1e2218' }}>
        {links.map(({ href, label, icon: Icon, badge }) => (
          <Link key={href} href={href}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
            style={{ color: path.startsWith(href) ? '#c8f135' : '#4a5a3a' }}>
            <Icon size={18} />
            <span className="text-[9px] font-semibold">{label}</span>
            {badge === 'pending' && pendingCount > 0 && (
              <span className="absolute top-1 text-[8px] font-bold px-1 py-0.5 rounded-full"
                style={{ background: '#d4a44a', color: '#0d0e0b' }}>
                {pendingCount}
              </span>
            )}
          </Link>
        ))}
        <button onClick={logout}
          className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
          style={{ color: '#4a5a3a', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <LogOut size={18} />
          <span className="text-[9px] font-semibold">Logout</span>
        </button>
      </nav>
    </>
  )
}

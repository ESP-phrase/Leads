'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Search, PhoneCall, Users, LogOut, DollarSign } from 'lucide-react'
import clsx from 'clsx'
import Logo from '@/components/Logo'

const links = [
  { href: '/dashboard', label: 'Pipeline',   icon: LayoutDashboard },
  { href: '/leads',     label: 'Find Leads', icon: Search },
  { href: '/dialer',    label: 'DialFlow',   icon: PhoneCall },
  { href: '/workers',   label: 'Workers',    icon: Users },
  { href: '/earnings',  label: 'Earnings',   icon: DollarSign },
]

export default function Sidebar() {
  const path = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col h-screen sticky top-0"
           style={{ background: '#111310', borderRight: '1px solid #1e2218' }}>
      <div className="px-5 py-5 border-b border-[#1e2218]">
        <Logo size={24} textSize="md" />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              path.startsWith(href)
                ? 'text-[#c8f135] bg-[#c8f13510]'
                : 'text-[#6b7a5a] hover:text-[#a0b080] hover:bg-[#ffffff06]'
            )}>
            <Icon size={16} />
            {label}
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
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Search, PhoneCall } from 'lucide-react'

const links = [
  { href: '/dashboard', label: 'Pipeline', icon: LayoutDashboard },
  { href: '/leads', label: 'Find Leads', icon: Search },
  { href: '/dialer', label: 'DialFlow', icon: PhoneCall },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-0 flex items-center gap-1 h-14">
      <span className="text-white font-bold text-sm tracking-tight mr-6">
        Lead<span className="text-blue-400">Gen</span>
      </span>
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-2 text-sm font-medium px-4 py-4 border-b-2 transition-colors ${
            path.startsWith(href)
              ? 'border-blue-500 text-white'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Icon size={15} />
          {label}
        </Link>
      ))}
    </nav>
  )
}

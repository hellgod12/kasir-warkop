'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/branches', label: 'Cabang' },
    { href: '/dashboard/menu', label: 'Menu' },
    { href: '/dashboard/menu/categories', label: 'Kategori' },
    { href: '/dashboard/orders/new', label: 'POS' },
    { href: '/dashboard/orders', label: 'Pesanan' },
  ]

  return (
    <div className="w-64 bg-gray-900 min-h-screen p-4">
      <h1 className="text-white text-xl font-bold mb-8">Warkop POS</h1>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-lg text-white hover:bg-gray-800 ${
              pathname === item.href ? 'bg-gray-800' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

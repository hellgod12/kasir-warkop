'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { signOut } from '@/app/auth/actions'
import Link from 'next/link'

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const auth = mounted ? useAuth() : null
  const user = auth?.user || null
  const profile = auth?.profile || null

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Selamat datang, {profile?.full_name}!</p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/dashboard/branches" className="bg-orange-600 text-white p-6 rounded-lg shadow hover:bg-orange-700">
          <h2 className="text-xl font-bold mb-2">🏢 Cabang</h2>
          <p className="text-orange-100">Setup cabang dulu</p>
        </Link>

        <Link href="/dashboard/menu/categories" className="bg-purple-600 text-white p-6 rounded-lg shadow hover:bg-purple-700">
          <h2 className="text-xl font-bold mb-2">🏷️ Kategori</h2>
          <p className="text-purple-100">Tambah kategori</p>
        </Link>

        <Link href="/dashboard/menu" className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700">
          <h2 className="text-xl font-bold mb-2">📋 Menu</h2>
          <p className="text-green-100">Tambah produk</p>
        </Link>

        <Link href="/dashboard/orders/new" className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700">
          <h2 className="text-xl font-bold mb-2">🛒 POS</h2>
          <p className="text-blue-100">Buat pesanan</p>
        </Link>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Status Pengembangan</h2>
        <div className="space-y-2">
          <p className="text-green-600">✓ Initial setup selesai</p>
          <p className="text-green-600">✓ Supabase integration</p>
          <p className="text-green-600">✓ Auth system</p>
          <p className="text-green-600">✓ Cart calculation</p>
          <p className="text-green-600">✓ POS sederhana</p>
          <p className="text-yellow-600">⏳ Need: Setup Supabase project</p>
          <p className="text-gray-600">⏳ Fitur-fitur lanjutan</p>
        </div>
      </div>
    </div>
  )
}

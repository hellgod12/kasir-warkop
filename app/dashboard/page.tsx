'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { signOut } from '@/app/auth/actions'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const auth = mounted ? useAuth() : null
  const user = auth?.user || null
  const profile = auth?.profile || null
  const supabase = mounted ? createClient() : null
  const [stats, setStats] = useState({ products: 0, orders: 0, branches: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && supabase) fetchStats()
  }, [mounted, supabase])

  const fetchStats = async () => {
    if (!supabase) return
    try {
      const [products, orders, branches] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('branches').select('id', { count: 'exact', head: true })
      ])
      setStats({
        products: products.count || 0,
        orders: orders.count || 0,
        branches: branches.count || 0
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="text-4xl mb-4">☕</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {profile?.full_name || 'Admin'}!</p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md"
        >
          Keluar
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/dashboard/branches" className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="text-4xl mb-3">🏢</div>
          <h2 className="text-xl font-bold mb-1">Cabang</h2>
          <p className="text-orange-100 text-sm">Setup cabang dulu</p>
        </Link>

        <Link href="/dashboard/menu/categories" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="text-4xl mb-3">🏷️</div>
          <h2 className="text-xl font-bold mb-1">Kategori</h2>
          <p className="text-purple-100 text-sm">Tambah kategori</p>
        </Link>

        <Link href="/dashboard/menu" className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="text-4xl mb-3">📋</div>
          <h2 className="text-xl font-bold mb-1">Menu</h2>
          <p className="text-green-100 text-sm">Tambah produk</p>
        </Link>

        <Link href="/dashboard/orders/new" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="text-4xl mb-3">🛒</div>
          <h2 className="text-xl font-bold mb-1">POS</h2>
          <p className="text-blue-100 text-sm">Buat pesanan</p>
        </Link>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Status Pengembangan</h3>
          <div className="space-y-3">
            <div className="flex items-center text-green-600">
              <span className="text-xl mr-2">✓</span>
              <span>Initial setup selesai</span>
            </div>
            <div className="flex items-center text-green-600">
              <span className="text-xl mr-2">✓</span>
              <span>Supabase integration</span>
            </div>
            <div className="flex items-center text-green-600">
              <span className="text-xl mr-2">✓</span>
              <span>Auth system</span>
            </div>
            <div className="flex items-center text-green-600">
              <span className="text-xl mr-2">✓</span>
              <span>Cart calculation</span>
            </div>
            <div className="flex items-center text-green-600">
              <span className="text-xl mr-2">✓</span>
              <span>POS berfungsi</span>
            </div>
            <div className="flex items-center text-green-600">
              <span className="text-xl mr-2">✓</span>
              <span>Excel export</span>
            </div>
            <div className="flex items-center text-green-600">
              <span className="text-xl mr-2">✓</span>
              <span>Shift management</span>
            </div>
            <div className="flex items-center text-green-600">
              <span className="text-xl mr-2">✓</span>
              <span>Tax settings</span>
            </div>
            <div className="flex items-center text-green-600">
              <span className="text-xl mr-2">✓</span>
              <span>Report generation</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-gray-700">Total Produk</span>
              <span className="font-bold text-amber-600">{stats.products}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Total Orders</span>
              <span className="font-bold text-green-600">{stats.orders}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Total Cabang</span>
              <span className="font-bold text-blue-600">{stats.branches}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-4">💡 Tips</h3>
          <div className="space-y-3 text-sm">
            <p>1. Setup cabang dulu sebelum tambah produk</p>
            <p>2. Buat kategori untuk organisasi menu</p>
            <p>3. Gambar produk akan tampil di POS</p>
            <p>4. PPN otomatis 11% dihitung</p>
          </div>
        </div>
      </div>
    </div>
  )
}

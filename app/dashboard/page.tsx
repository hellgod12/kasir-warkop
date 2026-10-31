'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { signOut } from '@/app/auth/actions'

export default function DashboardPage() {
  const { user, profile } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Warkop POS Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {profile?.full_name} ({profile?.role})
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Welcome!</h2>
            <p className="text-gray-600">
              Anda login sebagai <strong>{profile?.role}</strong>
            </p>
            <p className="text-gray-600">
              Email: {user?.email}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Buat Pesanan Baru
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Manajemen Menu
              </button>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Laporan Penjualan
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Status</h2>
            <p className="text-green-600">✓ Supabase terkoneksi</p>
            <p className="text-green-600">✓ Auth berfungsi</p>
            <p className="text-gray-600">⏳ Fitur lain dalam development</p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Fitur yang akan segera hadir:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Multi-cabang management</li>
            <li>POS system dengan perhitungan otomatis</li>
            <li>Manajemen menu & stok</li>
            <li>Laporan penjualan dengan export Excel</li>
            <li>Shift kasir</li>
            <li>Discount & promo</li>
            <li>Layanan antar</li>
            <li>Program loyalitas</li>
            <li>Dan banyak lagi...</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

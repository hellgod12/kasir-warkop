'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function MenuPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) fetchProducts()
  }, [mounted])

  const fetchProducts = async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name')
    setProducts(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Menu</h1>
          <button
            onClick={() => router.push('/dashboard/menu/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Tambah Produk
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-xl font-bold text-green-600 mt-2">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-500">Stok: {product.stock}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

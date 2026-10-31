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

  const deleteProduct = async (id: string) => {
    if (!supabase) return
    if (!confirm('Hapus produk ini?')) return
    
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) fetchProducts()
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Menu</h1>
        <button
          onClick={() => router.push('/dashboard/menu/new')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg"
        >
          + Tambah Produk
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              {product.image_url && (
                <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              )}
              <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
              <p className="text-xl font-bold text-green-600 mt-2">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">Stok: {product.stock}</p>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function CategoriesPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) fetchCategories()
  }, [mounted])

  const fetchCategories = async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order')
    setCategories(data || [])
  }

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    if (!supabase) return

    setLoading(true)
    const { error } = await supabase.from('categories').insert({
      name: newCategoryName,
      display_order: categories.length
    } as any)
    
    if (!error) {
      setNewCategoryName('')
      fetchCategories()
      alert('Kategori berhasil ditambahkan!')
    } else {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kategori Menu</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <form onSubmit={addCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nama kategori baru"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl disabled:opacity-50"
          >
            {loading ? 'Menambahkan...' : 'Tambah'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="text-4xl mb-3">🏷️</div>
            <h3 className="font-semibold text-lg text-gray-900">{cat.name}</h3>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
              cat.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {cat.is_active ? 'Aktif' : 'Non-aktif'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

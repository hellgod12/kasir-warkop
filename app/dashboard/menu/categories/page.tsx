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
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Kategori Menu</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <form onSubmit={addCategory} className="flex gap-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nama kategori baru"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Tambah
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <span className="font-medium">{cat.name}</span>
              <span className={`px-2 py-1 rounded text-xs ${cat.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {cat.is_active ? 'Aktif' : 'Non-aktif'}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

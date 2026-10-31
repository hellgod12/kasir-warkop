'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ProductInsert, Category } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  
  const [formData, setFormData] = useState<ProductInsert>({
    name: '',
    description: '',
    category_id: '',
    branch_id: '',
    price: 0,
    cost_price: 0,
    stock: 0,
    min_stock: 10,
    is_active: true,
    is_featured: false,
  })
  
  const [categories, setCategories] = useState<Category[]>([])
  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchCategories()
      fetchBranches()
    }
  }, [mounted])

  const fetchCategories = async () => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order')
      
      if (error) {
        console.error('Error fetching categories:', error)
        setError('Gagal mengambil kategori: ' + error.message)
        return
      }
      
      setCategories(data || [])
      console.log('Categories loaded:', data?.length, 'items')
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Gagal mengambil kategori')
    }
  }

  const fetchBranches = async () => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
      
      if (error) {
        console.error('Error fetching branches:', error)
        return
      }
      
      setBranches(data || [])
      console.log('Branches loaded:', data?.length, 'items')
      
      // Auto-select first branch if available
      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, branch_id: (data[0] as any).id }))
      }
    } catch (err) {
      console.error('Error fetching branches:', err)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !supabase) return null
    
    setUploading(true)
    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `products/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile)
      
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)
      
      return publicUrl
    } catch (err) {
      console.error('Upload error:', err)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!supabase) throw new Error('Supabase not available')
      
      let imageUrl = formData.image_url
      if (imageFile) {
        imageUrl = await uploadImage()
        if (!imageUrl) throw new Error('Failed to upload image')
      }
      
      const { error } = await supabase.from('products').insert({
        ...formData,
        image_url: imageUrl
      } as any)
      
      if (error) throw error
      
      router.push('/dashboard/menu')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Produk
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview('')
                      }}
                      className="mt-2 text-red-500 text-sm hover:text-red-700"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-gray-600 text-sm">Klik untuk upload gambar</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="mt-2 inline-block px-4 py-2 bg-amber-500 text-white rounded-lg cursor-pointer hover:bg-amber-600"
                    >
                      Pilih File
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk *
              </label>
              <input
                type="text"
                required
                minLength={3}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Contoh: Kopi Susu Gula Aren"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Deskripsi produk (opsional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cabang *
              </label>
              <select
                required
                value={formData.branch_id || ''}
                onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih cabang</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                required
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga (Rp) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  step={0.01}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="15000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Modal (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={formData.cost_price || 0}
                  onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok Minimum *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.min_stock}
                  onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Aktif</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Featured (Highlight di menu)</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
              >
                {loading || uploading ? 'Memproses...' : 'Simpan Produk'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

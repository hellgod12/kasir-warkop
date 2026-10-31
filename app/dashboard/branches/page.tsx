'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Branch } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function BranchesPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [branches, setBranches] = useState<Branch[]>([])
  const [newBranchName, setNewBranchName] = useState('')
  const [loading, setLoading] = useState(false)
  const [duplicateError, setDuplicateError] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) fetchBranches()
  }, [mounted])

  const fetchBranches = async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('branches')
      .select('*')
      .order('name')
    setBranches(data || [])
  }

  const addBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBranchName.trim()) return
    if (!supabase) return

    // Check duplicate
    const exists = branches.some(b => b.name.toLowerCase() === newBranchName.toLowerCase())
    if (exists) {
      setDuplicateError('Cabang dengan nama ini sudah ada')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('branches').insert({
      name: newBranchName,
      is_active: true
    } as any)
    
    if (!error) {
      setNewBranchName('')
      setDuplicateError('')
      fetchBranches()
      alert('Cabang berhasil ditambahkan!')
    } else {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cabang</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        {duplicateError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{duplicateError}</div>
        )}
        <form onSubmit={addBranch} className="flex gap-4">
          <input
            type="text"
            value={newBranchName}
            onChange={(e) => { setNewBranchName(e.target.value); setDuplicateError('') }}
            placeholder="Nama cabang baru"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl disabled:opacity-50"
          >
            {loading ? 'Menambahkan...' : 'Tambah Cabang'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="text-4xl mb-3">🏢</div>
            <h3 className="font-semibold text-lg text-gray-900">{branch.name}</h3>
            <p className="text-gray-600 text-sm">{branch.address}</p>
            <p className="text-gray-600 text-sm">{branch.phone}</p>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
              branch.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {branch.is_active ? 'Aktif' : 'Non-aktif'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

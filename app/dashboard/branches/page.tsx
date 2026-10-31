'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Branch } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function BranchesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [branches, setBranches] = useState<Branch[]>([])
  const [newBranchName, setNewBranchName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    const { data } = await supabase
      .from('branches')
      .select('*')
      .order('name')
    setBranches(data || [])
  }

  const addBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBranchName.trim()) return

    setLoading(true)
    const { error } = await supabase.from('branches').insert({
      name: newBranchName,
      is_active: true
    })
    
    if (!error) {
      setNewBranchName('')
      fetchBranches()
    }
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cabang</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <form onSubmit={addBranch} className="flex gap-4">
          <input
            type="text"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            placeholder="Nama cabang baru"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Tambah Cabang
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg">{branch.name}</h3>
            <p className="text-gray-600 text-sm">{branch.address}</p>
            <p className="text-gray-600 text-sm">{branch.phone}</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${branch.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {branch.is_active ? 'Aktif' : 'Non-aktif'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

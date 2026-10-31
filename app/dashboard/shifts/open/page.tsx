'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function OpenShiftPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [openingBalance, setOpeningBalance] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    
    setLoading(true)
    try {
      const { error } = await supabase.from('shifts').insert({
        branch_id: 'placeholder',
        cashier_id: 'placeholder',
        shift_number: `SHIFT-${Date.now()}`,
        status: 'open',
        opening_balance: parseFloat(openingBalance),
        opened_at: new Date().toISOString()
      } as any)
      
      if (error) throw error
      router.push('/dashboard/shifts')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Buka Shift Baru</h1>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Modal Awal (Rp)</label>
              <input
                type="number"
                required
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="0"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg"
            >
              {loading ? 'Loading...' : 'Buka Shift'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

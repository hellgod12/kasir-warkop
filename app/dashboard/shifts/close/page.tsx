'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CloseShiftPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [closingBalance, setClosingBalance] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setLoading(true)
    // TODO: Update shift status
    setTimeout(() => {
      router.push('/dashboard/shifts')
      setLoading(false)
    }, 500)
  }

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-8">Tutup Shift</h1>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Modal Akhir (Rp)</label>
              <input
                type="number"
                required
                value={closingBalance}
                onChange={(e) => setClosingBalance(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg"
            >
              {loading ? 'Loading...' : 'Tutup Shift'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

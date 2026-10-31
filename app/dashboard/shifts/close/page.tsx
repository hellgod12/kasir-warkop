'use client'

// @ts-nocheck
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CloseShiftPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [closingBalance, setClosingBalance] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentShift, setCurrentShift] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) fetchCurrentShift()
  }, [mounted])

  const fetchCurrentShift = async () => {
    if (!supabase) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: shift } = await supabase
          .from('shifts')
          .select('*')
          .eq('cashier_id', user.id)
          .eq('status', 'open')
          .single()
        setCurrentShift(shift)
      }
    } catch (err) {
      console.error('Error fetching current shift:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    if (!currentShift) {
      setError('Tidak ada shift yang sedang berjalan')
      return
    }
    
    setLoading(true)
    try {
      const closingAmount = parseFloat(closingBalance)
      const expectedAmount = currentShift.opening_balance
      const discrepancy = closingAmount - expectedAmount
      
      const res = await (supabase.from('shifts') as any)
        .update({
          status: 'closed',
          closing_balance: closingAmount,
          discrepancy: discrepancy,
          closed_at: new Date().toISOString()
        })
        .eq('id', currentShift.id)
      
      if (res.error) throw res.error
      
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
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Tutup Shift</h1>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
          {currentShift && (
            <div className="mb-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600">Modal Awal: Rp {currentShift.opening_balance?.toLocaleString('id-ID')}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Modal Akhir (Rp)</label>
              <input
                type="number"
                required
                value={closingBalance}
                onChange={(e) => setClosingBalance(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="0"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Tutup Shift'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

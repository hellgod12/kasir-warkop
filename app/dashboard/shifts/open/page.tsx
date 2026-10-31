'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function OpenShiftPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [openingBalance, setOpeningBalance] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) fetchUserProfile()
  }, [mounted])

  const fetchUserProfile = async () => {
    if (!supabase) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setUserProfile(profile)
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    if (!userProfile) {
      setError('User profile tidak ditemukan')
      return
    }
    
    setLoading(true)
    try {
      const { error } = await supabase.from('shifts').insert({
        branch_id: userProfile.branch_id,
        cashier_id: userProfile.id,
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
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Buka Shift'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DiscountsPage() {
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [discounts, setDiscounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) fetchDiscounts()
  }, [mounted])

  const fetchDiscounts = async () => {
    if (!supabase) return
    const { data } = await supabase.from('discounts').select('*').order('created_at', { ascending: false })
    setDiscounts(data || [])
    setLoading(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Diskon & Promo</h1>
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-600 mb-4">Fitur diskon dan promo akan segera hadir...</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {discounts.map((d) => (
              <div key={d.id} className="border p-4 rounded-lg">
                <h3 className="font-bold">{d.name}</h3>
                <p className="text-sm text-gray-600">{d.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TaxSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [ppnRate, setPpnRate] = useState(11)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!supabase) return
    setLoading(true)
    // TODO: Save to settings table
    setTimeout(() => setLoading(false), 500)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Pengaturan Pajak</h1>
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">PPN (%)</label>
            <input
              type="number"
              value={ppnRate}
              onChange={(e) => setPpnRate(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-1">Standar Indonesia: 11%</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg"
          >
            {loading ? 'Saving...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}

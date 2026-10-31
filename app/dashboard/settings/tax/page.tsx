'use client'

// @ts-nocheck
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TaxSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [ppnRate, setPpnRate] = useState(11)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) fetchTaxSettings()
  }, [mounted])

  const fetchTaxSettings = async () => {
    if (!supabase) return
    try {
      const { data } = await supabase
        .from('tax_settings')
        .select('*')
        .eq('is_active', true)
        .single()
      
      if (data) {
        setPpnRate((data as any).rate || 11)
      }
    } catch (err) {
      console.error('Error fetching tax settings:', err)
    }
  }

  const handleSave = async () => {
    if (!supabase) {
      setError('Supabase belum terkoneksi')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const { data: existing } = await supabase
        .from('tax_settings')
        .select('*')
        .eq('type', 'ppn')
        .single()
      
      if (existing) {
        const res = await (supabase.from('tax_settings') as any)
          .update({ rate: ppnRate })
          .eq('id', (existing as any).id)
        
        if (res.error) throw res.error
      } else {
        const res = await (supabase.from('tax_settings') as any)
          .insert({
            type: 'ppn',
            rate: ppnRate,
            is_active: true
          })
        
        if (res.error) throw res.error
      }
      
      setSuccess('Pengaturan pajak berhasil disimpan!')
    } catch (err: any) {
      console.error(err)
      setError('Error menyimpan: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Pengaturan Pajak</h1>
      
      {error && (
        <div className="p-4 rounded-lg mb-6 bg-red-50 text-red-700">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 rounded-lg mb-6 bg-green-50 text-green-700">
          {success}
        </div>
      )}
      
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
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}

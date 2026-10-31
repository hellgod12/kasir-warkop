'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ShiftsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [shifts, setShifts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) fetchShifts()
  }, [mounted])

  const fetchShifts = async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('shifts')
      .select('*')
      .order('opened_at', { ascending: false })
    setShifts(data || [])
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shift Kasir</h1>
        <button
          onClick={() => router.push('/dashboard/shifts/open')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg"
        >
          Buka Shift Baru
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left">No. Shift</th>
                <th className="px-6 py-3 text-left">Tanggal</th>
                <th className="px-6 py-3 text-left">Jam Buka</th>
                <th className="px-6 py-3 text-left">Jam Tutup</th>
                <th className="px-6 py-3 text-left">Durasi</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Modal Awal</th>
                <th className="px-6 py-3 text-left">Modal Akhir</th>
                <th className="px-6 py-3 text-left">Selisih</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {shifts.map((shift) => {
                const openDate = new Date(shift.opened_at)
                const closeDate = shift.closed_at ? new Date(shift.closed_at) : null
                const duration = closeDate ? Math.floor((closeDate.getTime() - openDate.getTime()) / 3600000) : null
                const hours = duration || 0
                const dateStr = openDate.toLocaleDateString('id-ID')
                const openTime = openDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                const closeTime = closeDate ? closeDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'
                
                return (
                  <tr key={shift.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{shift.shift_number}</td>
                    <td className="px-6 py-4">{dateStr}</td>
                    <td className="px-6 py-4">{openTime}</td>
                    <td className="px-6 py-4">{closeTime}</td>
                    <td className="px-6 py-4">{duration ? `${hours} jam` : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        shift.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {shift.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">Rp {shift.opening_balance.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      {shift.closing_balance ? `Rp ${shift.closing_balance.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {shift.discrepancy_amount !== null && (
                        <span className={shift.discrepancy_amount < 0 ? 'text-red-600' : 'text-green-600'}>
                          Rp {shift.discrepancy_amount.toLocaleString('id-ID')}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

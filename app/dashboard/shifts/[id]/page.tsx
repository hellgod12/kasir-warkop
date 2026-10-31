'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ShiftDetailsPage() {
  const router = useRouter()
  const shiftId = router.query.id as string
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && shiftId) fetchTransactions()
  }, [mounted, shiftId])

  const fetchTransactions = async () => {
    if (!supabase || !shiftId) return
    const { data } = await supabase
      .from('shift_transactions')
      .select('*')
      .eq('shift_id', shiftId)
      .order('created_at', { ascending: false })
    setTransactions(data || [])
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Detail Transaksi Shift</h1>
        <button onClick={() => router.back()} className="px-4 py-2 border rounded-lg">Kembali</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Waktu</th>
                <th className="px-6 py-3 text-left">Tipe</th>
                <th className="px-6 py-3 text-left">Jumlah</th>
                <th className="px-6 py-3 text-left">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(t.created_at).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">{t.transaction_type}</td>
                  <td className="px-6 py-4">Rp {t.amount?.toLocaleString('id-ID') || '-'}</td>
                  <td className="px-6 py-4">{t.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import * as XLSX from 'xlsx'

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false)
  const supabase = mounted ? createClient() : null
  const [loading, setLoading] = useState(false)

  const exportToExcel = async (reportType: string) => {
    if (!supabase) return
    setLoading(true)
    
    try {
      let data: any[] = []
      let fileName = ''
      
      if (reportType === 'sales') {
        const { data: orders } = await supabase.from('orders').select('*')
        data = orders || []
        fileName = 'Laporan_Penjualan.xlsx'
      } else if (reportType === 'inventory') {
        const { data: products } = await supabase.from('products').select('*')
        data = products || []
        fileName = 'Laporan_Stok.xlsx'
      } else if (reportType === 'orders') {
        const { data: orders } = await supabase.from('orders').select('*')
        data = orders || []
        fileName = 'Laporan_Pesanan.xlsx'
      }
      
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Report')
      XLSX.writeFile(wb, fileName)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Laporan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => exportToExcel('sales')}
          disabled={loading}
          className="bg-green-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <div className="text-4xl mb-2">📊</div>
          <h3 className="font-bold">Laporan Penjualan</h3>
          <p className="text-sm text-green-100">Export ke Excel</p>
        </button>
        <button
          onClick={() => exportToExcel('inventory')}
          disabled={loading}
          className="bg-blue-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <div className="text-4xl mb-2">📦</div>
          <h3 className="font-bold">Laporan Stok</h3>
          <p className="text-sm text-blue-100">Export ke Excel</p>
        </button>
        <button
          onClick={() => exportToExcel('orders')}
          disabled={loading}
          className="bg-purple-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <div className="text-4xl mb-2">📋</div>
          <h3 className="font-bold">Laporan Pesanan</h3>
          <p className="text-sm text-purple-100">Export ke Excel</p>
        </button>
      </div>
    </div>
  )
}

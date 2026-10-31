'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [timeout, setTimeout] = useState(false)

  useEffect(() => {
    // Timeout setelah 2 detik jika loading masih true
    const timer = setTimeout(() => {
      setTimeout(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading || timeout) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/auth/login')
      }
    }
  }, [user, loading, timeout, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Warkop POS</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

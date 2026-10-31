'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const auth = mounted ? useAuth() : null
  const user = auth?.user || null
  const loading = auth?.loading || true

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/auth/login')
      }
    }
  }, [user, loading, router, mounted])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Warkop POS</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

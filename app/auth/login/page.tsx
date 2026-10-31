'use client'

import { useState } from 'react'
import { signIn } from '../actions'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@warkop.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    const result = await signIn(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header dengan gradient */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-8">
            <div className="text-center">
              <div className="text-5xl mb-3">☕</div>
              <h2 className="text-3xl font-bold text-white">
                Warkop POS
              </h2>
              <p className="mt-2 text-amber-100 text-sm">
                Sistem Kasir Profesional
              </p>
            </div>
          </div>
          
          <div className="px-8 py-8">
            <form action={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  ⚠️ {error}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue="admin@warkop.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="admin@warkop.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  defaultValue="admin123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : 'Masuk'}
              </button>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs text-amber-800 font-semibold mb-2">🔐 Default Login:</p>
                <div className="text-xs text-amber-700 space-y-1">
                  <p><span className="font-medium">Email:</span> admin@warkop.com</p>
                  <p><span className="font-medium">Password:</span> admin123</p>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 Warkop POS. Professional Coffee Shop Management System
        </p>
      </div>
    </div>
  )
}

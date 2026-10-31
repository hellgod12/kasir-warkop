'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types/database'
import { calculateTotal, calculateChange, type CartItem } from '@/lib/calculations/cart'
import { useRouter } from 'next/navigation'

export default function NewOrderPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const supabase = mounted ? createClient() : null
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paidAmount, setPaidAmount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchUserProfile()
      fetchProducts()
      fetchCategories()
    }
  }, [mounted])

  const fetchProducts = async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name')
    setProducts(data || [])
  }

  const fetchCategories = async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
    setCategories(data || [])
  }

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
        setProfile(profile)
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id)
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      ))
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price
      }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
      }
      return item
    }))
  }

  const calculation = calculateTotal({ items: cart, taxRate: 11 })
  const change = calculateChange(calculation.totalAmount, paidAmount)

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('Cart kosong!')
    if (paidAmount < calculation.totalAmount) return alert('Pembayaran kurang!')
    if (!supabase) return alert('Supabase not available')
    if (!profile || !profile.branch_id) {
      alert('Profile tidak ditemukan. Silakan login ulang.')
      router.push('/auth/login')
      return
    }
    
    setLoading(true)
    
    try {
      const orderNumber = `ORD-${Date.now()}`
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          branch_id: profile.branch_id,
          cashier_id: profile.id,
          subtotal: calculation.subtotal,
          discount_amount: calculation.discountAmount,
          tax_amount: calculation.taxAmount,
          service_charge_amount: calculation.serviceChargeAmount,
          total_amount: calculation.totalAmount,
          paid_amount: paidAmount,
          change_amount: change,
          payment_method: 'cash',
          status: 'completed',
          order_type: 'dine_in',
        } as any)
        .select()
        .single()
      
      if (orderError) throw orderError
      
      const orderItems = cart.map(item => ({
        order_id: (orderData as any).id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.subtotal
      }))
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems as any)
      
      if (itemsError) throw itemsError
      
      alert('Order berhasil! Total: Rp ' + calculation.totalAmount.toLocaleString('id-ID'))
      setCart([])
      setPaidAmount(0)
      router.push('/dashboard/orders')
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-3xl">☕</span>
            POS - Buat Pesanan
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Grid */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products
                .filter(p => !selectedCategory || p.category_id === selectedCategory)
                .map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white p-4 rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition-all hover:scale-105 border border-gray-100"
                >
                  <div className="text-4xl mb-2">🍵</div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Stok: {product.stock}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-fit sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🛒</span>
              Keranjang
            </h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🛒</div>
                <p className="text-gray-500">Keranjang kosong</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">Rp {item.price.toLocaleString('id-ID')} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="w-8 h-8 bg-white rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="w-8 h-8 bg-white rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 text-sm hover:text-red-700 ml-2"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>Rp {calculation.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>PPN (11%):</span>
                    <span>Rp {calculation.taxAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-gray-900 border-t-2 border-gray-200 pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">Rp {calculation.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Jumlah Bayar:</label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Masukkan jumlah bayar"
                  />
                  {paidAmount > 0 && (
                    <p className="text-green-600 font-semibold text-lg">
                      Kembalian: Rp {change.toLocaleString('id-ID')}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 font-bold text-lg shadow-lg transition-all mt-4"
                >
                  {loading ? 'Memproses...' : 'Bayar Sekarang'}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

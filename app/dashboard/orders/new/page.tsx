'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types/database'
import { calculateTotal, calculateChange, type CartItem } from '@/lib/calculations/cart'
import { useRouter } from 'next/navigation'

export default function NewOrderPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [paidAmount, setPaidAmount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name')
    setProducts(data || [])
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
    
    setLoading(true)
    
    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          branch_id: 'default-branch-id', // TODO: Get from user session
          cashier_id: 'default-cashier-id', // TODO: Get from user session
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
        })
        .select()
        .single()
      
      if (orderError) throw orderError
      
      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.subtotal
      }))
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
      
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">POS - Buat Pesanan</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-500">Stok: {product.stock}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-bold mb-4">Keranjang</h2>
            
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Keranjang kosong</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">Rp {item.price.toLocaleString('id-ID')} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rp {calculation.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PPN (11%):</span>
                    <span>Rp {calculation.taxAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>Rp {calculation.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-medium">Jumlah Bayar:</label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Masukkan jumlah bayar"
                  />
                  {paidAmount > 0 && (
                    <p className="text-green-600 font-medium">
                      Kembalian: Rp {change.toLocaleString('id-ID')}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Memproses...' : 'Bayar'}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

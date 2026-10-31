export interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  subtotal: number
}

export interface CartCalculation {
  subtotal: number
  discountAmount: number
  taxAmount: number
  serviceChargeAmount: number
  totalAmount: number
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}

export function calculateDiscount(
  subtotal: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number {
  if (discountType === 'percentage') {
    return subtotal * (discountValue / 100)
  }
  return discountValue
}

export function calculateTax(
  subtotal: number,
  discountAmount: number,
  taxRate: number = 11
): number {
  const taxableAmount = subtotal - discountAmount
  return taxableAmount * (taxRate / 100)
}

export function calculateServiceCharge(
  subtotal: number,
  discountAmount: number,
  serviceChargeRate: number = 0
): number {
  const chargeableAmount = subtotal - discountAmount
  return chargeableAmount * (serviceChargeRate / 100)
}

export function calculateTotal(cart: {
  items: CartItem[]
  discountType?: 'percentage' | 'fixed'
  discountValue?: number
  taxRate?: number
  serviceChargeRate?: number
}): CartCalculation {
  const subtotal = calculateSubtotal(cart.items)
  const discountAmount = cart.discountType && cart.discountValue
    ? calculateDiscount(subtotal, cart.discountType, cart.discountValue)
    : 0
  const taxAmount = calculateTax(subtotal, discountAmount, cart.taxRate)
  const serviceChargeAmount = calculateServiceCharge(
    subtotal,
    discountAmount,
    cart.serviceChargeRate
  )
  const totalAmount = subtotal - discountAmount + taxAmount + serviceChargeAmount

  return {
    subtotal,
    discountAmount,
    taxAmount,
    serviceChargeAmount,
    totalAmount,
  }
}

export function calculateChange(
  totalAmount: number,
  paidAmount: number
): number {
  return paidAmount - totalAmount
}

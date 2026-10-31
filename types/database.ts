import type { Database } from './supabase'

export type Db = Database

export type Branch = Db['public']['Tables']['branches']['Row']
export type Profile = Db['public']['Tables']['profiles']['Row']
export type Product = Db['public']['Tables']['products']['Row']
export type Order = Db['public']['Tables']['orders']['Row']
export type OrderItem = Db['public']['Tables']['order_items']['Row']
export type Customer = Db['public']['Tables']['customers']['Row']
export type Category = Db['public']['Tables']['categories']['Row']

export type BranchInsert = Db['public']['Tables']['branches']['Insert']
export type ProfileInsert = Db['public']['Tables']['profiles']['Insert']
export type ProductInsert = Db['public']['Tables']['products']['Insert']
export type OrderInsert = Db['public']['Tables']['orders']['Insert']
export type OrderItemInsert = Db['public']['Tables']['order_items']['Insert']
export type CategoryInsert = Db['public']['Tables']['categories']['Insert']

export type BranchUpdate = Db['public']['Tables']['branches']['Update']
export type ProfileUpdate = Db['public']['Tables']['profiles']['Update']
export type ProductUpdate = Db['public']['Tables']['products']['Update']
export type OrderUpdate = Db['public']['Tables']['orders']['Update']

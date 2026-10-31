export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      settings: {
        Row: {
          id: string
          key: string
          value: string
          description: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          description?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          description?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      branches: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          operating_hours: Json | null
          logo_url: string | null
          is_active: boolean
          tax_settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          operating_hours?: Json | null
          logo_url?: string | null
          is_active?: boolean
          tax_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          operating_hours?: Json | null
          logo_url?: string | null
          is_active?: boolean
          tax_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: 'super_admin' | 'admin_cabang' | 'kasir'
          branch_id: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          role?: 'super_admin' | 'admin_cabang' | 'kasir'
          branch_id?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: 'super_admin' | 'admin_cabang' | 'kasir'
          branch_id?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category_id: string | null
          branch_id: string
          price: number
          cost_price: number | null
          stock: number
          min_stock: number
          image_url: string | null
          thumbnail_url: string | null
          is_active: boolean
          is_featured: boolean
          display_order: number
          barcode: string | null
          sku: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category_id?: string | null
          branch_id: string
          price: number
          cost_price?: number | null
          stock?: number
          min_stock?: number
          image_url?: string | null
          thumbnail_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          display_order?: number
          barcode?: string | null
          sku?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category_id?: string | null
          branch_id?: string
          price?: number
          cost_price?: number | null
          stock?: number
          min_stock?: number
          image_url?: string | null
          thumbnail_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          display_order?: number
          barcode?: string | null
          sku?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          branch_id: string
          cashier_id: string | null
          customer_id: string | null
          shift_id: string | null
          status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
          order_type: 'dine_in' | 'delivery' | 'takeaway'
          table_number: string | null
          order_notes: string | null
          subtotal: number
          discount_amount: number
          tax_amount: number
          service_charge_amount: number
          total_amount: number
          paid_amount: number
          change_amount: number
          payment_method: 'cash' | 'transfer' | 'ewallet' | 'qris' | 'credit_card' | null
          payment_details: Json | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          order_number: string
          branch_id: string
          cashier_id?: string | null
          customer_id?: string | null
          shift_id?: string | null
          status?: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
          order_type?: 'dine_in' | 'delivery' | 'takeaway'
          table_number?: string | null
          order_notes?: string | null
          subtotal: number
          discount_amount?: number
          tax_amount?: number
          service_charge_amount?: number
          total_amount: number
          paid_amount?: number
          change_amount?: number
          payment_method?: 'cash' | 'transfer' | 'ewallet' | 'qris' | 'credit_card' | null
          payment_details?: Json | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          branch_id?: string
          cashier_id?: string | null
          customer_id?: string | null
          shift_id?: string | null
          status?: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
          order_type?: 'dine_in' | 'delivery' | 'takeaway'
          table_number?: string | null
          order_notes?: string | null
          subtotal?: number
          discount_amount?: number
          tax_amount?: number
          service_charge_amount?: number
          total_amount?: number
          paid_amount?: number
          change_amount?: number
          payment_method?: 'cash' | 'transfer' | 'ewallet' | 'qris' | 'credit_card' | null
          payment_details?: Json | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
          item_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
          item_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
          item_notes?: string | null
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          birth_date: string | null
          loyalty_points: number
          tier: string
          total_spent: number
          visit_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email?: string | null
          address?: string | null
          birth_date?: string | null
          loyalty_points?: number
          tier?: string
          total_spent?: number
          visit_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          birth_date?: string | null
          loyalty_points?: number
          tier?: string
          total_spent?: number
          visit_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

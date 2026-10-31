import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return profile
}

export async function getUserRole(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.role || null
}

export async function getUserBranch(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.branch_id || null
}

export async function canAccessBranch(branchId: string): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (user?.role === 'super_admin') return true
  if (user?.role === 'admin_cabang' && user.branch_id === branchId) return true
  if (user?.role === 'kasir' && user.branch_id === branchId) return true
  
  return false
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden')
  }
  return user
}

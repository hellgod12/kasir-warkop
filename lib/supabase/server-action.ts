import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export const createActionClient = () => {
  const cookieStore = cookies()
  return createServerActionClient<Database>({ 
    cookies: () => cookieStore 
  })
}

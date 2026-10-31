import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export const createClient = () => {
  // Hardcoded values for immediate connection
  const supabaseUrl = 'https://njcqxtphfpeljeltbffy.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qY3F4dHBoZnBlbGplbHRiZmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0ODI1MDQsImV4cCI6MjEwOTA1ODUwNH0.DsMhG36iH3X5Y6kK_KxwgZGocBgHybDtO3Xu3RwrcSk'
  
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}

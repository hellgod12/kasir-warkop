'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createActionClient } from '@/lib/supabase/server-action'

export async function signIn(formData: FormData) {
  const supabase = await createActionClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createActionClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

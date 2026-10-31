import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Skip auth check if Supabase not configured
    if (!supabaseUrl || !supabaseAnonKey) {
      return res
    }
    
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            res.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            res.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Protected routes
    const protectedPaths = ['/dashboard']
    const isProtectedPath = protectedPaths.some(path => 
      req.nextUrl.pathname.startsWith(path)
    )

    if (isProtectedPath && !session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // Allow request to proceed even if auth check fails
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

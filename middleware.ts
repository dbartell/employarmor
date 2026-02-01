import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

// Routes that require specific permissions
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/settings/team': ['owner', 'admin'], // Only admins can access team management
  '/api/team/invite': ['owner', 'admin'],
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // Handle ?format=md for markdown API access
  if (searchParams.get('format') === 'md' && pathname.startsWith('/compliance')) {
    const mdUrl = new URL(`/api/markdown${pathname}`, request.url)
    return NextResponse.rewrite(mdUrl)
  }
  
  // Allow invite pages without auth (they handle auth internally)
  if (pathname.startsWith('/invite/')) {
    return await updateSession(request)
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

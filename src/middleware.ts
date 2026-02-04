import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

// Routes that require specific permissions
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/settings/team': ['owner', 'admin'], // Only admins can access team management
  '/api/team/invite': ['owner', 'admin'],
}

// Marketing paths that support markdown rendering for AI agents
const MARKDOWN_PATHS = ['/compliance', '/resources', '/glossary']

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const acceptHeader = request.headers.get('Accept') || ''
  
  // Check if this is an AI agent requesting markdown
  const formatParam = searchParams.get('format')
  const wantsMarkdown = 
    acceptHeader.includes('text/markdown') ||
    acceptHeader.includes('text/plain') ||
    formatParam === 'md' ||
    pathname.endsWith('.md')
  
  const matchesPath = MARKDOWN_PATHS.some(p => pathname.startsWith(p) || pathname.replace('.md', '').startsWith(p))
  
  // Handle markdown requests for marketing/content pages
  if (wantsMarkdown && matchesPath) {
    const cleanPath = pathname.replace(/\.md$/, '')
    const mdUrl = new URL(`/api/markdown${cleanPath}`, request.url)
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

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const protectedPaths = ['/marketplace/add', '/admin']
  const pathname = request.nextUrl.pathname
  
  console.log('Current path:', pathname);
  
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )

  if (isProtectedPath) {
    const token = request.cookies.get('user')
    const isAdmin = request.cookies.get('isAdmin')
    
    if (!token) {
      console.log('No token, redirecting to /auth');
      const loginUrl = new URL('/auth', request.url)
      loginUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(loginUrl)
    }

    if (pathname.startsWith('/admin')) {
      if (isAdmin?.value !== 'true') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return NextResponse.next()
    }
  }

  if (request.nextUrl.pathname.startsWith('/auth')) {
    const token = request.cookies.get('user')
    
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/marketplace/add',
    '/auth',
    '/admin/:path*'
  ]
}
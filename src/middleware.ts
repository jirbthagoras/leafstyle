import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const protectedPaths = ['/marketplace/add']
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath) {
    const token = request.cookies.get('user')

    if (!token) {
      const loginUrl = new URL('/auth', request.url)
      loginUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(loginUrl)
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
  ]
}
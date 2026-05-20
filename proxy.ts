import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/admin/:path*'] // Targets all /admin/* except /admin/login
}

export function proxy(request: NextRequest) {
  // Temp placeholder: Check for "admin-session" cookie
  const pathname = request.nextUrl.pathname
  const sessionCookie = request.cookies.get('admin-session')

  // Allow /admin/login unconditionally
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Redirect to /admin/login if no cookie
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Proceed if cookie exists
  return NextResponse.next()
}

import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export const config = {
  matcher: ['/admin/:path*']
}

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

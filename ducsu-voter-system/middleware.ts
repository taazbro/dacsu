import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For now, allow all requests to pass through
  // This bypasses authentication temporarily
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/voters/:path*',
    '/api/halls/:path*',
    '/api/export/:path*'
  ]
}
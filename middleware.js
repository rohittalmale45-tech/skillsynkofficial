import { NextResponse } from 'next/server'

// Auth gate removed: the app is open-access (role is chosen in-app).
// Middleware is now a simple pass-through.
export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.jpeg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

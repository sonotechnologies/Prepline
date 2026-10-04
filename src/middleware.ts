import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, gateEnabled, isValidSession } from '@/lib/admin-session';

// Every admin page and admin API request needs a valid admin-password session first.
export function middleware(request: NextRequest) {
  if (!gateEnabled() || isValidSession(request.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Admin password required' }, { status: 401 });
  }
  const login = new URL('/admin', request.url);
  login.searchParams.set('next', pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/keystatic', '/keystatic/:path*', '/api/keystatic/:path*'],
  runtime: 'nodejs'
};

import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/admin-session';

export function GET(request: Request) {
  const res = NextResponse.redirect(new URL('/admin?signed-out=1', request.url), 303);
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}

import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, SESSION_SECONDS, adminPassword, createSession, passwordMatches, safeNext } from '@/lib/admin-session';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: Request) {
  const form = await request.formData();
  const next = safeNext(String(form.get('next') ?? ''));
  const back = (error: string) =>
    NextResponse.redirect(new URL(`/admin?error=${error}&next=${encodeURIComponent(next)}`, request.url), 303);

  if (!adminPassword()) return back('not-set');
  if (!passwordMatches(String(form.get('password') ?? ''))) {
    await sleep(1500); // slows down password guessing
    return back('wrong');
  }

  const res = NextResponse.redirect(new URL(next, request.url), 303);
  res.cookies.set(ADMIN_COOKIE, createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // must survive the redirect back from GitHub sign-in
    path: '/',
    maxAge: SESSION_SECONDS
  });
  return res;
}

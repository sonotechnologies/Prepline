import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config';

// Without GitHub mode the live site has nothing to read or write, so the admin API stays closed.
const notConnected = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE !== 'github';

// Created on the first request, not at build time: Vercel "Secret" variables (the GitHub App
// client secret and KEYSTATIC_SECRET) are only guaranteed to exist while the site is running.
let handler: ReturnType<typeof makeRouteHandler> | undefined;
const getHandler = () => (handler ??= makeRouteHandler({ config }));

export async function GET(request: Request) {
  if (notConnected) return new Response('Not found', { status: 404 });
  return getHandler().GET(request);
}

export async function POST(request: Request) {
  if (notConnected) return new Response('Not found', { status: 404 });
  return getHandler().POST(request);
}

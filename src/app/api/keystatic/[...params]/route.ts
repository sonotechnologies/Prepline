import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config';

const handler = makeRouteHandler({ config });

// Without GitHub mode the live site has nothing to read or write, so the admin API stays closed.
const notConnected = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE !== 'github';
const closed = () => new Response('Not found', { status: 404 });

export const GET = notConnected ? closed : handler.GET;
export const POST = notConnected ? closed : handler.POST;

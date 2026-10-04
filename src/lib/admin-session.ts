import crypto from 'node:crypto';

// A small password gate in front of the Keystatic admin (/keystatic), on top of GitHub sign-in.
// The password lives in the ADMIN_PASSWORD environment variable (a Vercel Secret). A correct password
// sets a signed cookie for 12 hours. The signature is keyed on the password, so changing the
// password signs everyone out.

export const ADMIN_COOKIE = 'ptt_admin';
export const SESSION_SECONDS = 12 * 60 * 60;

export const adminPassword = () => process.env.ADMIN_PASSWORD ?? '';

/** On the live site the gate is required; locally it's skipped unless a password is set. */
export const gateEnabled = () => process.env.NODE_ENV === 'production' || adminPassword() !== '';

const sign = (value: string) =>
  crypto.createHmac('sha256', adminPassword()).update(`ptt-admin:${value}`).digest('hex');

export function createSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return `${expires}.${sign(String(expires))}`;
}

export function isValidSession(token: string | undefined) {
  if (!token || !adminPassword()) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || Number(expires) < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(expires));
  const given = Buffer.from(signature);
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}

/** Constant-time password check (hashing first makes both sides the same length). */
export function passwordMatches(attempt: string) {
  const actual = adminPassword();
  if (!actual) return false;
  const a = crypto.createHash('sha256').update(attempt).digest();
  const b = crypto.createHash('sha256').update(actual).digest();
  return crypto.timingSafeEqual(a, b);
}

/** Only allow redirects back into the admin, never to another site. */
export function safeNext(next: string | null | undefined) {
  return next && /^\/keystatic(\/|$|\?)/.test(next) ? next : '/keystatic';
}

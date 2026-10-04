import type { Metadata } from 'next';
import { site } from '@/content/site';
import { adminPassword, safeNext } from '@/lib/admin-session';
import '@/app/globals.css';

export const metadata: Metadata = { title: 'Admin sign-in', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const MESSAGES: Record<string, string> = {
  wrong: 'That password is not correct.',
  'not-set': 'The admin password has not been set up yet (ADMIN_PASSWORD in Vercel).'
};

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string; error?: string; 'signed-out'?: string }>
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const error = params.error ? MESSAGES[params.error] : !adminPassword() ? MESSAGES['not-set'] : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-gut py-16">
      <div className="card w-full max-w-[420px] p-8 shadow-card">
        <p className="h-bold text-2xl leading-none text-primary">{site.shortName}</p>
        <p className="mt-1 font-heading text-[11px] font-medium uppercase tracking-[.18em] text-ink">Travel and Tours</p>
        <h1 className="h3 mt-8">Admin sign-in</h1>
        <p className="mt-2 text-muted">Enter the admin password to continue. You&apos;ll then sign in with GitHub.</p>

        {params['signed-out'] && <p className="mt-5 rounded-sm bg-tint px-4 py-3 text-[15px] text-tag">You are signed out.</p>}
        {error && (
          <p role="alert" className="mt-5 rounded-sm bg-[#FDECEA] px-4 py-3 text-[15px] text-[#B42318]">
            {error}
          </p>
        )}

        <form method="post" action="/api/admin-login" className="mt-6 flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <label className="field-label">
            Password
            <input
              className="field"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              autoFocus
            />
          </label>
          <button type="submit" className="btn btn-primary w-full">
            Continue
          </button>
        </form>
        <p className="mt-6 text-sm text-muted">
          <a href="/api/admin-logout">Sign out of the admin</a>
        </p>
      </div>
    </main>
  );
}

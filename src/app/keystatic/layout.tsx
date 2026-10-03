import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };

/**
 * On the live site the admin only works in GitHub mode: local mode would read and write the server's
 * own disk, which holds no content and is thrown away. Show a clear message instead of an empty admin.
 */
const notConnected = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE !== 'github';

// The admin renders without the public site's header, footer and styles.
export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
  if (!notConnected) return children;
  return (
    <main style={{ maxWidth: 560, margin: '15vh auto', padding: 24, fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 24, margin: '0 0 12px' }}>Admin not connected yet</h1>
      <p>
        The online admin saves to GitHub, but this deployment is missing its GitHub settings. Add{' '}
        <code>NEXT_PUBLIC_KEYSTATIC_STORAGE=github</code> and the Keystatic GitHub App values in Vercel (Settings →
        Environment Variables), then redeploy. See &quot;Admin&quot; in the project README.
      </p>
    </main>
  );
}

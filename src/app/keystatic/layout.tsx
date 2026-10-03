import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };

// The admin renders without the public site's header, footer and styles.
export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
  return children;
}

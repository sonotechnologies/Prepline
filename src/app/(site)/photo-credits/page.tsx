import type { Metadata } from 'next';
import { PageHeader } from '@/components/SectionHeading';
import credits from '@/content/photo-credits.json';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Photo credits',
    description: 'Photographers whose work from Pexels appears on this website.',
    path: '/photo-credits'
  }),
  robots: { index: false }
};

type Credit = { id: number; photographer: string; photographerUrl: string; pexelsUrl: string };

export default function PhotoCreditsPage() {
  // One row per photographer, with every photo of theirs we use.
  const byPhotographer = new Map<string, { url: string; photos: string[] }>();
  for (const c of Object.values(credits as Record<string, Credit>)) {
    const entry = byPhotographer.get(c.photographer) ?? { url: c.photographerUrl, photos: [] };
    entry.photos.push(c.pexelsUrl);
    byPhotographer.set(c.photographer, entry);
  }
  const rows = [...byPhotographer.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <>
      <PageHeader
        title="Photo credits"
        text="Many photos on this website come from Pexels. Thank you to the photographers below."
      />
      <section className="container-site py-sec-y">
        {rows.length === 0 ? (
          <p className="text-muted">No stock photos are in use yet.</p>
        ) : (
          <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 md:grid-cols-2 lg:grid-cols-3">
            {rows.map(([name, { url, photos }]) => (
              <li key={name} className="flex flex-wrap items-baseline gap-x-2">
                <a href={url} target="_blank" rel="noopener" className="font-semibold">
                  {name}
                </a>
                <span className="text-sm text-muted">
                  {photos.map((p, i) => (
                    <a key={p} href={p} target="_blank" rel="noopener" className="mr-1.5 text-muted">
                      photo {i + 1}
                    </a>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-10 text-muted">
          Photos provided by{' '}
          <a href="https://www.pexels.com" target="_blank" rel="noopener">
            Pexels
          </a>
          .
        </p>
      </section>
    </>
  );
}

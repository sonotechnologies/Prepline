import type { MetadataRoute } from 'next';
import { getAllPackages } from '@/lib/packages';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/packages/', '/destinations/', '/services/', '/custom-trip/', '/about/', '/contact/'];
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p), changeFrequency: 'weekly' as const, priority: p === '/' ? 1 : 0.8 })),
    ...getAllPackages().map((p) => ({
      url: absoluteUrl(`/packages/${p.slug}/`),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      images: [absoluteUrl(p.coverImage)]
    }))
  ];
}

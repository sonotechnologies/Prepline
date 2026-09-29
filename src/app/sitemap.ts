import type { MetadataRoute } from 'next';
import { coverOf, getAllPackages, getAllVisas } from '@/lib/content';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/packages', '/visas', '/destinations', '/services', '/custom-trip', '/about', '/contact'];
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p), changeFrequency: 'weekly' as const, priority: p === '/' ? 1 : 0.8 })),
    ...getAllPackages().map((p) => ({
      url: absoluteUrl(`/packages/${p.slug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      images: [absoluteUrl(coverOf(p).image)]
    })),
    ...getAllVisas().map((v) => ({
      url: absoluteUrl(`/visas/${v.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      images: [absoluteUrl(v.image)]
    }))
  ];
}

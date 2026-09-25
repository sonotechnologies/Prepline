import type { Metadata } from 'next';
import { site } from '@/content/site';

export const absoluteUrl = (path = '/') => `${site.url.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

/** Per-page metadata with Open Graph and Twitter cards. */
export function pageMetadata({
  title,
  description,
  path,
  image = '/images/og-default.jpg',
  imageAlt = site.name
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title,
      description,
      url,
      locale: 'en_NG',
      images: [{ url: absoluteUrl(image), alt: imageAlt }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl(image)]
    }
  };
}

export function travelAgencyJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: site.name,
    description: site.description,
    url: absoluteUrl('/'),
    telephone: site.phone.tel,
    email: site.email,
    image: absoluteUrl('/images/og-default.jpg'),
    priceRange: '₦₦₦',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressCountry: site.address.countryCode
    },
    openingHours: 'Mo-Sa 09:00-18:00',
    sameAs: site.socials.map((s) => s.href)
  };
}

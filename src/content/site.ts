/**
 * Business details for the whole site. The values live in settings.json, which the client edits in
 * the admin (Business details). Components read from `site` only, so changing a value there, for
 * example the WhatsApp number, updates every page on the next deploy.
 *
 * This file is also imported by client components, so it does not pull in Zod; settings.json is
 * validated at build time in src/lib/content.ts.
 */
import settings from './settings.json';

const s = settings as typeof settings & { ga4Id?: string; metaPixelId?: string; foundedYear?: number | null };
const clean = (v: string | null | undefined) => (v && v.trim() ? v.trim() : '');

export const site = {
  name: 'Prepping Travel and Tours',
  shortName: 'Prepping',
  tagline: clean(s.tagline) || 'Trips to any country, planned with you on WhatsApp from our office in Lagos.',
  description:
    'Prepping Travel and Tours is a Lagos travel agency planning holidays, honeymoons, group tours and visa applications for 60+ countries. Pick a trip and chat with us on WhatsApp.',

  // Public URL of the live site, used for canonical links, the sitemap and WhatsApp package links.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.preppingtravel.ng',

  whatsappNumber: s.whatsappNumber,
  phone: { display: s.phoneDisplay, tel: s.phoneTel },
  email: s.email,
  address: {
    street: s.street,
    city: s.city,
    country: s.country,
    countryCode: 'NG',
    mapQuery: clean(s.mapQuery) || `${s.street}, ${s.city}, ${s.country}`
  },
  hours: { office: clean(s.officeHours), whatsapp: clean(s.whatsappHours) },
  socials: s.socials,
  stats: s.stats.map((x) => ({ value: x.value, suffix: x.suffix ?? '', label: x.label })),
  accreditations: s.accreditations,
  reviewSummary: {
    rating: clean(s.rating),
    count: s.reviewCount ?? 0,
    source: clean(s.reviewSource) || 'Google',
    isSample: s.reviewsAreSamples
  },
  foundedYear: s.foundedYear ?? undefined,
  analytics: { ga4Id: clean(s.ga4Id), metaPixelId: clean(s.metaPixelId) }
};

export type Site = typeof site;

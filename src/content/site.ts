/**
 * Every business detail lives here. Components read from this file only,
 * so changing a value (for example whatsappNumber) updates the whole site.
 */
export const site = {
  name: 'Prepping Travel and Tours',
  shortName: 'Prepping',
  tagline: 'Trips to any country, planned with you on WhatsApp from our office in Lagos.',
  description:
    'Prepping Travel and Tours is a Lagos travel agency planning holidays, honeymoons, group tours and visas to 60+ countries. Pick a trip and chat with us on WhatsApp.',

  // Public URL of the live site, used for canonical links, the sitemap and WhatsApp package links.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.preppingtravel.ng',

  // International format, digits only, no "+" (used in https://wa.me/<number>).
  whatsappNumber: '2348000000000',
  phone: {
    display: '+234 800 000 0000',
    tel: '+2348000000000'
  },
  email: 'hello@preppingtravel.ng',
  address: {
    street: 'Office address, Lekki Phase 1',
    city: 'Lagos',
    country: 'Nigeria',
    countryCode: 'NG',
    // Text used for the Google Maps embed on the Contact page.
    mapQuery: 'Lekki Phase 1, Lagos, Nigeria'
  },
  hours: {
    office: 'Mon to Sat, 9am to 6pm WAT',
    whatsapp: 'WhatsApp replies 7 days a week'
  },
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/' },
    { label: 'Facebook', href: 'https://www.facebook.com/' }
  ],
  stats: [
    { value: 10, suffix: '+', label: 'Years planning trips' },
    { value: 5000, suffix: '+', label: 'Happy travellers' },
    { value: 60, suffix: '+', label: 'Countries' },
    { value: 98, suffix: '%', label: 'Client satisfaction' }
  ],
  // Placeholder accreditation logos. Replace with real logo files when available.
  accreditations: ['IATA', 'NANTA', 'NCAA'],
  reviewSummary: {
    rating: 4.9,
    count: 312,
    source: 'Google',
    // Remove this flag once the reviews are real.
    isSample: true
  },
  foundedYear: 2016,

  // Optional analytics. Leave empty to load nothing.
  analytics: {
    ga4Id: '',
    metaPixelId: ''
  }
} as const;

export type Site = typeof site;

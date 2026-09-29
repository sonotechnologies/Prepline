import { z } from 'zod';

// These schemas validate the JSON the admin (keystatic.config.ts) writes. Keep both in step.

export const REGIONS = ['Africa', 'Europe', 'Asia', 'Middle East', 'Americas', 'Oceania'] as const;
export const TRIP_TYPES = ['Honeymoon', 'Family', 'Adventure', 'Group', 'Religious', 'Luxury'] as const;
export const VISA_PURPOSES = ['Tourism', 'Business', 'Visiting family', 'Study', 'Work', 'Transit'] as const;

export type Region = (typeof REGIONS)[number];
export type TripType = (typeof TRIP_TYPES)[number];

/** Keystatic writes "" for empty text fields; treat that as "not set". */
const optionalText = z
  .string()
  .nullish()
  .transform((s) => (s && s.trim() ? s.trim() : undefined));
const text = z.string().trim().min(1);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use ISO dates, for example 2026-11-14');
const imagePath = z.string().regex(/^\/images\/.+\.(webp|jpe?g|png|avif)$/i, 'Image must be a file under /images');
const countryCode = z
  .string()
  .length(2)
  .transform((s) => s.toUpperCase());
const photo = z.object({ image: imagePath, alt: optionalText.transform((s) => s ?? '') });
const faq = z.object({ q: text, a: text });
const currency = z.enum(['NGN', 'USD']).default('NGN');

export const PackageSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/), // from the file name
  title: text,
  featured: z.boolean().default(false),
  country: text,
  countryCode,
  city: optionalText,
  region: z.enum(REGIONS),
  tripTypes: z.array(z.enum(TRIP_TYPES)).min(1, 'Pick at least one trip type'),
  durationDays: z.number().int().positive(),
  nights: z.number().int().nonnegative(),
  priceFrom: z.number().positive(),
  currency,
  priceNote: optionalText.transform((s) => s ?? 'per person'),
  departures: z.array(z.object({ date: isoDate, note: optionalText })).default([]),
  gallery: z.array(photo).min(1, 'Add at least one photo'),
  highlights: z.array(text).max(3),
  overview: text,
  itinerary: z
    .array(
      z.object({ day: z.number().int().positive(), title: text, description: z.string().default(''), meta: optionalText })
    )
    .min(1),
  included: z.array(text).default([]),
  excluded: z.array(text).default([]),
  addOns: z.array(z.object({ title: text, priceFrom: z.number().positive().nullish() })).default([]),
  faqs: z.array(faq).default([]),
  quickFacts: z.object({
    groupSize: z.string().default(''),
    bestSeason: z.string().default(''),
    visaRequired: z.boolean()
  })
});
export type Pkg = z.infer<typeof PackageSchema>;

export const VisaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: text,
  featured: z.boolean().default(false),
  country: text,
  countryCode,
  region: z.enum(REGIONS),
  purposes: z.array(z.enum(VISA_PURPOSES)).default([]),
  priceFrom: z.number().positive(),
  currency,
  priceNote: optionalText.transform((s) => s ?? 'per applicant'),
  feeNote: optionalText,
  processingTime: text,
  validity: optionalText,
  stay: optionalText,
  entries: optionalText,
  appointment: optionalText,
  image: imagePath,
  imageAlt: optionalText.transform((s) => s ?? ''),
  summary: text,
  overview: text,
  requirements: z.array(text).default([]),
  steps: z.array(z.object({ title: text, description: z.string().default('') })).default([]),
  included: z.array(text).default([]),
  excluded: z.array(text).default([]),
  faqs: z.array(faq).default([])
});
export type Visa = z.infer<typeof VisaSchema>;

export const DestinationSchema = z.object({
  slug: z.string(),
  name: text, // country name, matched against package and visa countries
  short: text, // used in "Ask about {short}"
  countryCode,
  region: z.enum(REGIONS),
  popular: z.boolean().default(false),
  image: imagePath,
  imageAlt: optionalText.transform((s) => s ?? '')
});
export type Destination = z.infer<typeof DestinationSchema>;

export const SettingsSchema = z.object({
  whatsappNumber: z.string().regex(/^\d{8,15}$/, 'WhatsApp number: digits only, international format, e.g. 2348012345678'),
  phoneDisplay: text,
  phoneTel: z.string().regex(/^\+?\d{8,15}$/, 'Phone for dialling: digits with an optional leading +'),
  email: z.string().email(),
  street: text,
  city: text,
  country: text,
  mapQuery: optionalText,
  officeHours: optionalText,
  whatsappHours: optionalText,
  tagline: optionalText,
  socials: z.array(z.object({ label: text, href: z.string().url() })).default([]),
  stats: z.array(z.object({ value: z.number(), suffix: z.string().default(''), label: text })).default([]),
  accreditations: z.array(text).default([]),
  rating: optionalText,
  reviewCount: z.number().int().nonnegative().nullish(),
  reviewSource: optionalText,
  reviewsAreSamples: z.boolean().default(true),
  foundedYear: z.number().int().nullish(),
  ga4Id: optionalText,
  metaPixelId: optionalText
});

export const HomeSchema = z.object({
  heroHeadline: text,
  heroSubline: optionalText,
  heroSlides: z.array(photo).min(1),
  gallery: z.array(photo.extend({ shape: z.enum(['3/4', '4/5', '1/1', '4/3']).default('1/1') })).default([])
});

export const AboutSchema = z.object({
  intro: optionalText,
  story: z.array(text).default([]),
  image: imagePath.nullish(),
  imageAlt: optionalText.transform((s) => s ?? '')
});

export const ServiceSchema = z.object({
  name: text,
  summary: text,
  details: z.array(text).default([]),
  link: optionalText
});
export type Service = z.infer<typeof ServiceSchema> & { slug: string };

export const ReviewSchema = z.object({
  quote: text,
  name: text,
  trip: optionalText,
  rating: z
    .number()
    .int()
    .min(1)
    .max(5)
    .nullish()
    .transform((n) => n ?? 5)
});
export type Review = z.infer<typeof ReviewSchema> & { initials: string };

export const FaqSchema = faq;
export type Faq = z.infer<typeof FaqSchema>;

export const listOf = <T extends z.ZodTypeAny>(item: T) => z.object({ items: z.array(item).default([]) });

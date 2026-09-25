import { z } from 'zod';

export const REGIONS = ['Africa', 'Europe', 'Asia', 'Middle East', 'Americas', 'Oceania'] as const;
export const TRIP_TYPES = ['Honeymoon', 'Family', 'Adventure', 'Group', 'Religious', 'Luxury'] as const;

export type Region = (typeof REGIONS)[number];
export type TripType = (typeof TRIP_TYPES)[number];

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use ISO dates, for example 2026-11-14');

export const PackageSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  country: z.string(),
  countryCode: z.string().length(2), // for the flag emoji
  city: z.string().optional(), // shown before the country on the detail page, e.g. "Dubai"
  region: z.enum(REGIONS),
  tripTypes: z.array(z.enum(TRIP_TYPES)).min(1),
  durationDays: z.number().int().positive(),
  nights: z.number().int().nonnegative(),
  priceFrom: z.number().positive(),
  currency: z.enum(['NGN', 'USD']).default('NGN'),
  priceNote: z.string().default('per person'),
  dates: z.array(isoDate), // departure dates
  dateNotes: z.record(isoDate, z.string()).optional(), // e.g. { "2026-11-14": "8 seats left" }
  featured: z.boolean().default(false),
  coverImage: z.string(),
  coverAlt: z.string(),
  gallery: z.array(z.object({ src: z.string(), alt: z.string() })).min(1),
  highlights: z.array(z.string()).max(3),
  overview: z.string(),
  itinerary: z
    .array(
      z.object({
        day: z.number().int().positive(),
        title: z.string(),
        description: z.string(),
        meta: z.string().optional() // e.g. "Meals: breakfast · Stay: 4-star hotel"
      })
    )
    .min(1),
  included: z.array(z.string()),
  excluded: z.array(z.string()),
  addOns: z
    .array(z.union([z.string(), z.object({ title: z.string(), priceFrom: z.number().positive().optional() })]))
    .optional(),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  quickFacts: z.object({ groupSize: z.string(), bestSeason: z.string(), visaRequired: z.boolean() })
});

export type Pkg = z.infer<typeof PackageSchema>;

export const DestinationSchema = z.object({
  slug: z.string(),
  name: z.string(), // country name, matched against package.country
  short: z.string(), // used in "Ask about {short}"
  countryCode: z.string().length(2),
  region: z.enum(REGIONS),
  image: z.string(),
  imageAlt: z.string(),
  popular: z.boolean().default(false)
});
export type Destination = z.infer<typeof DestinationSchema>;

export const ServiceSchema = z.object({
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  details: z.array(z.string())
});
export type Service = z.infer<typeof ServiceSchema>;

export const ReviewSchema = z.object({
  quote: z.string(),
  name: z.string(),
  initials: z.string(),
  trip: z.string(),
  rating: z.number().min(1).max(5),
  isSample: z.boolean().default(true)
});
export type Review = z.infer<typeof ReviewSchema>;

export const FaqSchema = z.object({ q: z.string(), a: z.string() });
export type Faq = z.infer<typeof FaqSchema>;

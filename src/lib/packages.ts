import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import destinationsJson from '@/content/destinations.json';
import faqsJson from '@/content/faqs.json';
import reviewsJson from '@/content/reviews.json';
import servicesJson from '@/content/services.json';
import {
  DestinationSchema,
  FaqSchema,
  PackageSchema,
  ReviewSchema,
  ServiceSchema,
  type Destination,
  type Pkg
} from './schema';
import { filterPackages, type PackageCardData } from './filters';
import { formatDuration, formatPrice } from './format';

const PACKAGES_DIR = path.join(process.cwd(), 'src', 'content', 'packages');

function parseOrThrow<S extends z.ZodTypeAny>(schema: S, data: unknown, source: string): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
    throw new Error(`Invalid content in ${source}:\n${issues}`);
  }
  return result.data;
}

let cache: Pkg[] | null = null;

/** Loads and validates every package file. A bad file fails the build with a readable message. */
export function getAllPackages(): Pkg[] {
  if (cache) return cache;
  const files = fs.readdirSync(PACKAGES_DIR).filter((f) => f.endsWith('.json'));
  const pkgs = files.map((file) => {
    const raw = JSON.parse(fs.readFileSync(path.join(PACKAGES_DIR, file), 'utf8'));
    const pkg = parseOrThrow(PackageSchema, raw, `src/content/packages/${file}`);
    if (`${pkg.slug}.json` !== file) {
      throw new Error(`src/content/packages/${file}: slug "${pkg.slug}" must match the file name`);
    }
    return pkg;
  });
  // Featured first, then by price, so "Recommended" order is stable.
  cache = pkgs.sort((a, b) => Number(b.featured) - Number(a.featured) || a.priceFrom - b.priceFrom);
  return cache;
}

export function getPackage(slug: string) {
  return getAllPackages().find((p) => p.slug === slug);
}

export function getFeaturedPackages(max = 6) {
  return getAllPackages()
    .filter((p) => p.featured)
    .slice(0, max);
}

/** Up to `count` packages sharing the region or a trip type, best matches first. */
export function getRelatedPackages(pkg: Pkg, count = 3) {
  return getAllPackages()
    .filter((p) => p.slug !== pkg.slug)
    .map((p) => ({
      p,
      score: (p.region === pkg.region ? 2 : 0) + p.tripTypes.filter((t) => pkg.tripTypes.includes(t)).length
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || Number(b.p.featured) - Number(a.p.featured))
    .slice(0, count)
    .map((x) => x.p);
}

/** The slim shape the package card and the client-side filters need. */
export function toCardData(p: Pkg): PackageCardData {
  return {
    slug: p.slug,
    title: p.title,
    country: p.country,
    countryCode: p.countryCode,
    region: p.region,
    tripTypes: p.tripTypes,
    durationDays: p.durationDays,
    nights: p.nights,
    priceFrom: p.priceFrom,
    currency: p.currency,
    priceNote: p.priceNote,
    priceText: formatPrice(p),
    durationText: formatDuration(p),
    featured: p.featured,
    coverImage: p.coverImage,
    coverAlt: p.coverAlt,
    highlights: p.highlights
  };
}

export const destinations: Destination[] = z.array(DestinationSchema).parse(destinationsJson);
export const services = z.array(ServiceSchema).parse(servicesJson);
export const reviews = z.array(ReviewSchema).parse(reviewsJson);
export const faqs = z.array(FaqSchema).parse(faqsJson);

export function packageCountFor(country: string) {
  return filterPackages(getAllPackages().map(toCardData), { country }).length;
}

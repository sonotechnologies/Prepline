import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { filterPackages, matchesCountry, type PackageCardData } from './filters';
import { formatDuration, formatPrice } from './format';
import {
  AboutSchema,
  DestinationSchema,
  FaqSchema,
  HomeSchema,
  PackageSchema,
  ReviewSchema,
  ServiceSchema,
  SettingsSchema,
  VisaSchema,
  listOf,
  type Destination,
  type Pkg,
  type Review,
  type Service,
  type Visa
} from './schema';

// Loads and validates everything in src/content. A bad file (for example a typo made in the admin)
// fails the build with the file name and field at fault, so a broken page never goes live.

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

function parseOrThrow<S extends z.ZodTypeAny>(schema: S, data: unknown, source: string): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
    throw new Error(`Invalid content in ${source}:\n${issues}`);
  }
  return result.data;
}

function readJson(rel: string) {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, rel), 'utf8'));
}

/** Every entry of a Keystatic collection folder; the slug is the file name. */
function loadCollection<S extends z.ZodTypeAny>(dir: string, schema: S): z.output<S>[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.json'))
    .map((file) => {
      const slug = file.replace(/\.json$/, '');
      return parseOrThrow(schema, { ...readJson(`${dir}/${file}`), slug }, `src/content/${dir}/${file}`);
    });
}

const cached = <T>(load: () => T) => {
  let value: T | undefined;
  return () => (value ??= load());
};

// Packages ------------------------------------------------------------------

/** Featured first, then by price, so "Recommended" order is stable. */
export const getAllPackages = cached((): Pkg[] =>
  loadCollection('packages', PackageSchema).sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.priceFrom - b.priceFrom
  )
);

export const getPackage = (slug: string) => getAllPackages().find((p) => p.slug === slug);

export const getFeaturedPackages = (max = 6) =>
  getAllPackages()
    .filter((p) => p.featured)
    .slice(0, max);

export const coverOf = (p: Pkg) => p.gallery[0];

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
  const cover = coverOf(p);
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
    coverImage: cover.image,
    coverAlt: cover.alt,
    highlights: p.highlights
  };
}

export function packageCountFor(country: string) {
  return filterPackages(getAllPackages().map(toCardData), { country }).length;
}

// Visas ---------------------------------------------------------------------

/** Featured first, then alphabetically by country. */
export const getAllVisas = cached((): Visa[] =>
  loadCollection('visas', VisaSchema).sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.country.localeCompare(b.country)
  )
);

export const getVisa = (slug: string) => getAllVisas().find((v) => v.slug === slug);

export const getFeaturedVisas = (max = 6) =>
  getAllVisas()
    .filter((v) => v.featured)
    .slice(0, max);

export function getRelatedVisas(visa: Visa, count = 3) {
  return getAllVisas()
    .filter((v) => v.slug !== visa.slug)
    .sort((a, b) => Number(b.region === visa.region) - Number(a.region === visa.region))
    .slice(0, count);
}

export const visasFor = (country: string) => getAllVisas().filter((v) => matchesCountry(v.country, country));

// Destinations --------------------------------------------------------------

export const getDestinations = cached((): Destination[] =>
  loadCollection('destinations', DestinationSchema).sort((a, b) => a.name.localeCompare(b.name))
);

// Singletons ----------------------------------------------------------------

export const getSettings = cached(() => parseOrThrow(SettingsSchema, readJson('settings.json'), 'src/content/settings.json'));
export const getHome = cached(() => parseOrThrow(HomeSchema, readJson('home.json'), 'src/content/home.json'));
export const getAbout = cached(() => parseOrThrow(AboutSchema, readJson('about.json'), 'src/content/about.json'));

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const getServices = cached((): Service[] =>
  parseOrThrow(listOf(ServiceSchema), readJson('services.json'), 'src/content/services.json').items.map((s) => ({
    ...s,
    slug: slugify(s.name)
  }))
);

export const getReviews = cached((): Review[] =>
  parseOrThrow(listOf(ReviewSchema), readJson('reviews.json'), 'src/content/reviews.json').items.map((r) => ({
    ...r,
    initials: r.name
      .split(/\s+/)
      .filter((w) => /^[A-Za-z]/.test(w) && w.toLowerCase() !== 'and')
      .map((w) => w[0].toUpperCase())
      .slice(0, 2)
      .join('')
  }))
);

export const getFaqs = cached(() => parseOrThrow(listOf(FaqSchema), readJson('faqs.json'), 'src/content/faqs.json').items);

/** Validates every content file. Called from the root layout so any bad file fails the build. */
export function assertContentValid() {
  getSettings();
  getHome();
  getAbout();
  getServices();
  getReviews();
  getFaqs();
  getDestinations();
  getAllPackages();
  getAllVisas();
}

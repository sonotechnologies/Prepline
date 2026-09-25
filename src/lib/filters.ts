// Filtering and sorting shared by the Packages page (client) and the build (server).
import type { Region, TripType } from './schema';

export type PackageCardData = {
  slug: string;
  title: string;
  country: string;
  countryCode: string;
  region: Region;
  tripTypes: TripType[];
  durationDays: number;
  nights: number;
  priceFrom: number;
  currency: 'NGN' | 'USD';
  priceNote: string;
  priceText: string;
  durationText: string;
  featured: boolean;
  coverImage: string;
  coverAlt: string;
  highlights: string[];
};

export const DURATION_BANDS = [
  { value: '1-4', label: '1 to 4 days', test: (d: number) => d <= 4 },
  { value: '5-7', label: '5 to 7 days', test: (d: number) => d >= 5 && d <= 7 },
  { value: '8-plus', label: '8 days or more', test: (d: number) => d >= 8 }
] as const;

export const PRICE_BANDS = [
  { value: 'under-2.5m', label: 'Under ₦2,500,000', test: (n: number) => n < 2_500_000 },
  { value: '2.5m-4m', label: '₦2,500,000 to ₦4,000,000', test: (n: number) => n >= 2_500_000 && n <= 4_000_000 },
  { value: 'over-4m', label: 'Over ₦4,000,000', test: (n: number) => n > 4_000_000 }
] as const;

export const SORTS = [
  { value: 'featured', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'duration', label: 'Duration: shortest first' }
] as const;

export type SortValue = (typeof SORTS)[number]['value'];

export type Filters = {
  q?: string;
  region?: string;
  type?: string;
  duration?: string;
  price?: string;
  country?: string;
  sort?: string;
};

/** "France and Netherlands" matches both "France" and "Netherlands". */
export function matchesCountry(pkgCountry: string, country: string) {
  const want = country.trim().toLowerCase();
  return pkgCountry
    .split(/\s+and\s+|,\s*/i)
    .map((c) => c.trim().toLowerCase())
    .includes(want);
}

export function filterPackages<T extends PackageCardData>(pkgs: T[], f: Filters): T[] {
  const q = (f.q ?? '').trim().toLowerCase();
  const dur = DURATION_BANDS.find((b) => b.value === f.duration);
  const price = PRICE_BANDS.find((b) => b.value === f.price);

  const out = pkgs.filter((p) => {
    if (q) {
      const hay = [p.title, p.country, p.region, ...p.highlights, ...p.tripTypes].join(' ').toLowerCase();
      if (!q.split(/\s+/).every((word) => hay.includes(word))) return false;
    }
    if (f.region && p.region !== f.region) return false;
    if (f.type && !p.tripTypes.includes(f.type as TripType)) return false;
    if (dur && !dur.test(p.durationDays)) return false;
    if (price && !price.test(p.priceFrom)) return false;
    if (f.country && !matchesCountry(p.country, f.country)) return false;
    return true;
  });

  switch (f.sort as SortValue) {
    case 'price-asc':
      return [...out].sort((a, b) => a.priceFrom - b.priceFrom);
    case 'price-desc':
      return [...out].sort((a, b) => b.priceFrom - a.priceFrom);
    case 'duration':
      return [...out].sort((a, b) => a.durationDays - b.durationDays || a.priceFrom - b.priceFrom);
    default:
      return out;
  }
}

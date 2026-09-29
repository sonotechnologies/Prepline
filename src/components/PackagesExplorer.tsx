'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { FilterChips, FilterSheet, type FilterGroup } from './PackageFilters';
import { PackageCard } from './PackageCard';
import { WhatsAppButton } from './WhatsAppButton';
import { DURATION_BANDS, PRICE_BANDS, SORTS, filterPackages, type Filters, type PackageCardData } from '@/lib/filters';
import { messages } from '@/lib/whatsapp';

const KEYS = ['q', 'region', 'type', 'duration', 'price', 'country', 'sort'] as const;

type Props = { packages: PackageCardData[]; regions: string[]; tripTypes: string[] };

function buildGroups(regions: string[], tripTypes: string[]): FilterGroup[] {
  return [
    { key: 'region', name: 'Region', options: regions.map((r) => ({ value: r, label: r })) },
    { key: 'type', name: 'Trip type', options: tripTypes.map((t) => ({ value: t, label: t })) },
    { key: 'duration', name: 'Duration', options: DURATION_BANDS.map((b) => ({ value: b.value, label: b.label })) },
    { key: 'price', name: 'Price', options: PRICE_BANDS.map((b) => ({ value: b.value, label: b.label })) }
  ];
}

function Explorer({
  packages,
  regions,
  tripTypes,
  filters,
  setFilters
}: Props & { filters: Filters; setFilters: (next: Filters) => void }) {
  const groups = useMemo(() => buildGroups(regions, tripTypes), [regions, tripTypes]);
  const [query, setQuery] = useState(filters.q ?? '');
  // The last search text this component wrote to the URL. Anything else came from outside (back/forward, a shared link).
  const pushedQ = useRef(filters.q ?? '');

  const push = (next: Filters) => {
    pushedQ.current = next.q ?? '';
    setFilters(next);
  };

  useEffect(() => {
    const q = filters.q ?? '';
    if (q !== pushedQ.current) {
      pushedQ.current = q;
      setQuery(q);
    }
  }, [filters.q]);

  // Debounce search text into the URL.
  useEffect(() => {
    if (pushedQ.current === query) return;
    const t = setTimeout(() => push({ ...filters, q: query }), 250);
    return () => clearTimeout(t);
  });

  const results = filterPackages(packages, { ...filters, q: query });
  const activeCount = groups.filter((g) => filters[g.key]).length + (filters.country ? 1 : 0);
  const anyFilter = activeCount > 0 || !!query;

  const pick = (key: FilterGroup['key'], value: string) =>
    push({ ...filters, q: query, [key]: filters[key] === value ? '' : value });
  const clearAll = () => {
    setQuery('');
    push({ sort: filters.sort });
  };

  const countText =
    results.length === packages.length
      ? `Showing all ${results.length} packages`
      : `Showing ${results.length} of ${packages.length} packages`;

  return (
    <>
      <section className="bg-tint bg-pattern-light">
        <div className="container-site flex flex-col gap-3.5 pb-10 pt-10 lg:pt-[72px]">
          <h1 className="h1">Our packages</h1>
          <p className="max-w-[620px] text-lead text-muted text-pretty">
            Ready-made trips from Lagos. Every price is a starting price per person, and your final quote comes on
            WhatsApp.
          </p>
          <form role="search" onSubmit={(e) => e.preventDefault()} className="relative mt-2.5 block max-w-[640px]">
            <label htmlFor="package-search" className="sr-only">
              Search packages
            </label>
            <Search size={20} className="pointer-events-none absolute left-4 top-4 text-muted" aria-hidden="true" />
            <input
              id="package-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a country, city or activity"
              className="h-[52px] w-full rounded-btn border border-line2 bg-[var(--field-bg)] pl-[46px] pr-4 text-[16px] text-ink"
            />
          </form>
        </div>
      </section>

      <div className="container-site flex flex-col gap-6 pb-sec-y pt-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="hidden flex-wrap items-center gap-2.5 lg:flex">
            <FilterChips groups={groups} values={filters} onPick={pick} />
            {filters.country && (
              <button
                type="button"
                onClick={() => push({ ...filters, q: query, country: '' })}
                className="flex min-h-[44px] items-center gap-2 rounded-btn border-[1.5px] border-primary bg-primary px-4 text-[16px] font-medium text-white"
              >
                {filters.country}
                <X size={16} aria-hidden="true" />
                <span className="sr-only">Remove country filter</span>
              </button>
            )}
            {anyFilter && (
              <button type="button" onClick={clearAll} className="text-link min-h-[44px] px-2 text-[16px]">
                Clear filters
              </button>
            )}
          </div>
          <FilterSheet
            groups={groups}
            values={filters}
            onPick={pick}
            onClear={clearAll}
            resultCount={results.length}
            activeCount={activeCount}
          />
          <label className="flex items-center gap-2.5 text-sm text-muted">
            Sort by
            <select
              value={filters.sort || 'featured'}
              onChange={(e) => push({ ...filters, q: query, sort: e.target.value === 'featured' ? '' : e.target.value })}
              className="field h-11 w-auto"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filters.country && (
          <p className="flex flex-wrap items-center gap-2 lg:hidden">
            <span className="text-muted">Country:</span>
            <button
              type="button"
              onClick={() => push({ ...filters, q: query, country: '' })}
              className="flex min-h-[44px] items-center gap-2 rounded-btn border-[1.5px] border-primary bg-primary px-4 text-[15px] font-medium text-white"
            >
              {filters.country}
              <X size={16} aria-hidden="true" />
              <span className="sr-only">Remove country filter</span>
            </button>
          </p>
        )}

        <p aria-live="polite" className="text-[16px] text-muted">
          {countText}
        </p>

        <h2 className="sr-only">Packages</h2>
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <PackageCard key={p.slug} pkg={p} />
            ))}
            <div className="on-dark flex min-h-[360px] flex-col justify-end gap-3.5 rounded-card bg-dark bg-pattern p-8 text-on-dark">
              <h2 className="h3 text-on-dark">Can&apos;t find your destination?</h2>
              <p className="text-on-dark-muted text-pretty">We plan trips to any country. Tell us where, when and your budget.</p>
              <Link href="/custom-trip" className="btn btn-primary w-full">
                Plan a custom trip
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3.5 rounded-card border-[1.5px] border-dashed border-line2 bg-pattern-light px-6 py-14 text-center">
            <span
              aria-hidden="true"
              className="h-bold flex h-16 w-16 items-center justify-center rounded-full bg-tint text-[28px] text-primary"
            >
              ?
            </span>
            <h2 className="h3">No packages match these filters</h2>
            <p className="max-w-[440px] text-muted text-pretty">
              Try removing a filter, or tell us where you want to go and we&apos;ll plan a custom trip.
            </p>
            <div className="mt-1.5 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={clearAll} className="btn btn-secondary">
                Clear filters
              </button>
              <WhatsAppButton
                icon={false}
                label="packages-empty"
                message={messages.customTrip({
                  destination: filters.country || query || 'Not sure yet',
                  dates: '',
                  travellers: 2,
                  budget: '',
                  style: filters.type ?? '',
                  notes: ''
                })}
              >
                Plan a custom trip
              </WhatsAppButton>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function readFilters(params: URLSearchParams): Filters {
  const f: Filters = {};
  for (const k of KEYS) {
    const v = params.get(k);
    if (v) f[k] = v;
  }
  return f;
}

function UrlExplorer(props: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => readFilters(new URLSearchParams(params.toString())), [params]);

  const setFilters = useMemo(
    () => (next: Filters) => {
      const sp = new URLSearchParams();
      for (const k of KEYS) {
        const v = next[k]?.trim();
        if (v) sp.set(k, v);
      }
      // Keep the temporary ?theme= preview switch when filters change.
      const theme = new URLSearchParams(window.location.search).get('theme');
      if (theme) sp.set('theme', theme);
      const qs = sp.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname]
  );

  return <Explorer {...props} filters={filters} setFilters={setFilters} />;
}

/** Package grid with search, filters and sort. State lives in the URL so filtered views can be shared. */
export function PackagesExplorer(props: Props) {
  return (
    <Suspense fallback={<Explorer {...props} filters={{}} setFilters={() => {}} />}>
      <UrlExplorer {...props} />
    </Suspense>
  );
}

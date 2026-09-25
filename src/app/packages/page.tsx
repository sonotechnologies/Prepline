import type { Metadata } from 'next';
import { PackagesExplorer } from '@/components/PackagesExplorer';
import { getAllPackages, toCardData } from '@/lib/packages';
import { REGIONS, TRIP_TYPES } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Our packages',
  description:
    'Ready-made trips from Lagos to Dubai, Zanzibar, Europe, Asia and more. Filter by region, trip type, duration and price, then chat with us on WhatsApp.',
  path: '/packages/'
});

export default function PackagesPage() {
  const pkgs = getAllPackages();
  // Only offer filter options that match at least one package.
  const regions = REGIONS.filter((r) => pkgs.some((p) => p.region === r));
  const tripTypes = TRIP_TYPES.filter((t) => pkgs.some((p) => p.tripTypes.includes(t)));
  return <PackagesExplorer packages={pkgs.map(toCardData)} regions={regions} tripTypes={tripTypes} />;
}

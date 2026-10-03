import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { DestinationTile } from '@/components/DestinationTile';
import { PageHeader } from '@/components/SectionHeading';
import { getDestinations, packageCountFor, visasFor } from '@/lib/content';
import { REGIONS } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Destinations',
  description:
    'Trips from Lagos to Africa, Europe, Asia, the Middle East, the Americas and Oceania. Browse packages by country or ask us about anywhere else on WhatsApp.',
  path: '/destinations'
});

export default function DestinationsPage() {
  const groups = REGIONS.map((region) => ({
    region,
    items: getDestinations()
      .filter((d) => d.region === region)
      .map((d) => ({ d, count: packageCountFor(d.name), visa: visasFor(d.name)[0] }))
      .sort((a, b) => b.count - a.count || a.d.name.localeCompare(b.d.name))
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader
        title="Destinations"
        text="We plan trips to any country. Pick a destination to see its packages, or ask us about it on WhatsApp."
      >
        <nav aria-label="Regions" className="mt-2">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {groups.map((g) => (
              <li key={g.region}>
                <a
                  href={`#${g.region.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex min-h-[44px] items-center rounded-btn border-[1.5px] border-line2 bg-surface px-4 text-[16px] font-medium text-ink no-underline hover:border-primary hover:text-primary"
                >
                  {g.region}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div className="container-site flex flex-col gap-16 py-sec-y">
        {groups.map((g) => (
          <section key={g.region} id={g.region.toLowerCase().replace(/\s+/g, '-')} aria-labelledby={`r-${g.region}`} className="flex flex-col gap-6">
            <h2 id={`r-${g.region}`} className="h2">
              {g.region}
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
              {g.items.map(({ d, count, visa }) => (
                <DestinationTile key={d.slug} d={d} packageCount={count} visa={visa} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <CtaBand title="Somewhere else in mind?" text="Tell us the country, your dates and your budget. We reply on WhatsApp with options and a quote." />
    </>
  );
}

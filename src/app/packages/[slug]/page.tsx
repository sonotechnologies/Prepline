import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Flag } from '@/components/Flag';
import { Gallery } from '@/components/Gallery';
import { CrossIcon, TickIcon } from '@/components/icons';
import { ItineraryAccordion } from '@/components/ItineraryAccordion';
import { JsonLd } from '@/components/JsonLd';
import { PackageCard } from '@/components/PackageCard';
import { PriceCard } from '@/components/PriceCard';
import { StickyEnquiryBar } from '@/components/StickyEnquiryBar';
import { site } from '@/content/site';
import { formatDateList, formatDuration, formatMoney, formatPrice, upcomingDates } from '@/lib/format';
import { getAllPackages, getPackage, getRelatedPackages, toCardData } from '@/lib/packages';
import { absoluteUrl, pageMetadata } from '@/lib/seo';
import { messages, packageUrl } from '@/lib/whatsapp';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllPackages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPackage(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.title}, ${formatDuration(p, ', ')}`,
    description: `${p.overview.split('. ')[0]}. From ${formatPrice(p)} ${p.priceNote}. Final quote on WhatsApp.`,
    path: `/packages/${p.slug}/`,
    image: p.coverImage,
    imageAlt: p.coverAlt
  });
}

export default async function PackagePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getPackage(slug);
  if (!p) notFound();

  const url = packageUrl(p.slug);
  const dates = upcomingDates(p.dates);
  const related = getRelatedPackages(p, 3).map(toCardData);
  const location = p.city && p.city !== p.country ? `${p.city}, ${p.country}` : p.country;
  const facts = [
    { k: 'Duration', v: formatDuration(p, ', ') },
    { k: 'Group size', v: p.quickFacts.groupSize },
    { k: 'Best season', v: p.quickFacts.bestSeason },
    { k: 'Visa needed', v: p.quickFacts.visaRequired ? 'Yes, we process it' : 'No' }
  ];
  const addOns = (p.addOns ?? []).map((a) => (typeof a === 'string' ? { title: a, priceFrom: undefined } : a));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: p.title,
    description: p.overview,
    url: absoluteUrl(`/packages/${p.slug}/`),
    image: p.gallery.map((g) => absoluteUrl(g.src)),
    touristType: p.tripTypes,
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: p.itinerary.length,
      itemListElement: p.itinerary.map((d, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'TouristAttraction', name: `Day ${d.day}: ${d.title}`, description: d.description }
      }))
    },
    offers: {
      '@type': 'Offer',
      price: p.priceFrom,
      priceCurrency: p.currency,
      description: `From ${formatPrice(p)} ${p.priceNote}. Final quote on WhatsApp.`,
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/packages/${p.slug}/`),
      ...(dates[0] ? { validFrom: dates[0] } : {}),
      offeredBy: { '@type': 'TravelAgency', name: site.name, url: absoluteUrl('/') }
    },
    provider: { '@type': 'TravelAgency', name: site.name, url: absoluteUrl('/') }
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="container-site pt-5">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="m-0 flex list-none items-center gap-2 p-0">
            <li>
              <Link href="/packages/" className="flex min-h-[44px] items-center text-link">
                Packages
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {p.title}
            </li>
          </ol>
        </nav>
        <Gallery photos={p.gallery} title={p.title} />
      </div>

      <div className="container-site grid grid-cols-1 items-start gap-12 pb-sec-y pt-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="flex min-w-0 flex-col gap-12">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-2 text-[15px] font-medium text-muted">
              <Flag code={p.countryCode} country={p.country} />
              {location}
            </div>
            <h1 className="h1">{p.title}</h1>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className="text-lead">
                From <strong className="h-bold">{formatPrice(p)}</strong> {p.priceNote}
              </span>
              <span className="text-sm text-muted">Final quote on WhatsApp</span>
            </div>
            <span className="text-muted">
              {formatDuration(p)} · {dates.length ? `Next dates: ${formatDateList(dates)}` : 'Dates on request'}
            </span>
          </div>

          <dl className="m-0 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.k} className="flex flex-col gap-1 bg-surface px-5 py-[18px]">
                <dt className="text-sm text-muted">{f.k}</dt>
                <dd className="h-semi m-0 text-lg leading-[1.3]">{f.v}</dd>
              </div>
            ))}
          </dl>

          <section className="flex flex-col gap-3" aria-labelledby="overview">
            <h2 id="overview" className="h2">
              Overview
            </h2>
            <p className="max-w-[68ch] text-pretty">{p.overview}</p>
          </section>

          <section className="flex flex-col gap-4" aria-labelledby="itinerary">
            <h2 id="itinerary" className="h2">
              Day by day
            </h2>
            <ItineraryAccordion days={p.itinerary} />
          </section>

          <section className="grid grid-cols-1 gap-8 md:grid-cols-2" aria-label="What the package includes">
            <div className="flex flex-col gap-3.5">
              <h2 className="h3">Included</h2>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {p.included.map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <TickIcon />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3.5">
              <h2 className="h3">Not included</h2>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {p.excluded.map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CrossIcon />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {addOns.length > 0 && (
            <section className="flex flex-col gap-4" aria-labelledby="addons">
              <div className="flex flex-wrap items-center gap-3">
                <h2 id="addons" className="h3">
                  Optional add-ons
                </h2>
                <span className="rounded-btn bg-tint px-2.5 py-1 text-sm font-semibold text-tag">Information only</span>
              </div>
              <p className="text-muted">
                Add-ons are not booked on this page. Mention the ones you want in your WhatsApp chat and we add them to
                your quote.
              </p>
              <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-3">
                {addOns.map((a) => (
                  <li key={a.title} className="flex flex-col gap-1.5 rounded-card border border-dashed border-line2 px-5 py-[18px]">
                    <strong className="font-semibold">{a.title}</strong>
                    {a.priceFrom && (
                      <>
                        <span className="text-[16px]">
                          From {formatMoney(a.priceFrom, p.currency)} {p.priceNote}
                        </span>
                        <span className="text-sm text-muted">Final quote on WhatsApp</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {p.faqs && p.faqs.length > 0 && (
            <section className="flex flex-col gap-2" aria-labelledby="package-faqs">
              <h2 id="package-faqs" className="h3 mb-2">
                Package FAQs
              </h2>
              <FaqAccordion faqs={p.faqs} name="package-faq" size="md" iconBg="var(--tint)" />
            </section>
          )}
        </article>

        <aside className="sticky top-24 hidden lg:block" aria-label="Price and enquiry">
          <PriceCard
            slug={p.slug}
            title={p.title}
            durationDays={p.durationDays}
            priceFrom={p.priceFrom}
            currency={p.currency}
            priceText={formatPrice(p)}
            priceNote={p.priceNote}
            url={url}
            dates={dates.map((iso) => ({ iso, note: p.dateNotes?.[iso] }))}
          />
        </aside>
      </div>

      {related.length > 0 && (
        <section className="bg-tint bg-pattern-light" aria-labelledby="related">
          <div className="container-site section-y flex flex-col gap-8">
            <h2 id="related" className="h2">
              You might also like
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <PackageCard key={r.slug} pkg={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      <StickyEnquiryBar
        slug={p.slug}
        priceText={formatPrice(p)}
        priceNote={p.priceNote}
        message={messages.package(p, url)}
      />
    </>
  );
}

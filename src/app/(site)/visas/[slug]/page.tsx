import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Flag } from '@/components/Flag';
import { CrossIcon, TickIcon, WhatsAppIcon } from '@/components/icons';
import { JsonLd } from '@/components/JsonLd';
import { StickyEnquiryBar } from '@/components/StickyEnquiryBar';
import { VisaCard } from '@/components/VisaCard';
import { site } from '@/content/site';
import { getAllVisas, getRelatedVisas, getVisa } from '@/lib/content';
import { formatPrice } from '@/lib/format';
import { absoluteUrl, pageMetadata } from '@/lib/seo';
import { messages, visaUrl, waLink } from '@/lib/whatsapp';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllVisas().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const v = getVisa(slug);
  if (!v) return {};
  return pageMetadata({
    title: v.title,
    description: `${v.summary} From ${formatPrice(v)} ${v.priceNote}. Final quote on WhatsApp.`,
    path: `/visas/${v.slug}`,
    image: v.image,
    imageAlt: v.imageAlt
  });
}

export default async function VisaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const v = getVisa(slug);
  if (!v) notFound();

  const message = messages.visa(v, visaUrl(v.slug));
  const related = getRelatedVisas(v, 3);
  const facts = [
    { k: 'Processing time', v: v.processingTime },
    { k: 'Visa validity', v: v.validity },
    { k: 'Length of stay', v: v.stay },
    { k: 'Entries', v: v.entries }
  ].filter((f): f is { k: string; v: string } => !!f.v);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: v.title,
    serviceType: 'Visa application assistance',
    description: v.overview,
    url: absoluteUrl(`/visas/${v.slug}`),
    image: absoluteUrl(v.image),
    areaServed: { '@type': 'Country', name: 'Nigeria' },
    provider: { '@type': 'TravelAgency', name: site.name, url: absoluteUrl('/') },
    offers: {
      '@type': 'Offer',
      price: v.priceFrom,
      priceCurrency: v.currency,
      description: `From ${formatPrice(v)} ${v.priceNote}. Final quote on WhatsApp.`
    }
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="container-site pt-5">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="m-0 flex list-none items-center gap-2 p-0">
            <li>
              <Link href="/visas" className="flex min-h-[44px] items-center text-link">
                Visas
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {v.title}
            </li>
          </ol>
        </nav>
      </div>

      <div className="container-site grid grid-cols-1 items-start gap-12 pb-sec-y pt-2 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="flex min-w-0 flex-col gap-12">
          <div className="flex flex-col gap-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-arch photo-frame md:aspect-[21/9]">
              <Image src={v.image} alt={v.imageAlt} fill priority sizes="(min-width: 1024px) 860px, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2 text-[15px] font-medium text-muted">
                <Flag code={v.countryCode} country={v.country} />
                {v.country}
              </div>
              <h1 className="h1">{v.title}</h1>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <span className="text-lead">
                  From <strong className="h-bold">{formatPrice(v)}</strong> {v.priceNote}
                </span>
                <span className="text-sm text-muted">Final quote on WhatsApp</span>
              </div>
              {v.feeNote && <span className="text-muted">{v.feeNote}</span>}
              {v.purposes.length > 0 && (
                <ul className="flex flex-wrap gap-1.5" aria-label="Good for">
                  {v.purposes.map((p) => (
                    <li key={p} className="tag">
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <dl className="m-0 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.k} className="flex flex-col gap-1 bg-surface px-5 py-[18px]">
                <dt className="text-sm text-muted">{f.k}</dt>
                <dd className="h-semi m-0 text-[17px] leading-[1.35]">{f.v}</dd>
              </div>
            ))}
            {v.appointment && (
              <div className="col-span-2 flex flex-col gap-1 bg-surface px-5 py-[18px] lg:col-span-4">
                <dt className="text-sm text-muted">Appointment</dt>
                <dd className="h-semi m-0 text-[17px] leading-[1.35]">{v.appointment}</dd>
              </div>
            )}
          </dl>

          <section className="flex flex-col gap-3" aria-labelledby="overview">
            <h2 id="overview" className="h2">
              Overview
            </h2>
            <p className="max-w-[68ch] text-pretty">{v.overview}</p>
          </section>

          {v.requirements.length > 0 && (
            <section className="flex flex-col gap-4" aria-labelledby="documents">
              <h2 id="documents" className="h2">
                Documents you need
              </h2>
              <p className="text-muted">A typical list. We send you a checklist tailored to your situation.</p>
              <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2">
                {v.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <TickIcon />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {v.steps.length > 0 && (
            <section className="flex flex-col gap-4" aria-labelledby="process">
              <h2 id="process" className="h2">
                How we handle it
              </h2>
              <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
                {v.steps.map((s, i) => (
                  <li key={s.title} className="card flex gap-4 px-5 py-4">
                    <span
                      aria-hidden="true"
                      className="flex h-9 min-w-9 flex-none items-center justify-center rounded-btn bg-tint text-sm font-bold text-tag"
                    >
                      {i + 1}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="h-semi text-lg leading-[1.3]">{s.title}</h3>
                      {s.description && <p className="text-muted text-pretty">{s.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {(v.included.length > 0 || v.excluded.length > 0) && (
            <section className="grid grid-cols-1 gap-8 md:grid-cols-2" aria-label="What the service includes">
              <div className="flex flex-col gap-3.5">
                <h2 className="h3">Our service includes</h2>
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {v.included.map((i) => (
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
                  {v.excluded.map((i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CrossIcon />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {v.faqs.length > 0 && (
            <section className="flex flex-col gap-2" aria-labelledby="visa-faqs">
              <h2 id="visa-faqs" className="h3 mb-2">
                Visa FAQs
              </h2>
              <FaqAccordion faqs={v.faqs} name="visa-faq" size="md" iconBg="var(--tint)" />
            </section>
          )}
        </article>

        <aside className="sticky top-24 hidden lg:block" aria-label="Price and enquiry">
          <div className="card flex flex-col gap-5 p-7 shadow-[0_24px_48px_-32px_rgba(0,0,0,.35)]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[16px]">From</span>
              <span className="h-bold text-[34px] leading-[1.1]">{formatPrice(v)}</span>
              <span className="text-[16px]">{v.priceNote}</span>
              <span className="mt-1 text-sm text-muted">Final quote on WhatsApp</span>
            </div>
            {v.feeNote && <p className="text-sm text-muted">{v.feeNote}</p>}
            <div className="flex items-start gap-2 rounded-sm bg-tint px-4 py-3 text-[15px] text-tag">
              <span className="font-semibold">Processing:</span>
              <span>{v.processingTime}</span>
            </div>
            <a
              href={waLink(message)}
              target="_blank"
              rel="noopener"
              data-wa-label={`visa-card-side:${v.slug}`}
              className="btn btn-primary min-h-[52px]"
            >
              <WhatsAppIcon />
              Enquire on WhatsApp
            </a>
            <a href={`tel:${site.phone.tel}`} className="-mt-2 flex min-h-[44px] items-center justify-center font-semibold text-link">
              Or call {site.phone.display}
            </a>
            <p className="border-t border-line pt-4 text-sm text-muted">
              Nothing is paid on this website. Visa decisions are made by the embassy; we make sure your application is
              complete and well prepared.
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="bg-tint bg-pattern-light" aria-labelledby="related">
          <div className="container-site section-y flex flex-col gap-8">
            <h2 id="related" className="h2">
              Other visas we handle
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <VisaCard key={r.slug} visa={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      <StickyEnquiryBar
        label={`sticky-bar:visa:${v.slug}`}
        priceText={formatPrice(v)}
        priceNote={v.priceNote}
        message={message}
        cta="Enquire on WhatsApp"
      />
    </>
  );
}

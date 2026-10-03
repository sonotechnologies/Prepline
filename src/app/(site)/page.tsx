import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { DestinationTile } from '@/components/DestinationTile';
import { FaqAccordion } from '@/components/FaqAccordion';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import { TickIcon } from '@/components/icons';
import { PackageCard } from '@/components/PackageCard';
import { VisaCard } from '@/components/VisaCard';
import { ReviewSlider } from '@/components/ReviewSlider';
import { SectionHeading, WaveDivider } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { StatsCounter } from '@/components/StatsCounter';
import { TripFinderForm } from '@/components/TripFinderForm';
import { TRUST_POINTS, TrustLogos } from '@/components/TrustLogos';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { site } from '@/content/site';
import {
  getDestinations,
  getFaqs,
  getFeaturedPackages,
  getFeaturedVisas,
  getHome,
  getReviews,
  getServices,
  toCardData
} from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { messages } from '@/lib/whatsapp';

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${site.name} | Holidays, group tours and visas from Lagos`,
    description: site.description,
    path: '/'
  }),
  title: { absolute: `${site.name} | Holidays, group tours and visas from Lagos` }
};

const STEPS = [
  {
    t: 'Pick a package or visa',
    d: 'Browse our packages and visa services, or tell us where you want to go. Every one shows a clear starting price.'
  },
  { t: 'Chat with us on WhatsApp', d: 'A travel planner confirms your dates, hotels and visa needs, then sends your final quote.' },
  { t: 'Pack your bags', d: 'We send your tickets, hotel vouchers and day-by-day plan, and stay on WhatsApp for the whole trip.' }
];

export default function HomePage() {
  const home = getHome();
  const destinations = getDestinations();
  const featured = getFeaturedPackages(6).map(toCardData);
  const visas = getFeaturedVisas(3);
  const popular = destinations.filter((d) => d.popular).slice(0, 6);

  return (
    <>
      {/* Hero: sits under the transparent header. */}
      <section
        aria-label="Plan a trip"
        className="relative -mt-header flex flex-col justify-end overflow-hidden bg-dark lg:min-h-[680px]"
      >
        <HeroSlideshow slides={home.heroSlides.map((s) => ({ src: s.image, alt: s.alt }))}>
          <div className="relative flex max-w-[780px] flex-col gap-4">
            <h1 className="h1 text-white">{home.heroHeadline}</h1>
            {home.heroSubline && (
              <p className="max-w-[620px] text-lead leading-normal text-white text-pretty">{home.heroSubline}</p>
            )}
          </div>
          <div className="relative">
            <TripFinderForm destinations={destinations.map((d) => d.name)} />
          </div>
        </HeroSlideshow>
      </section>

      <section aria-label="In numbers" className="bg-stats-bg bg-pattern">
        <StatsCounter stats={site.stats} />
      </section>

      <section className="container-site section-y flex flex-col gap-8" aria-labelledby="featured-title">
        <SectionHeading
          id="featured-title"
          title="Featured packages"
          text="Ready-made trips from Lagos. Every price is a starting price per person."
          action={
            <Link href="/packages" className="text-link">
              View all packages →
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PackageCard key={p.slug} pkg={p} showBadge={false} />
          ))}
        </div>
      </section>

      {visas.length > 0 && (
        <section className="bg-tint bg-pattern-light" aria-labelledby="visas-title">
          <div className="container-site section-y flex flex-col gap-8">
            <SectionHeading
              id="visas-title"
              title="Visa applications, handled"
              text="UK, US, Canada, Schengen, Dubai and more. We prepare your forms and documents, book your appointment and check everything before you submit."
              action={
                <Link href="/visas" className="text-link">
                  All visa services →
                </Link>
              }
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visas.map((v) => (
                <VisaCard key={v.slug} visa={v} />
              ))}
            </div>
          </div>
        </section>
      )}

      <WaveDivider />

      <section className="bg-pattern-light" aria-labelledby="how-title">
        <div className="container-site section-y flex flex-col gap-10">
          <h2 id="how-title" className="h2">
            How it works
          </h2>
          <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="card flex flex-col gap-3 p-7">
                <span
                  aria-hidden="true"
                  className="h-bold flex h-12 w-12 items-center justify-center rounded-btn bg-step text-xl text-step-text"
                >
                  {i + 1}
                </span>
                <h3 className="h3">{s.t}</h3>
                <p className="text-muted text-pretty">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-site section-y flex flex-col gap-8" aria-labelledby="dest-title">
        <SectionHeading
          id="dest-title"
          title="Popular destinations"
          text="Don't see yours? We plan trips to any country."
          action={
            <Link href="/destinations" className="text-link">
              All destinations →
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-6">
          {popular.map((d) => (
            <DestinationTile key={d.slug} d={d} />
          ))}
        </div>
      </section>

      <section className="bg-tint bg-pattern-light" aria-labelledby="services-title">
        <div className="container-site section-y flex flex-col gap-8">
          <SectionHeading
            id="services-title"
            title="What we do"
            text="One team for the whole trip, from the first message to the flight home."
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {getServices().map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="container-site section-y grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
        aria-labelledby="why-title"
      >
        <div className="flex flex-col gap-5">
          <h2 id="why-title" className="h2">
            Why travellers choose us
          </h2>
          <p className="text-muted text-pretty">A licensed Lagos agency with more than ten years of trips behind it.</p>
          <TrustLogos />
        </div>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
          {TRUST_POINTS.map((t) => (
            <li key={t.t} className="flex gap-3.5">
              <TickIcon size={28} />
              <div className="flex flex-col gap-1">
                <h3 className="h-semi text-[19px] leading-[1.3]">{t.t}</h3>
                <p className="text-muted text-pretty">{t.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <WaveDivider />

      <ReviewSlider reviews={getReviews()} />

      <section className="container-site flex flex-col gap-8 pb-sec-y" aria-labelledby="gallery-title">
        <div className="flex flex-col gap-2">
          <h2 id="gallery-title" className="h2">
            Trip gallery
          </h2>
          <p className="text-muted">Photos shared by our travellers.</p>
        </div>
        <div className="columns-2 gap-4 lg:columns-4">
          {home.gallery.map((g) => (
            <div
              key={g.image}
              className="relative mb-4 break-inside-avoid overflow-hidden rounded-gal photo-frame"
              style={{ aspectRatio: g.shape }}
            >
              <Image
                src={g.image}
                alt={g.alt}
                fill
                sizes="(min-width: 1024px) 300px, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section id="faqs" className="bg-tint bg-pattern-light" aria-labelledby="faq-title">
        <div className="container-site section-y grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col items-start gap-4">
            <h2 id="faq-title" className="h2">
              Questions, answered
            </h2>
            <p className="text-muted">Something else on your mind? Ask us on WhatsApp.</p>
            <WhatsAppButton variant="secondary" icon={false} message={messages.general()} label="faq">
              Enquire on WhatsApp
            </WhatsAppButton>
          </div>
          <FaqAccordion faqs={getFaqs()} name="home-faq" openFirst />
        </div>
      </section>

      <CtaBand />
    </>
  );
}

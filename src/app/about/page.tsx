import Image from 'next/image';
import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { TickIcon } from '@/components/icons';
import { PageHeader, WaveDivider } from '@/components/SectionHeading';
import { StatsCounter } from '@/components/StatsCounter';
import { TRUST_POINTS, TrustLogos } from '@/components/TrustLogos';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About us',
  description: `${site.name} is a licensed Lagos travel agency. Since ${site.foundedYear} we have planned trips to 60+ countries for families, couples and groups.`,
  path: '/about/'
});

export default function AboutPage() {
  const years = new Date().getFullYear() - site.foundedYear;
  return (
    <>
      <PageHeader title="About us" text="A Lagos travel agency that plans every trip with you, one WhatsApp message at a time." />

      <section className="container-site section-y grid grid-cols-1 items-center gap-12 lg:grid-cols-2" aria-labelledby="story">
        <div className="flex flex-col gap-5">
          <h2 id="story" className="h2">
            Our story
          </h2>
          <p className="text-pretty">
            {site.name} started in {site.address.city} in {site.foundedYear} with a simple idea: planning a trip abroad
            should feel like chatting with a friend who knows travel. {years > 1 ? `${years} years` : 'Years'} and more
            than 5,000 travellers later, that is still how we work.
          </p>
          <p className="text-pretty">
            We plan holidays, honeymoons, family trips, church and corporate tours, and pilgrimages to more than 60
            countries. A named planner handles your visa checklist, flights, hotels and tours, and stays on WhatsApp
            from the first message until you land back home.
          </p>
          <p className="text-pretty text-muted">
            We do not sell anything on this website. Every trip is quoted and confirmed with you directly, and you only
            pay once you approve your final quote.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-card photo-frame">
          <Image
            src="/images/about/team.webp"
            alt="Our travel planners at the Lagos office"
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section aria-label="In numbers" className="bg-stats-bg bg-pattern">
        <StatsCounter stats={site.stats} />
      </section>

      <section className="container-site section-y grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" aria-labelledby="trust">
        <div className="flex flex-col gap-5">
          <h2 id="trust" className="h2">
            Why travellers choose us
          </h2>
          <p className="text-muted text-pretty">Licensed, accredited and on WhatsApp seven days a week.</p>
          <TrustLogos />
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-7 p-0 md:grid-cols-2">
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
      <CtaBand />
    </>
  );
}

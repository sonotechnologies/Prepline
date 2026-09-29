import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { PageHeader, WaveDivider } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { getServices } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Services',
  description:
    'Holiday packages, honeymoons, group and corporate tours, visa assistance, flights, hotels and travel insurance, planned with you on WhatsApp.',
  path: '/services'
});

const STEPS = [
  { t: 'Send us a message', d: 'Tell us where, when, how many and your budget. A planner replies on WhatsApp.' },
  { t: 'Get options and a quote', d: 'We send hotel and flight options with a clear quote that lists every cost.' },
  { t: 'Approve and travel', d: 'Once you approve, we confirm everything and stay on WhatsApp for the whole trip.' }
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader title="Services" text="One team for the whole trip, from the first message to the flight home." />
      <section className="container-site section-y" aria-labelledby="our-services">
        <h2 id="our-services" className="sr-only">
          Our services
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {getServices().map((s, i) => (
            <ServiceCard key={s.slug} service={s} index={i} showDetails />
          ))}
        </div>
      </section>
      <WaveDivider />
      <section className="container-site section-y flex flex-col gap-10" aria-labelledby="process">
        <h2 id="process" className="h2">
          How we work
        </h2>
        <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="card flex flex-col gap-3 p-7">
              <span aria-hidden="true" className="h-bold flex h-12 w-12 items-center justify-center rounded-btn bg-step text-xl text-step-text">
                {i + 1}
              </span>
              <h3 className="h3">{s.t}</h3>
              <p className="text-muted text-pretty">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
      <CtaBand />
    </>
  );
}

import type { Metadata } from 'next';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons';
import { PageHeader } from '@/components/SectionHeading';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';
import { messages } from '@/lib/whatsapp';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description: `Chat with ${site.name} on WhatsApp, call ${site.phone.display} or visit our office in ${site.address.city}.`,
  path: '/contact/'
});

export default function ContactPage() {
  const address = `${site.address.street}, ${site.address.city}, ${site.address.country}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address.mapQuery)}&output=embed`;
  const rows = [
    { icon: Phone, label: 'Phone', content: <a href={`tel:${site.phone.tel}`} className="font-semibold text-ink">{site.phone.display}</a> },
    { icon: Mail, label: 'Email', content: <a href={`mailto:${site.email}`}>{site.email}</a> },
    { icon: Clock, label: 'Hours', content: <>{site.hours.office}<br />{site.hours.whatsapp}</> },
    { icon: MapPin, label: 'Office', content: address }
  ];

  return (
    <>
      <PageHeader title="Contact us" text="The fastest way to reach us is WhatsApp. A travel planner replies, usually within the hour." />
      <div className="container-site grid grid-cols-1 items-start gap-12 py-sec-y lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section className="flex flex-col gap-8" aria-labelledby="reach">
          <div className="card flex flex-col items-start gap-4 p-7">
            <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-sm bg-tint text-primary">
              <WhatsAppIcon size={24} />
            </span>
            <h2 id="reach" className="h3">
              Chat with us on WhatsApp
            </h2>
            <p className="text-muted">Send your destination, dates and number of travellers, and we reply with options and a quote.</p>
            <WhatsAppButton message={messages.general()} label="contact">
              Enquire on WhatsApp
            </WhatsAppButton>
          </div>
          <address className="not-italic">
            <dl className="m-0 flex flex-col gap-5">
              {rows.map(({ icon: Icon, label, content }) => (
                <div key={label} className="flex gap-4">
                  <Icon size={22} className="mt-0.5 flex-none text-primary" aria-hidden="true" />
                  <div className="flex flex-col">
                    <dt className="text-sm font-semibold text-muted">{label}</dt>
                    <dd className="m-0">{content}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </address>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Social media">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener" className="btn btn-secondary min-h-[44px] px-4">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="map-title" className="flex flex-col gap-4">
          <h2 id="map-title" className="h3">
            Find our office
          </h2>
          <div className="aspect-[4/3] overflow-hidden rounded-card border border-line bg-tint lg:aspect-auto lg:h-[520px]">
            <iframe
              title={`Map showing ${address}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        </section>
      </div>
    </>
  );
}

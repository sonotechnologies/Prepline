import type { Metadata } from 'next';
import { CustomTripForm } from '@/components/CustomTripForm';
import { TickIcon } from '@/components/icons';
import { PageHeader } from '@/components/SectionHeading';
import { destinations } from '@/lib/packages';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Plan a custom trip',
  description:
    'Tell us where you want to go, when, and your budget. We build a custom trip to any country and send your quote on WhatsApp.',
  path: '/custom-trip/'
});

const POINTS = [
  'Any country, any dates, any group size',
  'Options that fit your budget',
  'Visa support and travel insurance on request',
  'Your quote on WhatsApp, usually the same day'
];

export default function CustomTripPage() {
  return (
    <>
      <PageHeader
        title="Plan a custom trip"
        text="Tell us about the trip you want. Your answers open in WhatsApp as a message you can edit before sending. Nothing is stored on this website."
      />
      <div className="container-site grid grid-cols-1 items-start gap-12 py-sec-y lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <CustomTripForm destinations={destinations.map((d) => d.name)} />
        <aside className="card flex flex-col gap-5 p-7" aria-labelledby="what-next">
          <h2 id="what-next" className="h3">
            What happens next
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <TickIcon />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="border-t border-line pt-4 text-sm text-muted">
            Nothing is paid on this website. We share payment details only after you approve your final quote.
          </p>
        </aside>
      </div>
    </>
  );
}

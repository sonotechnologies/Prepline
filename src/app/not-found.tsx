import Link from 'next/link';
import { SiteChrome } from '@/components/SiteChrome';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { messages } from '@/lib/whatsapp';

export default function NotFound() {
  return (
    <SiteChrome>
    <section className="container-site flex flex-col items-center gap-5 py-24 text-center">
      <span aria-hidden="true" className="h-bold flex h-16 w-16 items-center justify-center rounded-full bg-tint text-[28px] text-primary">
        ?
      </span>
      <h1 className="h1">This page took a different flight</h1>
      <p className="max-w-[520px] text-lead text-muted text-pretty">
        We couldn&apos;t find that page. Browse our packages, or tell us where you want to go.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/packages" className="btn btn-secondary">
          View all packages
        </Link>
        <WhatsAppButton message={messages.planTrip()} label="404">
          Plan my trip
        </WhatsAppButton>
      </div>
    </section>
    </SiteChrome>
  );
}

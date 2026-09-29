import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Flag } from './Flag';
import { WhatsAppButton } from './WhatsAppButton';
import { formatPrice } from '@/lib/format';
import type { Visa } from '@/lib/schema';
import { messages, visaUrl } from '@/lib/whatsapp';

/** Visa service card: same shape and states as the package card, with processing time instead of duration. */
export function VisaCard({ visa: v }: { visa: Visa }) {
  return (
    <article className="card card-lift relative flex h-full flex-col overflow-hidden shadow-card">
      <div className="relative mx-[var(--inset)] mt-[var(--inset)] aspect-[4/3] overflow-hidden rounded-arch photo-frame">
        <Image
          src={v.image}
          alt={v.imageAlt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 pb-[22px] pt-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Flag code={v.countryCode} country={v.country} />
          {v.country}
        </div>
        <h3 className="h3">
          <Link
            href={`/visas/${v.slug}`}
            className="text-ink no-underline after:absolute after:inset-0 after:content-[''] hover:text-primary"
          >
            {v.title}
          </Link>
        </h3>
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Clock size={16} aria-hidden="true" className="flex-none" />
          <span>
            <span className="sr-only">Processing time: </span>
            {v.processingTime}
          </span>
        </span>
        {v.purposes.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Good for">
            {v.purposes.slice(0, 3).map((p) => (
              <li key={p} className="tag">
                {p}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-col gap-0.5 border-t border-line pt-3.5">
          <span className="text-base">
            From <strong className="h-bold text-[22px]">{formatPrice(v)}</strong> {v.priceNote}
          </span>
          <span className="text-sm text-muted">Final quote on WhatsApp</span>
        </div>
        <WhatsAppButton
          variant="secondary"
          icon
          label={`visa-card:${v.slug}`}
          message={messages.visa(v, visaUrl(v.slug))}
          className="relative z-10 w-full"
        >
          Enquire on WhatsApp
        </WhatsAppButton>
      </div>
    </article>
  );
}

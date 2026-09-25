import Image from 'next/image';
import Link from 'next/link';
import { Flag } from './Flag';
import { WhatsAppButton } from './WhatsAppButton';
import type { PackageCardData } from '@/lib/filters';
import { messages, packageUrl } from '@/lib/whatsapp';

export function PackageCard({
  pkg,
  priority = false,
  showBadge = true
}: {
  pkg: PackageCardData;
  priority?: boolean;
  /** Off in the Featured section, where every card would carry the badge. */
  showBadge?: boolean;
}) {
  const href = `/packages/${pkg.slug}/`;
  return (
    <article className="card card-lift relative flex h-full flex-col overflow-hidden shadow-card">
      <div className="relative mx-[var(--inset)] mt-[var(--inset)] aspect-[4/3] overflow-hidden rounded-arch photo-frame">
        <Image
          src={pkg.coverImage}
          alt={pkg.coverAlt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          priority={priority}
        />
        {showBadge && pkg.featured && (
          <span className="absolute bottom-3 right-3 rounded-btn bg-badge px-3 py-1.5 text-sm font-bold text-badge-text">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 pb-[22px] pt-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Flag code={pkg.countryCode} country={pkg.country} />
          {pkg.country}
        </div>
        <h3 className="h3">
          {/* The stretched link makes the whole card clickable without nesting interactive elements. */}
          <Link href={href} className="text-ink no-underline after:absolute after:inset-0 after:content-[''] hover:text-primary">
            {pkg.title}
          </Link>
        </h3>
        <span className="text-sm text-muted">{pkg.durationText}</span>
        <ul className="flex flex-wrap gap-1.5" aria-label="Highlights">
          {pkg.highlights.map((h) => (
            <li key={h} className="tag">
              {h}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-0.5 border-t border-line pt-3.5">
          <span className="text-base">
            From <strong className="h-bold text-[22px]">{pkg.priceText}</strong> {pkg.priceNote}
          </span>
          <span className="text-sm text-muted">Final quote on WhatsApp</span>
        </div>
        <WhatsAppButton
          variant="secondary"
          icon
          label={`card:${pkg.slug}`}
          message={messages.package(pkg, packageUrl(pkg.slug))}
          className="relative z-10 w-full"
        >
          Enquire on WhatsApp
        </WhatsAppButton>
      </div>
    </article>
  );
}

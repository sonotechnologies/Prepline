import Image from 'next/image';
import Link from 'next/link';
import type { Destination } from '@/lib/schema';
import { messages, waLink } from '@/lib/whatsapp';

/**
 * Destination tile. Links to the country's packages and visa page when they exist;
 * "Ask about {Country}" always opens WhatsApp.
 */
export function DestinationTile({
  d,
  packageCount = 0,
  visa,
  sizes
}: {
  d: Destination;
  packageCount?: number;
  visa?: { slug: string };
  sizes?: string;
}) {
  const hasPackages = packageCount > 0;
  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative aspect-[3/4] overflow-hidden rounded-tile photo-frame">
        <Image src={d.image} alt={d.imageAlt} fill sizes={sizes ?? '(min-width: 1024px) 200px, 50vw'} className="object-cover" />
      </div>
      <h3 className="text-xl leading-tight">{d.name}</h3>
      {hasPackages && (
        <Link href={`/packages?country=${encodeURIComponent(d.name)}`} className="text-link -mt-2.5 text-[16px]">
          {packageCount === 1 ? '1 package' : `${packageCount} packages`}
        </Link>
      )}
      {visa && (
        <Link href={`/visas/${visa.slug}`} className={`text-link text-[16px] ${hasPackages ? '-mt-3' : '-mt-2.5'}`}>
          Visa help
        </Link>
      )}
      <a
        href={waLink(messages.destination(d.name))}
        target="_blank"
        rel="noopener"
        data-wa-label={`destination:${d.slug}`}
        className={`text-link text-[16px] ${hasPackages || visa ? '-mt-3' : '-mt-2.5'}`}
      >
        Ask about {d.short}
      </a>
    </div>
  );
}

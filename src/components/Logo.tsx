import Link from 'next/link';
import { site } from '@/content/site';

export function Logo({ inverted = false, size = 'md' }: { inverted?: boolean; size?: 'md' | 'lg' }) {
  const big = size === 'lg';
  return (
    <Link
      href="/"
      className="flex min-h-[44px] flex-col justify-center gap-[3px] no-underline"
    >
      <span
        className={`h-bold leading-none ${big ? 'text-[28px]' : 'text-2xl'} ${inverted ? 'text-white' : 'text-primary'}`}
      >
        {site.shortName}
      </span>{' '}
      <span
        className={`whitespace-nowrap font-heading font-medium uppercase leading-none tracking-[.18em] ${big ? 'text-xs' : 'text-[11px]'} ${inverted ? 'text-white' : 'text-ink'}`}
      >
        Travel and Tours
      </span>
      <span className="sr-only">, home</span>
    </Link>
  );
}

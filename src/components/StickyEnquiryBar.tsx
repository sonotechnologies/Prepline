'use client';

import { useEffect, useRef } from 'react';
import { WhatsAppIcon } from './icons';
import { waLink } from '@/lib/whatsapp';

/**
 * Mobile sticky bar with the price and the WhatsApp button. The data attribute lifts the
 * floating WhatsApp button above it (see globals.css) so the two never overlap; once measured,
 * the exact bar height replaces the CSS fallback, even when the price line wraps.
 */
export function StickyEnquiryBar({
  priceText,
  priceNote,
  message,
  label,
  cta = 'Chat about this package'
}: {
  priceText: string;
  priceNote: string;
  message: string;
  /** Analytics label, e.g. "sticky-bar:dubai-city-escape". */
  label: string;
  cta?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('ResizeObserver' in window)) return;
    const root = document.documentElement;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      if (h > 0) root.style.setProperty('--sticky-bar-h', `${h}px`);
      else root.style.removeProperty('--sticky-bar-h');
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty('--sticky-bar-h');
    };
  }, []);

  return (
    <div
      ref={ref}
      data-sticky-enquiry-bar
      className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-2 border-t border-line bg-surface px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_28px_-16px_rgba(0,0,0,.3)] lg:hidden"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-[16px]">
          From <strong className="h-bold">{priceText}</strong> {priceNote}
        </span>
        <span className="text-sm text-muted">Final quote on WhatsApp</span>
      </div>
      <a href={waLink(message)} target="_blank" rel="noopener" data-wa-label={label} className="btn btn-primary">
        <WhatsAppIcon />
        {cta}
      </a>
    </div>
  );
}

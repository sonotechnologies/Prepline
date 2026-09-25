'use client';

import { useState } from 'react';
import { WhatsAppIcon } from './icons';
import { site } from '@/content/site';
import { formatDate } from '@/lib/format';
import { messages, waLink } from '@/lib/whatsapp';

type Props = {
  slug: string;
  title: string;
  durationDays: number;
  priceFrom: number;
  currency: 'NGN' | 'USD';
  priceText: string;
  priceNote: string;
  url: string;
  dates: { iso: string; note?: string }[];
};

/** Desktop sticky sidebar card. Picking a date adds it to the WhatsApp message. Nothing is booked. */
export function PriceCard(p: Props) {
  const [picked, setPicked] = useState(p.dates[0]?.iso);
  const href = waLink(messages.package(p, p.url, picked));

  return (
    <div className="card flex flex-col gap-5 p-7 shadow-[0_24px_48px_-32px_rgba(0,0,0,.35)]">
      <div className="flex flex-col gap-0.5">
        <span className="text-[16px]">From</span>
        <span className="h-bold text-[34px] leading-[1.1]">{p.priceText}</span>
        <span className="text-[16px]">{p.priceNote}</span>
        <span className="mt-1 text-sm text-muted">Final quote on WhatsApp</span>
      </div>
      {p.dates.length > 0 ? (
        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="mb-2 text-sm font-semibold">Next dates</legend>
          {p.dates.map((d) => {
            const sel = d.iso === picked;
            return (
              <button
                key={d.iso}
                type="button"
                aria-pressed={sel}
                onClick={() => setPicked(d.iso)}
                className={`flex min-h-12 items-center justify-between rounded-sm border-[1.5px] px-4 text-left text-[16px] text-ink ${
                  sel ? 'border-primary bg-tint' : 'border-line bg-transparent'
                }`}
              >
                <span>{formatDate(d.iso)}</span>
                {d.note && <span className="text-sm text-muted">{d.note}</span>}
              </button>
            );
          })}
        </fieldset>
      ) : (
        <p className="text-muted">Dates on request. Private trips can start on any date.</p>
      )}
      <a href={href} target="_blank" rel="noopener" data-wa-label={`price-card:${p.slug}`} className="btn btn-primary min-h-[52px]">
        <WhatsAppIcon />
        Chat about this package
      </a>
      <a href={`tel:${site.phone.tel}`} className="-mt-2 flex min-h-[44px] items-center justify-center font-semibold text-link">
        Or call {site.phone.display}
      </a>
      <p className="border-t border-line pt-4 text-sm text-muted">
        Nothing is paid on this website. We confirm dates, hotels and your quote with you on WhatsApp.
      </p>
    </div>
  );
}

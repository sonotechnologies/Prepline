'use client';

import { useEffect, useId, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { WhatsAppIcon } from './icons';
import { nextMonths } from '@/lib/format';
import { messages, waLink } from '@/lib/whatsapp';

const TRIP_TYPES = ['Any trip type', 'Holiday', 'Honeymoon', 'Family', 'Group or corporate', 'Adventure', 'Religious'];

/** Hero trip finder. The button is a link whose WhatsApp message follows the form state. */
export function TripFinderForm({ destinations }: { destinations: string[] }) {
  const id = useId();
  const [destination, setDestination] = useState('Anywhere');
  const [type, setType] = useState(TRIP_TYPES[0]);
  const [month, setMonth] = useState('Any month');
  const [travellers, setTravellers] = useState(2);
  // Months are built at build time, then refreshed in the browser so they never go stale.
  const [months, setMonths] = useState(() => nextMonths(12));
  useEffect(() => setMonths(nextMonths(12)), []);

  const href = waLink(messages.tripFinder({ destination, type, month, travellers }));

  return (
    <form
      aria-label="Trip finder"
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-1 items-end gap-4 rounded-card bg-surface p-5 text-ink shadow-float md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:p-6"
    >
      <label className="field-label">
        Destination
        <select className="field" value={destination} onChange={(e) => setDestination(e.target.value)}>
          {['Anywhere', ...destinations, 'Somewhere else'].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <label className="field-label">
        Trip type
        <select className="field" value={type} onChange={(e) => setType(e.target.value)}>
          {TRIP_TYPES.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <label className="field-label">
        Month
        <select className="field" value={month} onChange={(e) => setMonth(e.target.value)}>
          {['Any month', ...months].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <div className="field-label" role="group" aria-labelledby={`${id}-trav`}>
        <span id={`${id}-trav`}>Travellers</span>
        <div className="flex h-12 items-center overflow-hidden rounded-field border border-line2 bg-[var(--field-bg)]">
          <button
            type="button"
            onClick={() => setTravellers((t) => Math.max(1, t - 1))}
            disabled={travellers <= 1}
            aria-label="Fewer travellers"
            className="flex h-full w-12 items-center justify-center text-primary disabled:opacity-40"
          >
            <Minus size={20} aria-hidden="true" />
          </button>
          <output aria-live="polite" className="flex-1 text-center text-[16px] font-semibold">
            {travellers}
          </output>
          <button
            type="button"
            onClick={() => setTravellers((t) => Math.min(50, t + 1))}
            disabled={travellers >= 50}
            aria-label="More travellers"
            className="flex h-full w-12 items-center justify-center text-primary disabled:opacity-40"
          >
            <Plus size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        data-wa-label="trip-finder"
        className="btn btn-primary whitespace-nowrap md:col-span-2 lg:col-span-1"
      >
        <WhatsAppIcon />
        Plan my trip on WhatsApp
      </a>
    </form>
  );
}

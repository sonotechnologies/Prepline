'use client';

import { useId, useState, type FormEvent } from 'react';
import { Minus, Plus } from 'lucide-react';
import { trackWhatsApp } from './Analytics';
import { WhatsAppIcon } from './icons';
import { messages, waLink, type CustomTrip } from '@/lib/whatsapp';

const BUDGETS = [
  'Under ₦1,500,000 per person',
  '₦1,500,000 to ₦3,000,000 per person',
  '₦3,000,000 to ₦5,000,000 per person',
  'Over ₦5,000,000 per person',
  'Not sure yet'
];
const STYLES = ['Holiday', 'Honeymoon', 'Family', 'Group or corporate', 'Adventure', 'Religious', 'Luxury'];

/** Controlled form with light validation. Submitting opens WhatsApp with the answers. Nothing is stored. */
export function CustomTripForm({ destinations }: { destinations: string[] }) {
  const id = useId();
  const [f, setF] = useState<CustomTrip>({ destination: '', dates: '', travellers: 2, budget: '', style: '', notes: '' });
  const [error, setError] = useState('');
  const set = <K extends keyof CustomTrip>(k: K, v: CustomTrip[K]) => setF((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.destination.trim()) {
      setError('Tell us where you would like to go.');
      document.getElementById(`${id}-dest`)?.focus();
      return;
    }
    setError('');
    const url = waLink(messages.customTrip({ ...f, destination: f.destination.trim(), notes: f.notes.trim() }));
    trackWhatsApp('custom-trip');
    const win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Custom trip" className="card flex flex-col gap-5 p-6 lg:p-8">
      <label className="field-label">
        <span>
          Destination <span aria-hidden="true" className="text-[var(--btn)]">*</span>
        </span>
        <input
          id={`${id}-dest`}
          className="field"
          list={`${id}-dest-list`}
          value={f.destination}
          onChange={(e) => set('destination', e.target.value)}
          placeholder="A country, city or region"
          required
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          autoComplete="off"
        />
        <datalist id={`${id}-dest-list`}>
          {destinations.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
        {error && (
          <span id={`${id}-err`} role="alert" className="text-[15px] font-medium text-[#B42318]">
            {error}
          </span>
        )}
      </label>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="field-label">
          Dates or month
          <input
            className="field"
            value={f.dates}
            onChange={(e) => set('dates', e.target.value)}
            placeholder="For example, mid-December, 7 nights"
          />
        </label>
        <div className="field-label" role="group" aria-labelledby={`${id}-trav`}>
          <span id={`${id}-trav`}>Travellers</span>
          <div className="flex h-12 items-center overflow-hidden rounded-field border border-line2 bg-[var(--field-bg)]">
            <button
              type="button"
              onClick={() => set('travellers', Math.max(1, f.travellers - 1))}
              disabled={f.travellers <= 1}
              aria-label="Fewer travellers"
              className="flex h-full w-12 items-center justify-center text-primary disabled:opacity-40"
            >
              <Minus size={20} aria-hidden="true" />
            </button>
            <output aria-live="polite" className="flex-1 text-center text-[16px] font-semibold">
              {f.travellers}
            </output>
            <button
              type="button"
              onClick={() => set('travellers', Math.min(200, f.travellers + 1))}
              disabled={f.travellers >= 200}
              aria-label="More travellers"
              className="flex h-full w-12 items-center justify-center text-primary disabled:opacity-40"
            >
              <Plus size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <label className="field-label">
          Budget
          <select className="field" value={f.budget} onChange={(e) => set('budget', e.target.value)}>
            <option value="">Choose a budget</option>
            {BUDGETS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Trip style
          <select className="field" value={f.style} onChange={(e) => set('style', e.target.value)}>
            <option value="">Choose a style</option>
            {STYLES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="field-label">
        Anything else?
        <textarea
          className="field"
          rows={4}
          value={f.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Hotel style, special occasions, visa questions…"
        />
      </label>

      <button type="submit" className="btn btn-primary min-h-[52px] self-stretch text-[17px] md:self-start">
        <WhatsAppIcon />
        Plan my trip on WhatsApp
      </button>
      <p className="text-sm text-muted">This opens WhatsApp with your answers. Nothing is sent until you press send.</p>
    </form>
  );
}

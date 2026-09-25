import { site } from '@/content/site';
import { formatDate, formatPrice } from './format';
import type { Pkg } from './schema';

export const waLink = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export type TripFinder = { destination: string; type: string; month: string; travellers: number };
export type CustomTrip = {
  destination: string;
  dates: string;
  travellers: number;
  budget: string;
  style: string;
  notes: string;
};

const ANY = /^(any|anywhere)/i;

export const messages = {
  general: () => `Hi ${site.name}, I'd like to make an enquiry.`,
  planTrip: () => `Hi ${site.name}, I'd like to plan a trip.`,
  package: (p: Pick<Pkg, 'title' | 'durationDays' | 'priceFrom' | 'currency'>, url: string, date?: string) =>
    `Hi, I'm interested in the ${p.title} (${p.durationDays} days), from ${formatPrice(p)}.` +
    (date ? `\nPreferred date: ${formatDate(date)}.` : '') +
    `\n${url}`,
  destination: (country: string) => `Hi, I'd like to know about trips to ${country}.`,
  service: (name: string) => `Hi, I need help with ${name.toLowerCase()}.`,
  tripFinder: (f: TripFinder) => {
    const type = ANY.test(f.type) ? '' : `${f.type.toLowerCase()} `;
    const where = ANY.test(f.destination) ? 'anywhere' : f.destination;
    const when = ANY.test(f.month) ? 'any month' : f.month;
    const who = f.travellers === 1 ? '1 person' : `${f.travellers} people`;
    return `Hi, I want a ${type}trip to ${where} around ${when} for ${who}.`;
  },
  customTrip: (f: CustomTrip) =>
    [
      "Hi, I'd like a custom trip:",
      `Destination: ${f.destination}`,
      `Dates: ${f.dates || 'Flexible'}`,
      `Travellers: ${f.travellers}`,
      `Budget: ${f.budget || 'Not sure yet'}`,
      `Style: ${f.style || 'Open to ideas'}`,
      `Notes: ${f.notes || 'None'}`
    ].join('\n')
};

/** Absolute URL for a package page, used inside WhatsApp messages. */
export const packageUrl = (slug: string) => `${site.url.replace(/\/$/, '')}/packages/${slug}/`;

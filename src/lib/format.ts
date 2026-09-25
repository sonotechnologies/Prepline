import type { Pkg } from './schema';

const SYMBOL = { NGN: '₦', USD: '$' } as const;

/** 1850000 → "₦1,850,000" */
export function formatMoney(amount: number, currency: 'NGN' | 'USD' = 'NGN') {
  return SYMBOL[currency] + Math.round(amount).toLocaleString('en-US');
}

/** "₦1,850,000" for a package */
export function formatPrice(p: Pick<Pkg, 'priceFrom' | 'currency'>) {
  return formatMoney(p.priceFrom, p.currency);
}

/** "From ₦1,850,000 per person" */
export function formatFromPrice(p: Pick<Pkg, 'priceFrom' | 'currency' | 'priceNote'>) {
  return `From ${formatPrice(p)} ${p.priceNote}`;
}

/** "5 days · 4 nights" */
export function formatDuration(p: Pick<Pkg, 'durationDays' | 'nights'>, sep = ' · ') {
  const d = `${p.durationDays} ${p.durationDays === 1 ? 'day' : 'days'}`;
  const n = `${p.nights} ${p.nights === 1 ? 'night' : 'nights'}`;
  return `${d}${sep}${n}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseIso(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m: m - 1, d };
}

/** "2026-11-14" → "14 Nov 2026" */
export function formatDate(iso: string) {
  const { y, m, d } = parseIso(iso);
  return `${d} ${MONTHS[m]} ${y}`;
}

/** ["2026-11-14","2026-12-12","2026-12-27"] → "14 Nov, 12 Dec, 27 Dec 2026" */
export function formatDateList(isos: string[]) {
  if (isos.length === 0) return '';
  const parts = isos.map(parseIso);
  const sameYear = parts.every((p) => p.y === parts[0].y);
  if (!sameYear) return isos.map(formatDate).join(', ');
  return parts.map((p) => `${p.d} ${MONTHS[p.m]}`).join(', ') + ` ${parts[0].y}`;
}

/** Departure dates from today onwards, sorted. */
export function upcomingDates(isos: string[], today = new Date()) {
  const t = today.toISOString().slice(0, 10);
  return [...isos].filter((d) => d >= t).sort();
}

/** "United Arab Emirates" with code "AE" → "🇦🇪" */
export function flagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/[A-Z]/g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

/** Next 12 months from a date: ["Sep 2026", "Oct 2026", …] */
export function nextMonths(count = 12, from = new Date()) {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(from.getFullYear(), from.getMonth() + i, 1);
    out.push(`${MONTHS[d.getMonth()]} ${d.getFullYear()}`);
  }
  return out;
}

import { site } from '@/content/site';

/** Placeholder accreditation logos. Swap the boxes for <Image> logos when the files are available. */
export function TrustLogos() {
  return (
    <ul className="flex flex-wrap gap-3" aria-label="Accreditations">
      {site.accreditations.map((l) => (
        <li
          key={l}
          className="flex h-14 w-28 items-center justify-center rounded-sm border border-dashed border-[#9CA3AF] bg-[#E5E7EB] font-mono text-sm font-semibold text-[#4B5563]"
        >
          {l}
        </li>
      ))}
    </ul>
  );
}

export const TRUST_POINTS = [
  { t: 'Licensed and accredited', d: 'Registered with the industry bodies that regulate Nigerian travel agencies.' },
  { t: 'Real people on WhatsApp', d: 'A named planner answers your messages, before and during your trip.' },
  { t: 'Clear quotes', d: 'Your quote lists every cost. What you approve is what you pay.' },
  { t: 'Visa support included', d: 'Checklists, appointments and application reviews on every package.' }
];

import type { Service } from '@/lib/schema';
import { messages, waLink } from '@/lib/whatsapp';

const BADGES = [
  { bg: 'var(--b1bg)', fg: 'var(--b1fg)' },
  { bg: 'var(--b2bg)', fg: 'var(--b2fg)' },
  { bg: 'var(--b3bg)', fg: 'var(--b3fg)' }
];

export function ServiceCard({ service, index, showDetails = false }: { service: Service; index: number; showDetails?: boolean }) {
  const badge = BADGES[index % 3];
  return (
    <div className="card card-lift flex flex-col gap-3 p-7">
      <span
        aria-hidden="true"
        className="h-bold flex h-12 w-12 items-center justify-center rounded-sm text-[16px]"
        style={{ background: badge.bg, color: badge.fg }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="h3">{service.name}</h3>
      <p className="text-muted text-pretty">{service.summary}</p>
      {showDetails && (
        <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-primary">
          {service.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
      <a
        href={waLink(messages.service(service.name))}
        target="_blank"
        rel="noopener"
        data-wa-label={`service:${service.slug}`}
        className="text-link mt-auto"
        aria-label={`Enquire on WhatsApp about ${service.name.toLowerCase()}`}
      >
        Enquire on WhatsApp
      </a>
    </div>
  );
}

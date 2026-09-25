import type { Faq } from '@/lib/schema';

/**
 * Native <details> accordion: keyboard operable and works without JavaScript.
 * The shared name makes it exclusive (one open at a time) in supporting browsers.
 */
export function FaqAccordion({
  faqs,
  name,
  openFirst = false,
  size = 'lg',
  iconBg = 'var(--surface)'
}: {
  faqs: Faq[];
  name: string;
  openFirst?: boolean;
  size?: 'lg' | 'md';
  iconBg?: string;
}) {
  return (
    <div className="flex flex-col border-t border-line2">
      {faqs.map((f, i) => (
        <details key={f.q} name={name} open={openFirst && i === 0} className="group border-b border-line2">
          <summary
            className={`h-semi flex cursor-pointer items-center justify-between gap-4 leading-[1.35] text-ink ${
              size === 'lg' ? 'min-h-16 py-4 text-lg' : 'min-h-[60px] py-3.5 text-[17px]'
            }`}
          >
            {f.q}
            <span
              aria-hidden="true"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full font-body text-xl text-primary"
              style={{ background: iconBg }}
            >
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <p className={`mr-12 text-muted text-pretty ${size === 'lg' ? 'mb-5' : 'mb-[18px]'}`}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

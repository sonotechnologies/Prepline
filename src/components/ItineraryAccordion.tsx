import type { Pkg } from '@/lib/schema';

/** Day-by-day itinerary as native <details>, with Day 1 open. */
export function ItineraryAccordion({ days }: { days: Pkg['itinerary'] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {days.map((d, i) => (
        <details
          key={d.day}
          name="itinerary"
          open={i === 0}
          className="group overflow-hidden rounded-card border border-line bg-surface open:border-primary"
        >
          <summary className="flex min-h-16 cursor-pointer items-center gap-4 px-5 py-3 text-ink">
            <span className="min-w-16 flex-none rounded-btn bg-tint px-2.5 py-1.5 text-center text-sm font-bold text-tag group-open:bg-primary group-open:text-white">
              Day {d.day}
            </span>
            <span className="h-semi flex-1 text-lg leading-[1.3]">{d.title}</span>
            <span aria-hidden="true" className="flex-none text-[22px] text-primary">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <div className="flex flex-col gap-2.5 px-5 pb-5">
            <p className="text-pretty">{d.description}</p>
            {d.meta && <span className="text-sm text-muted">{d.meta}</span>}
          </div>
        </details>
      ))}
    </div>
  );
}

'use client';

import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { site } from '@/content/site';
import type { Review } from '@/lib/schema';

function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`} className="tracking-[2px] text-star" style={{ fontSize: size }}>
      {'★★★★★'.slice(0, Math.round(rating))}
    </span>
  );
}

/** Google-style review slider: native horizontal scroll with snap, plus previous and next buttons. */
export function ReviewSlider({ reviews }: { reviews: Review[] }) {
  const track = useRef<HTMLUListElement>(null);
  const { rating, count, source, isSample } = site.reviewSummary;

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const w = card?.offsetWidth ?? el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;
    const smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: smooth });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: smooth });
    else el.scrollBy({ left: dir * w, behavior: smooth });
  };

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="container-site section-y flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-3">
          <h2 id="reviews-title" className="h2">
            What travellers say
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="h-bold text-[28px] leading-none">{rating}</span>
            <Stars rating={5} size={20} />
            <span className="text-muted">
              {count} {source} reviews
            </span>
            {isSample && <span className="sample-badge">Sample</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => step(-1)} aria-label="Previous review" className="btn btn-secondary h-12 w-12 p-0">
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next review" className="btn btn-secondary h-12 w-12 p-0">
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul
        ref={track}
        tabIndex={0}
        aria-label="Reviews"
        className="scrollbar-none -mr-4 flex lg:-mr-6 snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {reviews.map((r) => (
          <li key={r.name} className="w-full flex-none snap-start pr-4 lg:w-1/2 lg:pr-6">
            <figure className="card m-0 flex h-full flex-col gap-4 p-7">
              <div className="flex items-center justify-between gap-3">
                <Stars rating={r.rating} />
                {r.isSample && <span className="sample-badge">Sample</span>}
              </div>
              <blockquote className="m-0 text-lead leading-normal text-pretty">{r.quote}</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-tint font-bold text-tag">
                  {r.initials}
                </span>
                <span className="flex flex-col">
                  <strong className="font-semibold">{r.name}</strong>
                  <span className="text-sm text-muted">
                    {r.trip} · {source} review
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type Slide = { src: string; alt: string };

/** Three hero photos cross-fading every 5s. Stays on the first photo with reduced motion. */
export function HeroSlideshow({ slides, children }: { slides: Slide[]; children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || paused || slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [reduced, paused, slides.length]);

  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((s, i) => (
          <Image
            key={s.src}
            src={s.src}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            loading={i === 0 ? undefined : 'lazy'}
            className="object-cover transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.1)_0%,rgba(0,0,0,.6)_100%)]" aria-hidden="true" />
      <div className="container-site relative flex flex-col gap-8 pb-10 pt-[calc(56px+var(--header-h))] lg:pt-[calc(120px+var(--header-h))]">
        {children}
      {slides.length > 1 && (
        <div className="-mb-3 -ml-3 -mt-4 flex gap-1" role="group" aria-label="Hero photos">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => {
                setIndex(i);
                setPaused(true);
              }}
              aria-label={`Show photo ${i + 1}: ${s.alt}`}
              aria-pressed={i === index}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span
                className="h-2 rounded-lg transition-[width] duration-300"
                style={{ width: i === index ? 28 : 8, background: i === index ? 'var(--hi)' : 'rgba(255,255,255,.7)' }}
              />
            </button>
          ))}
        </div>
      )}
      </div>
    </>
  );
}

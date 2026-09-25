'use client';

import { useEffect, useRef, useState } from 'react';

type Stat = { value: number; suffix: string; label: string };

const DURATION = 1600;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts up from 0 over 1.6s when the strip enters the viewport. Shows final values with reduced motion or no JS. */
export function StatsCounter({ stats }: { stats: readonly Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    setProgress(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          setProgress(easeOut(t));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="container-site grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
      {stats.map((s) => {
        const final = `${s.value.toLocaleString('en-US')}${s.suffix}`;
        return (
          <div key={s.label} className="flex flex-col gap-1">
            <span className="h-bold text-stat leading-none text-stats-num tabular-nums" aria-hidden="true">
              {Math.round(s.value * progress).toLocaleString('en-US')}
              {s.suffix}
            </span>
            <span className="sr-only">{final}</span>
            <span className="text-[16px] text-stats-label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

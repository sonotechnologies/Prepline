'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

const LightboxView = dynamic(() => import('./LightboxView'), { ssr: false });

type Photo = { src: string; alt: string };

/** One large photo and four thumbnails. Any photo opens the lightbox (arrow keys, Escape, swipe). */
export function Gallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [index, setIndex] = useState(-1);
  const shown = photos.slice(0, 5);

  return (
    <>
      <div className="mt-1 grid grid-cols-4 grid-rows-[260px_76px] gap-2.5 md:grid-rows-[320px_110px] lg:grid-cols-[2fr_1fr_1fr] lg:grid-rows-[236px_236px]">
        {shown.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.alt}`}
            className={`relative cursor-zoom-in overflow-hidden border-0 p-0 photo-frame ${
              i === 0 ? 'col-span-4 rounded-arch lg:col-span-1 lg:row-span-2' : 'rounded-sm'
            }`}
          >
            <Image
              src={p.src}
              alt=""
              fill
              priority={i === 0}
              sizes={i === 0 ? '(min-width: 1024px) 640px, 100vw' : '(min-width: 1024px) 320px, 25vw'}
              className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>
      {index >= 0 && (
        <LightboxView
          slides={photos.map((p) => ({ src: p.src, alt: `${title}: ${p.alt}` }))}
          index={index}
          onClose={() => setIndex(-1)}
        />
      )}
    </>
  );
}

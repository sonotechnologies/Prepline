'use client';

import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';

// Loaded on demand by Gallery so the lightbox code stays out of the first page load.
export default function LightboxView({
  slides,
  index,
  onClose
}: {
  slides: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
}) {
  return (
    <Lightbox
      open
      index={index}
      close={onClose}
      slides={slides}
      plugins={[Counter]}
      counter={{ container: { style: { top: 0, bottom: 'unset' } } }}
      labels={{ Previous: 'Previous photo', Next: 'Next photo', Close: 'Close gallery', Lightbox: 'Photo gallery', Carousel: 'Photos' }}
      styles={{ container: { backgroundColor: 'rgba(10,10,10,.92)' } }}
    />
  );
}

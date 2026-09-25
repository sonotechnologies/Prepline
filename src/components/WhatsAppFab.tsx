'use client';

import { useEffect, useState } from 'react';
import { WhatsAppIcon } from './icons';
import { messages, waLink } from '@/lib/whatsapp';

const SEEN_KEY = 'ptt-fab-label-seen';

/**
 * Floating WhatsApp button, bottom right on every page. #25D366 is used here and nowhere else.
 * The "Chat with us" label shows for 5 seconds on a visitor's first page view.
 */
export function WhatsAppFab() {
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === '1';
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* storage blocked: show the label once per page load */
    }
    if (seen) return;
    setShowLabel(true);
    const t = setTimeout(() => setShowLabel(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const href = waLink(messages.planTrip());

  return (
    <div
      className="fixed z-[60] flex items-center gap-3"
      style={{
        right: 'calc(20px + env(safe-area-inset-right))',
        bottom: 'calc(var(--fab-bottom) + env(safe-area-inset-bottom))'
      }}
    >
      {showLabel && (
        <a
          href={href}
          target="_blank"
          rel="noopener"
          data-wa-label="fab-label"
          tabIndex={-1}
          aria-hidden="true"
          className="flex min-h-[44px] items-center whitespace-nowrap rounded-full bg-white px-[18px] text-[16px] font-semibold text-[#1E293B] no-underline shadow-[0_10px_28px_-10px_rgba(0,0,0,.45)] hover:text-[#1E293B]"
        >
          Chat with us
        </a>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener"
        data-wa-label="fab"
        aria-label="Chat with us on WhatsApp"
        className="flex h-[60px] w-[60px] flex-none items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_12px_28px_-10px_rgba(0,0,0,.5)] transition-transform duration-200 hover:scale-[1.06] hover:text-white"
      >
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}

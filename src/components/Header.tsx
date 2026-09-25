'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { WhatsAppIcon } from './icons';
import { MAIN_NAV, isActive } from './nav';
import { site } from '@/content/site';
import { messages, waLink } from '@/lib/whatsapp';

export function Header() {
  const pathname = usePathname();
  const overlayPage = pathname === '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Transparent over the home hero, solid once the page scrolls.
  useEffect(() => {
    if (!overlayPage) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlayPage]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const transparent = overlayPage && !scrolled && !open;

  return (
    <header
      className={`sticky top-0 z-30 font-body transition-[background-color,border-color] duration-300 ${
        transparent
          ? 'border-b border-transparent bg-transparent bg-[linear-gradient(180deg,rgba(0,0,0,.45),rgba(0,0,0,0))] text-white'
          : 'border-b border-line bg-[var(--header-bg)] text-ink'
      }`}
    >
      <a
        href="#main"
        className="sr-only-focusable absolute left-2 top-2 z-50 rounded-sm bg-surface px-4 py-2 font-semibold text-ink"
      >
        Skip to content
      </a>
      <div className="container-site flex h-header items-center justify-between gap-6">
        <Logo inverted={transparent} />

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {MAIN_NAV.map((n) => {
            const active = isActive(pathname, n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex min-h-[44px] items-center px-3.5 text-base font-medium no-underline xl:text-[16px] ${
                  transparent ? 'text-white hover:text-white/80' : 'text-ink hover:text-primary'
                }`}
              >
                {n.label}
                {active && (
                  <span aria-hidden="true" className="absolute inset-x-3.5 bottom-1 h-[3px] rounded-[3px] bg-[var(--accent-line)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <a
          href={`tel:${site.phone.tel}`}
          className={`hidden min-h-[44px] flex-col justify-center leading-tight no-underline lg:flex ${
            transparent ? 'text-white hover:text-white' : 'text-ink hover:text-ink'
          }`}
        >
          <span className={`text-[13px] ${transparent ? 'text-white/85' : 'text-muted'}`}>Call or WhatsApp</span>
          <span className="whitespace-nowrap text-base font-semibold">{site.phone.display}</span>
        </a>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className={`flex h-11 w-11 items-center justify-center rounded-sm border lg:hidden ${
            transparent ? 'border-white/60 bg-transparent text-white' : 'border-line bg-surface text-ink'
          }`}
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-header flex max-h-[calc(100dvh-var(--header-h))] flex-col overflow-y-auto border-b border-line bg-[var(--header-bg)] px-gut pb-6 pt-2 shadow-[0_24px_32px_-24px_rgba(0,0,0,.35)] lg:hidden"
        >
          <nav aria-label="Mobile">
            {MAIN_NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(pathname, n.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className="flex min-h-[52px] items-center justify-between border-b border-line text-[17px] font-medium text-ink no-underline aria-[current=page]:text-primary"
              >
                {n.label}
                <ArrowRight size={18} className="text-muted" aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <a href={`tel:${site.phone.tel}`} className="flex min-h-[52px] items-center font-semibold text-ink no-underline">
            Call {site.phone.display}
          </a>
          <a
            href={waLink(messages.planTrip())}
            target="_blank"
            rel="noopener"
            data-wa-label="mobile-menu"
            className="btn btn-primary mt-2 w-full"
          >
            <WhatsAppIcon />
            Plan my trip
          </a>
        </div>
      )}
    </header>
  );
}

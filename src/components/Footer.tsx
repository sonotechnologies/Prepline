import Link from 'next/link';
import { site } from '@/content/site';

const EXPLORE = [
  { label: 'Packages', href: '/packages/' },
  { label: 'Destinations', href: '/destinations/' },
  { label: 'Custom trip', href: '/custom-trip/' },
  { label: 'Services', href: '/services/' }
];
const COMPANY = [
  { label: 'About', href: '/about/' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'FAQs', href: '/#faqs' },
  { label: 'Contact', href: '/contact/' }
];

const heading = 'mb-2 text-sm font-semibold uppercase tracking-[.08em] text-hi';
const link = 'flex min-h-[44px] items-center text-on-dark no-underline hover:text-on-dark hover:underline';

export function Footer() {
  return (
    <footer className="on-dark bg-dark bg-pattern text-on-dark">
      <div className="container-site grid grid-cols-2 gap-x-8 gap-y-10 pb-10 pt-sec-y lg:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
        <div className="col-span-2 flex max-w-[360px] flex-col gap-4 lg:col-span-1">
          <div className="flex flex-col gap-1">
            <span className="h-bold text-[28px] leading-none">{site.shortName}</span>
            <span className="font-heading text-xs font-medium uppercase tracking-[.18em] text-on-dark-muted">Travel and Tours</span>
          </div>
          <p className="text-[16px] text-on-dark-muted text-pretty">{site.tagline}</p>
        </div>
        <nav aria-label="Explore" className="flex flex-col">
          <h2 className={`font-body ${heading}`}>Explore</h2>
          {EXPLORE.map((l) => (
            <Link key={l.href} href={l.href} className={link}>
              {l.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Company" className="flex flex-col">
          <h2 className={`font-body ${heading}`}>Company</h2>
          {COMPANY.map((l) => (
            <Link key={l.href} href={l.href} className={link}>
              {l.label}
            </Link>
          ))}
        </nav>
        <address className="col-span-2 flex flex-col gap-3 text-[16px] not-italic lg:col-span-1">
          <h2 className={`font-body ${heading} mb-0`}>Contact</h2>
          <a href={`tel:${site.phone.tel}`} className={`${link} font-semibold`}>
            {site.phone.display}
          </a>
          <a href={`mailto:${site.email}`} className="text-on-dark-muted underline-offset-4 hover:text-on-dark">
            {site.email}
          </a>
          <span className="text-on-dark-muted">
            {site.hours.office}
            <br />
            {site.hours.whatsapp}
          </span>
          <span className="text-on-dark-muted">
            {site.address.street}, {site.address.city}, {site.address.country}
          </span>
        </address>
      </div>
      <div className="border-t border-white/15">
        <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-6 pt-4">
          <span className="text-sm text-on-dark-muted">
            © {new Date().getFullYear()} {site.name}
          </span>
          <ul className="flex gap-2" aria-label="Social media">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener" className="flex min-h-[44px] items-center px-2.5 text-[15px] text-on-dark no-underline hover:text-on-dark hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

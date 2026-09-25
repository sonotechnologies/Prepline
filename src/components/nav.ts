export const MAIN_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Packages', href: '/packages/' },
  { label: 'Destinations', href: '/destinations/' },
  { label: 'Services', href: '/services/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' }
] as const;

export function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href.replace(/\/$/, ''));
}

import type { ReactNode } from 'react';
import { Analytics } from './Analytics';
import { Footer } from './Footer';
import { Header } from './Header';
import { JsonLd } from './JsonLd';
import { WhatsAppFab } from './WhatsAppFab';
import { assertContentValid } from '@/lib/content';
import { travelAgencyJsonLd } from '@/lib/seo';
import '@/app/globals.css';

/** Header, footer and floating WhatsApp button around every public page (not the admin). */
export function SiteChrome({ children }: { children: ReactNode }) {
  // Fails the build with a readable message if any content file is invalid.
  assertContentValid();
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
      <Analytics />
      <JsonLd data={travelAgencyJsonLd()} />
    </>
  );
}

import type { Metadata, Viewport } from 'next';
import { DM_Sans, Fraunces, Inter, Poppins } from 'next/font/google';
import { Analytics } from '@/components/Analytics';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { site } from '@/content/site';
import { absoluteUrl, travelAgencyJsonLd } from '@/lib/seo';
import './globals.css';

// Variant A fonts are preloaded. Variant B fonts only download when data-theme="b" uses them.
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-poppins', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-fraunces', display: 'swap', preload: false });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl('/')),
  title: { default: `${site.name} | Holidays, honeymoons and group tours from Lagos`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: false },
  icons: { icon: '/favicon.svg' }
};

export const viewport: Viewport = {
  themeColor: '#0E7C86',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

// Temporary preview switch: ?theme=b (or ?theme=a) sets the variant for this browser tab.
const themeScript = `(function(){try{var q=new URLSearchParams(location.search).get('theme'),s=sessionStorage;if(q==='a'||q==='b')s.setItem('ptt-theme',q);var t=q||s.getItem('ptt-theme');if(t==='a'||t==='b')document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-NG"
      data-theme="a"
      suppressHydrationWarning
      className={`${poppins.variable} ${inter.variable} ${fraunces.variable} ${dmSans.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
        <Analytics />
        <JsonLd data={travelAgencyJsonLd()} />
      </body>
    </html>
  );
}

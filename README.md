# Prepping Travel and Tours website

A static, mobile-first showcase site for a Lagos travel agency. Nothing is sold online: every call to action opens a prefilled WhatsApp chat.

Built with Next.js 15 (App Router, `output: 'export'`), TypeScript, Tailwind CSS, Zod, lucide-react and yet-another-react-lightbox. The visual design comes from the Claude Design hand-off in [`design-handoff/`](design-handoff/). This build implements **Variant A (Bright and adventurous)**. Variant B's tokens are included so the client can compare the two with `?theme=b`.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to out/
npm start          # serves out/ locally
npm run lint
npm run typecheck
```

Requires Node.js 18.18 or newer (developed on Node 22).

`npm run build` first runs `npm run check:copy`, which fails the build if banned booking or checkout wording appears anywhere in `src/`, `public/` or this README. It then validates every content file with Zod, so a typo in a package file stops the build and prints the file and field at fault.

## Change contact details

Every business detail lives in **`src/content/site.ts`**:

| Field | Used for |
| --- | --- |
| `whatsappNumber` | Every WhatsApp link on the site. International format, digits only, for example `2348012345678`. |
| `phone.display` / `phone.tel` | Header, footer, Contact page and the `tel:` links |
| `email`, `address`, `hours`, `socials` | Footer, Contact page and the structured data |
| `address.mapQuery` | The Google Maps embed on the Contact page |
| `url` | Canonical URLs, the sitemap and the package links inside WhatsApp messages. You can also set `NEXT_PUBLIC_SITE_URL` at build time. |
| `stats`, `accreditations`, `reviewSummary` | Home and About pages |
| `analytics.ga4Id`, `analytics.metaPixelId` | Optional. When a value is empty, nothing loads. |

No component hard-codes these values, so change them here and rebuild.

WhatsApp message templates are in `src/lib/whatsapp.ts`. When GA4 or the Meta Pixel is configured, every WhatsApp link click sends a `whatsapp_click` event with a label (for example `card:dubai-city-escape` or `trip-finder`).

## Add a package

1. Copy an existing file in `src/content/packages/`, for example `dubai-city-escape.json`, to `<slug>.json`. The `slug` field must match the file name.
2. Edit the fields. The schema in `src/lib/schema.ts` documents each one. The main ones:
   - `region`: one of `Africa`, `Europe`, `Asia`, `Middle East`, `Americas`, `Oceania`
   - `tripTypes`: any of `Honeymoon`, `Family`, `Adventure`, `Group`, `Religious`, `Luxury`
   - `priceFrom`: a number in naira, with no symbol or commas. It renders as "From ₦1,850,000 per person".
   - `dates`: ISO dates (`2026-11-14`). Past dates hide automatically. `dateNotes` adds labels such as "8 seats left".
   - `featured: true` shows the package on the Home page (six at most).
   - `highlights`: up to three tags for the card.
   - `itinerary`: day 1 opens by default. `meta` is the small "Meals · Stay" line.
   - `addOns`: shown as information only, never bookable.
3. Add the photos. See Images below.
4. Run `npm run build`. The package gets its own page at `/packages/<slug>/`, appears in the filters and the sitemap, and shows up under Destinations when its `country` matches a destination name.

To add a destination, add an entry to `src/content/destinations.json`. Services, reviews and the Home page FAQs live in `services.json`, `reviews.json` and `faqs.json` in the same folder.

## Images

Every image is a **striped placeholder** labelled with the photo it should become, matching the hand-off. Real photos weren't available, and Unsplash couldn't be reached from the build environment to check stock URLs. To replace a placeholder, drop a real photo at the same path:

| Path | Size | Notes |
| --- | --- | --- |
| `public/images/hero/1-3.webp` | 1920×1080 | Home hero slideshow. Keep each file under 250 KB. |
| `public/images/packages/<slug>/1-5.webp` | 1200×900 (4:3) | `1.webp` is the cover and the Open Graph image |
| `public/images/destinations/<slug>.webp` | 600×800 (3:4) | Destination tiles |
| `public/images/gallery/1-8.webp` | 600 px wide | Home trip gallery (mixed aspect ratios) |
| `public/images/about/team.webp` | 1200×900 | About page |
| `public/images/og-default.jpg` | 1200×630 | Default social share image |

Use WebP at about 70–80% quality. `npm run images` creates placeholders only for files that are missing, so it never overwrites real photos. `npm run images -- --force` regenerates every placeholder.

Accreditation logos (IATA, NANTA, NCAA) are grey placeholder boxes in `src/components/TrustLogos.tsx`. Reviews are labelled "Sample" until `isSample` is set to `false` in `reviews.json` and `site.ts`.

## Themes

Design tokens for both variants live in `src/styles/themes.css` as CSS variables, which `tailwind.config.ts` maps to utility classes. `<html data-theme="a">` is the default.

- **Client preview:** add `?theme=b` to any URL. The choice lasts for the browser tab, and `?theme=a` switches back.
- **Switch permanently:** change `data-theme="a"` in `src/app/layout.tsx`. Once the client confirms Variant A, you can delete the Variant B block, the preview script in `layout.tsx` and the Fraunces and DM Sans fonts.

Layout tokens: spacing scale 4, 8, 12, 16, 24, 32, 48, 64, 96. Breakpoints 640, 768, 1024, 1280. Content max width 1312 px. Page gutter is 20 px on mobile, 32 px on tablet and 64 px on desktop.

Motion (Variant A): cards lift 6 px on hover (250 ms), stats count up over 1.6 s when they scroll into view, and the hero cross-fades every 5 s. With `prefers-reduced-motion`, cards don't lift, stats show their final values and the hero stays on the first photo.

## Deploy

**Vercel:** import the repository. The framework preset (Next.js) works as-is, and Vercel serves the static export. Set `NEXT_PUBLIC_SITE_URL` to the live domain.

**Netlify:** build command `npm run build`, publish directory `out`, and set `NEXT_PUBLIC_SITE_URL`.

**Any static host:** upload the contents of `out/`. Serve it with gzip or brotli compression and long cache headers on `/_next/static/`.

## Where the build differs from the hand-off

- **Primary button colour.** White on coral `#FF6B4A` fails WCAG AA, and so does the hand-off's suggested `#D9431F` (4.4:1). Buttons use `#CC3F1C` (4.9:1). Coral stays as the accent (the nav underline).
- **Secondary buttons and stats labels** use the darker link teal `#0B6A73` and white, because the design values measured 4.3:1 on the tint and teal backgrounds.
- **Package flags** use emoji flags (from `countryCode`) instead of the design's two-letter code badge. Windows shows the letters instead.
- **The header** is transparent over the Home hero and turns solid on scroll, as the build brief asks.
- **Trip types and filters** follow the build brief's schema (Honeymoon, Family, Adventure, Group, Religious, Luxury) instead of the prototype's labels.

## Quality checks run

- `npm run build`: 20 static routes, all 8 seed packages validated, no errors
- Lighthouse mobile, served with compression: Home and `/packages/dubai-city-escape/` each score Performance 93, Accessibility 100, Best Practices 100, SEO 100
- Tested at 360, 390 and 1440 px with no horizontal scroll. Checks covered filter combinations with URL sync and shared links, the empty state, the mobile filter sheet, the lightbox keyboard controls, the date picker message, `?theme=b`, and the sticky bar never covering the WhatsApp button.

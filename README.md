# Prepping Travel and Tours website

A mobile-first showcase site for a Lagos travel agency: holiday packages, visa services and destinations. Nothing is sold online. Every call to action opens a prefilled WhatsApp chat.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Zod, lucide-react, yet-another-react-lightbox and **Keystatic** (the admin at `/keystatic`). The visual design comes from the Claude Design hand-off in [`design-handoff/`](design-handoff/). This build implements **Variant A (Bright and adventurous)**. Variant B's tokens are included so the client can compare the two with `?theme=b`.

## Quick start

```bash
npm install
npm run dev          # site at http://localhost:3000, admin at http://localhost:3000/keystatic
npm run build        # production build (checks copy and validates all content)
npm start            # runs the production build locally
npm run lint
npm run typecheck
```

Requires Node.js 18.18 or newer (developed on Node 22).

`npm run build` first runs `npm run check:copy`, which fails the build if banned booking or checkout wording appears anywhere in `src/`, `public/` or this README. It then validates every content file with Zod. A mistake in any file, including one made in the admin, stops the build and prints the file and field at fault, so a broken page never goes live.

## Site map

| Route | Page | Content |
| --- | --- | --- |
| `/` | Home | `home.json`, featured packages and visas, popular destinations, services, reviews, FAQs |
| `/packages` | Packages with search, filters and sort (synced to the URL) | `packages/*.json` |
| `/packages/<slug>` | Package detail | one file per package |
| `/visas` | Visa services | `visas/*.json` |
| `/visas/<slug>` | Visa detail: processing time, documents, steps, fees | one file per visa |
| `/destinations` | Countries by region, linking to packages and visa pages | `destinations/*.json` |
| `/services`, `/about`, `/contact`, `/custom-trip` | Supporting pages | `services.json`, `about.json`, `settings.json` |
| `/photo-credits` | Pexels photographer credits | `photo-credits.json` (written by the Pexels script) |
| `/keystatic` | Admin | all of the above |

All public pages are pre-rendered at build time. Only the admin and its API run on the server.

## Admin (Keystatic)

The admin edits the JSON files in `src/content` and the images in `public/images`. The client can:

- **Trips and visas:** add, edit, duplicate or delete packages, visas and destinations, including photos, prices, departure dates, itineraries, documents and FAQs.
- **Page content:** edit the Home page hero and trip gallery, the About page, Services, Reviews and the Home page FAQs.
- **Business details:** change the WhatsApp number, phone, email, address, hours, social links, stats, the review rating and analytics IDs.

Every field has help text in the admin. Saving validates the entry, and the build validates it again.

### Admin password

`/keystatic` sits behind a password page at `/admin`, before the GitHub sign-in. Set the password in Vercel as **`ADMIN_PASSWORD`** (type **Secret**) and redeploy. A correct password signs you in for 12 hours, and changing the password signs everyone out. If `ADMIN_PASSWORD` isn't set, the live admin stays locked. Locally, the page is skipped unless `ADMIN_PASSWORD` is in your `.env`. To sign out, open `/api/admin-logout`.

### How editing works in production

In production the admin saves by **committing to the GitHub repo**. Vercel sees the commit and redeploys, so changes are live in about 1–2 minutes. Every edit is in the Git history, so any change can be undone.

Editors sign in with a GitHub account that has write access to the repo. Invite the client under **GitHub → Settings → Collaborators** (a free GitHub account is enough).

### One-time setup: connect the admin to GitHub

Locally, the admin reads and writes files on disk and needs no setup. For production:

1. **Create the GitHub App (on your computer, once).**
   ```bash
   NEXT_PUBLIC_KEYSTATIC_STORAGE=github npm run dev
   ```
   Open http://localhost:3000/keystatic. Keystatic walks you through creating a GitHub App for the repo and writes these values to `.env`:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
   When asked, **install the app** on the `sonotechnologies/prepline` repo.
2. **Add the live callback URL.** In GitHub, go to **Settings → Developer settings → GitHub Apps → (your app) → Callback URL** and add
   `https://<your-domain>/api/keystatic/github/oauth/callback`
   (also add the `*.vercel.app` address if you use it).
3. **Add environment variables in Vercel** (**Project → Settings → Environment Variables**):

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_KEYSTATIC_STORAGE` | `github` |
   | `KEYSTATIC_GITHUB_CLIENT_ID` | from `.env` |
   | `KEYSTATIC_GITHUB_CLIENT_SECRET` | from `.env` |
   | `KEYSTATIC_SECRET` | from `.env` |
   | `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | from `.env` |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-domain>` |

   In Vercel, add the three `NEXT_PUBLIC_…` variables with type **Config**: they're built into the public pages, so the build must be able to read them. Add `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET` and `KEYSTATIC_SECRET` with type **Secret**: the admin reads them only while the site is running. If `NEXT_PUBLIC_KEYSTATIC_STORAGE` isn't visible to the build, `/keystatic` shows "Admin not connected yet".
4. Redeploy, open `https://<your-domain>/keystatic` and sign in with GitHub.

`.env` holds secrets. It's git-ignored; never commit it.

The repo is `sonotechnologies/prepline` by default. To point the admin at another repo, set `NEXT_PUBLIC_KEYSTATIC_GITHUB_OWNER` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO`.

### For developers: keep the admin and the site in step

`keystatic.config.ts` (the admin fields) and `src/lib/schema.ts` (the Zod validation) describe the same JSON. Keystatic refuses to open a file with keys it doesn't know, so when you add a field, add it to both. Keystatic stores images at `public/images/<section>/<slug>/<field>.webp` (and `…/<field>/<index>/<subfield>.webp` inside lists). Keep that layout when you add files by hand.

## Visas

Each visa entry has: country and flag, what it's good for (tourism, business, family), our starting fee ("From ₦150,000 per applicant", then "Final quote on WhatsApp"), a note on government fees, processing time, validity, length of stay, entries, appointment details, required documents, our step-by-step process, what's included and not included, and FAQs.

The six seed visas (UK, US, Canada, Schengen, UAE, South Africa) are **sample content**. Their fees, processing times and document lists are reasonable placeholders. The client must check them against current embassy guidance and their own prices before launch, and can do so in the admin.

Visa pages link from the navigation, the Home page, the "Visa assistance" service card, and each matching country on the Destinations page.

## Images and Pexels

Until real photos are added, every image is a striped placeholder labelled with the photo it should become. Placeholders carry a hidden marker in their metadata. Photos uploaded in the admin or fetched from Pexels don't have it, so the scripts below never overwrite them.

Put your key in a `.env` file in the project folder (it is git-ignored, never commit it):

```
PEXELS_API_KEY=your-key-here
```

```bash
npm run images:pexels -- --dry-run   # preview the photo each image would get
npm run images:pexels                # replace every placeholder
npm run images:pexels -- --only=visas
npm run images                       # make placeholders for any missing image
```

You can also set `PEXELS_API_KEY` in the terminal instead of using `.env`:

```bash
export PEXELS_API_KEY="your-key"          # Mac / Linux
$env:PEXELS_API_KEY="your-key"            # Windows PowerShell
set PEXELS_API_KEY=your-key               # Windows Command Prompt
```

- Get a free key at https://www.pexels.com/api/.
- Each image is searched using its description (the alt text). To use a better search for a specific image, add it to `scripts/pexels-queries.json` (image path → search words).
- Photos are cropped to size and saved as WebP. Hero photos are kept under 250 KB.
- Photographer credits are saved to `src/content/photo-credits.json` and listed at `/photo-credits`, which the footer links to ("Photos from Pexels"), as Pexels asks.
- Review the photos before committing. A bad match is easiest to fix by uploading a different photo in the admin, or by adding a query override, deleting the file, running `npm run images` and then the Pexels script again.

Accreditation logos (IATA, NANTA, NCAA) are grey boxes named in **Business details → Accreditations**. Reviews show "Sample" labels until **Reviews are samples** is unticked in Business details.

## WhatsApp

Every button builds its link from **Business details → WhatsApp number**. Message templates are in `src/lib/whatsapp.ts` (package, visa, destination, service, trip finder and custom trip). When GA4 or the Meta Pixel is set in Business details, every WhatsApp click sends a `whatsapp_click` event with a label such as `card:dubai-city-escape` or `visa-card:uk-standard-visitor-visa`.

## Themes

Design tokens for both variants live in `src/styles/themes.css` as CSS variables, which `tailwind.config.ts` maps to utility classes. `<html data-theme="a">` is the default.

- **Client preview:** add `?theme=b` to any URL. The choice lasts for the browser tab, and `?theme=a` switches back.
- **Switch permanently:** change `data-theme="a"` in `src/app/layout.tsx`. Once Variant A is confirmed, you can delete the Variant B block, the preview script and the Fraunces and DM Sans fonts.

Layout tokens: spacing scale 4, 8, 12, 16, 24, 32, 48, 64, 96. Breakpoints 640, 768, 1024, 1280. Content max width 1312 px. Motion: cards lift 6 px on hover, stats count up when they scroll into view, and the hero cross-fades every 5 s. All of it is disabled with `prefers-reduced-motion`.

## Deploy (Vercel)

1. Import the repo in Vercel. The Next.js preset works with the default build settings.
2. Add the environment variables from the admin setup above (at least `NEXT_PUBLIC_SITE_URL`).
3. Every push to `main`, including every save in the admin, redeploys automatically.

Because the admin needs a server route, the site is no longer a pure static export. It runs as a normal Next.js app, with all public pages pre-rendered.

## Where the build differs from the hand-off

- **Primary button colour.** White on coral `#FF6B4A` fails WCAG AA, and so does the hand-off's suggested `#D9431F` (4.4:1). Buttons use `#CC3F1C` (4.9:1). Coral stays as the accent (the nav underline).
- **Secondary buttons and stats labels** use the darker link teal `#0B6A73` and white, because the design values measured 4.3:1 on the tint and teal backgrounds.
- **Flags** are emoji flags (from the country code) instead of the design's two-letter code badge. Windows shows the letters instead.
- **The header** is transparent over the Home hero and turns solid on scroll, as the build brief asks.
- **Visas** are a new section that isn't in the original hand-off. They reuse the package card and detail-page components and styling.

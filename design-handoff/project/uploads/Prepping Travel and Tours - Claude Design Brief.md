# Prepping Travel and Tours — Claude Design Brief

Sep 24, 2026 · @Sono Technologies

Paste this into Claude Design. Design the Prepping Travel and Tours website in two visual variants so the client can choose one.

## Context and hard rules

The website is a showcase for a Nigerian travel and tours agency that takes trips to any country. It sells nothing online. Every action leads to a WhatsApp chat.

**Hard rules**

- No cart, checkout, payment, booking calendar or seat picker anywhere.
- Never write "Book now". Call-to-action buttons say "Chat about this package", "Enquire on WhatsApp" or "Plan my trip".
- Prices always read "From ₦X per person" and are followed by "Final quote on WhatsApp".
- A floating WhatsApp button, in WhatsApp green #25D366, sits bottom right on every screen. No other element uses that green.
- Design mobile first, at 390px wide, then desktop at 1440px. Most visitors arrive from Instagram and WhatsApp on phones.
- Body text is at least 16px, tap targets at least 44px, and text contrast meets WCAG AA.
- Features are modelled on myvisang.com, but its visual design must not be copied.

## Screens to design

Design the first three screens in both variants. Once the client picks a variant, design the rest in that variant only.

| Priority | Screen | Both variants? |
| --- | --- | --- |
| 1 | Home | Yes |
| 2 | Package detail (Dubai City Escape) | Yes |
| 3 | Our Packages (grid with filters) | Yes |
| 4 | Destinations | Chosen variant only |
| 5 | Custom Trip form | Chosen variant only |
| 6 | Services, About, Contact | Chosen variant only |

Each screen needs a mobile (390px) frame and a desktop (1440px) frame.

### Home: sections top to bottom

1. Header: logo, nav (Home, Packages, Destinations, Services, About, Contact), phone number. Hamburger menu on mobile.
2. Hero: full-bleed destination photo, headline, subline, and a trip-finder card (Destination, Trip type, Month, Travellers). The button reads "Plan my trip on WhatsApp".
3. Stats strip: 10+ years, 5,000+ happy travellers, 60+ countries, 98% satisfaction.
4. Featured packages: six package cards, with a "View all packages" link.
5. How it works: three steps (Pick a package, Chat with us on WhatsApp, Pack your bags).
6. Popular destinations: six country tiles, each with an "Ask about {Country}" link.
7. Services: six cards (Holiday packages, Honeymoons, Group and corporate tours, Visa assistance, Flights and hotels, Travel insurance).
8. Why choose us: a row of accreditation logos plus four trust points.
9. Reviews: a Google-style review slider showing the star rating and review count.
10. Trip gallery: a masonry grid of client trip photos.
11. FAQs: an accordion with six questions.
12. Final CTA band: "Ready to go somewhere?" with a WhatsApp button.
13. Footer: tagline, links, contact details, hours, address, socials.

### Package detail

- Gallery: one large image with four thumbnails; opens in a lightbox.
- Title block: country flag, title, duration, "From ₦X per person", next dates.
- Quick facts row: Duration, Group size, Best season, Visa needed.
- Overview paragraph.
- Day-by-day itinerary as an accordion, with Day 1 open.
- Included and Excluded in two columns, with tick and cross icons.
- Optional add-ons, labelled as information only.
- Package FAQs and related packages.
- Desktop: a sticky sidebar card with price, dates and the "Chat about this package" button.
- Mobile: a sticky bottom bar with the price and the WhatsApp button.

### Our Packages

- Page header, a search bar, and filter chips for Region, Trip type, Duration and Price. On mobile, filters open as a bottom sheet.
- A sort dropdown and a results count.
- A package card grid: three columns on desktop, one on mobile.
- A final "Can't find your destination? Plan a custom trip" card.
- An empty state for when the filters match nothing.

## Variant A and Variant B

Both variants use the same layout, content and components. They differ only in colour, type, shape, imagery and motion.

| Token | Variant A: Bright and adventurous | Variant B: Warm and local |
| --- | --- | --- |
| Mood | Energetic, sunny, "let's go" | Rich, welcoming, proudly Nigerian with a global reach |
| Primary | Ocean teal #0E7C86 | Deep terracotta #B4532A |
| Accent | Sunset coral #FF6B4A | Palm green #1F6B45 |
| Highlight | Sun yellow #FFC857 | Gold #D9A441 |
| Light background | Off-white #F8FAFB | Warm cream #FBF5EC |
| Dark sections | Navy #0B2233 | Deep brown #2B1A12 |
| Body text | Slate #1E293B | Espresso #2B1A12 |
| Heading font | Poppins Bold, tight tracking | Fraunces SemiBold |
| Body font | Inter | DM Sans |
| Corner radius | 20px on cards; pill-shaped buttons | 12px on cards; arch-topped image frames |
| Decoration | Wavy section dividers, playful icon badges | Thin Adire-inspired line patterns in dividers and backgrounds |
| Photography | Saturated, wide landscapes and action shots | Warm-toned photos of Nigerian travellers, families and couples abroad |
| Motion (annotate it) | Cards lift on hover, counters count up, hero slideshow | Slow fades, gentle parallax, dividers draw in |
| Hero headline | "The world is waiting. Where to next?" | "From Lagos to anywhere, we plan it, you enjoy it." |
| Primary button | Coral pill, white text | Terracotta, gold 1px border |

**Type scale (both variants):** H1 56/40px (desktop/mobile), H2 40/30px, H3 24/20px, body 17/16px, small 14px.

## Components, content and deliverables

**Components to define (with their states)**

- Package card: image, flag and country, title, duration, "From" price, three highlight tags, Enquire button. States: default, hover, featured badge.
- Buttons: primary, secondary, WhatsApp (icon plus label), text link. States: default, hover, pressed, focus.
- Floating WhatsApp button, with a "Chat with us" label that shows on first load.
- Filter chip and filter bottom sheet (mobile).
- Itinerary accordion item and FAQ accordion item, in open and closed states.
- Stats counter, review card, destination tile, service card, trust-logo row.
- Trip-finder form fields: select, date or month picker, number stepper.
- Sticky package bar (mobile) and sticky price card (desktop).

**Placeholder content**

- Brand: a text logo, "Prepping Travel and Tours", in each variant's heading font.
- Packages: Dubai City Escape (5 days, from ₦1,850,000), Zanzibar Honeymoon (6 days, from ₦2,400,000), Paris and Amsterdam Explorer (8 days, from ₦4,900,000), Cape Town and Garden Route (7 days, from ₦3,200,000), Bali Island Retreat (7 days, from ₦3,600,000), Istanbul and Cappadocia (6 days, from ₦2,750,000).
- Reviews: three sample reviews, each clearly labelled "Sample".
- Accreditation logos: grey placeholder boxes labelled IATA, NANTA, NCAA.
- Phone: +234 800 000 0000.

**Deliverables**

1. Home, Package detail and Our Packages in Variant A and Variant B, each in mobile and desktop frames.
2. A component sheet and a colour and type token sheet for each variant.
3. After the client chooses: the remaining screens in the chosen variant.
4. Hand-off notes for Claude Code: token names, spacing scale (4, 8, 12, 16, 24, 32, 48, 64, 96), breakpoints (640, 768, 1024, 1280) and motion notes.

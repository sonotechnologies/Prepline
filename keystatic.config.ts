import { collection, config, fields, singleton } from '@keystatic/core';

/**
 * Admin (Keystatic) configuration. Every field here maps 1:1 to the JSON files in src/content,
 * which the site validates with Zod in src/lib/schema.ts. Keep the two in step: Keystatic
 * refuses to open a file that has keys it does not know.
 *
 * Storage: local files in development; the GitHub repo in production once the GitHub App
 * variables are set (see README "Admin"). Saving in production commits to GitHub and Vercel redeploys.
 */

const REGIONS = ['Africa', 'Europe', 'Asia', 'Middle East', 'Americas', 'Oceania'].map((r) => ({ label: r, value: r }));
const TRIP_TYPES = ['Honeymoon', 'Family', 'Adventure', 'Group', 'Religious', 'Luxury'].map((t) => ({ label: t, value: t }));
const VISA_PURPOSES = ['Tourism', 'Business', 'Visiting family', 'Study', 'Work', 'Transit'].map((t) => ({ label: t, value: t }));
const CURRENCIES = [
  { label: 'Naira (₦)', value: 'NGN' },
  { label: 'US dollars ($)', value: 'USD' }
];

const image = (directory: string, label = 'Photo', description?: string) =>
  fields.image({ label, directory: `public/images/${directory}`, publicPath: `/images/${directory}/`, description });

const alt = () =>
  fields.text({
    label: 'Photo description',
    description: 'Describe the photo for people using screen readers, e.g. "Burj Khalifa at dusk".'
  });

const faqList = (label = 'FAQs') =>
  fields.array(
    fields.object({
      q: fields.text({ label: 'Question', validation: { isRequired: true } }),
      a: fields.text({ label: 'Answer', multiline: true, validation: { isRequired: true } })
    }),
    { label, itemLabel: (p) => p.fields.q.value || 'Question' }
  );

const textList = (label: string, description?: string) =>
  fields.array(fields.text({ label }), { label, description, itemLabel: (p) => p.value || label });

const storage =
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === 'github'
    ? ({
        kind: 'github',
        repo: {
          owner: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_OWNER ?? 'sonotechnologies',
          name: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO ?? 'prepline'
        }
      } as const)
    : ({ kind: 'local' } as const);

export default config({
  storage,
  ui: {
    brand: { name: 'Prepline Travel and Tours' },
    navigation: {
      'Trips and visas': ['packages', 'visas', 'destinations'],
      'Page content': ['home', 'about', 'services', 'reviews', 'faqs'],
      Business: ['settings']
    }
  },

  collections: {
    packages: collection({
      label: 'Packages',
      slugField: 'title',
      path: 'src/content/packages/*',
      format: { data: 'json' },
      columns: ['country', 'priceFrom'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: { label: 'Web address', description: 'Used in the link: /packages/<web-address>. Changing it breaks old links.' }
        }),
        featured: fields.checkbox({ label: 'Featured', description: 'Shown on the home page (first six) and with a "Featured" badge.' }),
        country: fields.text({
          label: 'Country',
          description: 'For several countries, join with "and", e.g. "France and Netherlands".',
          validation: { isRequired: true }
        }),
        countryCode: fields.text({ label: 'Country code', description: 'Two letters, for the flag, e.g. AE, GB, TZ.', validation: { length: { min: 2, max: 2 } } }),
        city: fields.text({ label: 'City or area (optional)', description: 'Shown before the country, e.g. "Dubai".' }),
        region: fields.select({ label: 'Region', options: REGIONS, defaultValue: 'Africa' }),
        tripTypes: fields.multiselect({ label: 'Trip types', options: TRIP_TYPES }),
        durationDays: fields.integer({ label: 'Days', validation: { isRequired: true, min: 1 } }),
        nights: fields.integer({ label: 'Nights', validation: { isRequired: true, min: 0 } }),
        priceFrom: fields.integer({
          label: 'Starting price',
          description: 'Numbers only, no commas. Shown as "From ₦1,850,000 per person".',
          validation: { isRequired: true, min: 1 }
        }),
        currency: fields.select({ label: 'Currency', options: CURRENCIES, defaultValue: 'NGN' }),
        priceNote: fields.text({ label: 'Price note', defaultValue: 'per person' }),
        departures: fields.array(
          fields.object({
            date: fields.date({ label: 'Departure date', validation: { isRequired: true } }),
            note: fields.text({ label: 'Label (optional)', description: 'e.g. "8 seats left"' })
          }),
          {
            label: 'Departure dates',
            description: 'Past dates hide automatically.',
            itemLabel: (p) => [p.fields.date.value, p.fields.note.value].filter(Boolean).join(' · ') || 'Date'
          }
        ),
        gallery: fields.array(fields.object({ image: image('packages'), alt: alt() }), {
          label: 'Photos',
          description: 'The first photo is the cover. Use 4 to 5 landscape photos (4:3).',
          itemLabel: (p) => p.fields.alt.value || 'Photo',
          validation: { length: { min: 1 } }
        }),
        highlights: fields.array(fields.text({ label: 'Highlight' }), {
          label: 'Highlights',
          description: 'Up to three short tags for the card, e.g. "Desert safari".',
          itemLabel: (p) => p.value || 'Highlight',
          validation: { length: { max: 3 } }
        }),
        overview: fields.text({ label: 'Overview', multiline: true, validation: { isRequired: true } }),
        itinerary: fields.array(
          fields.object({
            day: fields.integer({ label: 'Day number', validation: { isRequired: true, min: 1 } }),
            title: fields.text({ label: 'Title', validation: { isRequired: true } }),
            description: fields.text({ label: 'Description', multiline: true }),
            meta: fields.text({ label: 'Meals and stay (optional)', description: 'e.g. "Meals: breakfast · Stay: 4-star hotel"' })
          }),
          { label: 'Day by day', itemLabel: (p) => `Day ${p.fields.day.value ?? '?'}: ${p.fields.title.value}` }
        ),
        included: textList('Included'),
        excluded: textList('Not included'),
        addOns: fields.array(
          fields.object({
            title: fields.text({ label: 'Add-on', validation: { isRequired: true } }),
            priceFrom: fields.integer({ label: 'Starting price (optional)' })
          }),
          {
            label: 'Optional add-ons',
            description: 'Information only. Visitors mention them on WhatsApp.',
            itemLabel: (p) => p.fields.title.value || 'Add-on'
          }
        ),
        faqs: faqList('Package FAQs'),
        quickFacts: fields.object(
          {
            groupSize: fields.text({ label: 'Group size', defaultValue: '2 to 16 travellers' }),
            bestSeason: fields.text({ label: 'Best season' }),
            visaRequired: fields.checkbox({ label: 'Visa needed for Nigerian passports', defaultValue: true })
          },
          { label: 'Quick facts' }
        )
      }
    }),

    visas: collection({
      label: 'Visas',
      slugField: 'title',
      path: 'src/content/visas/*',
      format: { data: 'json' },
      columns: ['country', 'priceFrom'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', description: 'e.g. "UK Standard Visitor Visa"', validation: { isRequired: true } },
          slug: { label: 'Web address', description: 'Used in the link: /visas/<web-address>.' }
        }),
        featured: fields.checkbox({ label: 'Featured', description: 'Shown on the home page.' }),
        country: fields.text({ label: 'Country or area', description: 'e.g. "United Kingdom" or "Schengen Area".', validation: { isRequired: true } }),
        countryCode: fields.text({
          label: 'Country code',
          description: 'Two letters for the flag, e.g. GB. Use EU for Schengen.',
          validation: { length: { min: 2, max: 2 } }
        }),
        region: fields.select({ label: 'Region', options: REGIONS, defaultValue: 'Europe' }),
        purposes: fields.multiselect({ label: 'Good for', options: VISA_PURPOSES }),
        priceFrom: fields.integer({
          label: 'Starting price',
          description: 'Our fee, numbers only. Shown as "From ₦150,000 per applicant".',
          validation: { isRequired: true, min: 1 }
        }),
        currency: fields.select({ label: 'Currency', options: CURRENCIES, defaultValue: 'NGN' }),
        priceNote: fields.text({ label: 'Price note', defaultValue: 'per applicant' }),
        feeNote: fields.text({ label: 'Government fee note', description: 'e.g. "Embassy visa fee paid separately".' }),
        processingTime: fields.text({ label: 'Typical processing time', validation: { isRequired: true } }),
        validity: fields.text({ label: 'Visa validity' }),
        stay: fields.text({ label: 'Length of stay' }),
        entries: fields.text({ label: 'Entries', description: 'e.g. "Single or multiple"' }),
        appointment: fields.text({ label: 'Appointment', description: 'e.g. "Biometrics at a visa centre in Lagos or Abuja"' }),
        image: image('visas', 'Photo', 'Landscape photo of the country (4:3).'),
        imageAlt: alt(),
        summary: fields.text({ label: 'Card summary', description: 'One or two sentences for the visa card.', multiline: true, validation: { isRequired: true } }),
        overview: fields.text({ label: 'Overview', multiline: true, validation: { isRequired: true } }),
        requirements: textList('Documents you need'),
        steps: fields.array(
          fields.object({
            title: fields.text({ label: 'Step', validation: { isRequired: true } }),
            description: fields.text({ label: 'Details', multiline: true })
          }),
          { label: 'How we handle it', itemLabel: (p) => p.fields.title.value || 'Step' }
        ),
        included: textList('Our service includes'),
        excluded: textList('Not included'),
        faqs: faqList('Visa FAQs')
      }
    }),

    destinations: collection({
      label: 'Destinations',
      slugField: 'name',
      path: 'src/content/destinations/*',
      format: { data: 'json' },
      columns: ['region'],
      schema: {
        name: fields.slug({
          name: { label: 'Country', description: 'Must match the country used on packages and visas.', validation: { isRequired: true } }
        }),
        short: fields.text({ label: 'Short name', description: 'Used in "Ask about …", e.g. "the UAE".', validation: { isRequired: true } }),
        countryCode: fields.text({ label: 'Country code', validation: { length: { min: 2, max: 2 } } }),
        region: fields.select({ label: 'Region', options: REGIONS, defaultValue: 'Africa' }),
        popular: fields.checkbox({ label: 'Popular', description: 'Shown on the home page (first six).' }),
        image: image('destinations', 'Photo', 'Portrait photo (3:4).'),
        imageAlt: alt()
      }
    })
  },

  singletons: {
    settings: singleton({
      label: 'Business details',
      path: 'src/content/settings',
      format: { data: 'json' },
      schema: {
        whatsappNumber: fields.text({
          label: 'WhatsApp number',
          description: 'International format, digits only, no "+" or spaces, e.g. 2348012345678. Every WhatsApp button uses this.',
          validation: { isRequired: true, length: { min: 8 } }
        }),
        phoneDisplay: fields.text({ label: 'Phone number (as shown)', description: 'e.g. +234 801 234 5678', validation: { isRequired: true } }),
        phoneTel: fields.text({ label: 'Phone number (for dialling)', description: 'e.g. +2348012345678', validation: { isRequired: true } }),
        email: fields.text({ label: 'Email', validation: { isRequired: true } }),
        street: fields.text({ label: 'Street address', validation: { isRequired: true } }),
        city: fields.text({ label: 'City', defaultValue: 'Lagos' }),
        country: fields.text({ label: 'Country', defaultValue: 'Nigeria' }),
        mapQuery: fields.text({ label: 'Map search', description: 'What to search on Google Maps for the Contact page map.' }),
        officeHours: fields.text({ label: 'Office hours' }),
        whatsappHours: fields.text({ label: 'WhatsApp hours' }),
        tagline: fields.text({ label: 'Footer tagline', multiline: true }),
        socials: fields.array(
          fields.object({
            label: fields.text({ label: 'Name', validation: { isRequired: true } }),
            href: fields.url({ label: 'Link', validation: { isRequired: true } })
          }),
          { label: 'Social media', itemLabel: (p) => p.fields.label.value || 'Link' }
        ),
        stats: fields.array(
          fields.object({
            value: fields.integer({ label: 'Number', validation: { isRequired: true } }),
            suffix: fields.text({ label: 'After the number', description: 'e.g. "+" or "%"' }),
            label: fields.text({ label: 'Label', validation: { isRequired: true } })
          }),
          { label: 'Stats strip', itemLabel: (p) => `${p.fields.value.value ?? ''}${p.fields.suffix.value} ${p.fields.label.value}` }
        ),
        accreditations: textList('Accreditations', 'Shown as logo boxes.'),
        rating: fields.text({ label: 'Review rating', description: 'e.g. 4.9' }),
        reviewCount: fields.integer({ label: 'Number of reviews' }),
        reviewSource: fields.text({ label: 'Review source', defaultValue: 'Google' }),
        reviewsAreSamples: fields.checkbox({
          label: 'Reviews are samples',
          description: 'Untick once real reviews are added. Removes the "Sample" labels.',
          defaultValue: true
        }),
        foundedYear: fields.integer({ label: 'Year founded' }),
        ga4Id: fields.text({ label: 'Google Analytics 4 ID (optional)', description: 'e.g. G-XXXXXXX. Leave empty to load nothing.' }),
        metaPixelId: fields.text({ label: 'Meta Pixel ID (optional)' })
      }
    }),

    home: singleton({
      label: 'Home page',
      path: 'src/content/home',
      format: { data: 'json' },
      schema: {
        heroHeadline: fields.text({ label: 'Headline', validation: { isRequired: true } }),
        heroSubline: fields.text({ label: 'Subline', multiline: true }),
        heroSlides: fields.array(
          fields.object({ image: image('home', 'Photo', 'Wide landscape photo, at least 1920×1080, under 250 KB.'), alt: alt() }),
          {
            label: 'Hero photos',
            description: 'Cross-fade every 5 seconds. Use 1 to 3.',
            itemLabel: (p) => p.fields.alt.value || 'Photo',
            validation: { length: { min: 1, max: 5 } }
          }
        ),
        gallery: fields.array(
          fields.object({
            image: image('home'),
            alt: alt(),
            shape: fields.select({
              label: 'Shape',
              options: [
                { label: 'Portrait (3:4)', value: '3/4' },
                { label: 'Tall (4:5)', value: '4/5' },
                { label: 'Square', value: '1/1' },
                { label: 'Landscape (4:3)', value: '4/3' }
              ],
              defaultValue: '1/1'
            })
          }),
          { label: 'Trip gallery', description: 'Client trip photos, shown as a masonry grid.', itemLabel: (p) => p.fields.alt.value || 'Photo' }
        )
      }
    }),

    about: singleton({
      label: 'About page',
      path: 'src/content/about',
      format: { data: 'json' },
      schema: {
        intro: fields.text({ label: 'Intro line', multiline: true }),
        story: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'Our story',
          itemLabel: (p) => p.value.slice(0, 60) || 'Paragraph'
        }),
        image: image('about'),
        imageAlt: alt()
      }
    }),

    services: singleton({
      label: 'Services',
      path: 'src/content/services',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            name: fields.text({ label: 'Service', validation: { isRequired: true } }),
            summary: fields.text({ label: 'Summary', multiline: true, validation: { isRequired: true } }),
            details: textList('Details'),
            link: fields.text({ label: 'Link (optional)', description: 'Page to link to, e.g. /visas' })
          }),
          { label: 'Services', itemLabel: (p) => p.fields.name.value || 'Service' }
        )
      }
    }),

    reviews: singleton({
      label: 'Reviews',
      path: 'src/content/reviews',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            quote: fields.text({ label: 'Review', multiline: true, validation: { isRequired: true } }),
            name: fields.text({ label: 'Name', validation: { isRequired: true } }),
            trip: fields.text({ label: 'Trip' }),
            rating: fields.integer({ label: 'Stars', defaultValue: 5, validation: { min: 1, max: 5 } })
          }),
          { label: 'Reviews', itemLabel: (p) => p.fields.name.value || 'Review' }
        )
      }
    }),

    faqs: singleton({
      label: 'Home page FAQs',
      path: 'src/content/faqs',
      format: { data: 'json' },
      schema: { items: faqList('Questions') }
    })
  }
});

import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { FaqAccordion } from '@/components/FaqAccordion';
import { PageHeader, WaveDivider } from '@/components/SectionHeading';
import { VisaCard } from '@/components/VisaCard';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { getAllVisas } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { messages } from '@/lib/whatsapp';

export const metadata: Metadata = pageMetadata({
  title: 'Visa services',
  description:
    'Visa applications from Lagos for the UK, US, Canada, the Schengen Area, Dubai and more. Document checklists, forms, appointments and a full review before you submit.',
  path: '/visas'
});

const STEPS = [
  { t: 'Free assessment', d: 'Tell us where you are going and why. We tell you honestly how strong your case looks.' },
  { t: 'Documents and forms', d: 'A checklist made for you, the application form, a cover letter and a full review.' },
  { t: 'Appointment and decision', d: 'We book your appointment, prepare you for it and track your application.' }
];

const FAQS = [
  {
    q: 'Can you guarantee my visa?',
    a: 'No agency can guarantee a visa. The decision belongs to the embassy or immigration service. What we guarantee is a complete, consistent and well-evidenced application.'
  },
  {
    q: 'Are government visa fees included in your price?',
    a: 'Usually not. Our price covers our service. Each visa page says which government and visa centre fees you pay separately, and your quote on WhatsApp lists every cost.'
  },
  {
    q: 'I was refused before. Can you help?',
    a: 'Yes. Send us your refusal letter on WhatsApp. We explain what needs to change before you apply again.'
  },
  {
    q: 'Do you handle study and work visas?',
    a: 'We handle visitor, business and family visit visas directly, and can refer study and work applications to licensed partners. Ask us on WhatsApp.'
  }
];

export default function VisasPage() {
  const visas = getAllVisas();
  return (
    <>
      <PageHeader
        title="Visa services"
        text="We prepare your application, book your appointment and check every document before you submit. Every price is a starting price, and your final quote comes on WhatsApp."
      />

      <section className="container-site flex flex-col gap-6 py-sec-y" aria-labelledby="visa-list">
        <h2 id="visa-list" className="sr-only">
          Visas we handle
        </h2>
        <p className="text-[16px] text-muted">
          {visas.length === 1 ? '1 visa service' : `${visas.length} visa services`}
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visas.map((v) => (
            <VisaCard key={v.slug} visa={v} />
          ))}
          <div className="on-dark flex min-h-[360px] flex-col justify-end gap-3.5 rounded-card bg-dark bg-pattern p-8 text-on-dark">
            <h2 className="h3 text-on-dark">Need a visa for another country?</h2>
            <p className="text-on-dark-muted text-pretty">
              We help with visas for most countries. Tell us where you are going and when.
            </p>
            <WhatsAppButton message={messages.visaGeneral()} label="visas-other" className="w-full">
              Enquire on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </section>

      <WaveDivider />

      <section className="container-site section-y flex flex-col gap-10" aria-labelledby="visa-how">
        <h2 id="visa-how" className="h2">
          How visa help works
        </h2>
        <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="card flex flex-col gap-3 p-7">
              <span
                aria-hidden="true"
                className="h-bold flex h-12 w-12 items-center justify-center rounded-btn bg-step text-xl text-step-text"
              >
                {i + 1}
              </span>
              <h3 className="h3">{s.t}</h3>
              <p className="text-muted text-pretty">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-tint bg-pattern-light" aria-labelledby="visa-faq">
        <div className="container-site section-y grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col items-start gap-4">
            <h2 id="visa-faq" className="h2">
              Visa questions
            </h2>
            <p className="text-muted">Not sure which visa you need? Ask us on WhatsApp.</p>
            <WhatsAppButton variant="secondary" icon={false} message={messages.visaGeneral()} label="visas-faq">
              Enquire on WhatsApp
            </WhatsAppButton>
          </div>
          <FaqAccordion faqs={FAQS} name="visa-faq" openFirst />
        </div>
      </section>

      <CtaBand
        title="Planning the whole trip?"
        text="Pair your visa with one of our packages, or tell us where you want to go and we plan the rest."
      />
    </>
  );
}

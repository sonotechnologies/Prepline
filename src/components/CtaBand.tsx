import { WhatsAppButton } from './WhatsAppButton';
import { messages } from '@/lib/whatsapp';

export function CtaBand({
  title = 'Ready to go somewhere?',
  text = 'Tell us where and when. We reply on WhatsApp with options and a quote.'
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="on-dark bg-dark bg-pattern text-on-dark">
      <div className="container-site section-y flex flex-col items-center gap-5 text-center">
        <h2 className="h1 leading-[1.1] text-on-dark">{title}</h2>
        <p className="max-w-[520px] text-lead text-on-dark-muted text-pretty">{text}</p>
        <WhatsAppButton message={messages.planTrip()} label="cta-band" className="min-h-[52px] px-7 text-[17px]">
          Enquire on WhatsApp
        </WhatsAppButton>
      </div>
    </section>
  );
}

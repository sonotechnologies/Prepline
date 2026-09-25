import type { ReactNode } from 'react';

export function SectionHeading({ title, text, id, action }: { title: string; text?: string; id?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex max-w-[640px] flex-col gap-2">
        <h2 id={id} className="h2">
          {title}
        </h2>
        {text && <p className="text-muted text-pretty">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function WaveDivider() {
  return (
    <div aria-hidden="true" className="px-gut">
      <div className="divider mx-auto max-w-site" />
    </div>
  );
}

export function PageHeader({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return (
    <section className="bg-tint bg-pattern-light">
      <div className="container-site flex flex-col gap-3.5 pb-10 pt-10 lg:pt-[72px]">
        <h1 className="h1">{title}</h1>
        {text && <p className="max-w-[620px] text-lead text-muted text-pretty">{text}</p>}
        {children}
      </div>
    </section>
  );
}

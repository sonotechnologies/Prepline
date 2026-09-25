// Local WhatsApp glyph (the speech-bubble mark from the design hand-off). Other icons come from lucide-react.
export function WhatsAppIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.4-4.4A8.5 8.5 0 1 1 20.5 11.5z" />
    </svg>
  );
}

export function TickIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="flex-none">
      <circle cx="12" cy="12" r="11" fill="var(--ok-bg)" />
      <path d="M7 12.5l3.2 3L17 9" fill="none" stroke="var(--ok)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CrossIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="flex-none">
      <circle cx="12" cy="12" r="11" fill="var(--line)" />
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke="var(--muted)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

import type { ReactNode } from 'react';
import { WhatsAppIcon } from './icons';
import { waLink } from '@/lib/whatsapp';

type Props = {
  message: string;
  /** Sent with the whatsapp_click analytics event. */
  label: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'link';
  icon?: boolean;
  className?: string;
};

/** Every WhatsApp call to action goes through this component (or waLink directly). */
export function WhatsAppButton({ message, label, children, variant = 'primary', icon = variant === 'primary', className = '' }: Props) {
  const base = variant === 'link' ? 'text-link' : `btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`;
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener"
      data-wa-label={label}
      className={`${base} ${className}`}
    >
      {icon && <WhatsAppIcon />}
      {children}
    </a>
  );
}

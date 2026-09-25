import { flagEmoji } from '@/lib/format';

export function Flag({ code, country, className = '' }: { code: string; country: string; className?: string }) {
  return (
    <span role="img" aria-label={`Flag of ${country}`} className={`text-[1.25em] leading-none ${className}`}>
      {flagEmoji(code)}
    </span>
  );
}

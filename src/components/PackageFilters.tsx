'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react';

export type FilterGroup = {
  key: 'region' | 'type' | 'duration' | 'price';
  name: string;
  options: { value: string; label: string }[];
};

type Props = {
  groups: FilterGroup[];
  values: Partial<Record<FilterGroup['key'], string>>;
  onPick: (key: FilterGroup['key'], value: string) => void;
};

/** Desktop filter chip with a dropdown of options. Escape and outside clicks close it. */
function FilterChip({ group, value, onPick }: { group: FilterGroup; value?: string; onPick: Props['onPick'] }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const active = group.options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex min-h-[44px] items-center gap-2 rounded-btn border-[1.5px] px-4 text-[16px] font-medium ${
          active ? 'border-primary bg-primary text-white' : 'border-line2 bg-surface text-ink'
        }`}
      >
        {active ? active.label : group.name}
        <ChevronDown size={16} aria-hidden="true" />
        {active && <span className="sr-only">(filter: {group.name})</span>}
      </button>
      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={group.name}
          className="absolute left-0 top-[52px] z-20 flex min-w-[260px] flex-col rounded-sm border border-line bg-surface p-2 shadow-sheet"
        >
          {group.options.map((o) => {
            const sel = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={sel}
                onClick={() => {
                  onPick(group.key, o.value);
                  setOpen(false);
                  button.current?.focus();
                }}
                className={`flex min-h-[44px] items-center justify-between gap-3 rounded-[calc(var(--rs)-4px)] px-3 text-left text-[16px] text-ink hover:bg-tint ${
                  sel ? 'bg-tint' : ''
                }`}
              >
                {o.label}
                {sel && <Check size={18} className="text-primary" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FilterChips({ groups, values, onPick }: Props) {
  return (
    <>
      {groups.map((g) => (
        <FilterChip key={g.key} group={g} value={values[g.key]} onPick={onPick} />
      ))}
    </>
  );
}

/** Mobile filters in a native modal <dialog> styled as a bottom sheet (focus is trapped, Escape closes). */
export function FilterSheet({
  groups,
  values,
  onPick,
  onClear,
  resultCount,
  activeCount
}: Props & { onClear: () => void; resultCount: number; activeCount: number }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
        className="btn btn-secondary px-[18px] lg:hidden"
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        Filters{activeCount ? ` (${activeCount})` : ''}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="sheet lg:hidden"
        onClick={(e) => {
          // A click on the backdrop lands on the <dialog> element itself.
          if (e.target === dialog.current) close();
        }}
      >
        <div className="flex max-h-[86dvh] flex-col">
          <div className="flex justify-center pt-2.5" aria-hidden="true">
            <span className="h-1 w-10 rounded bg-line2" />
          </div>
          <div className="flex items-center justify-between px-5 py-2">
            <h2 id={titleId} className="text-[22px]">
              Filters
            </h2>
            <button type="button" onClick={close} aria-label="Close filters" className="flex h-11 w-11 items-center justify-center text-ink">
              <X size={26} aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-col gap-[22px] overflow-y-auto px-5 pb-2">
            {groups.map((g) => (
              <fieldset key={g.key} className="m-0 flex flex-col gap-2.5 border-0 p-0">
                <legend className="mb-2.5 text-[16px] font-semibold">{g.name}</legend>
                <div className="flex flex-wrap gap-2">
                  {g.options.map((o) => {
                    const sel = values[g.key] === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        aria-pressed={sel}
                        onClick={() => onPick(g.key, o.value)}
                        className={`min-h-[44px] rounded-btn border-[1.5px] px-3.5 text-[15px] font-medium ${
                          sel ? 'border-primary bg-primary text-white' : 'border-line2 bg-transparent text-ink'
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="flex items-center gap-3 border-t border-line px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3.5">
            <button type="button" onClick={onClear} className="text-link min-h-12 px-3">
              Clear all
            </button>
            <button type="button" onClick={close} className="btn btn-primary flex-1">
              {resultCount === 1 ? 'Show 1 package' : `Show ${resultCount} packages`}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

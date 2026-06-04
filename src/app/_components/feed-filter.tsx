"use client";

import { useEffect, useRef, useState } from 'react';
import { Check, SlidersHorizontal } from 'lucide-react';

export type FeedFilter = 'now' | 'latest' | 'trending';

export const FEED_FILTERS: { id: FeedFilter; label: string }[] = [
  { id: 'now', label: 'Now' },
  { id: 'latest', label: 'Latest' },
  { id: 'trending', label: 'Trending' },
];

// Why: the home Today's prices, /items, and market details items lists need the
// same Now / Latest / Trending filter affordance; sharing this component keeps
// them in sync.
export function FeedFilterPopover({
  active,
  onChange,
  className = '',
}: {
  active: FeedFilter;
  onChange: (next: FeedFilter) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeLabel = FEED_FILTERS.find((f) => f.id === active)?.label ?? 'Now';

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-background hover:bg-muted/60 transition-colors"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        {activeLabel}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-20 w-40 rounded-lg border bg-card shadow-md py-1"
        >
          {FEED_FILTERS.map((f) => {
            const isActive = f.id === active;
            return (
              <button
                key={f.id}
                role="menuitemradio"
                aria-checked={isActive}
                type="button"
                onClick={() => {
                  onChange(f.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  isActive ? 'text-primary font-medium' : 'hover:bg-muted/60'
                }`}
              >
                <span>{f.label}</span>
                {isActive ? <Check className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Generic shape: anything with a numeric price and an optional last_update
// timestamp can be filtered by Now / Latest / Trending without coupling to a
// specific product type.
export type FilterableItem = {
  price: number;
  discountPrice?: number | null;
  lastUpdateTs?: number;
};

// Why: each list has its own item shape; rather than force a common type, the
// caller passes an accessor function that pulls the comparable fields from its
// row. T is the row type, F is the value returned.
// How: pass `(row) => ({ price, discountPrice, lastUpdateTs })` so this helper
// can sort/filter without seeing the rest of the row's fields.
export function applyFeedFilter<T>(
  rows: T[],
  filter: FeedFilter,
  accessor: (row: T) => FilterableItem,
): T[] {
  if (filter === 'now') return rows;

  if (filter === 'latest') {
    return [...rows].sort((a, b) => {
      const at = accessor(a).lastUpdateTs ?? 0;
      const bt = accessor(b).lastUpdateTs ?? 0;
      return bt - at;
    });
  }

  // trending: only rows where discount < price; sorted by savings % desc.
  const withSavings = rows
    .map((row) => {
      const v = accessor(row);
      const price = v.price ?? 0;
      const discount = v.discountPrice ?? 0;
      if (!discount || !price || discount >= price) return null;
      return { row, savings: ((price - discount) / price) * 100 };
    })
    .filter((entry): entry is { row: T; savings: number } => entry !== null)
    .sort((a, b) => b.savings - a.savings);

  return withSavings.map((entry) => entry.row);
}

export function parseTs(value?: string | null): number {
  if (!value) return 0;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : 0;
}

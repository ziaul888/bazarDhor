"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Store } from 'lucide-react';
import { useMarketItems, useRandomMarkets } from '@/lib/api/hooks/useMarkets';
import { PriceRow, type PriceRowItem } from './price-row';

const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';

type SelectedMarket = { id: string; name: string };

function resolveImage(value?: string | null) {
  if (!value) return undefined;
  const t = value.trim();
  if (!t) return undefined;
  if (t.startsWith('http') || t.startsWith('/')) return t;
  return `${IMAGE_BASE_URL}${t}`;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toStringValue(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
}

export function MarketSpotlight() {
  const [selected, setSelected] = useState<SelectedMarket | null>(null);
  const { data: markets, isLoading: isMarketsLoading } = useRandomMarkets();
  const {
    data: itemsData,
    isLoading: isItemsLoading,
  } = useMarketItems(selected?.id ?? '', { page: 1, limit: 8 });

  const rows = useMemo<PriceRowItem[]>(() => {
    if (!selected) return [];
    const items = itemsData?.data ?? [];
    return items.map((item) => {
      const raw = item as unknown as Record<string, unknown>;
      const unit = (raw.unit ?? null) as Record<string, unknown> | null;
      const marketPrices = Array.isArray(raw.market_prices)
        ? raw.market_prices
        : Array.isArray(raw.marketPrices)
          ? raw.marketPrices
          : [];
      const latest = (marketPrices[0] ?? null) as Record<string, unknown> | null;
      return {
        id: toStringValue(raw.id ?? raw.item_id ?? raw.product_id, '0'),
        name: toStringValue(raw.name ?? raw.title, 'Item'),
        marketName: selected.name,
        marketId: selected.id,
        price: toNumber(
          latest?.discount_price ?? latest?.price ?? raw.price ?? raw.current_price,
          0
        ),
        image: resolveImage(toStringValue(raw.image_path ?? raw.image ?? raw.image_url)),
        unit:
          toStringValue(unit?.symbol ?? unit?.name ?? raw.unit, undefined as unknown as string) ||
          undefined,
      };
    });
  }, [itemsData?.data, selected]);

  return (
    <section className="px-4 pt-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold">Browse by market</h2>
        <MarketPicker
          markets={markets ?? []}
          isLoading={isMarketsLoading}
          selected={selected}
          onSelect={setSelected}
        />
      </div>

      {!selected ? (
        <div className="rounded-xl border bg-card px-4 py-6 text-center">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-2">
            <Store className="h-5 w-5" />
          </span>
          <p className="text-sm font-medium">Pick a market to see its items</p>
          <p className="text-xs text-muted-foreground mt-1">
            Choose a nearby market above to preview today&apos;s items and prices from there.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card divide-y overflow-hidden">
          {isItemsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
          ) : rows.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-medium">No items yet from {selected.name}.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Be the first to submit a price.
              </p>
            </div>
          ) : (
            rows.map((r) => <PriceRow key={`${r.id}-${r.marketId ?? 'na'}`} item={r} />)
          )}
        </div>
      )}
    </section>
  );
}

type RawMarket = NonNullable<ReturnType<typeof useRandomMarkets>['data']>[number];

function MarketPicker({
  markets,
  isLoading,
  selected,
  onSelect,
}: {
  markets: RawMarket[];
  isLoading: boolean;
  selected: SelectedMarket | null;
  onSelect: (next: SelectedMarket | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-1.5 max-w-[180px] px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-background hover:bg-muted/60 transition-colors"
      >
        <Store className="h-3.5 w-3.5" />
        <span className="truncate">{selected ? selected.name : 'Select market'}</span>
        <ChevronDown className="h-3.5 w-3.5 flex-none" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-20 w-64 rounded-lg border bg-card shadow-md overflow-hidden"
        >
          <div className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
            Nearby markets
          </div>
          <div className="max-h-64 overflow-y-auto pb-1">
            {isLoading ? (
              <div className="px-3 py-4 text-xs text-muted-foreground">Loading markets…</div>
            ) : markets.length === 0 ? (
              <div className="px-3 py-4 text-xs text-muted-foreground">
                No nearby markets yet.
              </div>
            ) : (
              <>
                {selected ? (
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(null);
                      setOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted/60 transition-colors"
                  >
                    Clear selection
                  </button>
                ) : null}
                {markets.map((m) => {
                  const isActive = selected?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      role="menuitemradio"
                      aria-checked={isActive}
                      type="button"
                      onClick={() => {
                        onSelect({ id: m.id, name: m.name });
                        setOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                        isActive ? 'text-primary font-medium' : 'hover:bg-muted/60'
                      }`}
                    >
                      <span className="truncate">{m.name}</span>
                      {isActive ? <Check className="h-4 w-4 flex-none" /> : null}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/5 bg-muted rounded" />
        <div className="h-2.5 w-1/3 bg-muted rounded" />
      </div>
      <div className="h-6 w-16 bg-muted rounded" />
    </div>
  );
}

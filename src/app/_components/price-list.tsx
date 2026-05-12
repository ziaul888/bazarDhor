"use client";

import { useMemo, useState } from 'react';
import { useRandomProducts } from '@/lib/api/hooks/useMarkets';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { PriceRow, type PriceRowItem } from './price-row';

const PAGE_SIZE = 20;

function mapToRow(p: NonNullable<ReturnType<typeof useRandomProducts>['data']>[number]): PriceRowItem | null {
  const lowest = p.market_prices?.[0];
  if (!lowest) return null;
  const hasDiscount = lowest.discount_price && lowest.discount_price > 0;
  return {
    id: p.id,
    name: p.name,
    marketId: lowest.market?.id,
    marketName: lowest.market?.name || 'Local market',
    price: hasDiscount ? lowest.discount_price! : (lowest.price || 0),
    unit: p.unit?.symbol || p.unit?.name || undefined,
  };
}

export function PriceList() {
  const { data: products, isLoading } = useRandomProducts();
  const { data: categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const allRows = useMemo(() => {
    if (!products) return [];
    if (activeCategory === 'all') {
      return products.map(mapToRow).filter((r): r is PriceRowItem => r !== null);
    }
    return products
      .filter((p) => String(p.category?.id) === activeCategory)
      .map(mapToRow)
      .filter((r): r is PriceRowItem => r !== null);
  }, [products, activeCategory]);

  const rows = allRows.slice(0, visible);
  const hasMore = allRows.length > rows.length;

  return (
    <section>
      <h2 className="px-4 pt-6 text-base font-semibold">Today&apos;s prices</h2>
      {/* Category chips */}
      <div className="px-4 pt-3 pb-2 sticky top-0 z-10 bg-background">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          <Chip
            label="All"
            active={activeCategory === 'all'}
            onClick={() => {
              setActiveCategory('all');
              setVisible(PAGE_SIZE);
            }}
          />
          {categories?.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              active={activeCategory === String(c.id)}
              onClick={() => {
                setActiveCategory(String(c.id));
                setVisible(PAGE_SIZE);
              }}
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y border-y bg-card">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
        ) : rows.length === 0 ? (
          <EmptyState />
        ) : (
          rows.map((r) => <PriceRow key={`${r.id}-${r.marketId ?? 'na'}`} item={r} />)
        )}
      </div>

      {/* Load more */}
      {hasMore ? (
        <div className="px-4 py-6 text-center">
          <button
            type="button"
            onClick={() => setVisible((n) => n + PAGE_SIZE)}
            className="text-sm text-primary font-medium hover:underline"
          >
            Load more
          </button>
        </div>
      ) : null}
    </section>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-none px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-muted-foreground border-border hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/5 bg-muted rounded" />
        <div className="h-2.5 w-1/3 bg-muted rounded" />
      </div>
      <div className="h-6 w-16 bg-muted rounded" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-4 py-16 text-center">
      <p className="text-sm font-medium">No prices submitted in your zone yet.</p>
      <p className="text-xs text-muted-foreground mt-1">
        Tap the ＋ button to be the first.
      </p>
    </div>
  );
}

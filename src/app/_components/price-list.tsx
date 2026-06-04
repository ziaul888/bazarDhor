"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRandomProducts } from '@/lib/api/hooks/useMarkets';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { PriceRow, type PriceRowItem } from './price-row';
import {
  FeedFilterPopover,
  applyFeedFilter,
  parseTs,
  type FeedFilter,
} from './feed-filter';

type Product = NonNullable<ReturnType<typeof useRandomProducts>['data']>[number];
type CategoryFilter = 'all' | string;

const PAGE_SIZE = 8;
const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';

function resolveImage(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `${IMAGE_BASE_URL}${trimmed}`;
}

function mapToRow(p: Product): PriceRowItem | null {
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
    image: resolveImage(p.image_path),
  };
}

export function PriceList() {
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('now');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: categories } = useCategories();

  // Server-side filter params — backend may not honor all yet, but the frontend
  // sends them so behavior upgrades automatically once supported.
  const { data: products, isLoading } = useRandomProducts({
    sort_by: feedFilter,
    ...(activeCategory !== 'all' ? { category_id: activeCategory } : {}),
  });

  const allRows = useMemo(() => {
    if (!products) return [];
    // Defensive client-side fallback: if the backend ignores the params we
    // still produce the right UX. Once the API honors them, these are no-ops.
    const list: Product[] =
      activeCategory === 'all'
        ? products
        : products.filter((p) => String(p.category?.id) === activeCategory);

    const sorted = applyFeedFilter(list, feedFilter, (p) => {
      const mp = p.market_prices?.[0];
      return {
        price: mp?.price ?? 0,
        discountPrice: mp?.discount_price ?? null,
        lastUpdateTs: parseTs(mp?.last_update),
      };
    });

    return sorted.map(mapToRow).filter((r): r is PriceRowItem => r !== null);
  }, [products, activeCategory, feedFilter]);

  const rows = allRows.slice(0, visible);
  const hasMore = allRows.length > rows.length;

  const handleSortChange = (next: FeedFilter) => {
    setFeedFilter(next);
    setVisible(PAGE_SIZE);
  };

  const handleCategoryChange = (next: CategoryFilter) => {
    setActiveCategory(next);
    setVisible(PAGE_SIZE);
  };

  // Why: replaces the manual "Load more" with an IntersectionObserver so the
  // next page renders as the user scrolls near the bottom.
  // How: observe a sentinel that's only present when there's more to show;
  // each intersection bumps `visible` by PAGE_SIZE. The observer only fires
  // on intersection *state changes* (not continuously), so after a page loads
  // the user has to scroll past the previous bottom for the next page —
  // exactly the infinite-scroll behavior we want.
  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible((n) => n + PAGE_SIZE);
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <section>
      <div className="flex items-center justify-between px-4 pt-6">
        <h2 className="text-base font-semibold">Today&apos;s prices</h2>
        <FeedFilterPopover active={feedFilter} onChange={handleSortChange} />
      </div>

      {/* Category chips — desktop only */}
      <div className="hidden lg:block px-4 pt-3 pb-2 sticky top-0 z-10 bg-background">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          <Chip
            label="All"
            active={activeCategory === 'all'}
            onClick={() => handleCategoryChange('all')}
          />
          {categories?.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              active={activeCategory === String(c.id)}
              onClick={() => handleCategoryChange(String(c.id))}
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

      {/* Infinite-scroll sentinel + tail state */}
      {hasMore ? (
        <div ref={sentinelRef} className="px-4 py-6 flex justify-center" aria-hidden>
          {Array.from({ length: 3 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      ) : rows.length > 0 ? (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">
          You&apos;ve reached the end.
        </p>
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

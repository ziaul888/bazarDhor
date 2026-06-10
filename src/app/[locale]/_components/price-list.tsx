"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInfiniteRandomProducts, useRandomProducts } from '@/lib/api/hooks/useMarkets';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { PriceRow, type PriceRowItem } from './price-row';
import { FeedFilterPopover, type FeedFilter } from './feed-filter';

type Product = NonNullable<ReturnType<typeof useRandomProducts>['data']>[number];
type CategoryFilter = 'all' | string;

const PAGE_LIMIT = 10;
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

function mapToRow(p: Product, fallbackMarketName: string): PriceRowItem | null {
  const lowest = p.market_prices?.[0];
  if (!lowest) return null;
  const hasDiscount = lowest.discount_price && lowest.discount_price > 0;
  const trend = (lowest as { price_trend?: string }).price_trend;
  const normalizedTrend: PriceRowItem['priceTrend'] =
    trend === 'up' || trend === 'down' || trend === 'stable' ? trend : undefined;
  return {
    id: p.id,
    name: p.name,
    marketId: lowest.market?.id,
    marketName: lowest.market?.name || fallbackMarketName,
    price: hasDiscount ? lowest.discount_price! : (lowest.price || 0),
    unit: p.unit?.symbol || p.unit?.name || undefined,
    image: resolveImage(p.image_path),
    lastUpdate: lowest.last_update || undefined,
    priceTrend: normalizedTrend,
  };
}

export function PriceList() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('random');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: categories } = useCategories();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRandomProducts({
    sort_by: feedFilter,
    limit: PAGE_LIMIT,
    ...(activeCategory !== 'all' ? { category_id: activeCategory } : {}),
  });

  const rows = useMemo(() => {
    // Why: with sort=random + infinite scroll, the API can return the same
    // product across multiple pages. Dedupe by product id so React keys stay
    // unique and the user doesn't see the same row twice.
    const seen = new Set<string>();
    const unique: Product[] = [];
    for (const p of data?.pages.flat() ?? []) {
      const key = String(p.id);
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(p);
    }
    const fallbackName = tCommon('na');
    return unique
      .map((p) => mapToRow(p, fallbackName))
      .filter((r): r is PriceRowItem => r !== null);
  }, [data, tCommon]);

  const handleSortChange = (next: FeedFilter) => {
    setFeedFilter(next);
  };

  const handleCategoryChange = (next: CategoryFilter) => {
    setActiveCategory(next);
  };

  // Why: load the next page from the API whenever the sentinel scrolls into
  // view. The observer fires on intersection state changes, so after a page
  // resolves the user has to scroll past the new bottom to trigger the next.
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section>
      <div className="flex items-center justify-between px-4 pt-6 pb-3 lg:pb-0">
        <h2 className="text-base font-semibold">{t('todaysPrices')}</h2>
        <FeedFilterPopover active={feedFilter} onChange={handleSortChange} />
      </div>

      {/* Category chips — sticky below the navbar (h-14 mobile, h-16 sm+) */}
      <div className="px-4 pt-3 pb-2 sticky top-[55px] sm:top-16 z-20 bg-background border-b">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          <Chip
            label={tCommon('all')}
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
          <EmptyState title={t('todaysPricesEmpty')} hint={t('todaysPricesEmptyHint')} />
        ) : (
          rows.map((r) => <PriceRow key={`${r.id}-${r.marketId ?? 'na'}`} item={r} />)
        )}
      </div>

      {/* Infinite-scroll sentinel + tail state */}
      {hasNextPage ? (
        <div ref={sentinelRef} className="divide-y border-y bg-card" aria-hidden>
          {Array.from({ length: 3 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      ) : rows.length > 0 ? (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">
          {tCommon('reachedEnd')}
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

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="px-4 py-16 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}

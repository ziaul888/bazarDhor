"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useMarketItems } from '@/lib/api/hooks/useMarkets';
import { Pagination } from '@/components/ui/pagination';
import { PriceRow, type PriceRowItem } from '@/app/_components/price-row';
import {
  FeedFilterPopover,
  applyFeedFilter,
  parseTs,
  type FeedFilter,
} from '@/app/_components/feed-filter';

type ItemRow = PriceRowItem & {
  rawPrice: number;
  rawDiscount: number | null;
  lastUpdateTs: number;
};

interface MarketItemsListProps {
  marketId: string;
}

const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';

const toImageUrl = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `${IMAGE_BASE_URL}${trimmed}`;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const toStringValue = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
};

export function MarketItemsList({ marketId }: MarketItemsListProps) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('now');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string }[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data: itemsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useMarketItems(marketId, {
    page,
    limit: 15,
    search: debouncedSearch || undefined,
    category: activeCategory || undefined,
  });
  const pagination = itemsData?.pagination;

  // Why: categories shown as chips must be market-wise, not global. We derive
  // them from the items returned for this market.
  // How: only refresh the chip list while the "All" filter is active so the
  // chips stay stable while a category is selected; otherwise the chip list
  // would collapse to just the active category.
  useEffect(() => {
    if (activeCategory) return;
    const items = itemsData?.data ?? [];
    if (items.length === 0) return;
    const seen = new Map<string, string>();
    for (const item of items) {
      const raw = item as unknown as Record<string, unknown>;
      const cat = (raw.category ?? null) as Record<string, unknown> | null;
      const id = cat?.id != null ? String(cat.id) : '';
      const name = typeof cat?.name === 'string' ? cat.name : '';
      if (id && name) seen.set(id, name);
    }
    setAvailableCategories(Array.from(seen, ([id, name]) => ({ id, name })));
  }, [itemsData?.data, activeCategory]);

  const handleCategoryChange = (next: string) => {
    setActiveCategory(next);
    setPage(1);
  };

  const allRows = useMemo<ItemRow[]>(() => {
    const rawItems = itemsData?.data ?? [];
    return rawItems.map((item) => {
      const rawItem = item as unknown as Record<string, unknown>;
      const market = (rawItem.market ?? null) as Record<string, unknown> | null;
      const unit = (rawItem.unit ?? null) as Record<string, unknown> | null;
      const marketPrices = Array.isArray(rawItem.market_prices)
        ? rawItem.market_prices
        : Array.isArray(rawItem.marketPrices)
          ? rawItem.marketPrices
          : [];
      const latestPrice = (marketPrices[0] ?? null) as Record<string, unknown> | null;

      const rawPrice = toNumber(latestPrice?.price ?? rawItem.price, 0);
      const rawDiscountRaw = latestPrice?.discount_price ?? rawItem.discount_price;
      const rawDiscount = rawDiscountRaw == null ? null : toNumber(rawDiscountRaw, 0);
      const lastUpdateTs = parseTs(toStringValue(latestPrice?.last_update ?? rawItem.last_update));

      return {
        id: toStringValue(rawItem.id ?? rawItem.item_id ?? rawItem.product_id, '0'),
        name: toStringValue(rawItem.name ?? rawItem.title, 'Item'),
        marketName: toStringValue(market?.name ?? rawItem.market_name, 'Local Market'),
        marketId: toStringValue(market?.id ?? rawItem.market_id) || marketId,
        price: toNumber(
          latestPrice?.discount_price ??
            latestPrice?.price ??
            rawItem.price ??
            rawItem.currentPrice ??
            rawItem.current_price,
          0
        ),
        image: toImageUrl(
          rawItem.image_path ?? rawItem.image ?? rawItem.image_url
        ),
        unit: toStringValue(unit?.symbol ?? unit?.name ?? rawItem.unit, undefined as unknown as string) || undefined,
        rawPrice,
        rawDiscount,
        lastUpdateTs,
      };
    });
  }, [itemsData?.data, marketId]);

  const rows = useMemo<ItemRow[]>(
    () =>
      applyFeedFilter(allRows, feedFilter, (r) => ({
        price: r.rawPrice,
        discountPrice: r.rawDiscount,
        lastUpdateTs: r.lastUpdateTs,
      })),
    [allRows, feedFilter]
  );

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  };

  if (isError) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-sm text-destructive">
          Error loading items: {error?.message || 'Something went wrong'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-9 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
          />
          {isFetching && debouncedSearch && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>
        <FeedFilterPopover
          active={feedFilter}
          onChange={(next) => {
            setFeedFilter(next);
            setPage(1);
          }}
        />
      </div>

      {availableCategories.length > 0 && (
        <div className="px-4 pt-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            <CategoryChip
              label="All"
              active={activeCategory === ''}
              onClick={() => handleCategoryChange('')}
            />
            {availableCategories.map((c) => (
              <CategoryChip
                key={c.id}
                label={c.name}
                active={activeCategory === c.id}
                onClick={() => handleCategoryChange(c.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="divide-y border-y bg-card mt-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
        ) : rows.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <p className="text-sm font-medium">No items found.</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different keyword.</p>
          </div>
        ) : (
          rows.map((r) => <PriceRow key={`${r.id}-${r.marketId ?? 'na'}`} item={r} />)
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="px-4 py-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

function CategoryChip({
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

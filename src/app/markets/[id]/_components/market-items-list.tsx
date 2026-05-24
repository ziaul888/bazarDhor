"use client";

import { useMemo, useRef, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useMarketItems } from '@/lib/api/hooks/useMarkets';
import { Pagination } from '@/components/ui/pagination';
import { PriceRow, type PriceRowItem } from '@/app/_components/price-row';

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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data: itemsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useMarketItems(marketId, { page, limit: 15, search: debouncedSearch || undefined });
  const pagination = itemsData?.pagination;

  const rows = useMemo<PriceRowItem[]>(() => {
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
      };
    });
  }, [itemsData?.data, marketId]);

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
      <div className="px-4">
        <div className="relative">
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
      </div>

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

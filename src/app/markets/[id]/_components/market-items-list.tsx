"use client";

import { useEffect, useRef, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useMarketItems } from '@/lib/api/hooks/useMarkets';
import { Pagination } from '@/components/ui/pagination';
import type { ItemFilters } from '@/lib/api/types';
import { ProductCard } from '@/components/product-card';

interface MarketItemsListProps {
  marketId: string;
}

const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';

const toImageUrl = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }

  return `${IMAGE_BASE_URL}${trimmed}`;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const toString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return fallback;
};

export function MarketItemsList({ marketId }: MarketItemsListProps) {
  const [filters, setFilters] = useState<ItemFilters>({
    page: 1,
    limit: 15,
  });
  const [searchInput, setSearchInput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [items, setItems] = useState<Array<{
    id: number | string;
    name: string;
    marketName: string;
    marketId?: number | string;
    currentPrice: number;
    image: string;
    category: string;
    priceChange: 'up' | 'down' | 'stable' | string;
    lastUpdated: string;
    unit?: string;
  }>>([]);

  const { 
    data: itemsData, 
    isLoading, 
    isError, 
    error 
  } = useMarketItems(marketId, filters);
  const pagination = itemsData?.pagination;

  useEffect(() => {
    const rawItems = itemsData?.data ?? [];
    const mapped = rawItems.map((item) => {
      const rawItem = item as unknown as Record<string, unknown>;
      const market = (rawItem.market ?? null) as Record<string, unknown> | null;
      const category = (rawItem.category ?? null) as Record<string, unknown> | null;
      const unit = (rawItem.unit ?? null) as Record<string, unknown> | null;
      const marketPrices = Array.isArray(rawItem.market_prices)
        ? rawItem.market_prices
        : Array.isArray(rawItem.marketPrices)
          ? rawItem.marketPrices
          : [];
      const latestPrice = (marketPrices[0] ?? null) as Record<string, unknown> | null;

      return {
        id: toString(rawItem.id ?? rawItem.item_id ?? rawItem.product_id, '0'),
        name: toString(rawItem.name ?? rawItem.title, 'Item'),
        marketName: toString(market?.name ?? rawItem.market_name, 'Local Market'),
        marketId: toNumber(market?.id ?? rawItem.market_id),
        currentPrice: toNumber(
          latestPrice?.discount_price ??
          latestPrice?.price ??
          rawItem.price ??
          rawItem.currentPrice ??
          rawItem.current_price,
          0
        ),
        image: toImageUrl(rawItem.image ?? rawItem.image_url ?? rawItem.image_path),
        category: toString(category?.name ?? rawItem.category, 'Fresh Items'),
        priceChange: toString(rawItem.price_change ?? rawItem.priceChange, 'down'),
        lastUpdated: toString(
          latestPrice?.last_update ??
          rawItem.last_updated ??
          rawItem.lastUpdated ??
          rawItem.updated_at,
          'Recently'
        ),
        unit: toString(unit?.symbol ?? unit?.name ?? rawItem.unit, 'unit'),
      };
    });
    setItems(mapped);
  }, [itemsData?.data]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value, page: 1 }));
    }, 400);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-2"></div>
            <div className="bg-gray-200 h-4 rounded mb-1"></div>
            <div className="bg-gray-200 h-3 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">
          Error loading items: {error?.message || 'Something went wrong'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search items..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
        />
        {isLoading && filters.search && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No items found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

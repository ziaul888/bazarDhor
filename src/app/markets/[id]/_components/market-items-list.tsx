"use client";

import { useEffect, useState } from 'react';
import { useMarketItems } from '@/lib/api/hooks/useMarkets';
import { Pagination } from '@/components/ui/pagination';
import type { ItemFilters } from '@/lib/api/types';
import { ProductCard } from '@/components/product-card';

interface MarketItemsListProps {
  marketId: string;
}

export function MarketItemsList({ marketId }: MarketItemsListProps) {
  const [filters, setFilters] = useState<ItemFilters>({
    page: 1,
    limit: 20,
  });
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
      const rawItem = item as Record<string, unknown>;
      const market = (rawItem.market ?? null) as Record<string, unknown> | null;
      const category = (rawItem.category ?? null) as Record<string, unknown> | null;
      const unit = (rawItem.unit ?? null) as Record<string, unknown> | null;

      return {
        id: rawItem.id ?? rawItem.item_id ?? rawItem.product_id,
        name: rawItem.name ?? rawItem.title ?? 'Item',
        marketName: market?.name ?? rawItem.market_name ?? 'Local Market',
        marketId: market?.id ?? rawItem.market_id,
        currentPrice: rawItem.price ?? rawItem.currentPrice ?? rawItem.current_price ?? 0,
        image: rawItem.image ?? rawItem.image_url ?? rawItem.image_path ?? '',
        category: category?.name ?? rawItem.category ?? 'Fresh Items',
        priceChange: rawItem.price_change ?? rawItem.priceChange ?? 'down',
        lastUpdated: rawItem.last_updated ?? rawItem.lastUpdated ?? rawItem.updated_at ?? 'Recently',
        unit: unit?.symbol ?? unit?.name ?? rawItem.unit ?? 'unit',
      };
    });
    setItems(mapped);
  }, [itemsData?.data]);

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
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
        <input
          type="text"
          placeholder="Search items..."
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
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

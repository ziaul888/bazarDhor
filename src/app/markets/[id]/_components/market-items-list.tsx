"use client";

import { useEffect, useState } from 'react';
import { useMarketItems } from '@/lib/api/hooks/useMarkets';
import { Pagination } from '@/components/ui/pagination';
import type { ItemFilters } from '@/lib/api/types';
import { ProductCard } from '@/components/product-card';
import { ProductPriceDialog } from '@/components/product-price-dialog';

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
  const [selectedItem, setSelectedItem] = useState<(typeof items)[number] | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    data: itemsData, 
    isLoading, 
    isError, 
    error 
  } = useMarketItems(marketId, filters);

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

  const rawItems = itemsData?.data || [];
  const pagination = itemsData?.pagination;

  useEffect(() => {
    const mapped = rawItems.map((item: any) => ({
      id: item.id ?? item.item_id ?? item.product_id,
      name: item.name ?? item.title ?? 'Item',
      marketName: item.market?.name ?? item.market_name ?? 'Local Market',
      marketId: item.market?.id ?? item.market_id,
      currentPrice: item.price ?? item.currentPrice ?? item.current_price ?? 0,
      image: item.image ?? item.image_url ?? item.image_path ?? '',
      category: item.category?.name ?? item.category ?? 'Fresh Items',
      priceChange: item.price_change ?? item.priceChange ?? 'down',
      lastUpdated: item.last_updated ?? item.lastUpdated ?? item.updated_at ?? 'Recently',
      unit: item.unit?.symbol ?? item.unit?.name ?? item.unit ?? 'unit',
    }));
    setItems(mapped);
  }, [rawItems]);

  const handleUpdatePrice = (item: (typeof items)[number]) => {
    setSelectedItem(item);
    setNewPrice(item.currentPrice.toString());
    setIsModalOpen(true);
  };

  const handleSavePrice = () => {
    if (!selectedItem) return;
    const parsed = parseFloat(newPrice);
    if (Number.isNaN(parsed)) return;
    setItems(prev =>
      prev.map(item =>
        item.id === selectedItem.id
          ? { ...item, currentPrice: parsed, lastUpdated: 'Just now' }
          : item
      )
    );
    setIsModalOpen(false);
  };

  const handlePredefinedAmount = (amount: number) => {
    if (selectedItem) {
      const currentPrice = parseFloat(newPrice) || selectedItem.currentPrice;
      const newPriceValue = Math.max(0, currentPrice + amount);
      setNewPrice(newPriceValue.toFixed(2));
    }
  };

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
              <ProductCard
                key={item.id}
                item={item}
                onUpdatePrice={handleUpdatePrice}
              />
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

      <ProductPriceDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={selectedItem}
        newPrice={newPrice}
        onNewPriceChange={setNewPrice}
        onSave={handleSavePrice}
        onQuickAdjust={handlePredefinedAmount}
        disableSave={!newPrice || parseFloat(newPrice) <= 0}
      />
    </div>
  );
}

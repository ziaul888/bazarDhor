"use client";

import { useState } from 'react';
import { useMarketItems } from '@/lib/api/hooks/useMarkets';
import { Pagination } from '@/components/ui/pagination';
import type { ItemFilters } from '@/lib/api/types';
import Image from 'next/image';

interface MarketItemsListProps {
  marketId: string;
}

export function MarketItemsList({ marketId }: MarketItemsListProps) {
  const [filters, setFilters] = useState<ItemFilters>({
    page: 1,
    limit: 20,
  });

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

  const items = itemsData?.data || [];
  const pagination = itemsData?.pagination;

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
              <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h3>
                  <p className="text-primary font-semibold">${item.price}</p>
                </div>
              </div>
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
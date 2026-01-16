"use client";

import { useState } from 'react';
import { useMarkets } from '@/lib/api/hooks/useMarkets';
import { MarketCard } from './market-card';
import { MarketFilters } from './market-filters';
import { Pagination } from '@/components/ui/pagination';
import type { MarketFilters as MarketFiltersType } from '@/lib/api/types';

export function MarketList() {
    const [filters, setFilters] = useState<MarketFiltersType>({
        page: 1,
        limit: 12,
    });

    const {
        data: marketsData,
        isLoading,
        isError,
        error
    } = useMarkets(filters);

    const handleFilterChange = (newFilters: Partial<MarketFiltersType>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                        <div className="bg-gray-200 h-4 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">
                    Error loading markets: {error?.message || 'Something went wrong'}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const markets = marketsData?.data || [];
    const pagination = marketsData?.pagination;

    return (
        <div className="space-y-6">
            <MarketFilters onFilterChange={handleFilterChange} />

            {markets.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">No markets found matching your criteria.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {markets.map((market) => (
                            <MarketCard key={market.id} market={market} />
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
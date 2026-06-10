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
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-xl border bg-card overflow-hidden">
                            <div className="h-48 market-shimmer" />
                            <div className="p-4 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 market-shimmer rounded w-3/4" />
                                        <div className="h-3.5 market-shimmer rounded w-1/2" />
                                    </div>
                                    <div className="h-5 w-12 market-shimmer rounded flex-shrink-0" />
                                </div>
                                <div className="h-4 market-shimmer rounded w-2/5" />
                                <div className="flex gap-2">
                                    <div className="h-6 w-20 market-shimmer rounded-md" />
                                    <div className="h-6 w-16 market-shimmer rounded-md" />
                                </div>
                                <div className="h-10 market-shimmer rounded-lg w-full" />
                            </div>
                        </div>
                    ))}
                </div>
                <style jsx global>{`
                    @keyframes market-shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    .market-shimmer {
                        background: linear-gradient(
                            90deg,
                            hsl(var(--muted)) 25%,
                            hsl(var(--muted-foreground) / 0.12) 50%,
                            hsl(var(--muted)) 75%
                        );
                        background-size: 200% 100%;
                        animation: market-shimmer 1.6s infinite linear;
                    }
                `}</style>
            </>
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
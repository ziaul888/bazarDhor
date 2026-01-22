"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Grid3X3,
    List,
    Search,
    SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { MarketCard, MarketListItem } from '@/components/market-card';
import type { Category } from '@/lib/api/types';

interface CategoryClientPageProps {
    markets: any[];
}

export function CategoryClientPage({ markets }: CategoryClientPageProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('distance');
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMarkets, setFilteredMarkets] = useState(markets);
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination logic - 9 items per page
    const { totalPages, getPaginatedItems, getPaginationInfo } = usePagination(filteredMarkets, 9);
    const paginatedMarkets = getPaginatedItems(currentPage);
    const paginationInfo = getPaginationInfo(currentPage);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = markets.filter(market =>
            market.name.toLowerCase().includes(query.toLowerCase()) ||
            market.address.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredMarkets(filtered);
        setCurrentPage(1);
    };

    const handleSort = (sortOption: string) => {
        setSortBy(sortOption);
        const sorted = [...filteredMarkets];

        switch (sortOption) {
            case 'distance':
                sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'price':
                sorted.sort((a, b) => parseFloat(a.avgPrice.replace('$', '')) - parseFloat(b.avgPrice.replace('$', '')));
                break;
            case 'items':
                sorted.sort((a, b) => b.categoryItems - a.categoryItems);
                break;
        }

        setFilteredMarkets(sorted);
        setCurrentPage(1);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search markets..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background"
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-2">
                    {/* View Mode Toggle */}
                    <div className="flex border border-border rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => handleSort(e.target.value)}
                        className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                    >
                        <option value="distance">Sort by Distance</option>
                        <option value="rating">Sort by Rating</option>
                        <option value="price">Sort by Price</option>
                        <option value="items">Sort by Items</option>
                    </select>

                    {/* Mobile Filter */}
                    <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="sm:hidden">
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle>Filter Markets</SheetTitle>
                            </SheetHeader>
                            <div className="py-4">
                                <p className="text-muted-foreground">Filter options coming soon...</p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                    Showing {paginationInfo.startIndex}-{paginationInfo.endIndex} of {paginationInfo.totalItems} markets
                </span>
                {totalPages > 1 && (
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                )}
            </div>

            {/* Markets Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedMarkets.map((market) => (
                        <MarketCard
                            key={market.id}
                            market={market}
                            showCategoryItems={true}
                            showPriceChange={true}
                            showPriceRange={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {paginatedMarkets.map((market) => (
                        <MarketListItem
                            key={market.id}
                            market={market}
                            showCategoryItems={true}
                            showPriceChange={true}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* No Results */}
            {filteredMarkets.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No markets found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search or check back later for new markets.
                    </p>
                </div>
            )}
        </div>
    );
}

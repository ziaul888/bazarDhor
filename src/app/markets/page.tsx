"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, SlidersHorizontal, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MarketCard } from '@/components/market-card';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { MarketFilters } from './_components/market-filters';
import { useMarketList } from '@/lib/api/hooks/useMarkets';
import type { Market } from '@/lib/api/types';

const fallbackMarkets: Market[] = [
    {
        id: "1",
        name: "Downtown Farmers Market",
        description: "Fresh local produce and organic foods from local farmers",
        location: "Downtown",
        address: "123 Main Street, Downtown",
        distance: "0.5 km",
        openTime: "8:00 AM - 6:00 PM",
        rating: 4.8,
        reviews: 245,
        vendors: 32,
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
        isOpen: true,
        isVerified: true,
        contributors: 15,
        lastUpdated: "2024-01-15",
        categories: ["Fresh Produce", "Organic Food"],
        specialties: ["Fresh Produce", "Organic Food"],
        featured: true,
        type: "Farmers Market",
        priceRange: "$$",
        hasParking: true,
        acceptsCards: true,
        hasDelivery: false
    },
    {
        id: "2",
        name: "Riverside Organic Market",
        description: "Certified organic produce and sustainable farming products",
        location: "Riverside",
        address: "456 River Road, Riverside",
        distance: "1.2 km",
        openTime: "9:00 AM - 5:00 PM",
        rating: 4.7,
        reviews: 189,
        vendors: 28,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        isOpen: true,
        isVerified: true,
        contributors: 12,
        lastUpdated: "2024-01-14",
        categories: ["Organic Food", "Local Produce"],
        specialties: ["Organic Food", "Local Produce"],
        featured: false,
        type: "Organic Market",
        priceRange: "$$$",
        hasParking: true,
        acceptsCards: true,
        hasDelivery: true
    },
    {
        id: "3",
        name: "Central Plaza Market",
        description: "Full-service grocery market with fresh meat and produce",
        location: "Central",
        address: "789 Plaza Avenue, Central",
        distance: "2.1 km",
        openTime: "7:00 AM - 7:00 PM",
        rating: 4.6,
        reviews: 156,
        vendors: 45,
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop",
        isOpen: false,
        isVerified: false,
        contributors: 8,
        lastUpdated: "2024-01-13",
        categories: ["Groceries", "Meat & Poultry"],
        specialties: ["Groceries", "Meat & Poultry"],
        featured: false,
        type: "Grocery Market",
        priceRange: "$",
        hasParking: false,
        acceptsCards: true,
        hasDelivery: false
    },
    {
        id: "4",
        name: "Sunset Weekend Market",
        description: "Weekend artisan market with street food and handmade goods",
        location: "West",
        address: "321 Sunset Boulevard, West",
        distance: "3.5 km",
        openTime: "10:00 AM - 4:00 PM",
        rating: 4.9,
        reviews: 298,
        vendors: 38,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        isOpen: true,
        isVerified: true,
        contributors: 22,
        lastUpdated: "2024-01-12",
        categories: ["Street Food", "Artisan Goods"],
        specialties: ["Street Food", "Artisan Goods"],
        featured: true,
        type: "Weekend Market",
        priceRange: "$$",
        hasParking: true,
        acceptsCards: false,
        hasDelivery: false
    },
    {
        id: "5",
        name: "Heritage Square Market",
        description: "Historic market square with traditional vendors and local crafts",
        location: "Old Town",
        address: "654 Heritage Lane, Old Town",
        distance: "4.2 km",
        openTime: "8:30 AM - 5:30 PM",
        rating: 4.5,
        reviews: 134,
        vendors: 25,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
        isOpen: true,
        isVerified: false,
        contributors: 7,
        lastUpdated: "2024-01-11",
        categories: ["Antiques", "Local Crafts"],
        specialties: ["Antiques", "Local Crafts"],
        featured: false,
        type: "Artisan Market",
        priceRange: "$$$",
        hasParking: true,
        acceptsCards: true,
        hasDelivery: false
    },
    {
        id: "6",
        name: "Fresh Valley Market",
        description: "Large farmers market with fresh produce and dairy products",
        location: "North",
        address: "987 Valley Road, North",
        distance: "5.8 km",
        openTime: "6:00 AM - 8:00 PM",
        rating: 4.4,
        reviews: 87,
        vendors: 52,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
        isOpen: true,
        isVerified: true,
        contributors: 18,
        lastUpdated: "2024-01-10",
        categories: ["Fresh Produce", "Dairy Products"],
        specialties: ["Fresh Produce", "Dairy Products"],
        featured: false,
        type: "Farmers Market",
        priceRange: "$",
        hasParking: true,
        acceptsCards: true,
        hasDelivery: true
    },
    {
        id: "7",
        name: "Metro Meat Market",
        description: "Specialty meat market with fresh cuts and seafood",
        location: "City Center",
        address: "147 Metro Street, City Center",
        distance: "1.8 km",
        openTime: "7:00 AM - 6:00 PM",
        rating: 4.3,
        reviews: 203,
        vendors: 15,
        image: "https://images.unsplash.com/photo-1588347818481-c7c1b6b8b4b4?w=400&h=300&fit=crop",
        isOpen: true,
        isVerified: false,
        contributors: 5,
        lastUpdated: "2024-01-09",
        categories: ["Meat & Poultry", "Seafood"],
        specialties: ["Meat & Poultry", "Seafood"],
        featured: false,
        type: "Specialty Market",
        priceRange: "$$",
        hasParking: false,
        acceptsCards: true,
        hasDelivery: true
    },
    {
        id: "8",
        name: "Seaside Fish Market",
        description: "Fresh daily catch and seafood market by the coast",
        location: "Seaside",
        address: "258 Coastal Drive, Seaside",
        distance: "6.2 km",
        openTime: "5:00 AM - 3:00 PM",
        rating: 4.7,
        reviews: 167,
        vendors: 8,
        image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop",
        isOpen: true,
        isVerified: true,
        contributors: 3,
        lastUpdated: "2024-01-08",
        categories: ["Fresh Seafood", "Daily Catch"],
        specialties: ["Fresh Seafood", "Daily Catch"],
        featured: false,
        type: "Seafood Market",
        priceRange: "$$$",
        hasParking: true,
        acceptsCards: true,
        hasDelivery: false
    }
];

const IMAGE_BASE_URL = 'https://bazardor.chhagolnaiyasportareana.xyz/storage/';
const DEFAULT_MARKET_IMAGE = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop";
const MARKET_LIST_PARAMS = {
    user_lat: 23.832619866576376,
    user_lng: 90.4348316383023,
    limit: 10,
    offset: 1
};

const toStringArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
    }
    if (typeof value === 'string' && value.trim().length > 0) {
        return [value.trim()];
    }
    return [];
};

const toNumber = (value: unknown, fallback: number) => {
    const numeric = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
};

const toBoolean = (value: unknown, fallback = false) => {
    if (typeof value === 'boolean') {
        return value;
    }
    if (value === 1 || value === '1') {
        return true;
    }
    if (value === 0 || value === '0') {
        return false;
    }
    return fallback;
};

const formatDistance = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return `${value} km`;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
        return value.includes('km') || value.includes('mi') ? value : `${value} km`;
    }
    return 'N/A';
};

const toImageUrl = (value: unknown) => {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return DEFAULT_MARKET_IMAGE;
    }
    return value.startsWith('http') ? value : `${IMAGE_BASE_URL}${value}`;
};

const extractMarketArray = (response: unknown): Record<string, unknown>[] => {
    if (!response) {
        return [];
    }

    if (Array.isArray(response)) {
        return response.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null);
    }

    if (typeof response === 'object') {
        const root = response as Record<string, unknown>;
        const direct = root.data ?? root.markets ?? root.market_list ?? root.marketList;

        if (Array.isArray(direct)) {
            return direct.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null);
        }

        if (direct && typeof direct === 'object') {
            const nested = (direct as Record<string, unknown>).data
                ?? (direct as Record<string, unknown>).markets
                ?? (direct as Record<string, unknown>).market_list;

            if (Array.isArray(nested)) {
                return nested.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null);
            }
        }
    }

    return [];
};

const mapMarketFromApi = (item: Record<string, unknown>, index: number): Market => {
    const categories = toStringArray(item.categories ?? item.category ?? item.category_name);
    const specialties = toStringArray(item.specialties ?? item.speciality ?? categories);

    return {
        id: String(item.id ?? item.market_id ?? item.marketId ?? `market-${index + 1}`),
        name: String(item.name ?? item.market_name ?? 'Local Market'),
        description: String(item.description ?? item.details ?? 'Fresh local market'),
        location: String(item.location ?? item.area ?? item.city ?? 'Local'),
        address: String(item.address ?? item.location ?? 'Address unavailable'),
        distance: formatDistance(item.distance ?? item.distance_km ?? item.distanceKm),
        openTime: String(item.openTime ?? item.open_time ?? item.opening_time ?? 'Hours vary'),
        image: toImageUrl(item.image ?? item.image_path ?? item.thumbnail),
        rating: toNumber(item.rating ?? item.avg_rating, 0),
        reviews: toNumber(item.reviews ?? item.review_count ?? item.total_reviews, 0),
        vendors: toNumber(item.vendors ?? item.vendor_count ?? item.total_vendors, 0),
        isOpen: toBoolean(item.isOpen ?? item.is_open ?? item.open_now),
        isVerified: toBoolean(item.isVerified ?? item.is_verified),
        contributors: toNumber(item.contributors ?? item.contributor_count, 0),
        lastUpdated: String(item.lastUpdated ?? item.updated_at ?? item.last_update ?? ''),
        categories,
        specialties: specialties.length > 0 ? specialties : ['Fresh Produce'],
        featured: toBoolean(item.featured ?? item.is_featured),
        type: String(item.type ?? item.market_type ?? 'Market'),
        priceRange: String(item.priceRange ?? item.price_range ?? '$$'),
        hasParking: toBoolean(item.hasParking ?? item.has_parking ?? item.parking_available),
        acceptsCards: toBoolean(item.acceptsCards ?? item.accepts_cards ?? item.card_available),
        hasDelivery: toBoolean(item.hasDelivery ?? item.has_delivery ?? item.delivery_available)
    };
};

export default function MarketsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [marketSource, setMarketSource] = useState<Market[]>(fallbackMarkets);
    const [filteredMarkets, setFilteredMarkets] = useState<Market[]>(fallbackMarkets);
    const [activeFilters, setActiveFilters] = useState<Record<string, unknown> | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [sortBy, setSortBy] = useState('distance');

    const { data: marketListData } = useMarketList(MARKET_LIST_PARAMS);

    const computeFilteredMarkets = (
        markets: Market[],
        query: string,
        filters?: Record<string, unknown>
    ) => {
        let filtered = markets;

        // Search filter
        if (query) {
            filtered = filtered.filter(market =>
                market.name.toLowerCase().includes(query.toLowerCase()) ||
                market.address.toLowerCase().includes(query.toLowerCase()) ||
                market.specialties.some(specialty =>
                    specialty.toLowerCase().includes(query.toLowerCase())
                )
            );
        }

        // Apply filters if provided
        if (filters) {
            // Filter by open status
            if (filters.isOpen) {
                filtered = filtered.filter(market => market.isOpen);
            }

            // Filter by featured
            if (filters.featured) {
                filtered = filtered.filter(market => market.featured);
            }

            // Filter by distance
            if (filters.distance && filters.distance !== '') {
                const maxDistance = parseFloat(String(filters.distance).replace('km', ''));
                filtered = filtered.filter(market =>
                    parseFloat(market.distance.replace('km', '')) <= maxDistance
                );
            }

            // Filter by rating
            if (filters.rating && filters.rating !== '') {
                const minRating = parseFloat(String(filters.rating));
                filtered = filtered.filter(market => market.rating >= minRating);
            }

            // Filter by price range
            if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length > 0) {
                filtered = filtered.filter(market =>
                    (filters.priceRange as string[]).includes(market.priceRange)
                );
            }

            // Filter by market type
            if (filters.marketType && Array.isArray(filters.marketType) && filters.marketType.length > 0) {
                filtered = filtered.filter(market =>
                    (filters.marketType as string[]).includes(market.type)
                );
            }

            // Filter by features
            if (filters.features && Array.isArray(filters.features) && filters.features.length > 0) {
                const features = filters.features as string[];
                filtered = filtered.filter(market => {
                    return features.every(feature => {
                        switch (feature) {
                            case 'hasParking':
                                return market.hasParking;
                            case 'acceptsCards':
                                return market.acceptsCards;
                            case 'hasDelivery':
                                return market.hasDelivery;
                            default:
                                return true;
                        }
                    });
                });
            }
        }

        return filtered;
    };

    // Pagination logic
    const { totalPages, getPaginatedItems, getPaginationInfo } = usePagination(filteredMarkets, 6);
    const paginatedMarkets = getPaginatedItems(currentPage);
    const paginationInfo = getPaginationInfo(currentPage);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = computeFilteredMarkets(marketSource, query, activeFilters);
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
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'vendors':
                sorted.sort((a, b) => b.vendors - a.vendors);
                break;
        }

        setFilteredMarkets(sorted);
        setCurrentPage(1); // Reset to first page when sorting
    };

    useEffect(() => {
        const markets = extractMarketArray(marketListData);
        if (markets.length === 0) {
            return;
        }

        const mapped = markets.map(mapMarketFromApi);
        setMarketSource(mapped);
        setFilteredMarkets(computeFilteredMarkets(mapped, searchQuery, activeFilters));
        setCurrentPage(1);
    }, [marketListData, searchQuery, activeFilters]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-muted/30 border-b">
                <div className="container mx-auto px-4 py-4 sm:py-6">
                    <div className="flex flex-col space-y-4">
                        {/* Title */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Local Markets</h1>
                            <p className="text-muted-foreground">
                                Discover fresh groceries and local produce near you
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search markets, products, or locations..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background"
                                />
                            </div>

                            {/* Filter Toggle - Mobile */}
                            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="px-4 py-3 h-auto lg:hidden"
                                    >
                                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                                    <SheetHeader className="p-6 border-b">
                                        <SheetTitle>Filter Markets</SheetTitle>
                                    </SheetHeader>
                                    <div className="p-6 overflow-y-auto h-full">
                                        <MarketFilters
                                            isMobile={true}
                                            onFilterChange={(filters: Record<string, unknown> | undefined) => {
                                                setActiveFilters(filters);
                                                const filtered = computeFilteredMarkets(marketSource, searchQuery, filters);
                                                setFilteredMarkets(filtered);
                                                setCurrentPage(1);
                                                // Don't auto-close sidebar, let user apply multiple filters
                                            }}
                                        />

                                        {/* Apply Filters Button for Mobile */}
                                        <div className="sticky bottom-0 bg-background pt-4 border-t mt-6">
                                            <Button
                                                className="w-full"
                                                onClick={() => setShowMobileFilters(false)}
                                            >
                                                Apply Filters
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Filter Toggle - Desktop (Hidden) */}
                            <Button
                                variant="outline"
                                className="px-4 py-3 h-auto hidden"
                            >
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4 sm:py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters Sidebar - Desktop Only */}
                    <div className="hidden lg:block lg:w-80">
                        <MarketFilters
                            onFilterChange={(filters: Record<string, unknown> | undefined) => {
                                setActiveFilters(filters);
                                const filtered = computeFilteredMarkets(marketSource, searchQuery, filters);
                                setFilteredMarkets(filtered);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Controls Bar */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm text-muted-foreground">
                                Showing {paginationInfo.startIndex}-{paginationInfo.endIndex} of {paginationInfo.totalItems} markets
                            </span>

                            <div className="flex items-center space-x-3">
                                {/* Compare Markets Button */}
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/markets/compare">
                                        <GitCompare className="h-4 w-4 sm:mr-2" />
                                        <span className="hidden sm:inline">Compare Markets</span>
                                    </Link>
                                </Button>

                                {/* Sort Dropdown */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSort(e.target.value)}
                                    className="text-sm border border-border rounded-md px-3 py-1 bg-background"
                                >
                                    <option value="distance">Sort by Distance</option>
                                    <option value="rating">Sort by Rating</option>
                                    <option value="name">Sort by Name</option>
                                    <option value="vendors">Sort by Vendors</option>
                                </select>
                            </div>
                        </div>

                        {/* Markets Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {paginatedMarkets.map((market) => (
                                <MarketCard
                                    key={market.id}
                                    market={market}
                                />
                            ))}
                        </div>

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
                            <div className="text-center py-8 sm:py-12">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold mb-2">No markets found</h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search or filters to find more markets.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

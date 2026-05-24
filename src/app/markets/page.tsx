"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, GitCompare, Loader2 } from 'lucide-react';
import { MarketListItem } from '@/components/market-card';
import { useMarketList, useSearchMarkets } from '@/lib/api/hooks/useMarkets';
import type { Market } from '@/lib/api/types';
import { NearestMarketSection } from '@/app/_components/nearest-market-section';

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
];

const PAGE_SIZE = 10;
const MARKET_LIST_PARAMS = {
    user_lat: 23.832619866576376,
    user_lng: 90.4348316383023,
    limit: 50,
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
    if (typeof value === 'boolean') return value;
    if (value === 1 || value === '1') return true;
    if (value === 0 || value === '0') return false;
    return fallback;
};

const formatDistance = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) return `${value} km`;
    if (typeof value === 'string' && value.trim().length > 0) {
        return value.includes('km') || value.includes('mi') ? value : `${value} km`;
    }
    return 'N/A';
};

const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';
const DEFAULT_MARKET_IMAGE = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop";

const toImageUrl = (value: unknown) => {
    if (typeof value !== 'string' || value.trim().length === 0) return DEFAULT_MARKET_IMAGE;
    return value.startsWith('http') ? value : `${IMAGE_BASE_URL}${value}`;
};

const extractMarketArray = (response: unknown): Record<string, unknown>[] => {
    if (!response) return [];
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

type SortOption = 'distance' | 'rating' | 'name' | 'vendors';

const sortLabels: Record<SortOption, string> = {
    distance: 'Distance',
    rating: 'Rating',
    name: 'Name',
    vendors: 'Vendors',
};

export default function MarketsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [marketSource, setMarketSource] = useState<Market[]>(fallbackMarkets);
    const [filteredMarkets, setFilteredMarkets] = useState<Market[]>(fallbackMarkets);
    const [visible, setVisible] = useState(PAGE_SIZE);
    const [sortBy, setSortBy] = useState<SortOption>('distance');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const marketListParams = {
        ...MARKET_LIST_PARAMS,
        sort_by: sortBy,
        sort_order: (sortBy === 'distance' ? 'asc' : 'desc') as 'asc' | 'desc',
    };

    const { data: marketListData, isLoading: isMarketListLoading } = useMarketList(marketListParams);
    const { data: searchData, isFetching: isSearchFetching } = useSearchMarkets(debouncedQuery);

    const isSearchActive = debouncedQuery.length > 2;

    const applyFilter = (markets: Market[], query: string) => {
        if (!query) return markets;
        const q = query.toLowerCase();
        return markets.filter(m =>
            m.name.toLowerCase().includes(q) ||
            m.address.toLowerCase().includes(q) ||
            m.specialties.some(s => s.toLowerCase().includes(q))
        );
    };

    const sortMarkets = (markets: Market[], by: SortOption) => {
        const sorted = [...markets];
        switch (by) {
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
        return sorted;
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setDebouncedQuery(query), 400);
        if (query.length <= 2) {
            setFilteredMarkets(sortMarkets(applyFilter(marketSource, query), sortBy));
            setVisible(PAGE_SIZE);
        }
    };

    const handleSort = (next: SortOption) => {
        setSortBy(next);
        setFilteredMarkets(sortMarkets(filteredMarkets, next));
        setVisible(PAGE_SIZE);
    };

    useEffect(() => {
        const markets = extractMarketArray(marketListData);
        if (markets.length === 0) return;
        const mapped = markets.map(mapMarketFromApi);
        setMarketSource(mapped);
        if (!isSearchActive) {
            setFilteredMarkets(sortMarkets(applyFilter(mapped, searchQuery), sortBy));
            setVisible(PAGE_SIZE);
        }
    }, [marketListData]);

    useEffect(() => {
        if (!isSearchActive) return;
        const markets = extractMarketArray(searchData);
        const mapped = markets.map(mapMarketFromApi);
        setFilteredMarkets(sortMarkets(mapped, sortBy));
        setVisible(PAGE_SIZE);
    }, [searchData, isSearchActive]);

    const rows = filteredMarkets.slice(0, visible);
    const hasMore = filteredMarkets.length > rows.length;

    return (
        <div className="pb-24">
            <NearestMarketSection />

            <div className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 lg:mt-4">
                <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
                    <div className="lg:min-w-0">
                        <section>
                            <div className="px-4 pt-6 flex items-center justify-between gap-3">
                                <h2 className="text-base font-semibold">Nearby markets</h2>
                                <Link
                                    href="/markets/compare"
                                    className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                                >
                                    <GitCompare className="h-3.5 w-3.5" />
                                    Compare
                                </Link>
                            </div>

                            <div className="px-4 pt-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        placeholder="Search markets, areas, or specialties"
                                        className="w-full h-10 pl-9 pr-9 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                                    />
                                    {isSearchFetching && (
                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                                    )}
                                </div>
                            </div>

                            <div className="px-4 pt-3 pb-2 sticky top-0 z-10 bg-background">
                                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
                                    {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                                        <Chip
                                            key={key}
                                            label={sortLabels[key]}
                                            active={sortBy === key}
                                            onClick={() => handleSort(key)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="px-4 space-y-3">
                                {isMarketListLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="rounded-xl border bg-card overflow-hidden">
                                            <RowSkeleton />
                                        </div>
                                    ))
                                ) : rows.length === 0 ? (
                                    <div className="rounded-xl border bg-card">
                                        <EmptyState />
                                    </div>
                                ) : (
                                    rows.map((m) => (
                                        <MarketListItem key={m.id} market={m} />
                                    ))
                                )}
                            </div>

                            {hasMore && (
                                <div className="px-4 py-6 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setVisible(n => n + PAGE_SIZE)}
                                        className="text-sm text-primary font-medium hover:underline"
                                    >
                                        Load more
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>

                    <aside className="lg:pt-6 lg:sticky lg:top-4 lg:self-start lg:space-y-4">
                        <div className="hidden lg:block px-4 text-xs text-muted-foreground space-y-1.5">
                            <Link className="block hover:text-foreground" href="/markets/compare">Compare two markets →</Link>
                            <Link className="block hover:text-foreground" href="/items">Browse all items</Link>
                            <Link className="block hover:text-foreground" href="/about">About BazarDhor</Link>
                        </div>
                    </aside>
                </div>
            </div>

            <div className="lg:hidden container mx-auto max-w-3xl px-4 pt-8 text-center text-xs text-muted-foreground">
                <Link href="/markets/compare" className="hover:text-foreground">Compare markets</Link>
                <span className="mx-2">·</span>
                <Link href="/items" className="hover:text-foreground">Items</Link>
            </div>
        </div>
    );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
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
            <div className="w-16 h-16 rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-2/5 bg-muted rounded" />
                <div className="h-2.5 w-1/3 bg-muted rounded" />
                <div className="h-2.5 w-1/4 bg-muted rounded" />
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="px-4 py-16 text-center">
            <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No markets match your search.</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different keyword or clear the filter.</p>
        </div>
    );
}

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, SlidersHorizontal, GitCompare, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MarketCard } from './_components/market-card';
import { MarketFilters } from './_components/market-filters';

const allMarkets = [
    {
        id: 1,
        name: "Downtown Farmers Market",
        address: "123 Main Street, Downtown",
        distance: "0.5 km",
        openTime: "8:00 AM - 6:00 PM",
        rating: 4.8,
        reviews: 245,
        vendors: 32,
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Fresh Produce", "Organic Food"],
        featured: true,
        type: "Farmers Market",
        priceRange: "$$",
        hasParking: true,
        acceptsCards: true,
        hasDelivery: false
    },
    {
        id: 2,
        name: "Riverside Organic Market",
        address: "456 River Road, Riverside",
        distance: "1.2 km",
        openTime: "9:00 AM - 5:00 PM",
        rating: 4.7,
        reviews: 189,
        vendors: 28,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Organic Food", "Local Produce"],
        featured: false,
        type: "Organic Market",
        priceRange: "$$$",
        hasParking: true,
        acceptsCards: true,
        hasDelivery: true
    },
    {
        id: 3,
        name: "Central Plaza Market",
        address: "789 Plaza Avenue, Central",
        distance: "2.1 km",
        openTime: "7:00 AM - 7:00 PM",
        rating: 4.6,
        reviews: 156,
        vendors: 45,
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop",
        isOpen: false,
        specialties: ["Groceries", "Meat & Poultry"],
        featured: false,
        type: "Grocery Market",
        priceRange: "$",
        hasParking: false,
        acceptsCards: true,
        hasDelivery: false
    },
    {
        id: 4,
        name: "Sunset Weekend Market",
        address: "321 Sunset Boulevard, West",
        distance: "3.5 km",
        openTime: "10:00 AM - 4:00 PM",
        rating: 4.9,
        reviews: 298,
        vendors: 38,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Street Food", "Artisan Goods"],
        featured: true,
        type: "Weekend Market",
        priceRange: "$$",
        hasParking: true,
        acceptsCards: false,
        hasDelivery: false
    },
    {
        id: 5,
        name: "Heritage Square Market",
        address: "654 Heritage Lane, Old Town",
        distance: "4.2 km",
        openTime: "8:30 AM - 5:30 PM",
        rating: 4.5,
        reviews: 134,
        vendors: 25,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Antiques", "Local Crafts"],
        featured: false,
        type: "Artisan Market",
        priceRange: "$$$",
        hasParking: true,
        acceptsCards: true,
        hasDelivery: false
    },
    {
        id: 6,
        name: "Fresh Valley Market",
        address: "987 Valley Road, North",
        distance: "5.8 km",
        openTime: "6:00 AM - 8:00 PM",
        rating: 4.4,
        reviews: 87,
        vendors: 52,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Fresh Produce", "Dairy Products"],
        featured: false,
        type: "Farmers Market",
        priceRange: "$",
        hasParking: true,
        acceptsCards: true,
        hasDelivery: true
    },
    {
        id: 7,
        name: "Metro Meat Market",
        address: "147 Metro Street, City Center",
        distance: "1.8 km",
        openTime: "7:00 AM - 6:00 PM",
        rating: 4.3,
        reviews: 203,
        vendors: 15,
        image: "https://images.unsplash.com/photo-1588347818481-c7c1b6b8b4b4?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Meat & Poultry", "Seafood"],
        featured: false,
        type: "Specialty Market",
        priceRange: "$$",
        hasParking: false,
        acceptsCards: true,
        hasDelivery: true
    },
    {
        id: 8,
        name: "Seaside Fish Market",
        address: "258 Coastal Drive, Seaside",
        distance: "6.2 km",
        openTime: "5:00 AM - 3:00 PM",
        rating: 4.7,
        reviews: 167,
        vendors: 8,
        image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Fresh Seafood", "Daily Catch"],
        featured: false,
        type: "Seafood Market",
        priceRange: "$$$",
        hasParking: true,
        acceptsCards: true,
        hasDelivery: false
    }
];

export default function MarketsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredMarkets, setFilteredMarkets] = useState(allMarkets);

    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [sortBy, setSortBy] = useState('distance');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        filterMarkets(query);
    };

    const filterMarkets = (query: string, filters?: Record<string, unknown>) => {
        let filtered = allMarkets;

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

        setFilteredMarkets(filtered);
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
    };

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
                                                filterMarkets(searchQuery, filters);
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
                            onFilterChange={(filters: Record<string, unknown> | undefined) => filterMarkets(searchQuery, filters)}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Controls Bar */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm text-muted-foreground">
                                {filteredMarkets.length} markets found
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
                            {filteredMarkets.map((market) => (
                                <MarketCard
                                    key={market.id}
                                    market={market}
                                />
                            ))}
                        </div>

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
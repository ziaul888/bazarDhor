"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Grid3X3,
  List,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { MarketCard, MarketListItem } from '@/components/market-card';

// Mock data for category details
const categoryData = {
  "fresh-vegetables": {
    id: 1,
    name: "Fresh Vegetables",
    description: "Farm-fresh vegetables sourced directly from local farmers and organic producers",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop",
    icon: "🥬",
    productCount: 85,
    marketCount: 45,
    priceChange: "down" as const,
    avgPriceChange: -5.2,
    popularItems: ["Tomatoes", "Onions", "Potatoes", "Carrots", "Spinach"]
  },
  "fresh-fruits": {
    id: 2,
    name: "Fresh Fruits",
    description: "Seasonal and exotic fruits from trusted local orchards and suppliers",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&h=400&fit=crop",
    icon: "🍎",
    productCount: 72,
    marketCount: 38,
    priceChange: "up" as const,
    avgPriceChange: 3.8,
    popularItems: ["Apples", "Bananas", "Oranges", "Grapes", "Mangoes"]
  },
  "meat-poultry": {
    id: 3,
    name: "Meat & Poultry",
    description: "Fresh, high-quality meat and poultry from certified local suppliers",
    image: "https://images.unsplash.com/photo-1588347818481-c7c1b6b8b4b4?w=800&h=400&fit=crop",
    icon: "🥩",
    productCount: 45,
    marketCount: 28,
    priceChange: "down" as const,
    avgPriceChange: -2.1,
    popularItems: ["Chicken", "Beef", "Lamb", "Pork", "Turkey"]
  }
};

// Mock markets data for the category
const categoryMarkets = [
  {
    id: 1,
    name: "Downtown Farmers Market",
    address: "123 Main Street, Downtown",
    distance: "0.5 km",
    rating: 4.8,
    reviews: 245,
    vendors: 32,
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
    isOpen: true,
    openTime: "8:00 AM - 6:00 PM",
    specialties: ["Organic", "Local Produce"],
    priceRange: "$$",
    categoryItems: 24,
    avgPrice: "$3.50/kg",
    priceChange: "down" as const
  },
  {
    id: 2,
    name: "Riverside Organic Market",
    address: "456 River Road, Riverside",
    distance: "1.2 km",
    rating: 4.7,
    reviews: 189,
    vendors: 28,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    isOpen: true,
    openTime: "9:00 AM - 5:00 PM",
    specialties: ["Organic", "Premium Quality"],
    priceRange: "$$$",
    categoryItems: 18,
    avgPrice: "$4.20/kg",
    priceChange: "up" as const
  },
  {
    id: 3,
    name: "Central Plaza Market",
    address: "789 Plaza Avenue, Central",
    distance: "2.1 km",
    rating: 4.6,
    reviews: 156,
    vendors: 45,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop",
    isOpen: false,
    openTime: "7:00 AM - 7:00 PM",
    specialties: ["Wholesale", "Bulk Orders"],
    priceRange: "$",
    categoryItems: 32,
    avgPrice: "$2.80/kg",
    priceChange: "down" as const
  },
  {
    id: 4,
    name: "Sunset Weekend Market",
    address: "321 Sunset Boulevard, West",
    distance: "3.5 km",
    rating: 4.9,
    reviews: 298,
    vendors: 38,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    isOpen: true,
    openTime: "10:00 AM - 4:00 PM",
    specialties: ["Artisan", "Premium"],
    priceRange: "$$$",
    categoryItems: 15,
    avgPrice: "$5.10/kg",
    priceChange: "up" as const
  },
  {
    id: 5,
    name: "Green Valley Market",
    address: "654 Valley Road, Green Hills",
    distance: "4.2 km",
    rating: 4.5,
    reviews: 134,
    vendors: 22,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    isOpen: true,
    openTime: "8:30 AM - 5:30 PM",
    specialties: ["Local", "Farm Fresh"],
    priceRange: "$$",
    categoryItems: 28,
    avgPrice: "$3.90/kg",
    priceChange: "down" as const
  },
  {
    id: 6,
    name: "City Center Market",
    address: "987 Center Street, City",
    distance: "1.8 km",
    rating: 4.4,
    reviews: 201,
    vendors: 35,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    isOpen: false,
    openTime: "9:00 AM - 6:00 PM",
    specialties: ["Convenient", "Quick Shopping"],
    priceRange: "$$",
    categoryItems: 21,
    avgPrice: "$3.75/kg",
    priceChange: "up" as const
  },
  {
    id: 7,
    name: "Heritage Square Market",
    address: "111 Heritage Square, Old Town",
    distance: "2.8 km",
    rating: 4.6,
    reviews: 178,
    vendors: 25,
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
    isOpen: true,
    openTime: "8:00 AM - 5:00 PM",
    specialties: ["Traditional", "Local"],
    priceRange: "$$",
    categoryItems: 19,
    avgPrice: "$3.60/kg",
    priceChange: "down" as const
  },
  {
    id: 8,
    name: "Northside Fresh Market",
    address: "222 North Avenue, Northside",
    distance: "3.1 km",
    rating: 4.3,
    reviews: 142,
    vendors: 18,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    isOpen: true,
    openTime: "9:00 AM - 6:00 PM",
    specialties: ["Fresh", "Affordable"],
    priceRange: "$",
    categoryItems: 26,
    avgPrice: "$3.20/kg",
    priceChange: "up" as const
  },
  {
    id: 9,
    name: "Eastside Community Market",
    address: "333 East Street, Eastside",
    distance: "4.5 km",
    rating: 4.7,
    reviews: 167,
    vendors: 30,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop",
    isOpen: false,
    openTime: "8:00 AM - 7:00 PM",
    specialties: ["Community", "Diverse"],
    priceRange: "$$",
    categoryItems: 22,
    avgPrice: "$3.80/kg",
    priceChange: "down" as const
  },
  {
    id: 10,
    name: "Westfield Organic Hub",
    address: "444 West Field Road, Westfield",
    distance: "5.2 km",
    rating: 4.8,
    reviews: 203,
    vendors: 27,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    isOpen: true,
    openTime: "7:30 AM - 6:30 PM",
    specialties: ["Organic", "Sustainable"],
    priceRange: "$$$",
    categoryItems: 31,
    avgPrice: "$4.50/kg",
    priceChange: "up" as const
  },
  {
    id: 11,
    name: "Southgate Market Plaza",
    address: "555 South Gate Drive, Southgate",
    distance: "3.7 km",
    rating: 4.5,
    reviews: 189,
    vendors: 42,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    isOpen: true,
    openTime: "8:00 AM - 8:00 PM",
    specialties: ["Large Selection", "Competitive Prices"],
    priceRange: "$$",
    categoryItems: 35,
    avgPrice: "$3.40/kg",
    priceChange: "down" as const
  },
  {
    id: 12,
    name: "Mountain View Market",
    address: "666 Mountain View Road, Heights",
    distance: "6.1 km",
    rating: 4.4,
    reviews: 156,
    vendors: 20,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    isOpen: false,
    openTime: "9:00 AM - 5:00 PM",
    specialties: ["Scenic", "Quality"],
    priceRange: "$$",
    categoryItems: 17,
    avgPrice: "$3.95/kg",
    priceChange: "up" as const
  },
  {
    id: 13,
    name: "Lakeside Fresh Foods",
    address: "777 Lakeside Boulevard, Lakeside",
    distance: "4.8 km",
    rating: 4.6,
    reviews: 174,
    vendors: 24,
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
    isOpen: true,
    openTime: "8:30 AM - 6:00 PM",
    specialties: ["Waterfront", "Fresh"],
    priceRange: "$$",
    categoryItems: 23,
    avgPrice: "$3.70/kg",
    priceChange: "down" as const
  },
  {
    id: 14,
    name: "Hillcrest Farmers Co-op",
    address: "888 Hillcrest Avenue, Hillcrest",
    distance: "5.5 km",
    rating: 4.7,
    reviews: 198,
    vendors: 33,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    isOpen: true,
    openTime: "7:00 AM - 7:00 PM",
    specialties: ["Co-operative", "Fair Trade"],
    priceRange: "$$",
    categoryItems: 29,
    avgPrice: "$3.85/kg",
    priceChange: "up" as const
  }
];

export default function CategoryDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('distance');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMarkets, setFilteredMarkets] = useState(categoryMarkets);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic - 9 items per page
  const { totalPages, getPaginatedItems, getPaginationInfo } = usePagination(filteredMarkets, 9);
  const paginatedMarkets = getPaginatedItems(currentPage);
  const paginationInfo = getPaginationInfo(currentPage);

  // Get category data
  const category = categoryData[slug as keyof typeof categoryData];

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          {/* <p className="text-muted-foreground mb-4">The category you're looking for doesnt exist.</p> */}
          <Button asChild>
            <Link href="/category">Back to Categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = categoryMarkets.filter(market =>
      market.name.toLowerCase().includes(query.toLowerCase()) ||
      market.address.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMarkets(filtered);
    setCurrentPage(1); // Reset to first page when searching
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
    setCurrentPage(1); // Reset to first page when sorting
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        {/* Hero Image */}
        <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/category" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>

          {/* Category Info Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl">
                  {category.icon}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                    {category.name}
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base max-w-2xl">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-card border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold">{category.marketCount}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Markets</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold">{category.productCount}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className={`text-lg sm:text-xl font-bold flex items-center justify-center space-x-1 ${category.priceChange === 'up' ? 'text-red-600' : 'text-green-600'
                  }`}>
                  {category.priceChange === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(category.avgPriceChange)}%</span>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Price Change</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold">4.7</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
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
                  {/* Filter content would go here */}
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
    </div>
  );
}


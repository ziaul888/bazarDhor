"use client";

import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Store, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { CategoryCard } from './_components/category-card';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { CategoryFilters } from './_components/category-filters';
import { useCategoryList } from '@/lib/api/hooks/useCategories';

const allCategories = [
  {
    id: 1,
    name: "Fresh Vegetables",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    productCount: 85,
    icon: "🥬",
    priceChange: "down",
    markets: 45
  },
  {
    id: 2,
    name: "Fresh Fruits",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop",
    productCount: 72,
    icon: "🍎",
    priceChange: "up",
    markets: 38
  },
  {
    id: 3,
    name: "Meat & Poultry",
    image: "https://images.unsplash.com/photo-1588347818481-c7c1b6b8b4b4?w=400&h=300&fit=crop",
    productCount: 45,
    icon: "🥩",
    priceChange: "down",
    markets: 28
  },
  {
    id: 4,
    name: "Fresh Seafood",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop",
    productCount: 32,
    icon: "🐟",
    priceChange: "up",
    markets: 18
  },
  {
    id: 5,
    name: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
    productCount: 38,
    icon: "🥛",
    priceChange: "down",
    markets: 35
  },
  {
    id: 6,
    name: "Grains & Pulses",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    productCount: 42,
    icon: "🌾",
    priceChange: "up",
    markets: 32
  },
  {
    id: 7,
    name: "Spices & Herbs",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
    productCount: 65,
    icon: "🌿",
    priceChange: "down",
    markets: 28
  },
  {
    id: 8,
    name: "Bakery Items",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    productCount: 28,
    icon: "🥖",
    priceChange: "up",
    markets: 22
  },
  {
    id: 9,
    name: "Organic Products",
    image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=300&fit=crop",
    productCount: 95,
    icon: "🌱",
    priceChange: "down",
    markets: 25
  },
  {
    id: 10,
    name: "Beverages",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
    productCount: 24,
    icon: "🥤",
    priceChange: "up",
    markets: 15
  },
  {
    id: 11,
    name: "Snacks & Nuts",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop",
    productCount: 36,
    icon: "🥜",
    priceChange: "down",
    markets: 20
  },
  {
    id: 12,
    name: "Prepared Foods",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    productCount: 18,
    icon: "🍽️",
    priceChange: "up",
    markets: 12
  }
];

const CATEGORY_LIST_PARAMS = {
  limit: 10,
  offset: 1
};

const IMAGE_BASE_URL = 'https://bazardor.chhagolnaiyasportareana.xyz/storage/';

const toNumber = (value: unknown, fallback: number) => {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const toImageUrl = (value: unknown) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop";
  }
  return value.startsWith('http') ? value : `${IMAGE_BASE_URL}${value}`;
};

const mapCategoryFromApi = (item: Record<string, unknown>, index: number) => {
  return {
    id: item.id ?? item.slug ?? `category-${index + 1}`,
    name: String(item.name ?? item.category_name ?? 'Category'),
    image: toImageUrl(item.image ?? item.image_path),
    productCount: toNumber(item.productCount ?? item.product_count ?? item.item_count, 0),
    icon: String(item.icon ?? item.emoji ?? '📦'),
    priceChange: index % 2 === 0 ? 'down' : 'up',
    markets: toNumber(item.marketCount ?? item.market_count ?? item.unique_market_count ?? item.vendor_count, 0),
  };
};

export default function CategoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySource, setCategorySource] = useState(allCategories);
  const [filteredCategories, setFilteredCategories] = useState(allCategories);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown> | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const { data: apiCategories } = useCategoryList(CATEGORY_LIST_PARAMS);

  // Pagination logic
  const { totalPages, getPaginatedItems, getPaginationInfo } = usePagination(filteredCategories, 12);
  const paginatedCategories = getPaginatedItems(currentPage);
  const paginationInfo = getPaginationInfo(currentPage);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = computeFilteredCategories(categorySource, query, activeFilters);
    setFilteredCategories(filtered);
    setCurrentPage(1);
  };

  const computeFilteredCategories = (
    categories: typeof allCategories,
    query: string,
    filters?: Record<string, unknown>
  ) => {
    let filtered = categories;

    // Search filter
    if (query) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filters if provided
    if (filters) {
      // Filter by price change
      if (filters.priceChange && filters.priceChange !== '') {
        filtered = filtered.filter(category =>
          category.priceChange === filters.priceChange
        );
      }

      // Filter by popular (high product count)
      if (filters.popular) {
        filtered = filtered.filter(category => category.productCount >= 50);
      }

      // Filter by product count
      if (filters.productCount && filters.productCount !== '') {
        const minCount = parseInt(String(filters.productCount).replace('+', ''));
        filtered = filtered.filter(category => category.productCount >= minCount);
      }

      // Filter by market count
      if (filters.marketCount && filters.marketCount !== '') {
        const minMarkets = parseInt(String(filters.marketCount).replace('+', ''));
        filtered = filtered.filter(category => category.markets >= minMarkets);
      }
    }

    return filtered;
  };

  const handleSort = (sortOption: string) => {
    setSortBy(sortOption);
    const sorted = [...filteredCategories];

    switch (sortOption) {
      case 'popular':
        // Sort by product count as a proxy for popularity
        sorted.sort((a, b) => b.productCount - a.productCount);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'products':
        sorted.sort((a, b) => b.productCount - a.productCount);
        break;

    }

    setFilteredCategories(sorted);
    setCurrentPage(1); // Reset to first page when sorting
  };

  useEffect(() => {
    if (!apiCategories || apiCategories.length === 0) {
      return;
    }

    const mapped = apiCategories.map((category, index) => mapCategoryFromApi(category as Record<string, unknown>, index));
    setCategorySource(mapped);
    setFilteredCategories(computeFilteredCategories(mapped, searchQuery, activeFilters));
    setCurrentPage(1);
  }, [apiCategories, searchQuery, activeFilters]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col space-y-4">
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Browse Categories</h1>
              <p className="text-muted-foreground">
                Explore fresh groceries and local produce by category
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search categories or products..."
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
                    <SheetTitle>Filter Categories</SheetTitle>
                  </SheetHeader>
                  <div className="p-6 overflow-y-auto h-full">
                    <CategoryFilters
                      isMobile={true}
                      onFilterChange={(filters: Record<string, unknown> | undefined) => {
                        setActiveFilters(filters);
                        const filtered = computeFilteredCategories(categorySource, searchQuery, filters);
                        setFilteredCategories(filtered);
                        setCurrentPage(1);
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
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:w-80">
            <CategoryFilters
              onFilterChange={(filters: Record<string, unknown> | undefined) => {
                setActiveFilters(filters);
                const filtered = computeFilteredCategories(categorySource, searchQuery, filters);
                setFilteredCategories(filtered);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-muted-foreground">
                Showing {paginationInfo.startIndex}-{paginationInfo.endIndex} of {paginationInfo.totalItems} categories
              </span>

              <div className="flex items-center space-x-3">
                {/* Browse Markets Button */}
                <Button variant="outline" size="sm" asChild>
                  <Link href="/markets" className="flex items-center">
                    <Store className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Browse Markets</span>
                  </Link>
                </Button>

                {/* Popular Filter Button - Mobile */}
                <Button
                  variant={sortBy === 'popular' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSort('popular')}
                  className="md:hidden flex items-center"
                >
                  <TrendingUp className="h-4 w-4" />
                </Button>

                {/* Sort Dropdown - Desktop */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="hidden md:block text-sm border border-border rounded-md px-3 py-1 bg-background"
                >
                  <option value="popular">Sort by Popular</option>
                  <option value="name">Sort by Name</option>
                  <option value="products">Sort by Products</option>
                </select>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
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
            {filteredCategories.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">No categories found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find more categories.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

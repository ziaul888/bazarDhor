"use client";

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useMemo } from 'react';
import { useCategories, Category as ApiCategory } from '@/lib/api';
import { useZone } from '@/providers/zone-provider';

// Fallback categories
const fallbackCategories = [
  {
    id: 1,
    name: "Vegetables",
    slug: "fresh-vegetables",
    vendors: 85,
    markets: 42,
    totalItems: 1250,
    rating: 4.8,
    icon: "🥬",
    popular: true
  },
  {
    id: 2,
    name: "Fruits",
    slug: "fresh-fruits",
    vendors: 72,
    markets: 38,
    totalItems: 980,
    rating: 4.9,
    icon: "🍎",
    popular: true
  },
  {
    id: 3,
    name: "Meat",
    slug: "meat",
    vendors: 45,
    markets: 25,
    totalItems: 650,
    rating: 4.7,
    icon: "🥩",
    popular: true
  },
  {
    id: 4,
    name: "Seafood",
    slug: "seafood",
    vendors: 28,
    markets: 18,
    totalItems: 420,
    rating: 4.6,
    icon: "🐟",
    popular: false
  },
  {
    id: 5,
    name: "Dairy",
    slug: "dairy",
    vendors: 35,
    markets: 22,
    totalItems: 580,
    rating: 4.5,
    icon: "🥛",
    popular: false
  },
  {
    id: 6,
    name: "Grains",
    slug: "grains",
    vendors: 42,
    markets: 28,
    totalItems: 720,
    rating: 4.4,
    icon: "🌾",
    popular: false
  },
  {
    id: 7,
    name: "Spices",
    slug: "spices",
    vendors: 38,
    markets: 24,
    totalItems: 890,
    rating: 4.7,
    icon: "🌿",
    popular: false
  },
  {
    id: 8,
    name: "Bakery",
    slug: "bakery",
    vendors: 25,
    markets: 15,
    totalItems: 340,
    rating: 4.6,
    icon: "🥖",
    popular: false
  },
  {
    id: 9,
    name: "Snacks",
    slug: "snacks",
    vendors: 31,
    markets: 20,
    totalItems: 520,
    rating: 4.3,
    icon: "🍿",
    popular: false
  },
  {
    id: 10,
    name: "Beverages",
    slug: "beverages",
    vendors: 29,
    markets: 19,
    totalItems: 480,
    rating: 4.4,
    icon: "🥤",
    popular: false
  }
];

interface Category {
  id: string | number;
  name: string;
  slug: string;
  vendors?: number;
  markets?: number;
  market_count?: number;
  totalItems?: number;
  product_count?: number;
  rating?: number;
  icon?: string;
  popular?: boolean;
}

export function CategorySection() {
  const { zone } = useZone();
  const { data: apiCategoriesData, isLoading: isApiLoading, error: apiError } = useCategories();

  const categories = useMemo(() => {
    if (apiCategoriesData && apiCategoriesData.length > 0) {
      return apiCategoriesData.map((cat: ApiCategory) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        vendors: cat.vendor_count || 0,
        markets: cat.market_count || (cat as any).unique_market_count || 0,
        totalItems: cat.product_count || 0,
        rating: cat.rating || 4.5,
        icon: cat.icon || '📦',
        popular: cat.popular || !!cat.popular,
      }));
    }
    return fallbackCategories;
  }, [apiCategoriesData]);
  console.log({ apiCategoriesData });
  const isLoading = isApiLoading;

  // Show first 9 categories
  const displayCategories = categories.slice(0, 9);

  return (
    <section className="py-3 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Bazar by Category</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Fresh groceries from local markets</p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 sm:gap-4 lg:gap-6">
          {displayCategories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`} className="group">
              <Card className="relative h-full bg-white/40 dark:bg-card/40 backdrop-blur-md rounded-3xl border border-white/20 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(34,197,94,0.15)] hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden py-3">
                {/* Popular Badge */}
                {category.popular && (
                  <div className="absolute top-2 right-2 z-20">
                    <div className="flex items-center gap-1 bg-primary/10 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-primary/20">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-[8px] font-bold text-primary uppercase tracking-tighter hidden xs:block">Top</span>
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <CardContent className="p-2 sm:p-4 text-center relative z-10 flex flex-col items-center">
                  {/* Category Icon Container */}
                  <div className="relative mb-3 group-hover:mb-4 transition-all duration-500">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center shadow-md border border-white/50 dark:border-white/10 group-hover:rotate-6 group-hover:-translate-y-1 transition-all duration-500">
                      <span className="text-xl xs:text-2xl sm:text-3xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-500">
                        {category.icon}
                      </span>
                    </div>
                    {/* Shadow Glow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-black/5 blur-sm rounded-full group-hover:w-10 group-hover:opacity-50 transition-all duration-500"></div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {category.name}
                  </h3>

                  {/* Stats */}
                  <div className="hidden xs:flex items-center gap-2 text-[10px] text-muted-foreground/70">
                    <div className="flex items-center gap-0.5">
                      <span className="opacity-70">📦</span>
                      <span className="font-semibold text-foreground/80">
                        {category.totalItems > 999
                          ? `${Math.floor(category.totalItems / 1000)}k`
                          : category.totalItems}
                      </span>
                    </div>
                    <div className="w-1 h-1 bg-muted-foreground/20 rounded-full"></div>
                    <div className="flex items-center gap-0.5">
                      <span className="opacity-70">🏪</span>
                      <span className="font-semibold text-foreground/80">{category.markets}</span>
                    </div>
                  </div>
                </CardContent>

                {/* Hover Background Accent */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Card>
            </Link>
          ))}

          {/* View All Button */}
          <Link href="/category" className="group">
            <Card className="relative h-full bg-primary/5 hover:bg-primary/10 backdrop-blur-md rounded-3xl border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all duration-500 cursor-pointer overflow-hidden py-3">
              <CardContent className="p-2 sm:p-4 text-center relative z-10 flex flex-col items-center h-full justify-center">
                <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 mb-3">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-primary mb-1">View All</h3>
                <p className="text-[10px] text-primary/60 font-medium hidden xs:block">Explore Store</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Custom styles for xs breakpoint */}
      <style jsx global>{`
        /* Custom breakpoint for extra small screens */
        @media (min-width: 475px) {
          .xs\\:w-9 { width: 2.25rem; }
          .xs\\:h-9 { height: 2.25rem; }
          .xs\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .xs\\:text-base { font-size: 1rem; line-height: 1.5rem; }
          .xs\\:text-xs { font-size: 0.75rem; line-height: 1rem; }
          .xs\\:block { display: block; }
          .xs\\:hidden { display: none; }
        }
      `}</style>
    </section>
  );
}
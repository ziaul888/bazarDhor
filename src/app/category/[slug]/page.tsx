import { CategoryClientPage } from './_components/category-client-page';
import { CategoryHero } from './_components/category-hero';
import { categoryServerApi } from '@/lib/api/services/server/category-server';
import { marketServerApi } from '@/lib/api/services/server/market-server';
import { BackButton } from '@/components/ui/back-button';
import { cookies } from 'next/headers';
import {
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';
const DEFAULT_MARKET_IMAGE = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop";
const CATEGORY_MARKET_LIST_PARAMS = {
  user_lat: 23.832619866576376,
  user_lng: 90.4348316383023,
  limit: 10,
  offset: 1,
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

const toImageUrl = (value: unknown) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return DEFAULT_MARKET_IMAGE;
  }
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

const mapMarketFromApi = (item: Record<string, unknown>, index: number) => {
  const categories = toStringArray(item.categories ?? item.category ?? item.category_name);
  const specialties = toStringArray(item.specialties ?? item.speciality ?? categories);

  return {
    id: String(item.id ?? item.market_id ?? item.marketId ?? `market-${index + 1}`),
    name: String(item.name ?? item.market_name ?? 'Local Market'),
    address: String(item.address ?? item.location ?? 'Address unavailable'),
    distance: formatDistance(item.distance ?? item.distance_km ?? item.distanceKm),
    rating: toNumber(item.rating ?? item.avg_rating, 0),
    reviews: toNumber(item.reviews ?? item.review_count ?? item.total_reviews, 0),
    vendors: toNumber(item.vendors ?? item.vendor_count ?? item.total_vendors, 0),
    image: toImageUrl(item.image ?? item.image_path ?? item.thumbnail),
    isOpen: toBoolean(item.isOpen ?? item.is_open ?? item.open_now),
    openTime: String(item.openTime ?? item.open_time ?? item.opening_time ?? 'Hours vary'),
    specialties: specialties.length > 0 ? specialties : ['Fresh Produce'],
    priceRange: String(item.priceRange ?? item.price_range ?? '$$'),
    categoryItems: toNumber(item.categoryItems ?? item.product_count ?? item.item_count, 0),
    priceChange: (toNumber(item.price_change, 0) ?? 0) > 0 ? 'up' : 'down' as const,
    featured: toBoolean(item.featured ?? item.is_featured),
  };
};

type CategoryFallback = {
  id: number;
  name: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  marketCount: number;
  priceChange: 'up' | 'down';
  avgPriceChange: number;
  popularItems: string[];
};

// Mock data for category details (kept as fallback)
const categoryData: Record<string, CategoryFallback> = {
  "fresh-vegetables": {
    id: 1,
    name: "Fresh Vegetables",
    description: "Farm-fresh vegetables sourced directly from local farmers and organic producers",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop",
    icon: "🥬",
    productCount: 85,
    marketCount: 45,
    priceChange: "down",
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
    priceChange: "up",
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
    priceChange: "down",
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

export default async function CategoryDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Get zoneId from cookies on the server
  const cookieStore = await cookies();
  const zoneId = cookieStore.get('zoneId')?.value;
  const headers = zoneId ? { zoneId } : undefined;

  // Fetch real category data from organized server service
  const apiCategory = zoneId
    ? await categoryServerApi.getCategoryById(slug, headers)
    : null;

  // Determine which category data to use
  let category = apiCategory ? {
    id: apiCategory.id,
    name: apiCategory.name,
    description: apiCategory.description || "Local market category",
    image: apiCategory.image_path ? (apiCategory.image_path.startsWith('http') ? apiCategory.image_path : `${IMAGE_BASE_URL}${apiCategory.image_path}`) : (categoryData[slug]?.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop"),
    icon: apiCategory.icon || categoryData[slug]?.icon || "📦",
    productCount: apiCategory.product_count || 0,
    marketCount: apiCategory.market_count || apiCategory.unique_market_count || categoryData[slug]?.marketCount || 0,
    priceChange: categoryData[slug]?.priceChange || "down",
    avgPriceChange: categoryData[slug]?.avgPriceChange || 0,
  } : categoryData[slug];

  // If still not found, search mock data by ID
  if (!category) {
    const mockMatch = Object.values(categoryData).find(c => c.id.toString() === slug);
    if (mockMatch) {
      category = mockMatch;
    }
  }
  if (!category) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-muted-foreground">?</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn&apos;t find the category you&apos;re looking for.
          </p>
          <BackButton
            size="lg"
            className="rounded-full px-8"
            fallbackHref="/category"
            label="Browse All Categories"
          />
        </div>
      </div>
    );
  }

  // Fetch real markets for this category from organized server service
  let markets: Array<Record<string, unknown>> = zoneId
    ? extractMarketArray(await marketServerApi.getMarketList({
        ...CATEGORY_MARKET_LIST_PARAMS,
        categoryId: category.id.toString(),
        category_id: category.id.toString(),
      }, headers)).map(mapMarketFromApi)
    : [];

  // If no real markets, use mock data for demonstration
  if (markets.length === 0) {
    markets = categoryMarkets as Array<Record<string, unknown>>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Section */}
      <div className="bg-card border-b">
        {/* Back Button */}
        <div className="container mx-auto px-4 pt-4">
          <BackButton variant="ghost" size="sm" fallbackHref="/category" />
        </div>

        {/* Category Identity */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Image */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 border shadow-sm">
              <CategoryHero image={category.image} name={category.name} />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
             
              <h1 className="text-lg sm:text-2xl font-bold leading-tight">{category.name}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {category.description}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{category.marketCount}</span> Markets
                <span className="text-border">·</span>
                <span className="font-medium text-foreground">{category.productCount}</span> Products
                <span className="text-border">·</span>
                <span className={`flex items-center gap-0.5 font-medium ${category.priceChange === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                  {category.priceChange === 'up' ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {Math.abs(category.avgPriceChange)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CategoryClientPage markets={markets} categoryId={category.id.toString()} />
    </div>
  );
}

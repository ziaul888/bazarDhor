import { CategoryClientPage } from './_components/category-client-page';
import { CategoryHero } from './_components/category-hero';
import { categoryServerApi } from '@/lib/api/services/server/category-server';
import { marketServerApi } from '@/lib/api/services/server/market-server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// Mock data for category details (kept as fallback)
const categoryData: Record<string, any> = {
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
  const zoneId = (await cookieStore).get('zoneId')?.value;

  const headers: Record<string, string> = {};
  if (zoneId) {
    headers['zoneId'] = zoneId;
  }

  // Fetch real category data from organized server service
  const apiCategory = await categoryServerApi.getCategoryById(slug, headers);

  // Determine which category data to use
  let category = apiCategory ? {
    id: apiCategory.id,
    name: apiCategory.name,
    description: apiCategory.description || "Local market category",
    image: apiCategory.image_path ? (apiCategory.image_path.startsWith('http') ? apiCategory.image_path : `https://bazardor.chhagolnaiyasportareana.xyz/storage/${apiCategory.image_path}`) : (categoryData[slug]?.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop"),
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
  console.log({ category });


  if (!category) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-muted-foreground">?</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find the category you're looking for.
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/category">Browse All Categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fetch real markets for this category from organized server service
  let markets = await marketServerApi.getMarketsByCategory(category.id.toString(), 50, headers);

  // If no real markets, use mock data for demonstration
  if (markets.length === 0) {
    markets = categoryMarkets as any;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header - Server Rendered */}
      <div className="relative">
        {/* Hero Image */}
        <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
          <CategoryHero
            image={category.image}
            name={category.name}
          />

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

        {/* Stats Bar - Server Rendered */}
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

      <CategoryClientPage markets={markets} />
    </div>
  );
}

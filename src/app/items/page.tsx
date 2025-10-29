"use client";

import { useState, useEffect } from 'react';
import { ItemCard } from '@/components/item-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Grid3X3, List, SlidersHorizontal, MapPin, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample items data - this would come from your API
const allItems = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    marketName: "Green Valley Farm Market",
    marketId: 1,
    currentPrice: 3.99,
    previousPrice: 4.50,
    image: "https://images.unsplash.com/photo-1546470427-e5ac89cd0b31?w=400&h=300&fit=crop",
    category: "Vegetables",
    priceChange: "down" as const,
    priceChangePercent: -11.3,
    lastUpdated: "2024-01-15T14:30:00Z",
    unit: "kg",
    inStock: true,
    rating: 4.8,
    reviews: 124,
    distance: "0.8 km",
    vendor: {
      id: 101,
      name: "Organic Farms Co.",
      rating: 4.7
    },
    description: "Fresh, juicy organic tomatoes grown locally without pesticides",
    organic: true,
    featured: true
  },
  {
    id: 2,
    name: "Fresh Chicken Breast",
    marketName: "City Meat Market",
    marketId: 2,
    currentPrice: 7.50,
    previousPrice: 8.00,
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
    category: "Meat & Poultry",
    priceChange: "down" as const,
    priceChangePercent: -6.25,
    lastUpdated: "2024-01-15T13:45:00Z",
    unit: "kg",
    inStock: true,
    rating: 4.6,
    reviews: 89,
    distance: "1.2 km",
    vendor: {
      id: 102,
      name: "Fresh Meat Co.",
      rating: 4.5
    },
    description: "Premium quality chicken breast, farm-raised and hormone-free",
    organic: false,
    featured: false
  },
  {
    id: 3,
    name: "Whole Milk",
    marketName: "Dairy Fresh Co.",
    marketId: 3,
    currentPrice: 2.99,
    previousPrice: 2.75,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
    category: "Dairy",
    priceChange: "up" as const,
    priceChangePercent: 8.7,
    lastUpdated: "2024-01-15T12:20:00Z",
    unit: "L",
    inStock: true,
    rating: 4.4,
    reviews: 156,
    distance: "0.5 km",
    vendor: {
      id: 103,
      name: "Local Dairy Farm",
      rating: 4.6
    },
    description: "Fresh whole milk from grass-fed cows, rich in nutrients",
    organic: true,
    featured: false
  },
  {
    id: 4,
    name: "Basmati Rice Premium",
    marketName: "Grain House Market",
    marketId: 4,
    currentPrice: 10.50,
    previousPrice: 11.00,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    category: "Grains",
    priceChange: "down" as const,
    priceChangePercent: -4.5,
    lastUpdated: "2024-01-15T11:15:00Z",
    unit: "2kg",
    inStock: true,
    rating: 4.9,
    reviews: 203,
    distance: "2.1 km",
    vendor: {
      id: 104,
      name: "Premium Grains Ltd.",
      rating: 4.8
    },
    description: "Authentic basmati rice with long grains and aromatic fragrance",
    organic: false,
    featured: true
  },
  {
    id: 5,
    name: "Fresh Atlantic Salmon",
    marketName: "Ocean Fresh Market",
    marketId: 5,
    currentPrice: 13.50,
    previousPrice: 12.99,
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop",
    category: "Seafood",
    priceChange: "up" as const,
    priceChangePercent: 3.9,
    lastUpdated: "2024-01-15T10:30:00Z",
    unit: "500g",
    inStock: true,
    rating: 4.7,
    reviews: 78,
    distance: "1.8 km",
    vendor: {
      id: 105,
      name: "Ocean Catch Co.",
      rating: 4.6
    },
    description: "Fresh Atlantic salmon, wild-caught and sustainably sourced",
    organic: false,
    featured: false
  },
  {
    id: 6,
    name: "Mixed Seasonal Vegetables",
    marketName: "Farm Direct Market",
    marketId: 6,
    currentPrice: 5.25,
    previousPrice: 5.75,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    category: "Vegetables",
    priceChange: "down" as const,
    priceChangePercent: -8.7,
    lastUpdated: "2024-01-15T09:45:00Z",
    unit: "kg",
    inStock: true,
    rating: 4.5,
    reviews: 92,
    distance: "1.5 km",
    vendor: {
      id: 106,
      name: "Seasonal Harvest",
      rating: 4.4
    },
    description: "Fresh mix of seasonal vegetables including carrots, broccoli, and bell peppers",
    organic: true,
    featured: false
  },
  {
    id: 7,
    name: "Artisan Sourdough Bread",
    marketName: "Baker's Corner",
    marketId: 7,
    currentPrice: 4.50,
    previousPrice: 4.25,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    category: "Bakery",
    priceChange: "up" as const,
    priceChangePercent: 5.9,
    lastUpdated: "2024-01-15T08:20:00Z",
    unit: "loaf",
    inStock: true,
    rating: 4.8,
    reviews: 167,
    distance: "0.7 km",
    vendor: {
      id: 107,
      name: "Artisan Bakery",
      rating: 4.9
    },
    description: "Handcrafted sourdough bread with a crispy crust and soft interior",
    organic: false,
    featured: true
  },
  {
    id: 8,
    name: "Fresh Bananas",
    marketName: "Tropical Fruits Market",
    marketId: 8,
    currentPrice: 1.99,
    previousPrice: 2.25,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
    category: "Fruits",
    priceChange: "down" as const,
    priceChangePercent: -11.6,
    lastUpdated: "2024-01-15T07:30:00Z",
    unit: "kg",
    inStock: true,
    rating: 4.3,
    reviews: 134,
    distance: "2.3 km",
    vendor: {
      id: 108,
      name: "Tropical Imports",
      rating: 4.2
    },
    description: "Sweet and ripe bananas, perfect for snacking or smoothies",
    organic: false,
    featured: false
  },
  {
    id: 9,
    name: "Greek Yogurt Natural",
    marketName: "Dairy Fresh Co.",
    marketId: 3,
    currentPrice: 4.25,
    previousPrice: 3.99,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
    category: "Dairy",
    priceChange: "up" as const,
    priceChangePercent: 6.5,
    lastUpdated: "2024-01-15T06:45:00Z",
    unit: "500g",
    inStock: true,
    rating: 4.6,
    reviews: 98,
    distance: "0.5 km",
    vendor: {
      id: 103,
      name: "Local Dairy Farm",
      rating: 4.6
    },
    description: "Creamy Greek yogurt made from organic milk, high in protein",
    organic: true,
    featured: false
  },
  {
    id: 10,
    name: "Extra Virgin Olive Oil",
    marketName: "Mediterranean Store",
    marketId: 9,
    currentPrice: 8.99,
    previousPrice: 9.50,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
    category: "Oils & Condiments",
    priceChange: "down" as const,
    priceChangePercent: -5.4,
    lastUpdated: "2024-01-15T05:20:00Z",
    unit: "500ml",
    inStock: true,
    rating: 4.9,
    reviews: 245,
    distance: "1.9 km",
    vendor: {
      id: 109,
      name: "Mediterranean Imports",
      rating: 4.8
    },
    description: "Premium extra virgin olive oil from Mediterranean olives",
    organic: true,
    featured: true
  },
  {
    id: 11,
    name: "Farm Fresh Eggs",
    marketName: "Farm Fresh Market",
    marketId: 10,
    currentPrice: 3.75,
    previousPrice: 3.50,
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop",
    category: "Dairy",
    priceChange: "up" as const,
    priceChangePercent: 7.1,
    lastUpdated: "2024-01-15T04:15:00Z",
    unit: "12 pcs",
    inStock: true,
    rating: 4.7,
    reviews: 187,
    distance: "1.1 km",
    vendor: {
      id: 110,
      name: "Free Range Farm",
      rating: 4.8
    },
    description: "Fresh eggs from free-range chickens, rich in omega-3",
    organic: true,
    featured: false
  },
  {
    id: 12,
    name: "Red Delicious Apples",
    marketName: "Orchard Direct",
    marketId: 11,
    currentPrice: 4.50,
    previousPrice: 4.99,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
    category: "Fruits",
    priceChange: "down" as const,
    priceChangePercent: -9.8,
    lastUpdated: "2024-01-15T03:30:00Z",
    unit: "kg",
    inStock: false,
    rating: 4.4,
    reviews: 156,
    distance: "2.8 km",
    vendor: {
      id: 111,
      name: "Apple Orchard Co.",
      rating: 4.5
    },
    description: "Crisp and sweet red delicious apples, perfect for snacking",
    organic: false,
    featured: false
  }
];

const categories = [
  "All Categories",
  "Vegetables",
  "Fruits", 
  "Meat & Poultry",
  "Dairy",
  "Seafood",
  "Grains",
  "Bakery",
  "Oils & Condiments"
];

const sortOptions = [
  { value: "name", label: "Name A-Z" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "distance", label: "Nearest First" },
  { value: "updated", label: "Recently Updated" }
];

export default function ItemsPage() {
  const [items, setItems] = useState(allItems);
  const [filteredItems, setFilteredItems] = useState(allItems);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showOrganicOnly, setShowOrganicOnly] = useState(false);

  // Filter and sort items
  useEffect(() => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.marketName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(item => 
      item.currentPrice >= priceRange.min && item.currentPrice <= priceRange.max
    );

    // In stock filter
    if (showInStockOnly) {
      filtered = filtered.filter(item => item.inStock);
    }

    // Organic filter
    if (showOrganicOnly) {
      filtered = filtered.filter(item => item.organic);
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.currentPrice - b.currentPrice;
        case "price-high":
          return b.currentPrice - a.currentPrice;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "distance":
          return parseFloat(a.distance?.replace(' km', '') || '0') - parseFloat(b.distance?.replace(' km', '') || '0');
        case "updated":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedCategory, sortBy, priceRange, showInStockOnly, showOrganicOnly]);

  const handleAddToCart = (itemId: number) => {
    console.log(`Added item ${itemId} to cart`);
    // Implement cart functionality
  };

  const handleToggleFavorite = (itemId: number) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4">
            {/* Title and View Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Items</h1>
                <p className="text-gray-600">{filteredItems.length} items available</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search items, markets, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full sm:w-auto"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        className="w-20"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="w-20"
                      />
                    </div>
                  </div>

                  {/* Stock Filter */}
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showInStockOnly}
                        onChange={(e) => setShowInStockOnly(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">In Stock Only</span>
                    </label>
                  </div>

                  {/* Organic Filter */}
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showOrganicOnly}
                        onChange={(e) => setShowOrganicOnly(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Organic Only</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Grid/List */}
      <div className="container mx-auto px-4 py-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1 max-w-4xl mx-auto"
          }`}>
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(item.id)}
                compact={viewMode === "list"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
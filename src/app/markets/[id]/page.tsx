"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Users,
  Phone,
  Globe,
  Car,
  CreditCard,
  Truck,
  Heart,
  Share2,
  Navigation,
  Tag,
  Search,
  Filter,

} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { ProductCard } from '@/components/product-card';
import { ProductPriceDialog } from '@/components/product-price-dialog';

// Mock market data - in real app, this would come from API based on [id]
const marketData = {
  id: 1,
  name: "Downtown Farmers Market",
  description: "A vibrant community market featuring fresh local produce, artisanal goods, and specialty foods from over 30 vendors. Established in 1985, we've been serving the downtown community with the freshest ingredients and unique handcrafted items.",
  address: "123 Main Street, Downtown",
  fullAddress: "123 Main Street, Downtown, City Center, State 12345",
  distance: "0.5 km",
  coordinates: { lat: 40.7128, lng: -74.0060 },
  openTime: "8:00 AM - 6:00 PM",
  rating: 4.8,
  reviews: 245,
  vendors: 32,
  images: [
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop"
  ],
  isOpen: true,
  specialties: ["Fresh Produce", "Artisan Crafts", "Organic Food", "Local Honey"],
  featured: true,
  type: "Farmers Market",
  priceRange: "$",
  hasParking: true,
  acceptsCards: true,
  hasDelivery: false,
  phone: "+1 (555) 123-4567",
  website: "www.downtownmarket.com",
  email: "info@downtownmarket.com",
  established: "1985",
  operatingDays: ["Monday", "Wednesday", "Friday", "Saturday"],
  features: {
    freeParking: true,
    organicCertified: true,
    petFriendly: true,
    wheelchairAccessible: true,
    restrooms: true,
    atm: true
  },
  socialMedia: {
    facebook: "downtownmarket",
    instagram: "downtown_market",
    twitter: "downtownmarket"
  }
};

const recentPrices = [
  {
    id: 1,
    product: "Organic Tomatoes",
    price: 4.99,
    unit: "kg",
    vendor: "Green Valley Farm",
    change: "down",
    lastUpdated: "2 hours ago",
    image: "https://images.unsplash.com/photo-1546470427-e5ac89cd0b31?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    product: "Fresh Chicken",
    price: 7.50,
    unit: "kg",
    vendor: "Farm Fresh Poultry",
    change: "up",
    lastUpdated: "4 hours ago",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    product: "Local Honey",
    price: 12.99,
    unit: "jar",
    vendor: "Bee Happy Honey",
    change: "down",
    lastUpdated: "1 day ago",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    product: "Artisan Bread",
    price: 5.50,
    unit: "loaf",
    vendor: "Baker's Corner",
    change: "up",
    lastUpdated: "3 hours ago",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop"
  }
];

const categories = [
  { id: 'all', name: 'All Items', count: 8 },
  { id: 'Vegetables', name: 'Vegetables', count: 1 },
  { id: 'Fruits', name: 'Fruits', count: 1 },
  { id: 'Meat & Poultry', name: 'Meat & Poultry', count: 1 },
  { id: 'Dairy', name: 'Dairy', count: 1 },
  { id: 'Bakery', name: 'Bakery', count: 1 },
  { id: 'Seafood', name: 'Seafood', count: 1 },
  { id: 'Herbs & Spices', name: 'Herbs & Spices', count: 1 },
  { id: 'Pantry', name: 'Pantry', count: 1 }
];

const marketItems = [
  {
    id: 1,
    name: "Organic Tomatoes",
    marketName: "Green Valley Farm",
    currentPrice: 4.99,
    unit: "kg",
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1546470427-e5ac89cd0b31?w=300&h=300&fit=crop",
    priceChange: "down",
    lastUpdated: "2 hours ago"
  },
  {
    id: 2,
    name: "Fresh Chicken Breast",
    marketName: "Farm Fresh Poultry",
    currentPrice: 12.99,
    unit: "kg",
    category: "Meat & Poultry",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop",
    priceChange: "up",
    lastUpdated: "1 hour ago"
  },
  {
    id: 3,
    name: "Local Honey",
    marketName: "Bee Happy Honey",
    currentPrice: 12.99,
    unit: "jar",
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop",
    priceChange: "down",
    lastUpdated: "3 hours ago"
  },
  {
    id: 4,
    name: "Artisan Sourdough",
    marketName: "Baker's Corner",
    currentPrice: 5.50,
    unit: "loaf",
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop",
    priceChange: "up",
    lastUpdated: "30 min ago"
  },
  {
    id: 5,
    name: "Fresh Apples",
    marketName: "Orchard Fresh",
    currentPrice: 3.99,
    unit: "kg",
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=300&fit=crop",
    priceChange: "down",
    lastUpdated: "4 hours ago"
  },
  {
    id: 6,
    name: "Farm Fresh Milk",
    marketName: "Dairy Delight",
    currentPrice: 2.99,
    unit: "L",
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop",
    priceChange: "up",
    lastUpdated: "1 hour ago"
  },
  {
    id: 7,
    name: "Fresh Salmon",
    marketName: "Ocean Fresh",
    currentPrice: 18.99,
    unit: "kg",
    category: "Seafood",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=300&fit=crop",
    priceChange: "down",
    lastUpdated: "2 hours ago"
  },
  {
    id: 8,
    name: "Organic Basil",
    marketName: "Herb Garden",
    currentPrice: 2.50,
    unit: "bunch",
    category: "Herbs & Spices",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop",
    priceChange: "up",
    lastUpdated: "5 hours ago"
  }
];

export default function MarketDetailsPage({ params }: { params: { id: string } }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState(marketItems);
  const [selectedItem, setSelectedItem] = useState<(typeof marketItems)[number] | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.marketName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const { totalPages, getPaginatedItems, getPaginationInfo } = usePagination(filteredItems, 8);
  const paginatedItems = getPaginatedItems(currentPage);
  const paginationInfo = getPaginationInfo(currentPage);

  // Reset pagination when filters change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleUpdatePrice = (item: (typeof marketItems)[number]) => {
    setSelectedItem(item);
    setNewPrice(item.currentPrice.toString());
    setIsModalOpen(true);
  };

  const handleSavePrice = () => {
    if (!selectedItem) return;
    const parsed = parseFloat(newPrice);
    if (Number.isNaN(parsed)) return;
    setItems(prev =>
      prev.map(item =>
        item.id === selectedItem.id
          ? { ...item, currentPrice: parsed, lastUpdated: 'Just now' }
          : item
      )
    );
    setIsModalOpen(false);
  };



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/markets">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">{marketData.name}</h1>
                <p className="text-sm text-muted-foreground">{marketData.type}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Market Info Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Market Details */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${marketData.isOpen
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                      }`}>
                      {marketData.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                    <span className="text-sm text-muted-foreground">{marketData.type}</span>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{marketData.rating}</span>
                      <span className="text-sm text-muted-foreground">({marketData.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{marketData.vendors} vendors</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                {marketData.description}
              </p>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{marketData.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{marketData.openTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{marketData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{marketData.website}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                {marketData.features.freeParking && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-full text-xs">
                    <Car className="h-3 w-3" />
                    <span>Free Parking</span>
                  </span>
                )}
                {marketData.acceptsCards && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-info/10 text-info rounded-full text-xs">
                    <CreditCard className="h-3 w-3" />
                    <span>Cards Accepted</span>
                  </span>
                )}
                {marketData.hasDelivery && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-warning/10 text-warning rounded-full text-xs">
                    <Truck className="h-3 w-3" />
                    <span>Delivery</span>
                  </span>
                )}
                {marketData.features.organicCertified && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-full text-xs">
                    <span>🌱</span>
                    <span>Organic</span>
                  </span>
                )}
              </div>
            </div>

            {/* Map & Directions */}
            <div className="lg:col-span-1">
              <div className="bg-muted/30 rounded-lg p-4 h-48 lg:h-full min-h-[200px] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Location</h3>
                  <span className="text-xs text-muted-foreground">{marketData.distance} away</span>
                </div>

                {/* Placeholder for map */}
                <div className="flex-1 bg-muted rounded-lg flex items-center justify-center mb-3">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Interactive Map</p>
                    <p className="text-xs">Coming Soon</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" className="w-full">
                    <Navigation className="h-3 w-3 mr-1" />
                    Directions
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        {/* Search & Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative w-full lg:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 lg:flex-nowrap lg:gap-4">
            {/* Verification Tag */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-success/10 text-success rounded-full border border-success/20 whitespace-nowrap">
              <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Verified Market</span>
            </div>

            {/* Contributors Info */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-info/10 text-info rounded-full border border-info/20 whitespace-nowrap">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">127 Contributors</span>
            </div>

            {/* Last Update Info */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-muted/50 text-muted-foreground rounded-full border border-border whitespace-nowrap">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">Updated 2h ago</span>
            </div>
          </div>
        </div>

        {/* Category Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
                  }`}
              >
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold">
              {selectedCategory === 'all' ? 'All Items' : categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <span className="text-sm text-muted-foreground">
              Showing {paginationInfo.startIndex}-{paginationInfo.endIndex} of {paginationInfo.totalItems} items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedItems.map((item) => (
              <ProductCard
                key={item.id}
                item={{ ...item, marketId: marketData.id }}
                onUpdatePrice={handleUpdatePrice}
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

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or selecting a different category.
              </p>
            </div>
          )}
        </div>
      </div>


      <ProductPriceDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={selectedItem}
        newPrice={newPrice}
        onNewPriceChange={setNewPrice}
        onSave={handleSavePrice}
        confirmLabel="Save"
      />

    </div>
  );
}

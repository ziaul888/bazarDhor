// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Market types
export interface Market {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  distance: string;
  openTime: string;
  image: string;
  rating: number;
  reviews: number;
  vendors: number;
  isOpen: boolean;
  isVerified: boolean;
  contributors: number;
  lastUpdated: string;
  categories: string[];
  specialties: string[];
  featured: boolean;
  type: string;
  priceRange: string;
  hasParking: boolean;
  acceptsCards: boolean;
  hasDelivery: boolean;
}

export interface MarketItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  priceChange: 'up' | 'down';
  marketId: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favoriteMarkets: string[];
}

// Query parameters
export interface MarketFilters {
  search?: string;
  category?: string;
  location?: string;
  verified?: boolean;
  page?: number;
  limit?: number;
}

export interface ItemFilters {
  search?: string;
  category?: string;
  inStock?: boolean;
  priceRange?: [number, number];
  page?: number;
  limit?: number;
}
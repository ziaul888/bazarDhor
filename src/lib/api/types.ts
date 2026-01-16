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
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
    location: {
      lat?: number;
      lng?: number;
      address?: string;
    };
  };
}

// Query parameters
export interface MarketFilters {
  search?: string;
  category?: string;
  location?: string;
  verified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'distance' | 'rating' | 'name' | 'reviews';
  sortOrder?: 'asc' | 'desc';
}

export interface ItemFilters {
  search?: string;
  category?: string;
  inStock?: boolean;
  priceRange?: [number, number];
  page?: number;
  limit?: number;
  marketId?: string;
  sortBy?: 'price' | 'name' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  itemCount: number;
  marketCount: number;
  popular: boolean;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  marketId: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

// Price comparison types
export interface PriceComparison {
  itemName: string;
  category: string;
  markets: Array<{
    marketId: string;
    marketName: string;
    price: number;
    inStock: boolean;
    lastUpdated: string;
  }>;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  dob: string;
  gender: string;
  city: string;
  division: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Contribution types
export interface PriceUpdate {
  itemId: string;
  marketId: string;
  price: number;
  inStock: boolean;
}

export interface NewItem {
  name: string;
  category: string;
  marketId: string;
  price: number;
  image?: string;
  description?: string;
}

// Zone types
export interface ZoneCoordinates {
  lat: number;
  lng: number;
}

export interface Zone {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  // Optional fields that might still be useful if the API evolves or for UI state
  slug?: string;
  coordinates?: ZoneCoordinates;
  radius?: number;
  deliveryAvailable?: boolean;
  markets?: string[];
}

export interface GetZoneRequest {
  lat: number;
  lng: number;
}

// Based on the user's JSON, the response data IS the zone object
export type GetZoneResponse = Zone;
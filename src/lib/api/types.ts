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

export interface ProductPrice {
  id: string;
  price: number;
  discount_price: number | null;
  price_date: string;
  last_update: string;
  market: {
    id: string;
    name: string;
  };
}

export interface Product {
  id: string;
  name: string;
  image_path: string;
  description: string;
  status: string;
  is_visible: boolean;
  is_featured: boolean;
  brand?: string;
  country_of_origin?: string;
  category: Category;
  unit: {
    id: string;
    name: string;
    symbol: string;
    unit_type: string;
  };
  market_prices: ProductPrice[];
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

export interface MarketListParams {
  user_lat: number;
  user_lng: number;
  limit?: number;
  offset?: number;
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
  id: string | number;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  itemCount?: number;
  marketCount?: number;
  product_count?: number;
  market_count?: number;
  unique_market_count?: number;
  vendor_count?: number;
  popular: boolean | number;
  image?: string;
  image_path?: string;
  rating?: number;
}

export interface CategoryListParams {
  limit?: number;
  offset?: number;
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
export interface MarketComparisonParams {
  market_id_1: string;
  market_id_2: string;
  user_lat: number;
  user_lng: number;
}

export interface ComparedMarket {
  id: string;
  name: string;
  type: string;
  address: string;
  distance_km: number;
  active_products_count: number;
  open_days_count: number;
  features: {
    non_veg_available: boolean;
    halal_available: boolean;
    parking_available: boolean;
    restroom_available: boolean;
    home_delivery: boolean;
  };
  opening_hours: Array<{
    day: string;
    is_closed: boolean;
    opening: string | null;
    closing: string | null;
  }>;
}

export interface MarketComparisonResponse {
  market_1: ComparedMarket;
  market_2: ComparedMarket;
}

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
  image?: any | null;
  referred_by?: string;
}

export interface AuthResponse {
  user: User;
  access_token?: string;
  token?: string; // legacy/alternate key
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

// User product contribution types
export interface CreateUserProductPayload {
  name: string;
  category?: string;
  categoryId?: string;
  marketId?: string;
  price?: number;
  unit?: string;
  image?: string;
  description?: string;
  [key: string]: unknown;
}

export interface UserProduct {
  id: string | number;
  name?: string;
  price?: number;
  image?: string;
  description?: string;
  [key: string]: unknown;
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

// Banner types
export interface Banner {
  id: string;
  title: string;
  image_path: string;
  url: string | null;
  type: string;
  description: string | null;
  badge_text: string | null;
  badge_color: string | null;
  badge_background_color: string | null;
  badge_icon: string | null;
  button_text: string | null;
  is_active: boolean;
  position: number;
}

export interface BannerResponse {
  data: Banner[];
  errors: unknown[];
}

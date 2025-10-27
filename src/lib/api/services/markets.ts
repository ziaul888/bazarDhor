import { apiClient } from '../client';
import type { 
  Market, 
  MarketItem, 
  MarketFilters, 
  ItemFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

export const marketsApi = {
  // Get all markets with filters
  getMarkets: async (filters?: MarketFilters): Promise<PaginatedResponse<Market>> => {
    const { data } = await apiClient.get('/markets', { params: filters });
    return data;
  },

  // Get single market by ID
  getMarket: async (id: string): Promise<ApiResponse<Market>> => {
    const { data } = await apiClient.get(`/markets/${id}`);
    return data;
  },

  // Get market items
  getMarketItems: async (marketId: string, filters?: ItemFilters): Promise<PaginatedResponse<MarketItem>> => {
    const { data } = await apiClient.get(`/markets/${marketId}/items`, { params: filters });
    return data;
  },

  // Search markets
  searchMarkets: async (query: string): Promise<ApiResponse<Market[]>> => {
    const { data } = await apiClient.get('/markets/search', { params: { q: query } });
    return data;
  },

  // Get nearby markets
  getNearbyMarkets: async (lat: number, lng: number, radius?: number): Promise<ApiResponse<Market[]>> => {
    const { data } = await apiClient.get('/markets/nearby', { 
      params: { lat, lng, radius: radius || 10 } 
    });
    return data;
  },

  // Get market categories
  getCategories: async (): Promise<ApiResponse<string[]>> => {
    const { data } = await apiClient.get('/markets/categories');
    return data;
  },
};
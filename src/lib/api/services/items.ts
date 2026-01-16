import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse, MarketItem, ItemFilters, PriceComparison, NewItem } from '../types';

export const itemsApi = {
  // Get all items with filters
  getAll: async (filters?: ItemFilters): Promise<PaginatedResponse<MarketItem>> => {
    const response = await apiClient.get<PaginatedResponse<MarketItem>>('/items', {
      params: filters,
    });
    return response.data;
  },

  // Get item by ID
  getById: async (id: string): Promise<MarketItem> => {
    const response = await apiClient.get<ApiResponse<MarketItem>>(`/items/${id}`);
    return response.data.data;
  },

  // Get items by market
  getByMarket: async (marketId: string, filters?: ItemFilters): Promise<PaginatedResponse<MarketItem>> => {
    const response = await apiClient.get<PaginatedResponse<MarketItem>>(`/markets/${marketId}/items`, {
      params: filters,
    });
    return response.data;
  },

  // Get items by category
  getByCategory: async (category: string, filters?: ItemFilters): Promise<PaginatedResponse<MarketItem>> => {
    const response = await apiClient.get<PaginatedResponse<MarketItem>>('/items', {
      params: { ...filters, category },
    });
    return response.data;
  },

  // Search items
  search: async (query: string, filters?: ItemFilters): Promise<PaginatedResponse<MarketItem>> => {
    const response = await apiClient.get<PaginatedResponse<MarketItem>>('/items/search', {
      params: { ...filters, search: query },
    });
    return response.data;
  },

  // Get price comparison for an item
  getPriceComparison: async (itemName: string): Promise<PriceComparison> => {
    const response = await apiClient.get<ApiResponse<PriceComparison>>('/items/price-comparison', {
      params: { itemName },
    });
    return response.data.data;
  },

  // Create new item (contribution)
  create: async (data: NewItem): Promise<MarketItem> => {
    const response = await apiClient.post<ApiResponse<MarketItem>>('/items', data);
    return response.data.data;
  },

  // Update item price
  updatePrice: async (id: string, price: number, inStock: boolean): Promise<MarketItem> => {
    const response = await apiClient.patch<ApiResponse<MarketItem>>(`/items/${id}/price`, {
      price,
      inStock,
    });
    return response.data.data;
  },

  // Get trending items
  getTrending: async (limit = 10): Promise<MarketItem[]> => {
    const response = await apiClient.get<ApiResponse<MarketItem[]>>('/items/trending', {
      params: { limit },
    });
    return response.data.data;
  },
};
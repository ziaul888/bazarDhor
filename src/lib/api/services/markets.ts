import { apiClient } from '../client';
import type {
  Market,
  MarketItem,
  MarketFilters,
  MarketListParams,
  ItemFilters,
  ApiResponse,
  PaginatedResponse,
  Product,
  MarketComparisonParams,
  MarketComparisonResponse,
  MarketProductComparisonParams,
  MarketProductComparisonResponse
} from '../types';

export const marketsApi = {
  // Get all markets with filters
  getMarkets: async (filters?: MarketFilters): Promise<PaginatedResponse<Market>> => {
    const { data } = await apiClient.get('/markets', { params: filters });
    return data;
  },

  // Get single market by ID
  getMarket: async (id: string): Promise<ApiResponse<Market>> => {
    const { data } = await apiClient.get(`/market/details/${id}`);
    return data;
  },

  // Get market items
  getMarketItems: async (marketId: string, filters?: ItemFilters): Promise<PaginatedResponse<MarketItem>> => {
    const limit = filters?.limit ?? 15;
    const page = filters?.page ?? 1;
    const offset = page;

    const { data } = await apiClient.get(`/market/products/${marketId}`, {
      params: {
        limit,
        offset,
        ...(filters?.search ? { search: filters.search } : {}),
        ...(filters?.category ? { category: filters.category } : {}),
        ...(filters?.sortBy ? { sort_by: filters.sortBy, sort_order: filters.sortOrder ?? 'asc' } : {}),
      },
    });

    const payload = data as Record<string, unknown>;
    const items = (
      payload.data ??
      payload.products ??
      payload.items ??
      []
    ) as MarketItem[];

    const rawPagination = (payload.pagination ?? payload.meta ?? {}) as Record<string, unknown>;
    const total =
      Number(rawPagination.total ?? rawPagination.total_count ?? items.length) || items.length;
    const currentPage =
      Number(rawPagination.page ?? rawPagination.offset ?? offset) || offset;
    const pageLimit = Number(rawPagination.limit ?? limit) || limit;
    const totalPages =
      Number(rawPagination.totalPages ?? rawPagination.total_pages) ||
      Math.max(1, Math.ceil(total / pageLimit));

    return {
      data: items,
      pagination: {
        page: currentPage,
        limit: pageLimit,
        total,
        totalPages,
      },
    };
  },

  // Search markets
  searchMarkets: async (query: string, categoryId?: string): Promise<ApiResponse<Market[]>> => {
    const { data } = await apiClient.get('/markets/search', {
      params: { q: query, ...(categoryId ? { category_id: categoryId } : {}) },
    });
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

  // Get random list of markets
  getRandomMarkets: async (): Promise<Market[]> => {
    const { data } = await apiClient.get<{ data: Market[] }>('/markets/random-list');
    return data.data || [];
  },

  // Get markets list by user location (offset/limit)
  getMarketList: async (params: MarketListParams): Promise<unknown> => {
    const { data } = await apiClient.get('/markets/list', { params });
    return data;
  },

  // Get random list of products
  getRandomProducts: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<{ data: Product[] }>('/markets/random-product-list');
    return data.data || [];
  },

  // Compare two markets
  compareMarkets: async (params: MarketComparisonParams): Promise<ApiResponse<MarketComparisonResponse>> => {
    const { data } = await apiClient.get('/markets/compare', { params });
    return data;
  },

  compareProducts: async (params: MarketProductComparisonParams): Promise<ApiResponse<MarketProductComparisonResponse>> => {
    const { data } = await apiClient.get('/markets/compare-products', { params });
    return data;
  },
};

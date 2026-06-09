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

export type RandomProductsParams = {
  category_id?: string | number;
  market_id?: string | number;
  sort_by?: 'latest' | 'trending' | 'random';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
};

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

    const { data } = await apiClient.get('/products', {
      params: {
        market_id: marketId,
        limit,
        offset,
        sort: filters?.sortBy ?? 'latest',
        ...(filters?.search ? { search: filters.search } : {}),
        ...(filters?.category ? { category_id: filters.category } : {}),
        ...(filters?.sortOrder ? { sort_order: filters.sortOrder } : {}),
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

  // Search markets (uses /markets with `search` as the query param)
  searchMarkets: async (query: string, categoryId?: string): Promise<ApiResponse<Market[]>> => {
    const { data } = await apiClient.get('/markets', {
      params: { search: query, ...(categoryId ? { category_id: categoryId } : {}) },
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
    const { data } = await apiClient.get<{ data: Market[] }>('/markets/random');
    return data.data || [];
  },

  // Get markets list by user location (offset/limit)
  getMarketList: async (params: MarketListParams): Promise<unknown> => {
    const categoryId = params.category_id ?? params.categoryId;
    const { data } = await apiClient.get('/markets', {
      params: {
        ...params,
        ...(categoryId ? { category_id: categoryId, categoryId } : {}),
      },
    });
    return data;
  },

  // Why: callers (e.g. the home Today's prices feed) need to pass category and sort
  // filters down to the backend so the API can return server-filtered/sorted data.
  // How: maps `sort_by` to the backend's `sort` param and forwards `category_id` /
  // `market_id` as-is; falls back to `sort=latest` when no sort is provided.
  getRandomProducts: async (params?: RandomProductsParams): Promise<Product[]> => {
    const query: Record<string, string | number> = { sort: params?.sort_by ?? 'latest' };
    if (params?.category_id != null && params.category_id !== '') query.category_id = params.category_id;
    if (params?.market_id != null && params.market_id !== '') query.market_id = params.market_id;
    if (params?.sort_order) query.sort_order = params.sort_order;
    if (params?.limit != null) query.limit = params.limit;
    if (params?.offset != null) query.offset = params.offset;

    const { data } = await apiClient.get<{ data: Product[] }>('/products', { params: query });
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

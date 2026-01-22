import { useQuery } from '@tanstack/react-query';
import { marketsApi } from '../services/markets';
import type { MarketFilters, ItemFilters } from '../types';

// Query keys for better cache management
export const marketKeys = {
  all: ['markets'] as const,
  lists: () => [...marketKeys.all, 'list'] as const,
  list: (filters: MarketFilters) => [...marketKeys.lists(), filters] as const,
  details: () => [...marketKeys.all, 'detail'] as const,
  detail: (id: string) => [...marketKeys.details(), id] as const,
  items: (id: string) => [...marketKeys.detail(id), 'items'] as const,
  itemsList: (id: string, filters: ItemFilters) => [...marketKeys.items(id), filters] as const,
  search: (query: string) => [...marketKeys.all, 'search', query] as const,
  nearby: (lat: number, lng: number) => [...marketKeys.all, 'nearby', lat, lng] as const,
  categories: () => [...marketKeys.all, 'categories'] as const,
  random: () => [...marketKeys.all, 'random'] as const,
  randomProducts: () => [...marketKeys.all, 'random-products'] as const,
};

// Get markets with filters
export const useMarkets = (filters?: MarketFilters) => {
  return useQuery({
    queryKey: marketKeys.list(filters || {}),
    queryFn: () => marketsApi.getMarkets(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single market
export const useMarket = (id: string) => {
  return useQuery({
    queryKey: marketKeys.detail(id),
    queryFn: () => marketsApi.getMarket(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get market items
export const useMarketItems = (marketId: string, filters?: ItemFilters) => {
  return useQuery({
    queryKey: marketKeys.itemsList(marketId, filters || {}),
    queryFn: () => marketsApi.getMarketItems(marketId, filters),
    enabled: !!marketId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Search markets
export const useSearchMarkets = (query: string) => {
  return useQuery({
    queryKey: marketKeys.search(query),
    queryFn: () => marketsApi.searchMarkets(query),
    enabled: query.length > 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get nearby markets
export const useNearbyMarkets = (lat?: number, lng?: number, radius?: number) => {
  return useQuery({
    queryKey: marketKeys.nearby(lat || 0, lng || 0),
    queryFn: () => marketsApi.getNearbyMarkets(lat!, lng!, radius),
    enabled: !!(lat && lng),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: marketKeys.categories(),
    queryFn: () => marketsApi.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useRandomMarkets = () => {
  return useQuery({
    queryKey: marketKeys.random(),
    queryFn: () => marketsApi.getRandomMarkets(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRandomProducts = () => {
  return useQuery({
    queryKey: marketKeys.randomProducts(),
    queryFn: () => marketsApi.getRandomProducts(),
    staleTime: 5 * 60 * 1000,
  });
};
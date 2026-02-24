import { useQuery } from '@tanstack/react-query';
import { marketsApi } from '../services/markets';
import type { MarketFilters, MarketListParams, ItemFilters, MarketComparisonParams } from '../types';
import { useZone } from '@/providers/zone-provider';

// Query keys for better cache management
export const marketKeys = {
  all: ['markets'] as const,
  lists: () => [...marketKeys.all, 'list'] as const,
  list: (filters: MarketFilters) => [...marketKeys.lists(), filters] as const,
  listByLocation: (params: MarketListParams) => [...marketKeys.lists(), 'by-location', params] as const,
  details: () => [...marketKeys.all, 'detail'] as const,
  detail: (id: string) => [...marketKeys.details(), id] as const,
  items: (id: string) => [...marketKeys.detail(id), 'items'] as const,
  itemsList: (id: string, filters: ItemFilters) => [...marketKeys.items(id), filters] as const,
  search: (query: string) => [...marketKeys.all, 'search', query] as const,
  nearby: (lat: number, lng: number) => [...marketKeys.all, 'nearby', lat, lng] as const,
  categories: () => [...marketKeys.all, 'categories'] as const,
  random: () => [...marketKeys.all, 'random'] as const,
  randomProducts: () => [...marketKeys.all, 'random-products'] as const,
  compare: (params: MarketComparisonParams) => [...marketKeys.all, 'compare', params] as const,
};

// Get markets with filters
export const useMarkets = (filters?: MarketFilters) => {
  const { zone } = useZone();

  return useQuery({
    queryKey: marketKeys.list(filters || {}),
    queryFn: () => marketsApi.getMarkets(filters),
    enabled: !!zone?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get markets list by user location (offset/limit)
export const useMarketList = (params: MarketListParams) => {
  const { zone } = useZone();

  return useQuery({
    queryKey: marketKeys.listByLocation(params),
    queryFn: () => marketsApi.getMarketList(params),
    enabled: !!zone?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single market
export const useMarket = (id: string) => {
  const { zone } = useZone();

  return useQuery({
    queryKey: marketKeys.detail(id),
    queryFn: () => marketsApi.getMarket(id),
    enabled: !!zone?.id && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get market items
export const useMarketItems = (marketId: string, filters?: ItemFilters) => {
  const { zone } = useZone();

  return useQuery({
    queryKey: marketKeys.itemsList(marketId, filters || {}),
    queryFn: () => marketsApi.getMarketItems(marketId, filters),
    enabled: !!zone?.id && !!marketId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Search markets
export const useSearchMarkets = (query: string) => {
  const { zone } = useZone();

  return useQuery({
    queryKey: marketKeys.search(query),
    queryFn: () => marketsApi.searchMarkets(query),
    enabled: !!zone?.id && query.length > 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get nearby markets
export const useNearbyMarkets = (lat?: number, lng?: number, radius?: number) => {
  const { zone } = useZone();

  return useQuery({
    queryKey: marketKeys.nearby(lat || 0, lng || 0),
    queryFn: () => marketsApi.getNearbyMarkets(lat!, lng!, radius),
    enabled: !!zone?.id && !!(lat && lng),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get categories
export const useCategories = () => {
  const { zone } = useZone();

  return useQuery({
    queryKey: marketKeys.categories(),
    queryFn: () => marketsApi.getCategories(),
    enabled: !!zone?.id,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useRandomMarkets = () => {
  const { zone } = useZone();

  return useQuery({
    queryKey: marketKeys.random(),
    queryFn: () => marketsApi.getRandomMarkets(),
    enabled: !!zone?.id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompareMarkets = (params: MarketComparisonParams, enabled: boolean = true) => {
  const { zone } = useZone();

  return useQuery({
    queryKey: marketKeys.compare(params),
    queryFn: () => marketsApi.compareMarkets(params),
    enabled: !!zone?.id && enabled && !!(params.market_id_1 && params.market_id_2),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRandomProducts = () => {
  const { zone } = useZone();

  return useQuery({
    queryKey: marketKeys.randomProducts(),
    queryFn: () => marketsApi.getRandomProducts(),
    enabled: !!zone?.id,
    staleTime: 5 * 60 * 1000,
  });
};

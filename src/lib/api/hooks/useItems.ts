import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { itemsApi } from '../services/items';
import { MarketItem, ItemFilters, PaginatedResponse, PriceComparison, NewItem } from '../types';

// Query keys
export const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
  list: (filters: ItemFilters) => [...itemKeys.lists(), { filters }] as const,
  details: () => [...itemKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemKeys.details(), id] as const,
  byMarket: (marketId: string) => [...itemKeys.all, 'market', marketId] as const,
  byCategory: (category: string) => [...itemKeys.all, 'category', category] as const,
  search: (query: string) => [...itemKeys.all, 'search', query] as const,
  priceComparison: (itemName: string) => [...itemKeys.all, 'price-comparison', itemName] as const,
  trending: () => [...itemKeys.all, 'trending'] as const,
};

// Get all items with filters
export const useItems = (filters?: ItemFilters): UseQueryResult<PaginatedResponse<MarketItem>, Error> => {
  return useQuery({
    queryKey: itemKeys.list(filters || {}),
    queryFn: () => itemsApi.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get item by ID
export const useItem = (id: string): UseQueryResult<MarketItem, Error> => {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: () => itemsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get items by market
export const useMarketItems = (
  marketId: string,
  filters?: ItemFilters
): UseQueryResult<PaginatedResponse<MarketItem>, Error> => {
  return useQuery({
    queryKey: [...itemKeys.byMarket(marketId), filters],
    queryFn: () => itemsApi.getByMarket(marketId, filters),
    enabled: !!marketId,
    staleTime: 2 * 60 * 1000,
  });
};

// Get items by category
export const useCategoryItems = (
  category: string,
  filters?: ItemFilters
): UseQueryResult<PaginatedResponse<MarketItem>, Error> => {
  return useQuery({
    queryKey: [...itemKeys.byCategory(category), filters],
    queryFn: () => itemsApi.getByCategory(category, filters),
    enabled: !!category,
    staleTime: 2 * 60 * 1000,
  });
};

// Search items
export const useSearchItems = (
  query: string,
  filters?: ItemFilters
): UseQueryResult<PaginatedResponse<MarketItem>, Error> => {
  return useQuery({
    queryKey: [...itemKeys.search(query), filters],
    queryFn: () => itemsApi.search(query, filters),
    enabled: query.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get price comparison
export const usePriceComparison = (itemName: string): UseQueryResult<PriceComparison, Error> => {
  return useQuery({
    queryKey: itemKeys.priceComparison(itemName),
    queryFn: () => itemsApi.getPriceComparison(itemName),
    enabled: !!itemName,
    staleTime: 5 * 60 * 1000,
  });
};

// Get trending items
export const useTrendingItems = (limit = 10): UseQueryResult<MarketItem[], Error> => {
  return useQuery({
    queryKey: [...itemKeys.trending(), limit],
    queryFn: () => itemsApi.getTrending(limit),
    staleTime: 10 * 60 * 1000,
  });
};

// Create new item mutation
export const useCreateItem = (): UseMutationResult<MarketItem, Error, NewItem> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itemsApi.create,
    onSuccess: () => {
      // Invalidate and refetch items
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
    },
  });
};

// Update item price mutation
export const useUpdateItemPrice = (): UseMutationResult<
  MarketItem,
  Error,
  { id: string; price: number; inStock: boolean }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, price, inStock }) => itemsApi.updatePrice(id, price, inStock),
    onSuccess: (data) => {
      // Update the specific item in cache
      queryClient.setQueryData(itemKeys.detail(data.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
    },
  });
};
// Export all API hooks for easy importing

// Markets hooks
export {
  useMarkets,
  useMarket,
  useMarketItems as useMarketItemsList,
  useSearchMarkets,
  useNearbyMarkets,
  useCategories as useMarketCategories,
  marketKeys,
} from './useMarkets';

// User hooks
export * from './useUser';

// Items hooks
export {
  useItems,
  useItem,
  useMarketItems,
  useCategoryItems,
  useSearchItems,
  usePriceComparison,
  useTrendingItems,
  useCreateItem,
  useUpdateItemPrice,
  itemKeys,
} from './useItems';

// Reviews hooks
export * from './useReviews';

// Auth hooks
export * from './useAuth';

// Categories hooks (separate to avoid conflicts)
export {
  useCategories,
  useCategory,
  usePopularCategories,
  categoryKeys,
} from './useCategories';

// Config hooks (zone detection, settings)
export * from './useConfig';
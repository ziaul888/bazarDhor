# React Query API Integration

## ✅ Complete API Integration with React Query

All API endpoints have been integrated with React Query hooks for efficient data fetching, caching, and state management.

## 📁 Project Structure

```
src/lib/api/
├── client.ts                 # Axios client configuration
├── types.ts                  # TypeScript type definitions
├── services/                 # API service functions
│   ├── auth.ts              # Authentication services
│   ├── markets.ts           # Market services
│   ├── items.ts             # Item services
│   ├── categories.ts        # Category services
│   ├── reviews.ts           # Review services
│   └── user.ts              # User services
└── hooks/                    # React Query hooks
    ├── index.ts             # Export all hooks
    ├── useAuth.ts           # Authentication hooks
    ├── useMarkets.ts        # Market hooks
    ├── useItems.ts          # Item hooks
    ├── useCategories.ts     # Category hooks
    ├── useReviews.ts        # Review hooks
    └── useUser.ts           # User hooks
```

## 🎯 Available Hooks

### **Authentication Hooks** (`useAuth.ts`)

```typescript
import { useCurrentUser, useLogin, useLogout, useRegister } from '@/lib/api/hooks';

// Get current user
const { data: user, isLoading, error } = useCurrentUser();

// Login
const loginMutation = useLogin();
loginMutation.mutate({ email, password });

// Register
const registerMutation = useRegister();
registerMutation.mutate({ name, email, password });

// Logout
const logoutMutation = useLogout();
logoutMutation.mutate();
```

### **Market Hooks** (`useMarkets.ts`)

```typescript
import { useMarkets, useMarket, useNearbyMarkets, useSearchMarkets } from '@/lib/api/hooks';

// Get all markets with filters
const { data, isLoading } = useMarkets({
  category: 'vegetables',
  verified: true,
  page: 1,
  limit: 10,
});

// Get single market
const { data: market } = useMarket(marketId);

// Get nearby markets
const { data: nearbyMarkets } = useNearbyMarkets(lat, lng, radius);

// Search markets
const { data: searchResults } = useSearchMarkets(searchQuery);
```

### **Item Hooks** (`useItems.ts`)

```typescript
import { 
  useItems, 
  useItem, 
  useMarketItems, 
  useCategoryItems,
  useSearchItems,
  usePriceComparison,
  useTrendingItems,
  useCreateItem,
  useUpdateItemPrice 
} from '@/lib/api/hooks';

// Get all items
const { data } = useItems({ category: 'vegetables', page: 1 });

// Get single item
const { data: item } = useItem(itemId);

// Get items by market
const { data: marketItems } = useMarketItems(marketId, { inStock: true });

// Get items by category
const { data: categoryItems } = useCategoryItems('vegetables');

// Search items
const { data: searchResults } = useSearchItems(query);

// Get price comparison
const { data: comparison } = usePriceComparison('Tomatoes');

// Get trending items
const { data: trending } = useTrendingItems(10);

// Create new item (mutation)
const createMutation = useCreateItem();
createMutation.mutate({
  name: 'Fresh Tomatoes',
  category: 'vegetables',
  marketId: 'market-1',
  price: 3.99,
});

// Update item price (mutation)
const updatePriceMutation = useUpdateItemPrice();
updatePriceMutation.mutate({
  id: 'item-1',
  price: 4.99,
  inStock: true,
});
```

### **Category Hooks** (`useCategories.ts`)

```typescript
import { useCategories, useCategory, usePopularCategories } from '@/lib/api/hooks';

// Get all categories
const { data: categories } = useCategories();

// Get single category
const { data: category } = useCategory('vegetables');

// Get popular categories
const { data: popular } = usePopularCategories(10);
```

### **Review Hooks** (`useReviews.ts`)

```typescript
import { 
  useMarketReviews, 
  useReview,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useMarkReviewHelpful 
} from '@/lib/api/hooks';

// Get market reviews
const { data: reviews } = useMarketReviews(marketId, page, limit);

// Get single review
const { data: review } = useReview(reviewId);

// Create review (mutation)
const createReviewMutation = useCreateReview();
createReviewMutation.mutate({
  marketId: 'market-1',
  rating: 5,
  comment: 'Great market!',
});

// Update review (mutation)
const updateReviewMutation = useUpdateReview();
updateReviewMutation.mutate({
  id: 'review-1',
  rating: 4,
  comment: 'Updated review',
});

// Delete review (mutation)
const deleteReviewMutation = useDeleteReview();
deleteReviewMutation.mutate(reviewId);

// Mark review as helpful (mutation)
const markHelpfulMutation = useMarkReviewHelpful();
markHelpfulMutation.mutate(reviewId);
```

### **User Hooks** (`useUser.ts`)

```typescript
import { 
  useUserProfile,
  useUpdateProfile,
  useFavoriteMarkets,
  useActivityHistory 
} from '@/lib/api/hooks';

// Get user profile
const { data: profile } = useUserProfile();

// Update profile (mutation)
const updateProfileMutation = useUpdateProfile();
updateProfileMutation.mutate({
  name: 'John Doe',
  email: 'john@example.com',
});

// Get favorite markets
const { data: favorites } = useFavoriteMarkets();

// Get activity history
const { data: activity } = useActivityHistory();
```

## 🔧 Usage Examples

### **Complete Component Example**

```typescript
'use client';

import { useMarkets, useCreateItem } from '@/lib/api/hooks';
import { useNotifications } from '@/store/hooks';

export function MarketList() {
  const [page, setPage] = useState(1);
  const { addNotification } = useNotifications();
  
  // Fetch markets with pagination
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useMarkets({ 
    page, 
    limit: 10,
    verified: true 
  });

  // Create item mutation
  const createItemMutation = useCreateItem();

  const handleCreateItem = async (itemData) => {
    try {
      await createItemMutation.mutateAsync(itemData);
      addNotification({
        type: 'success',
        message: 'Item created successfully!',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to create item',
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
      
      <Pagination
        currentPage={page}
        totalPages={data?.pagination.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### **Search with Debounce**

```typescript
import { useState, useEffect } from 'react';
import { useSearchItems } from '@/lib/api/hooks';
import { useDebounce } from '@/hooks/useDebounce';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  const { data, isLoading } = useSearchItems(debouncedQuery, {
    limit: 10,
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search items..."
      />
      
      {isLoading && <div>Searching...</div>}
      
      {data?.data.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### **Optimistic Updates**

```typescript
import { useUpdateItemPrice } from '@/lib/api/hooks';
import { useQueryClient } from '@tanstack/react-query';

export function PriceUpdateButton({ item }) {
  const queryClient = useQueryClient();
  const updatePriceMutation = useUpdateItemPrice();

  const handleUpdatePrice = async (newPrice) => {
    // Optimistic update
    const previousData = queryClient.getQueryData(['items', 'detail', item.id]);
    
    queryClient.setQueryData(['items', 'detail', item.id], {
      ...item,
      price: newPrice,
    });

    try {
      await updatePriceMutation.mutateAsync({
        id: item.id,
        price: newPrice,
        inStock: item.inStock,
      });
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(['items', 'detail', item.id], previousData);
    }
  };

  return (
    <button onClick={() => handleUpdatePrice(4.99)}>
      Update Price
    </button>
  );
}
```

### **Infinite Scroll**

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { itemsApi } from '@/lib/api/services/items';

export function InfiniteItemList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['items', 'infinite'],
    queryFn: ({ pageParam = 1 }) => itemsApi.getAll({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  return (
    <div>
      {data?.pages.map((page) =>
        page.data.map((item) => <ItemCard key={item.id} item={item} />)
      )}
      
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

## ⚙️ Configuration

### **Query Client Setup** (Already configured in `src/providers/query-provider.tsx`)

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## 🎯 Key Features

### **Automatic Caching**
- Data is automatically cached and reused
- Configurable stale time for each query
- Background refetching for fresh data

### **Loading & Error States**
- Built-in loading states
- Error handling with retry logic
- Easy to display loading spinners and error messages

### **Mutations**
- Optimistic updates
- Automatic cache invalidation
- Success/error callbacks

### **DevTools**
- React Query DevTools for debugging
- Inspect cache state
- Monitor network requests

## 🚀 Best Practices

1. **Use Query Keys Consistently**
   ```typescript
   // Good
   queryKey: marketKeys.detail(id)
   
   // Bad
   queryKey: ['markets', id]
   ```

2. **Handle Loading & Error States**
   ```typescript
   if (isLoading) return <Spinner />;
   if (error) return <ErrorMessage error={error} />;
   ```

3. **Invalidate Cache After Mutations**
   ```typescript
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
   }
   ```

4. **Use Optimistic Updates for Better UX**
   ```typescript
   onMutate: async (newData) => {
     await queryClient.cancelQueries({ queryKey: itemKeys.detail(id) });
     const previousData = queryClient.getQueryData(itemKeys.detail(id));
     queryClient.setQueryData(itemKeys.detail(id), newData);
     return { previousData };
   }
   ```

5. **Combine with Zustand for Global State**
   ```typescript
   const { user } = useAuth(); // Zustand
   const { data: profile } = useUserProfile(); // React Query
   ```

## 📊 Performance Tips

- Use `staleTime` to reduce unnecessary refetches
- Implement pagination for large datasets
- Use `enabled` option to conditionally fetch data
- Prefetch data for better UX
- Use `select` option to transform data

## 🔍 Debugging

1. **Enable DevTools** (already enabled in development)
2. **Check Network Tab** in browser DevTools
3. **Inspect Query Cache** using React Query DevTools
4. **Monitor Console** for API errors

## ✅ Integration Complete!

All API endpoints now have corresponding React Query hooks with:
- ✅ Type-safe TypeScript interfaces
- ✅ Automatic caching and refetching
- ✅ Loading and error states
- ✅ Mutations with cache invalidation
- ✅ Optimistic updates support
- ✅ Integration with Zustand store
- ✅ DevTools for debugging

The API layer is production-ready and follows React Query best practices! 🚀
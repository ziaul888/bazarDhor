import { useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type QueryClient,
} from '@tanstack/react-query';
import { userApi } from '../services/user';
import type {
  FavoriteType,
  UpdateProfilePayload,
  UserProfile,
  CreateUserProductPayload,
  UserProduct,
  BackendApiResponse,
  SubmitProductPricePayload,
  SubmitProductPriceResponse,
  ActivityTypeFilter,
} from '../types';
import { useAppStore } from '@/store/app-store';

// Query keys
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  favorites: (type?: FavoriteType) => [...userKeys.all, 'favorites', type ?? 'all'] as const,
  // Root key (no filter segment) so one invalidateQueries call refreshes every
  // filter-specific activities cache at once.
  activitiesRoot: () => [...userKeys.all, 'activities'] as const,
  activities: (type: ActivityTypeFilter = 'all') => [...userKeys.activitiesRoot(), type] as const,
  activityStatistics: () => [...userKeys.all, 'activity-statistics'] as const,
};

/**
 * Why: every profile surface (header, tabs, navbar) reads the user from the
 * Zustand store, which is persisted in localStorage. A fresh API response is
 * therefore only visible if we write it back into the store.
 */
const syncProfileToStore = (profile: UserProfile) => {
  useAppStore.getState().login(profile);
};

// Why: adding/removing favorites and submitting prices each create a new activity
// entry and shift the statistics counters, so both cached activity surfaces are
// refreshed eagerly instead of waiting for their staleTime to lapse.
const invalidateActivitySurfaces = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: userKeys.activityStatistics() });
  queryClient.invalidateQueries({ queryKey: userKeys.activitiesRoot() });
};

// Get user profile — also refreshes the store copy persisted in localStorage
export const useUserProfile = (enabled: boolean = true) => {
  const query = useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => userApi.getProfile(),
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const profile = query.data;

  useEffect(() => {
    if (profile) {
      syncProfileToStore(profile);
    }
  }, [profile]);

  return query;
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userApi.updateProfile(payload),
    onSuccess: (profile) => {
      // Keep both the store and the profile cache in sync with the server response
      syncProfileToStore(profile);
      queryClient.setQueryData(userKeys.profile(), profile);
    },
  });
};

// Get favorite markets
export const useFavoriteMarkets = () => {
  return useQuery({
    queryKey: userKeys.favorites('market'),
    queryFn: () => userApi.getFavorites({ type: 'market' }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Add a market or product to favorites
export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, favoritableId }: { type: FavoriteType; favoritableId: string }) =>
      userApi.addFavorite(type, favoritableId),
    onSuccess: (_data, variables) => {
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: userKeys.favorites(variables.type) });
      invalidateActivitySurfaces(queryClient);
    },
  });
};

// Remove a market or product from favorites
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, favoritableId }: { type: FavoriteType; favoritableId: string }) =>
      userApi.removeFavorite(type, favoritableId),
    onSuccess: (_data, variables) => {
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: userKeys.favorites(variables.type) });
      invalidateActivitySurfaces(queryClient);
    },
  });
};

// Create product (add item) for current user
export const useCreateUserProduct = () => {
  return useMutation<BackendApiResponse<UserProduct>, Error, CreateUserProductPayload | FormData>({
    mutationFn: (payload) => userApi.createProduct(payload),
  });
};

// Submit product price update
export const useSubmitProductPrice = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BackendApiResponse<SubmitProductPriceResponse>,
    Error,
    SubmitProductPricePayload | FormData
  >({
    mutationFn: (payload) => userApi.submitPrice(payload),
    onSuccess: () => invalidateActivitySurfaces(queryClient),
  });
};

// Activity statistics — one shared cache for the profile header stats and the
// Activity tab tiles, so navigating between the two never refetches within staleTime.
export const useActivityStatistics = (enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.activityStatistics(),
    queryFn: () => userApi.getActivityStatistics(),
    enabled,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Why: infinite accumulation lets the Activity tab append pages behind a single
// "load more" control; page state stays in React Query, not component state.
export const useActivities = (type: ActivityTypeFilter = 'all', limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: userKeys.activities(type),
    queryFn: ({ pageParam }) => userApi.getActivities({ page: pageParam, limit, type }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Backend reports the grand total in `total_size`; another page exists while
      // fewer items have been fetched than that.
      const fetched = allPages.reduce((sum, page) => sum + page.items.length, 0);
      return fetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../services/user';
import type { User } from '../types';

// Query keys
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  favorites: () => [...userKeys.all, 'favorites'] as const,
};

// Get user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => userApi.getProfile(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Partial<User>) => userApi.updateProfile(userData),
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};

// Get favorite markets
export const useFavoriteMarkets = () => {
  return useQuery({
    queryKey: userKeys.favorites(),
    queryFn: () => userApi.getFavoriteMarkets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Add favorite market
export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (marketId: string) => userApi.addFavoriteMarket(marketId),
    onSuccess: () => {
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: userKeys.favorites() });
    },
  });
};

// Remove favorite market
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (marketId: string) => userApi.removeFavoriteMarket(marketId),
    onSuccess: () => {
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: userKeys.favorites() });
    },
  });
};
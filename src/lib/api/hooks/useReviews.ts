import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { reviewsApi } from '../services/reviews';
import { Review, PaginatedResponse } from '../types';
import { useZone } from '@/providers/zone-provider';

// Query keys
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (marketId: string, page: number) => [...reviewKeys.lists(), marketId, page] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
};

// Get reviews for a market
export const useMarketReviews = (
  marketId: string,
  page = 1,
  limit = 10
): UseQueryResult<PaginatedResponse<Review>, Error> => {
  const { zone } = useZone();

  return useQuery({
    queryKey: reviewKeys.list(marketId, page),
    queryFn: () => reviewsApi.getByMarket(marketId, page, limit),
    enabled: !!zone?.id && !!marketId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get review by ID
export const useReview = (id: string): UseQueryResult<Review, Error> => {
  const { zone } = useZone();

  return useQuery({
    queryKey: reviewKeys.detail(id),
    queryFn: () => reviewsApi.getById(id),
    enabled: !!zone?.id && !!id,
  });
};

// Create review mutation
export const useCreateReview = (): UseMutationResult<
  Review,
  Error,
  { marketId: string; rating: number; comment: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ marketId, rating, comment }) => reviewsApi.create(marketId, { rating, comment }),
    onSuccess: (_, variables) => {
      // Invalidate market reviews
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      // Also invalidate market data to update rating
      queryClient.invalidateQueries({ queryKey: ['markets', 'detail', variables.marketId] });
    },
  });
};

// Update review mutation
export const useUpdateReview = (): UseMutationResult<
  Review,
  Error,
  { id: string; rating?: number; comment?: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating, comment }) => reviewsApi.update(id, { rating, comment }),
    onSuccess: (data) => {
      // Update the specific review in cache
      queryClient.setQueryData(reviewKeys.detail(data.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};

// Delete review mutation
export const useDeleteReview = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsApi.delete,
    onSuccess: () => {
      // Invalidate all review lists
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};

// Mark review as helpful mutation
export const useMarkReviewHelpful = (): UseMutationResult<Review, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsApi.markHelpful,
    onSuccess: (data) => {
      // Update the specific review in cache
      queryClient.setQueryData(reviewKeys.detail(data.id), data);
    },
  });
};

import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse, Review } from '../types';

export const reviewsApi = {
  // Get reviews for a market
  getByMarket: async (marketId: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get<PaginatedResponse<Review>>(`/markets/${marketId}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get review by ID
  getById: async (id: string): Promise<Review> => {
    const response = await apiClient.get<ApiResponse<Review>>(`/reviews/${id}`);
    return response.data.data;
  },

  // Create a review
  create: async (marketId: string, data: { rating: number; comment: string }): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(`/markets/${marketId}/reviews`, data);
    return response.data.data;
  },

  // Update a review
  update: async (id: string, data: { rating?: number; comment?: string }): Promise<Review> => {
    const response = await apiClient.patch<ApiResponse<Review>>(`/reviews/${id}`, data);
    return response.data.data;
  },

  // Delete a review
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`);
  },

  // Mark review as helpful
  markHelpful: async (id: string): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(`/reviews/${id}/helpful`);
    return response.data.data;
  },
};
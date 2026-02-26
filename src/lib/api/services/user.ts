import { apiClient } from '../client';
import type { User, ApiResponse, CreateUserProductPayload, UserProduct } from '../types';

export const userApi = {
  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.get('/user/profile');
    return data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.put('/user/profile', userData);
    return data;
  },

  // Add market to favorites
  addFavoriteMarket: async (marketId: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.post(`/user/favorites/${marketId}`);
    return data;
  },

  // Remove market from favorites
  removeFavoriteMarket: async (marketId: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete(`/user/favorites/${marketId}`);
    return data;
  },

  // Get user's favorite markets
  getFavoriteMarkets: async (): Promise<ApiResponse<string[]>> => {
    const { data } = await apiClient.get('/user/favorites');
    return data;
  },

  // Create a product for the current user
  createProduct: async (
    payload: CreateUserProductPayload | FormData
  ): Promise<ApiResponse<UserProduct>> => {
    const { data } = await apiClient.post('users/products/create', payload);
    return data;
  },
};

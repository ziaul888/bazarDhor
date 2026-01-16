import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse, Category } from '../types';

export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  },

  // Get category by slug
  getBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${slug}`);
    return response.data.data;
  },

  // Get popular categories
  getPopular: async (limit = 10): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories/popular', {
      params: { limit },
    });
    return response.data.data;
  },
};
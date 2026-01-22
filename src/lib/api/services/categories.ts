import { apiClient } from '../client';
import { ApiResponse, PaginatedResponse, Category } from '../types';

export const categoriesApi = {
  // Get all categories
  getAll: async (params?: { limit?: number; offset?: number }): Promise<Category[]> => {
    try {
      const response = await apiClient.get<PaginatedResponse<Category>>('/categories/list', {
        params,
      });
      // Handle actual response format: { data: Category[], ... }
      return response.data?.data || [];
    } catch (error) {
      console.error('API Error [categoriesApi.getAll]:', error);
      return [];
    }
  },

  // Get category by slug
  getBySlug: async (slug: string): Promise<Category | null> => {
    try {
      const response = await apiClient.get<Category>(`/categories/${slug}`);
      return response.data || null;
    } catch (error) {
      console.error('API Error [categoriesApi.getBySlug]:', error);
      return null;
    }
  },

  // Get popular categories
  getPopular: async (limit = 10): Promise<Category[]> => {
    try {
      const response = await apiClient.get<Category[] | { data: Category[] }>('/categories/popular', {
        params: { limit },
      });
      // Handle both flat array and wrapped { data: [] }
      if (Array.isArray(response.data)) return response.data;
      if (response.data && 'data' in response.data && Array.isArray(response.data.data)) return response.data.data;
      return [];
    } catch (error) {
      console.error('API Error [categoriesApi.getPopular]:', error);
      return [];
    }
  },

  // Get category by ID
  getById: async (id: string, headers?: Record<string, string>): Promise<Category | null> => {
    try {
      const response = await apiClient.get<Category>(`/categories/get-category`, {
        params: { category_id: id },
        headers: headers // Allow passing headers (like zoneId) from server side
      });

      // Handle the case where the API might wrap the category in a 'data' property
      let categoryData = response.data as any;
      if (categoryData && categoryData.data) {
        // If data is an error object, return null
        if (categoryData.data.error) return null;
        categoryData = categoryData.data;
      }

      // Final validation: ensure we have at least an ID and name
      if (categoryData && (categoryData.id || categoryData.name)) {
        return categoryData;
      }

      return null;
    } catch (error) {
      console.error('API Error [categoriesApi.getById]:', error);
      return null;
    }
  },
};
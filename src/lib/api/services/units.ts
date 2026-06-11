import { apiClient } from '../client';
import type { PaginatedResponse } from '../types';

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  unit_type: string;
  is_active: boolean;
}

export const unitsApi = {
  // Get all units
  getAll: async (params?: { limit?: number; offset?: number }): Promise<Unit[]> => {
    try {
      const response = await apiClient.get<PaginatedResponse<Unit>>('/units', { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('API Error [unitsApi.getAll]:', error);
      return [];
    }
  },
};

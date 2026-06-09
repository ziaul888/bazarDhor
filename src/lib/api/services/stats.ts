import { apiClient } from '../client';

export interface PulseStats {
  recent_prices: number;
  markets_total: number;
  items_total: number;
  contributors: number;
  window: string;
}

export const statsApi = {
  getPulse: async (): Promise<PulseStats | null> => {
    try {
      const { data } = await apiClient.get<{ data: PulseStats }>('/stats/pulse');
      return data.data ?? null;
    } catch (error) {
      console.error('API Error [statsApi.getPulse]:', error);
      return null;
    }
  },
};

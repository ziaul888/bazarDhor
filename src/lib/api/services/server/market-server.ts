import { fetchClient } from '../../fetch-client';
import type { Market, ApiResponse } from '../../types';

export const marketServerApi = {
    getMarketsByCategory: async (categoryId: string, limit: number = 50, headers?: Record<string, string>): Promise<Market[]> => {
        try {
            const markets = await fetchClient<Market[]>('/markets', {
                params: {
                    category: categoryId,
                    limit
                },
                headers,
                throwOnError: false,
                next: { revalidate: 3600 }
            });

            return markets || [];
        } catch (error) {
            console.error('SERVER API Error [marketServerApi.getMarketsByCategory]:', error);
            return [];
        }
    },

    getMarketById: async (id: string, headers?: Record<string, string>): Promise<Market | null> => {
        try {
            const response = await fetchClient<ApiResponse<Market>>(`/markets/${id}`, {
                headers,
                throwOnError: false,
                next: { revalidate: 900 } // 15 minutes
            });

            return response?.data || null;
        } catch (error) {
            console.error('SERVER API Error [marketServerApi.getMarketById]:', error);
            return null;
        }
    },
};

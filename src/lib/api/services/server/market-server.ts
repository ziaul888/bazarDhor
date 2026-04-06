import { fetchClient } from '../../fetch-client';
import type { Market, ApiResponse, MarketListParams } from '../../types';

export const marketServerApi = {
    getMarketsByCategory: async (categoryId: string, limit: number = 50, headers?: Record<string, string>): Promise<unknown> => {
        try {
            const markets = await fetchClient<unknown>('/markets/list', {
                params: {
                    user_lat: 23.832619866576376,
                    user_lng: 90.4348316383023,
                    limit,
                    offset: 1,
                    categoryId: categoryId,
                    category_id: categoryId,
                },
                headers,
                throwOnError: false,
                next: { revalidate: 3600 }
            });

            return markets ?? [];
        } catch (error) {
            console.error('SERVER API Error [marketServerApi.getMarketsByCategory]:', error);
            return [];
        }
    },

    getMarketList: async (params: MarketListParams & { categoryId?: string; category_id?: string }, headers?: Record<string, string>): Promise<unknown> => {
        try {
            const markets = await fetchClient<unknown>('/markets/list', {
                params,
                headers,
                throwOnError: false,
                next: { revalidate: 3600 }
            });

            return markets ?? [];
        } catch (error) {
            console.error('SERVER API Error [marketServerApi.getMarketList]:', error);
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

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
            const queryParams = {
                user_lat: params.user_lat,
                user_lng: params.user_lng,
                limit: params.limit,
                offset: params.offset,
                categoryId: params.categoryId,
                category_id: params.category_id,
            };

            const markets = await fetchClient<unknown>('/markets/list', {
                params: queryParams,
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
            const market = await fetchClient<Market | ApiResponse<Market>>(`/markets/${id}`, {
                headers,
                throwOnError: false,
                next: { revalidate: 900 } // 15 minutes
            });

            if (!market) {
                return null;
            }

            if (typeof market === 'object' && market !== null && 'data' in market) {
                return (market as ApiResponse<Market>).data ?? null;
            }

            return market as Market;
        } catch (error) {
            console.error('SERVER API Error [marketServerApi.getMarketById]:', error);
            return null;
        }
    },

    getMarketProducts: async (
        marketId: string,
        params: { limit?: number; offset?: number } = {},
        headers?: Record<string, string>
    ): Promise<unknown> => {
        try {
            const products = await fetchClient<unknown>(`/market/products/${marketId}`, {
                params: {
                    limit: params.limit,
                    offset: params.offset,
                },
                headers,
                throwOnError: false,
                next: { revalidate: 900 }
            });

            return products ?? [];
        } catch (error) {
            console.error('SERVER API Error [marketServerApi.getMarketProducts]:', error);
            return [];
        }
    },
};

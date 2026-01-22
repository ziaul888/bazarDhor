import { fetchClient } from '../../fetch-client';
import type { Market } from '../../types';

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
};

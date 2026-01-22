import { apiClient } from '../client';
import type { BannerResponse, Banner } from '../types';

export const bannersApi = {
    // Get all banners
    getBanners: async (limit: number = 10, offset: number = 1): Promise<Banner[]> => {
        const { data } = await apiClient.get<BannerResponse>('/banners/list', {
            params: { limit, offset }
        });
        return data.data || [];
    },
};

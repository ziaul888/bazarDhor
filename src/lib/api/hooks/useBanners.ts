import { useQuery } from '@tanstack/react-query';
import { bannersApi } from '../services/banners';

export const bannerKeys = {
    all: ['banners'] as const,
    list: (limit: number, offset: number) => [...bannerKeys.all, 'list', { limit, offset }] as const,
};

export const useBanners = (limit: number = 10, offset: number = 1) => {
    return useQuery({
        queryKey: bannerKeys.list(limit, offset),
        queryFn: () => bannersApi.getBanners(limit, offset),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

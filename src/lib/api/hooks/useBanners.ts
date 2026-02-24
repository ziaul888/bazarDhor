import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { bannersApi } from '../services/banners';
import type { Banner } from '../types';
import { useZone } from '@/providers/zone-provider';

export const bannerKeys = {
    all: ['banners'] as const,
    list: (limit: number, offset: number, type?: string) => [...bannerKeys.all, 'list', { limit, offset, type: type ?? null }] as const,
};

export const useBanners = (limit: number = 10, offset: number = 1, type?: string): UseQueryResult<Banner[], Error> => {
    const { zone } = useZone();

    return useQuery({
        queryKey: bannerKeys.list(limit, offset, type),
        queryFn: () => bannersApi.getBanners(limit, offset, type),
        enabled: !!zone?.id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

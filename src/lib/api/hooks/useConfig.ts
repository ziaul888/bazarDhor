import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configApi } from '../services/config';
import type { GetZoneRequest, GetZoneResponse } from '../types';

// Query keys
export const configKeys = {
    all: ['config'] as const,
    zone: (lat: number, lng: number) => [...configKeys.all, 'zone', lat, lng] as const,
    settings: () => [...configKeys.all, 'settings'] as const,
    appConfig: () => [...configKeys.all, 'app-config'] as const,
};

/**
 * Hook to get zone based on coordinates
 * @param coordinates - Latitude and longitude
 * @param enabled - Whether to enable the query
 */
export const useGetZone = (
    coordinates: GetZoneRequest | null,
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: coordinates
            ? configKeys.zone(coordinates.lat, coordinates.lng)
            : ['config', 'zone', 'null'],
        queryFn: () => {
            if (!coordinates) {
                throw new Error('Coordinates are required');
            }
            return configApi.getZone(coordinates);
        },
        enabled: enabled && coordinates !== null,
        staleTime: 15 * 60 * 1000, // 15 minutes - zones don't change frequently
        retry: 2,
    });
};

/**
 * Hook to get zone with mutation (for on-demand fetching)
 */
export const useGetZoneMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (coordinates: GetZoneRequest) => configApi.getZone(coordinates),
        onSuccess: (data, variables) => {
            // Cache the result
            queryClient.setQueryData(
                configKeys.zone(variables.lat, variables.lng),
                data
            );
        },
    });
};

/**
 * Hook to get app settings
 */
export const useSettings = () => {
    return useQuery({
        queryKey: configKeys.settings(),
        queryFn: () => configApi.getSettings(),
        staleTime: 30 * 60 * 1000, // 30 minutes
    });
};

/**
 * Hook to get app configuration
 */
export const useAppConfig = () => {
    return useQuery({
        queryKey: configKeys.appConfig(),
        queryFn: () => configApi.getAppConfig(),
        staleTime: 60 * 60 * 1000, // 1 hour
    });
};

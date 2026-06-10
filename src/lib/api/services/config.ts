import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
    ApiResponse,
    BackendApiResponse,
    GeneralConfig,
    GetZoneRequest,
    GetZoneResponse
} from '../types';

/**
 * Zone/Config API Service
 * Handles zone detection and configuration endpoints
 */
export const configApi = {
    /**
     * Get zone based on coordinates (lat, lng)
     * @param coordinates - Latitude and longitude
     * @returns Zone information and nearby zones
     */
    getZone: async (coordinates: GetZoneRequest): Promise<GetZoneResponse> => {
        const response = await apiClient.get<ApiResponse<GetZoneResponse>>(
            API_ENDPOINTS.CONFIG.GET_ZONE,
            {
                params: coordinates,
            }
        );
        return response.data.data;
    },

    /**
     * Get app configuration settings — backend consolidated /config/app and
     * /config/settings into a single /config endpoint, so all three accessors
     * now hit /config and React Query dedupes via the per-hook cache key.
     */
    getSettings: async (): Promise<unknown> => {
        const response = await apiClient.get<BackendApiResponse<GeneralConfig>>(
            API_ENDPOINTS.CONFIG.GENERAL
        );
        return response.data.data;
    },

    /**
     * Get app configuration (now served by /config)
     */
    getAppConfig: async (): Promise<unknown> => {
        const response = await apiClient.get<BackendApiResponse<GeneralConfig>>(
            API_ENDPOINTS.CONFIG.GENERAL
        );
        return response.data.data;
    },

    /**
     * Get general configuration (entire /config endpoint)
     */
    getGeneralConfig: async (): Promise<GeneralConfig> => {
        const response = await apiClient.get<BackendApiResponse<GeneralConfig>>(
            API_ENDPOINTS.CONFIG.GENERAL
        );
        return response.data.data;
    },
};

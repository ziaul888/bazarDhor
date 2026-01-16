import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse, GetZoneRequest, GetZoneResponse } from '../types';

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
     * Get app configuration settings
     */
    getSettings: async (): Promise<any> => {
        const response = await apiClient.get<ApiResponse<any>>(
            API_ENDPOINTS.CONFIG.SETTINGS
        );
        return response.data.data;
    },

    /**
     * Get app configuration
     */
    getAppConfig: async (): Promise<any> => {
        const response = await apiClient.get<ApiResponse<any>>(
            API_ENDPOINTS.CONFIG.APP_CONFIG
        );
        return response.data.data;
    },
};

/**
 * API Endpoints Configuration
 * Centralized location for all API endpoint paths
 */

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
        REFRESH: '/auth/refresh',
        PASSWORD_RESET_REQUEST: '/auth/password-reset/request',
        PASSWORD_RESET_CONFIRM: '/auth/password-reset/confirm',
        VERIFY_EMAIL: '/auth/verify-email',
    },

    // User
    USER: {
        PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/profile',
        FAVORITES: '/user/favorites',
        ADD_FAVORITE: '/user/favorites',
        REMOVE_FAVORITE: (marketId: string) => `/user/favorites/${marketId}`,
    },

    // Markets
    MARKETS: {
        LIST: '/markets',
        DETAIL: (id: string) => `/markets/${id}`,
        NEARBY: '/markets/nearby',
        SEARCH: '/markets/search',
    },

    // Items
    ITEMS: {
        LIST: '/items',
        DETAIL: (id: string) => `/items/${id}`,
        CREATE: '/items',
        UPDATE: (id: string) => `/items/${id}`,
        DELETE: (id: string) => `/items/${id}`,
        SEARCH: '/items/search',
    },

    // Categories
    CATEGORIES: {
        LIST: '/categories',
        DETAIL: (id: string) => `/categories/${id}`,
    },

    // Reviews
    REVIEWS: {
        LIST: '/reviews',
        CREATE: '/reviews',
        UPDATE: (id: string) => `/reviews/${id}`,
        DELETE: (id: string) => `/reviews/${id}`,
        BY_MARKET: (marketId: string) => `/reviews/market/${marketId}`,
    },

    // Config
    CONFIG: {
        GET_ZONE: '/config/get-zone',
        SETTINGS: '/config/settings',
        APP_CONFIG: '/config/app',
        GENERAL: '/config',
    },
} as const;

// Type for API endpoints
export type ApiEndpoints = typeof API_ENDPOINTS;

// Helper to build endpoint with parameters
export const buildEndpoint = (
    endpointFn: ((...args: string[]) => string) | string,
    ...params: (string | number)[]
): string => {
    if (typeof endpointFn === 'function') {
        return endpointFn(...params.map(String));
    }
    return endpointFn;
};

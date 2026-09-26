/**
 * API Endpoints Configuration
 * Centralized location for all API endpoint paths
 */

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        // Why: logout is served under the users prefix (api/users/logout) — the
        // /auth/logout path does not exist and returned 404, so the Sanctum token
        // was never revoked server-side.
        LOGOUT: '/users/logout',
        // Why no `ME` entry: the backend has no /auth/me route. The authenticated
        // user comes from USER.PROFILE (see authApi.getCurrentUser).
        REFRESH: '/auth/refresh',
        PASSWORD_RESET_REQUEST: '/auth/password-reset/request',
        PASSWORD_RESET_CONFIRM: '/auth/password-reset/confirm',
        VERIFY_EMAIL: '/auth/verify-email',
    },

    // User
    // Why: the backend exposes these under the plural `users` prefix
    // (api/users/profile, api/users/update-profile, api/users/favorites*).
    USER: {
        PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/update-profile',
        FAVORITES: '/users/favorites',
        ADD_FAVORITE: '/users/favorites/add',
        REMOVE_FAVORITE: '/users/favorites/remove',
        ACTIVITIES: '/users/activities',
        ACTIVITY_STATISTICS: '/users/activity-statistics',
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

    // Products
    PRODUCTS: {
        CREATE: '/products/create',
        SUBMIT_PRICE: '/products/submit-price',
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

/**
 * Endpoints that must be callable before a zone is resolved.
 * Why: the axios/fetch clients reject calls without a `zoneId` header unless the
 * endpoint is listed here. The user's own profile is zone-independent, so it has
 * to stay reachable even when zone detection failed or is still in flight.
 */
export const ZONE_OPTIONAL_ENDPOINTS = new Set<string>([
    API_ENDPOINTS.CONFIG.GET_ZONE,
    API_ENDPOINTS.USER.PROFILE,
    // Why: the activity endpoints are scoped to the bearer token, not to a zone —
    // the backend answers without a zoneId header (same rationale as USER.PROFILE).
    API_ENDPOINTS.USER.ACTIVITIES,
    API_ENDPOINTS.USER.ACTIVITY_STATISTICS,
]);

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

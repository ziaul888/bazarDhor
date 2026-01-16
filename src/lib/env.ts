// Environment configuration helper
// This file provides type-safe access to environment variables

export const env = {
  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Fresh Market Finder',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // API Configuration
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  },

  // Authentication
  auth: {
    tokenKey: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token',
    sessionTimeout: parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '3600000', 10),
  },

  // Google Maps
  maps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    defaultCenter: {
      lat: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_MAP_CENTER_LAT || '40.7128'),
      lng: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_MAP_CENTER_LNG || '-74.0060'),
    },
    defaultZoom: parseInt(process.env.NEXT_PUBLIC_DEFAULT_MAP_ZOOM || '12', 10),
    nearbyRadius: parseInt(process.env.NEXT_PUBLIC_NEARBY_RADIUS_KM || '5', 10),
  },

  // Analytics
  analytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
    enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },

  // Feature Flags
  features: {
    pwa: process.env.NEXT_PUBLIC_ENABLE_PWA !== 'false',
    notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
    geolocation: process.env.NEXT_PUBLIC_ENABLE_GEOLOCATION !== 'false',
    offlineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE !== 'false',
  },

  // Cache Configuration
  cache: {
    staleTime: parseInt(process.env.NEXT_PUBLIC_CACHE_STALE_TIME || '300000', 10),
    maxAge: parseInt(process.env.NEXT_PUBLIC_CACHE_MAX_AGE || '3600000', 10),
  },

  // Image Configuration
  images: {
    domains: (process.env.NEXT_PUBLIC_IMAGE_DOMAINS || 'images.unsplash.com').split(','),
  },

  // Pagination
  pagination: {
    defaultPageSize: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '10', 10),
    maxPageSize: parseInt(process.env.NEXT_PUBLIC_MAX_PAGE_SIZE || '100', 10),
  },

  // Search Configuration
  search: {
    debounceMs: parseInt(process.env.NEXT_PUBLIC_SEARCH_DEBOUNCE_MS || '500', 10),
    minLength: parseInt(process.env.NEXT_PUBLIC_MIN_SEARCH_LENGTH || '2', 10),
  },

  // Development Tools
  devTools: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true',
    reduxDevTools: process.env.NEXT_PUBLIC_ENABLE_REDUX_DEVTOOLS === 'true',
    reactQueryDevTools: process.env.NEXT_PUBLIC_ENABLE_REACT_QUERY_DEVTOOLS === 'true',
  },

  // Logging
  logging: {
    level: process.env.NEXT_PUBLIC_LOG_LEVEL || 'info',
    errorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
  },

  // Rate Limiting
  rateLimit: {
    requests: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_REQUESTS || '100', 10),
    windowMs: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_WINDOW_MS || '60000', 10),
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880', 10),
    allowedTypes: (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  },

  // Social Media
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  },

  // Contact
  contact: {
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@freshmarketfinder.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  },
} as const;

// Type-safe environment variable getter
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value || defaultValue || '';
}

// Validate required environment variables
export function validateEnv(): void {
  const required = [
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_API_URL',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file.'
    );
  }
}

// Helper to check if we're in browser
export const isBrowser = typeof window !== 'undefined';

// Helper to check if we're in server
export const isServer = !isBrowser;
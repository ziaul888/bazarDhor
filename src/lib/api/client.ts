import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://bazardor.chhagolnaiyasportareana.xyz/api',
  timeout: 30000, // Increased to 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor for adding auth tokens and zone ID
apiClient.interceptors.request.use(
  (config) => {
    // Client-side only logic
    if (typeof window !== 'undefined') {
      // 1. Add auth token if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 2. Add zone ID if available
      let zoneId = Cookies.get('zoneId');

      // Fallback: try to get from localStorage if cookie is missing
      if (!zoneId && typeof localStorage !== 'undefined') {
        const storedZone = localStorage.getItem('user_zone');
        if (storedZone) {
          try {
            const zone = JSON.parse(storedZone);
            if (zone?.id) {
              zoneId = zone.id;
              // Restore cookie if it was missing but we found it in localStorage
              Cookies.set('zoneId', zoneId as string, { expires: 7, path: '/' });
            }
          } catch (e) {
            // ignore parse error
          }
        }
      }

      console.log('DEBUG: Final zoneId for header:', zoneId);

      if (zoneId) {
        config.headers['zoneId'] = zoneId;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // Use router instead of direct navigation in production
        // window.location.href = '/login';
      }
    }

    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Timeout error
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. The server is taking too long to respond. Please try again.';
    }

    // Network error
    if (error.message === 'Network Error') {
      return 'Network error. Please check your internet connection.';
    }

    // 302 Redirect (API endpoint might not exist)
    if (error.response?.status === 302) {
      return 'API endpoint not found. Please contact support.';
    }

    // 404 Not Found
    if (error.response?.status === 404) {
      return 'API endpoint not found. Please verify the API configuration.';
    }

    // 500 Server Error
    if (error.response?.status === 500) {
      return 'Server error. Please try again later.';
    }

    return error.response?.data?.message || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse, AuthResponse, BackendApiResponse, LoginCredentials, RegisterData, UserProfile } from '../types';

const getAuthToken = (data: AuthResponse): string | undefined => {
  return data.access_token ?? data.token;
};

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    
    // Store token
    const token = getAuthToken(response.data.data);
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem('auth_token', token);
    }
    
    return response.data.data;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    
    // Store token
    const token = getAuthToken(response.data.data);
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem('auth_token', token);
    }
    
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    
    // Remove token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  // Get current user
  // Why: the backend has no /auth/me route — the authenticated user is served by
  // api/users/profile (Api\ProfileController@show), which returns the same
  // UserResource shape that POST /auth/login embeds under `user`.
  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await apiClient.get<BackendApiResponse<UserProfile>>(
      API_ENDPOINTS.USER.PROFILE
    );
    return response.data.data;
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string } | { access_token: string }> => {
    const response = await apiClient.post<ApiResponse<{ token: string } | { access_token: string }>>('/auth/refresh');
    
    // Update token
    const nextToken = ('token' in response.data.data ? response.data.data.token : response.data.data.access_token);
    if (typeof window !== 'undefined' && nextToken) {
      localStorage.setItem('auth_token', nextToken);
    }
    
    return response.data.data;
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/auth/password-reset/request', { email });
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/password-reset/confirm', { token, newPassword });
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/auth/verify-email', { token });
  },
};

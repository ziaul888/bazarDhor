import { apiClient } from '../client';
import { ApiResponse, AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    
    // Store token
    if (typeof window !== 'undefined' && response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    
    return response.data.data;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    
    // Store token
    if (typeof window !== 'undefined' && response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    
    // Remove token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
    
    // Update token
    if (typeof window !== 'undefined' && response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
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
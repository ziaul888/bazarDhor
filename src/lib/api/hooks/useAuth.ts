import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { authApi } from '../services/auth';
import { User, AuthResponse, LoginCredentials, RegisterData } from '../types';
import { useAppStore } from '@/store/app-store';
import { useZone } from '@/providers/zone-provider';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Get current user
export const useCurrentUser = (): UseQueryResult<User, Error> => {
  const { zone } = useZone();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authApi.getCurrentUser,
    enabled: !!zone?.id,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

// Login mutation
export const useLogin = (): UseMutationResult<AuthResponse, Error, LoginCredentials> => {
  const queryClient = useQueryClient();
  const { login: zustandLogin } = useAppStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Update Zustand store
      zustandLogin(data.user);
      // Update React Query cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
};

// Register mutation
export const useRegister = (): UseMutationResult<AuthResponse, Error, RegisterData> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // Update React Query cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
};

// Logout mutation
export const useLogout = (): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();
  const { logout: zustandLogout } = useAppStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear Zustand store
      zustandLogout();
      // Clear React Query cache
      queryClient.clear();
    },
  });
};

// Request password reset mutation
export const useRequestPasswordReset = (): UseMutationResult<void, Error, string> => {
  return useMutation({
    mutationFn: authApi.requestPasswordReset,
  });
};

// Reset password mutation
export const useResetPassword = (): UseMutationResult<void, Error, { token: string; newPassword: string }> => {
  return useMutation({
    mutationFn: ({ token, newPassword }) => authApi.resetPassword(token, newPassword),
  });
};

// Verify email mutation
export const useVerifyEmail = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      // Refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

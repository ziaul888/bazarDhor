# Auth API Integration Documentation

## Overview
The authentication system is fully integrated with the `/api/auth/login` endpoint using the specified payload format.

## API Endpoint Details

### Login Endpoint
- **URL**: `/api/auth/login`
- **Method**: POST
- **Payload Format**:
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

## Implementation Details

### 1. Type Definitions
Located in `src/lib/api/types.ts`:
```typescript
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token?: string;
  token?: string; // legacy/alternate key
}
```

### 2. API Service
Located in `src/lib/api/services/auth.ts`:
```typescript
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    
    // Store token
    const token = getAuthToken(response.data.data);
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem('auth_token', token);
    }
    
    return response.data.data;
  },
  // ... other methods
};
```

### 3. React Query Hook
Located in `src/lib/api/hooks/useAuth.ts`:
```typescript
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
```

### 4. Usage in Auth Modal
Located in `src/components/auth/auth-modal.tsx`:
```typescript
const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateLoginForm()) {
    return;
  }

  try {
    // This calls /api/auth/login with the exact payload format
    const response = await loginMutation.mutateAsync({
      email: loginFormData.email,
      password: loginFormData.password,
    });

    // Success handling...
  } catch (error) {
    // Error handling...
  }
};
```

## What Happens After Successful Login

1. **API Call**: POST request to `/api/auth/login` with email/password payload
2. **Token Storage**: Auth token is automatically stored in `localStorage` under `auth_token`
3. **State Update**: User data is stored in Zustand store via `useAppStore().login()`
4. **Cache Update**: React Query cache is updated with user data
5. **UI Update**: Auth modal closes and user interface updates to show logged-in state

## Testing

A test component is available at `src/components/auth/login-test.tsx` that demonstrates the exact API call with your specified payload format.

## Error Handling

The system includes comprehensive error handling:
- Form validation before API call
- Network error handling
- Server response error handling
- User-friendly error messages via toast notifications
- Console logging for debugging

## Security Features

- Tokens are securely stored in localStorage
- Automatic cleanup on logout
- Session management through Zustand store
- Protected routes (handled by AuthProvider)
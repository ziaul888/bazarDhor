# Auth + Registration Zustand Sync

This document describes the changes made to ensure user data is stored in Zustand immediately after registration and reused across the app.

## Summary

- Registration now sets the returned `user` into the Zustand store (`useAppStore`) and closes the auth modal.
- Auth tokens are now stored from `access_token` (or legacy `token`) into `localStorage` under `auth_token`.
- Navbar now shows **Profile** (instead of **Sign In**) when authenticated and links to `/profile`.
- On reload, auth state is synced from `auth_token` (and `/auth/me` when needed) so the navbar stays correct.
- Profile page now reads the logged-in user from the auth store instead of mock data.
- `AuthProvider` (context) now reads `user`, `isAuthenticated`, and `isAuthModalOpen` from Zustand, so components using `useAuth()` stay in sync with the store.
- `useRegister()` no longer updates Zustand by itself; it only updates the React Query cache. The UI (AuthModal) decides what to do after a successful registration.

## Behavior Changes

### After successful **Sign Up**

- The API `register` call returns `{ user, access_token }` (some environments may return `token`).
- The modal:
  - Calls `useAppStore.getState().login(user)` to persist the user in Zustand.
  - Closes the modal.
  - Resets both login + registration form state.

### After successful **Sign In**

- No behavior change: `useLogin()` still sets the user into Zustand on success.

## Files Changed

### `src/components/auth/auth-modal.tsx`

- Captures the `useRegister().mutateAsync(...)` response.
- Writes `response.user` into Zustand via `useAppStore.getState().login(...)`.
- Closes modal and resets local form state after registration.

### `src/lib/api/hooks/useAuth.ts`

- `useRegister()` no longer calls Zustand `login()` inside its `onSuccess`.
- It still updates React Query `authKeys.user()` cache.

### `src/components/auth/auth-context.tsx`

- `AuthProvider` now reuses Zustand state/actions:
  - `isAuthModalOpen`, `openAuthModal`, `closeAuthModal`
  - `user`, `isAuthenticated`
- Keeps `authModalMode` as local UI state (signin/signup) for controlling the modal content.

## Why This Change

- Avoids having two separate sources of truth for auth/user state (local context state vs Zustand).
- Ensures newly registered users are immediately available through the same Zustand-backed `useAuth()` API used elsewhere in the app.

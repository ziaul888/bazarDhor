"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAppStore, type User } from '@/store/app-store';
import { authApi } from '@/lib/api/services/auth';
import { useZone } from '@/providers/zone-provider';

interface AuthContextType {
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  hasHydrated: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const isAuthModalOpen = useAppStore((state) => state.isAuthModalOpen);
  const openAuthModalStore = useAppStore((state) => state.openAuthModal);
  const closeAuthModalStore = useAppStore((state) => state.closeAuthModal);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const user = useAppStore((state) => state.user);
  const login = useAppStore((state) => state.login);
  const logout = useAppStore((state) => state.logout);
  const { zone, isLoading: isZoneLoading } = useZone();

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    openAuthModalStore();
  };

  const closeAuthModal = () => {
    closeAuthModalStore();
  };

  useEffect(() => {
    if (!hasHydrated || typeof window === 'undefined') return;

    const token = localStorage.getItem('auth_token');

    // If there's no token, ensure the store is logged out (prevents stale persisted UI state)
    if (!token) {
      if (isAuthenticated || user) {
        logout();
      }
      return;
    }

    // Zone must be available before any non-zone API call.
    if (isZoneLoading || !zone?.id) {
      return;
    }

    // If there's a token but no user in state (e.g. fresh session), fetch current user
    if (!user) {
      void (async () => {
        try {
          const currentUser = await authApi.getCurrentUser();
          login(currentUser);
        } catch {
          localStorage.removeItem('auth_token');
          logout();
        }
      })();
      return;
    }

    // If we have a user but auth flag is false, normalize it
    if (!isAuthenticated) {
      login(user);
    }
  }, [hasHydrated, isAuthenticated, user, login, logout, zone?.id, isZoneLoading]);

  return (
    <AuthContext.Provider
      value={{
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        hasHydrated,
        isAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

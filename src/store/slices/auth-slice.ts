import { StateCreator } from 'zustand';
import { User } from '../app-store';

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  
  setUser: (user) => set((state) => ({
    ...state,
    user,
    isAuthenticated: !!user,
  })),
  
  login: (user) => set((state) => ({
    ...state,
    user,
    isAuthenticated: true,
    isAuthModalOpen: false,
  })),
  
  logout: () => set((state) => ({
    ...state,
    user: null,
    isAuthenticated: false,
  })),
  
  openAuthModal: () => set((state) => ({
    ...state,
    isAuthModalOpen: true,
  })),
  
  closeAuthModal: () => set((state) => ({
    ...state,
    isAuthModalOpen: false,
  })),
  
  updateUserPreferences: (preferences) => set((state) => ({
    ...state,
    user: state.user ? {
      ...state.user,
      preferences: { ...state.user.preferences, ...preferences }
    } : null,
  })),
});
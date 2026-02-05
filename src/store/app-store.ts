import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
export interface UserPreferences {
  currency?: string;
  language?: string;
  notifications?: boolean;
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;

  // Common profile fields (API may include more)
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string | null;
  dob?: string | null;
  gender?: string | null;
  city?: string | null;
  division?: string | null;
  address?: string | null;
  created_at?: string;
  updated_at?: string;

  favoriteMarkets?: string[];
  preferences?: UserPreferences;
}

export interface Market {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  vendors: number;
  image: string;
  isOpen: boolean;
  openTime: string;
  specialties: string[];
  priceRange: string;
  features: {
    freeParking?: boolean;
    creditCards?: boolean;
    delivery?: boolean;
    organic?: boolean;
  };
}

export interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;

  // App config (from /config/* endpoints)
  appConfig: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
  generalConfig: Record<string, unknown> | null;
  
  // Favorites
  favoriteMarkets: string[];
  favoriteItems: string[];
  
  // Search & Filters
  searchQuery: string;
  selectedCategory: string | null;
  priceRange: [number, number];
  sortBy: 'distance' | 'rating' | 'price' | 'name';
  
  // UI state
  hasHydrated: boolean;
  isSearchVisible: boolean;
  isAuthModalOpen: boolean;
  isAddItemModalOpen: boolean;
  
  // Location
  userLocation: {
    lat?: number;
    lng?: number;
    address?: string;
  };
  
  // Recent searches
  recentSearches: string[];
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
}

export interface AppActions {
  // User actions
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;

  // Config actions
  setAppConfig: (appConfig: Record<string, unknown> | null) => void;
  setSettings: (settings: Record<string, unknown> | null) => void;
  setGeneralConfig: (generalConfig: Record<string, unknown> | null) => void;
  
  // Favorites actions
  toggleFavoriteMarket: (marketId: string) => void;
  toggleFavoriteItem: (itemId: string) => void;
  
  // Search & Filter actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sortBy: AppState['sortBy']) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  
  // UI actions
  setHasHydrated: (hasHydrated: boolean) => void;
  toggleSearch: () => void;
  showSearch: () => void;
  hideSearch: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openAddItemModal: () => void;
  closeAddItemModal: () => void;
  
  // Location actions
  setUserLocation: (location: AppState['userLocation']) => void;
  
  // Notification actions
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

type AppStore = AppState & AppActions;

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  appConfig: null,
  settings: null,
  generalConfig: null,
  favoriteMarkets: [],
  favoriteItems: [],
  searchQuery: '',
  selectedCategory: null,
  priceRange: [0, 100],
  sortBy: 'distance',
  hasHydrated: false,
  isSearchVisible: false,
  isAuthModalOpen: false,
  isAddItemModalOpen: false,
  userLocation: {},
  recentSearches: [],
  notifications: [],
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        // User actions
        setUser: (user) => set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
          if (user) {
            state.favoriteMarkets = user.favoriteMarkets || [];
          }
        }),
        
        login: (user) => set((state) => {
          state.user = user;
          state.isAuthenticated = true;
          state.favoriteMarkets = user.favoriteMarkets || [];
          state.isAuthModalOpen = false;
        }),
        
        logout: () => set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.favoriteMarkets = [];
          state.favoriteItems = [];
        }),

        // Config actions
        setAppConfig: (appConfig) => set((state) => {
          state.appConfig = appConfig;
        }),

        setSettings: (settings) => set((state) => {
          state.settings = settings;
        }),

        setGeneralConfig: (generalConfig) => set((state) => {
          state.generalConfig = generalConfig;
        }),
        
        updateUserPreferences: (preferences) => set((state) => {
          if (state.user) {
            const current = state.user.preferences ?? {
              currency: 'BDT',
              language: 'en',
              notifications: true,
              location: {},
            };

            state.user.preferences = {
              ...current,
              ...preferences,
              location: {
                ...(current.location ?? {}),
                ...(preferences.location ?? {}),
              },
            };
          }
        }),
        
        // Favorites actions
        toggleFavoriteMarket: (marketId) => set((state) => {
          const index = state.favoriteMarkets.indexOf(marketId);
          if (index > -1) {
            state.favoriteMarkets.splice(index, 1);
          } else {
            state.favoriteMarkets.push(marketId);
          }
          
          // Update user favorites if logged in
          if (state.user) {
            state.user.favoriteMarkets = [...state.favoriteMarkets];
          }
        }),
        
        toggleFavoriteItem: (itemId) => set((state) => {
          const index = state.favoriteItems.indexOf(itemId);
          if (index > -1) {
            state.favoriteItems.splice(index, 1);
          } else {
            state.favoriteItems.push(itemId);
          }
        }),
        
        // Search & Filter actions
        setSearchQuery: (query) => set((state) => {
          state.searchQuery = query;
        }),
        
        setSelectedCategory: (category) => set((state) => {
          state.selectedCategory = category;
        }),
        
        setPriceRange: (range) => set((state) => {
          state.priceRange = range;
        }),
        
        setSortBy: (sortBy) => set((state) => {
          state.sortBy = sortBy;
        }),
        
        addRecentSearch: (query) => set((state) => {
          if (query.trim() && !state.recentSearches.includes(query)) {
            state.recentSearches.unshift(query);
            // Keep only last 10 searches
            state.recentSearches = state.recentSearches.slice(0, 10);
          }
        }),
        
        clearRecentSearches: () => set((state) => {
          state.recentSearches = [];
        }),
        
        // UI actions
        setHasHydrated: (hasHydrated) => set((state) => {
          state.hasHydrated = hasHydrated;
        }),
        
        toggleSearch: () => set((state) => {
          state.isSearchVisible = !state.isSearchVisible;
        }),
        
        showSearch: () => set((state) => {
          state.isSearchVisible = true;
        }),
        
        hideSearch: () => set((state) => {
          state.isSearchVisible = false;
        }),
        
        openAuthModal: () => set((state) => {
          state.isAuthModalOpen = true;
        }),
        
        closeAuthModal: () => set((state) => {
          state.isAuthModalOpen = false;
        }),
        
        openAddItemModal: () => set((state) => {
          state.isAddItemModalOpen = true;
        }),
        
        closeAddItemModal: () => set((state) => {
          state.isAddItemModalOpen = false;
        }),
        
        // Location actions
        setUserLocation: (location) => set((state) => {
          state.userLocation = location;
          if (state.user) {
            const current = state.user.preferences ?? {
              currency: 'BDT',
              language: 'en',
              notifications: true,
              location: {},
            };

            state.user.preferences = {
              ...current,
              location: {
                ...(current.location ?? {}),
                ...location,
              },
            };
          }
        }),
        
        // Notification actions
        addNotification: (notification) => set((state) => {
          const newNotification = {
            ...notification,
            id: `notification-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
          };
          state.notifications.push(newNotification);
          
          // Auto-remove after 5 seconds for non-error notifications
          if (notification.type !== 'error') {
            setTimeout(() => {
              const currentState = get();
              currentState.removeNotification(newNotification.id);
            }, 5000);
          }
        }),
        
        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id);
        }),
        
        clearNotifications: () => set((state) => {
          state.notifications = [];
        }),
      })),
      {
        name: 'fresh-market-finder-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          appConfig: state.appConfig,
          settings: state.settings,
          generalConfig: state.generalConfig,
          favoriteMarkets: state.favoriteMarkets,
          favoriteItems: state.favoriteItems,
          userLocation: state.userLocation,
          recentSearches: state.recentSearches,
          searchQuery: state.searchQuery,
          selectedCategory: state.selectedCategory,
          priceRange: state.priceRange,
          sortBy: state.sortBy,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    ),
    {
      name: 'fresh-market-finder-store',
    }
  )
);

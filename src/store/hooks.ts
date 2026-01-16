import { useAppStore } from './app-store';

// Auth hooks
export const useAuth = () => {
  const user = useAppStore((state) => state.user);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const login = useAppStore((state) => state.login);
  const logout = useAppStore((state) => state.logout);
  const setUser = useAppStore((state) => state.setUser);
  const updateUserPreferences = useAppStore((state) => state.updateUserPreferences);
  
  return {
    user,
    isAuthenticated,
    login,
    logout,
    setUser,
    updateUserPreferences,
  };
};



// Search hooks
export const useSearch = () => {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const isSearchVisible = useAppStore((state) => state.isSearchVisible);
  const selectedCategory = useAppStore((state) => state.selectedCategory);
  const priceRange = useAppStore((state) => state.priceRange);
  const sortBy = useAppStore((state) => state.sortBy);
  const recentSearches = useAppStore((state) => state.recentSearches);
  
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const toggleSearch = useAppStore((state) => state.toggleSearch);
  const showSearch = useAppStore((state) => state.showSearch);
  const hideSearch = useAppStore((state) => state.hideSearch);
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory);
  const setPriceRange = useAppStore((state) => state.setPriceRange);
  const setSortBy = useAppStore((state) => state.setSortBy);
  const addRecentSearch = useAppStore((state) => state.addRecentSearch);
  const clearRecentSearches = useAppStore((state) => state.clearRecentSearches);
  
  return {
    searchQuery,
    isSearchVisible,
    selectedCategory,
    priceRange,
    sortBy,
    recentSearches,
    setSearchQuery,
    toggleSearch,
    showSearch,
    hideSearch,
    setSelectedCategory,
    setPriceRange,
    setSortBy,
    addRecentSearch,
    clearRecentSearches,
  };
};

// Favorites hooks
export const useFavorites = () => {
  const favoriteMarkets = useAppStore((state) => state.favoriteMarkets);
  const favoriteItems = useAppStore((state) => state.favoriteItems);
  const toggleFavoriteMarket = useAppStore((state) => state.toggleFavoriteMarket);
  const toggleFavoriteItem = useAppStore((state) => state.toggleFavoriteItem);
  
  const isFavoriteMarket = (marketId: string) => favoriteMarkets.includes(marketId);
  const isFavoriteItem = (itemId: string) => favoriteItems.includes(itemId);
  
  return {
    favoriteMarkets,
    favoriteItems,
    toggleFavoriteMarket,
    toggleFavoriteItem,
    isFavoriteMarket,
    isFavoriteItem,
  };
};

// UI hooks
export const useUI = () => {
  const isAuthModalOpen = useAppStore((state) => state.isAuthModalOpen);
  const isAddItemModalOpen = useAppStore((state) => state.isAddItemModalOpen);
  const openAuthModal = useAppStore((state) => state.openAuthModal);
  const closeAuthModal = useAppStore((state) => state.closeAuthModal);
  const openAddItemModal = useAppStore((state) => state.openAddItemModal);
  const closeAddItemModal = useAppStore((state) => state.closeAddItemModal);
  
  return {
    isAuthModalOpen,
    isAddItemModalOpen,
    openAuthModal,
    closeAuthModal,
    openAddItemModal,
    closeAddItemModal,
  };
};

// Location hooks
export const useLocation = () => {
  const userLocation = useAppStore((state) => state.userLocation);
  const setUserLocation = useAppStore((state) => state.setUserLocation);
  
  return {
    userLocation,
    setUserLocation,
  };
};

// Notifications hooks
export const useNotifications = () => {
  const notifications = useAppStore((state) => state.notifications);
  const addNotification = useAppStore((state) => state.addNotification);
  const removeNotification = useAppStore((state) => state.removeNotification);
  const clearNotifications = useAppStore((state) => state.clearNotifications);
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
};
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  isSearchVisible: boolean;
  showSearch: () => void;
  hideSearch: () => void;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const showSearch = () => setIsSearchVisible(true);
  const hideSearch = () => setIsSearchVisible(false);
  const toggleSearch = () => setIsSearchVisible(prev => !prev);

  return (
    <SearchContext.Provider value={{
      isSearchVisible,
      showSearch,
      hideSearch,
      toggleSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useSearch as useSearchStore } from '@/store/hooks';

// Keep the same interface for backward compatibility
interface SearchContextType {
  isSearchVisible: boolean;
  showSearch: () => void;
  hideSearch: () => void;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const { isSearchVisible, showSearch, hideSearch, toggleSearch } = useSearchStore();

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

// Keep the old hook for backward compatibility, but it now uses Zustand
export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
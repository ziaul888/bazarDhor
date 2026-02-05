import { useAppStore } from '@/store/app-store';
import { useGeneralConfig } from '@/lib/api/hooks/useConfig';

/**
 * Custom hook to access general configuration throughout the app
 * Provides both cached store data and fresh API data
 */
export function useConfig() {
  // Get cached config from Zustand store
  const generalConfig = useAppStore((state) => state.generalConfig);
  
  // Get fresh data from API
  const {
    data: freshConfig,
    isLoading,
    error,
    refetch
  } = useGeneralConfig();

  return {
    // Cached data (immediately available)
    config: generalConfig,
    
    // Fresh data from API
    freshConfig,
    
    // Loading state
    isLoading,
    
    // Error state
    error,
    
    // Refetch function
    refetch,
    
    // Convenience method to get specific config value
    getConfigValue: <T = unknown>(key: string, defaultValue?: T): T | undefined => {
      if (generalConfig && key in generalConfig) {
        return generalConfig[key] as T;
      }
      if (freshConfig && key in freshConfig) {
        return freshConfig[key] as T;
      }
      return defaultValue;
    }
  };
}
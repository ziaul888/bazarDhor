import { fetchClient } from '../../fetch-client';

export const configServerApi = {
  getAppConfig: async (headers?: Record<string, string>): Promise<Record<string, unknown> | null> => {
    try {
      const config = await fetchClient<Record<string, unknown>>('/config/app', {
        headers,
        throwOnError: false,
        next: { revalidate: 3600 },
      });

      return config ?? null;
    } catch (error) {
      console.error('SERVER API Error [configServerApi.getAppConfig]:', error);
      return null;
    }
  },

  getSettings: async (headers?: Record<string, string>): Promise<Record<string, unknown> | null> => {
    try {
      const settings = await fetchClient<Record<string, unknown>>('/config/settings', {
        headers,
        throwOnError: false,
        next: { revalidate: 3600 },
      });

      return settings ?? null;
    } catch (error) {
      console.error('SERVER API Error [configServerApi.getSettings]:', error);
      return null;
    }
  },

  getGeneralConfig: async (headers?: Record<string, string>): Promise<Record<string, unknown> | null> => {
    try {
      const generalConfig = await fetchClient<Record<string, unknown>>('/config', {
        headers,
        throwOnError: false,
        next: { revalidate: 1800 },
      });

      return generalConfig ?? null;
    } catch (error) {
      console.error('SERVER API Error [configServerApi.getGeneralConfig]:', error);
      return null;
    }
  },
};


import { fetchClient } from '../../fetch-client';

// Why: the backend collapsed `/config/app` and `/config/settings` into a single
// consolidated `/config` endpoint. We keep three accessors so the existing
// store shape (`appConfig`/`settings`/`generalConfig`) doesn't change, and rely
// on Next.js's fetch dedupe to coalesce identical requests within one render.
const fetchConfig = async (
  headers?: Record<string, string>
): Promise<Record<string, unknown> | null> => {
  try {
    const config = await fetchClient<Record<string, unknown>>('/config', {
      headers,
      throwOnError: false,
      next: { revalidate: 1800 },
    });
    return config ?? null;
  } catch (error) {
    console.error('SERVER API Error [configServerApi.fetchConfig]:', error);
    return null;
  }
};

export const configServerApi = {
  getAppConfig: fetchConfig,
  getSettings: fetchConfig,
  getGeneralConfig: fetchConfig,
};


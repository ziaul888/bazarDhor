import 'server-only';
import { cookies } from 'next/headers';
import { configServerApi } from '@/lib/api/services/server/config-server';
import { LOCALE_TO_HEADER, LOCALIZATION_HEADER, type AppLocale } from '@/i18n/routing';

// Why: every generateMetadata call (root layout, markets list, market detail,
// future item detail) needs the brand name from /config so the title/OG/site
// name reflect whatever admin configured. Centralized here so the lookup +
// header plumbing live in one place and Next's per-render fetch dedupe makes
// it free when the layout has already fetched the same config.
export async function getBackendBrand(locale: AppLocale): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const zoneId = cookieStore.get('zoneId')?.value;
    if (!zoneId) return null;

    const config = await configServerApi.getGeneralConfig({
      zoneId,
      [LOCALIZATION_HEADER]: LOCALE_TO_HEADER[locale],
    });
    if (!config) return null;

    const raw = (config as Record<string, unknown>).business_name;
    if (typeof raw !== 'string') return null;
    const trimmed = raw.trim();
    return trimmed.length > 0 ? trimmed : null;
  } catch {
    return null;
  }
}

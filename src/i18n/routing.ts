import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['bn', 'en'] as const,
  defaultLocale: 'bn',
  localePrefix: 'always',
  // Why: with detection on, the NEXT_LOCALE cookie or the browser's
  // Accept-Language can override the default. Turning it off makes `/` always
  // redirect to /bn; users still switch by visiting /en explicitly or via the
  // language switcher (which writes the URL, not just the cookie).
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

// Why: API clients need to translate the active locale into a BCP-47 tag
// for the Accept-Language header. Kept here so the table stays in one place
// alongside the locales list.
export const LOCALE_TO_HTTP: Record<AppLocale, string> = {
  en: 'en-US',
  bn: 'bn-BD',
};

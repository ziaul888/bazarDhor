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

// Why: the backend reads the active locale from an `X-localization` request
// header containing the short locale code (`bn` or `en`). Centralized so the
// header name lives in one place; if the backend ever expects BCP-47 tags
// instead, change only the value side here.
export const LOCALIZATION_HEADER = 'X-localization';
export const LOCALE_TO_HEADER: Record<AppLocale, string> = {
  en: 'en',
  bn: 'bn',
};

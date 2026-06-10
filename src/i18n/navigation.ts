import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Why: re-export locale-aware versions of the Next navigation primitives. Link
// auto-prefixes the active locale, usePathname strips it, and useRouter knows
// how to switch locales (used by LocaleSwitch).
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

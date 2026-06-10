import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Why: skip Next internals (`_next`, `_vercel`), API routes (`/api/*`), and
  // any path that contains a dot (static files: manifest.json, sw.js, icons,
  // images, etc.). Everything else flows through the locale router.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

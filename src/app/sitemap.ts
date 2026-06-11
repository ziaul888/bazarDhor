import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bazardhor.com';

// Why: routes that exist for every locale and should be indexed. Per-market
// and per-item dynamic entries should be appended here once those pages serve
// real data — for now we ship the known static surfaces so search engines
// can discover both locale trees.
const STATIC_ROUTES = ['', '/markets', '/markets/compare', '/items', '/about'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return STATIC_ROUTES.flatMap((route) =>
    routing.locales.map((locale) => {
      const path = `/${locale}${route}`;
      // Build hreflang alternates so each entry points at the other locale.
      const alternates: Record<string, string> = {};
      for (const lng of routing.locales) {
        alternates[lng === 'bn' ? 'bn-BD' : 'en-US'] = `${SITE_URL}/${lng}${route}`;
      }
      alternates['x-default'] = `${SITE_URL}/${routing.defaultLocale}${route}`;

      return {
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.7,
        alternates: { languages: alternates },
      };
    }),
  );
}

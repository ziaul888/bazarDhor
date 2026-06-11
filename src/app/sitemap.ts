import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { marketServerApi } from '@/lib/api/services/server/market-server';
import { mapMarketsFromApi, MARKET_LIST_PARAMS } from './[locale]/markets/_lib/market-mapper';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bazardhor.com';

// Why: routes that exist for every locale and should be indexed. Per-market
// dynamic entries are appended at the bottom — per-item routes will join once
// the items/[id] page ships.
const STATIC_ROUTES = ['', '/markets', '/markets/compare', '/items', '/about'] as const;

const hreflangFor = (route: string): Record<string, string> => {
  const alternates: Record<string, string> = {};
  for (const lng of routing.locales) {
    alternates[lng === 'bn' ? 'bn-BD' : 'en-US'] = `${SITE_URL}/${lng}${route}`;
  }
  alternates['x-default'] = `${SITE_URL}/${routing.defaultLocale}${route}`;
  return alternates;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.7,
      alternates: { languages: hreflangFor(route) },
    })),
  );

  // Why: ship dynamic market URLs so search engines can crawl each market page
  // directly. The server fetch is best-effort — if the backend has no markets
  // for the build's default zone, we emit only static routes.
  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const response = await marketServerApi.getMarketList(
      {
        ...MARKET_LIST_PARAMS,
        sort_by: 'distance',
        sort_order: 'asc',
      } as never,
      // No zoneId available at build time; the backend will return empty if it
      // gates on the header, and the catch below will swallow any error.
      {},
    );
    const markets = mapMarketsFromApi(response);
    dynamicEntries = markets.flatMap((market) => {
      const route = `/markets/${market.id}`;
      return routing.locales.map((locale) => ({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.6,
        alternates: { languages: hreflangFor(route) },
      }));
    });
  } catch (error) {
    console.error('sitemap: failed to fetch markets, falling back to static entries', error);
  }

  return [...staticEntries, ...dynamicEntries];
}

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { marketServerApi } from '@/lib/api/services/server/market-server';
import { LOCALE_TO_HEADER, LOCALIZATION_HEADER, routing, type AppLocale } from '@/i18n/routing';
import { getBackendBrand } from '@/lib/server/branding';
import { MarketsPageClient } from './_components/markets-page-client';
import { MARKET_LIST_PARAMS, mapMarketsFromApi } from './_lib/market-mapper';

interface MarketsPageProps {
  params: Promise<{ locale: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bazardhor.com';

export async function generateMetadata({ params }: MarketsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'markets' });
  const tSeo = await getTranslations({ locale, namespace: 'seo' });

  const backendBrand = await getBackendBrand(locale as AppLocale);
  const brand = backendBrand ?? tSeo('brand');
  const title = `${t('pageTitle')} | ${brand}`;
  const description = tSeo('description');
  const path = `/${locale}/markets`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        routing.locales.map((lng) => [
          lng === 'bn' ? 'bn-BD' : 'en-US',
          `${SITE_URL}/${lng}/markets`,
        ]),
      ),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function MarketsPage({ params }: MarketsPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const cookieStore = await cookies();
  const zoneId = cookieStore.get('zoneId')?.value;
  const headers: Record<string, string> = {
    [LOCALIZATION_HEADER]: LOCALE_TO_HEADER[locale as AppLocale],
    ...(zoneId ? { zoneId } : {}),
  };

  // Why: server-render the initial market list so Googlebot's single-shot HTML
  // already contains the cards. Pass the result to the client component, which
  // uses it as initial state and refreshes via React Query on hydration.
  const apiResponse = zoneId
    ? await marketServerApi.getMarketList(
        {
          ...MARKET_LIST_PARAMS,
          sort_by: 'distance',
          sort_order: 'asc',
        } as never,
        headers,
      )
    : null;
  const initialMarkets = mapMarketsFromApi(apiResponse);

  return <MarketsPageClient initialMarkets={initialMarkets} />;
}

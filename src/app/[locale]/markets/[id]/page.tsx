import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { marketServerApi } from '@/lib/api/services/server/market-server';
import { cookies } from 'next/headers';
import { getBackendBrand } from '@/lib/server/branding';
import type { AppLocale } from '@/i18n/routing';
import { MarketDetailsClient } from './_components/market-details-client';

interface MarketDetailsProps {
  params: Promise<{ id: string; locale: string }>;
}

async function getMarketData(id: string) {
  const cookieStore = await cookies();
  const zoneId = cookieStore.get('zoneId')?.value;

  if (!zoneId) {
    return null;
  }

  const marketHeaders = { zoneId };
  
  try {
    const market = await marketServerApi.getMarketById(id, marketHeaders);
    if (!market) return null;

    const raw = market as unknown as Record<string, unknown>;
    const zone = raw.zone as { id?: string; name?: string } | null ?? null;

    return {
      id: String(raw.id ?? id),
      name: String(raw.name ?? ''),
      slug: String(raw.slug ?? ''),
      description: typeof raw.description === 'string' ? raw.description : null,
      image_path: typeof raw.image_path === 'string' ? raw.image_path : null,
      address: typeof raw.address === 'string' ? raw.address : null,
      latitude: typeof raw.latitude === 'number' ? raw.latitude : null,
      longitude: typeof raw.longitude === 'number' ? raw.longitude : null,
      phone: typeof raw.phone === 'string' ? raw.phone : null,
      email: typeof raw.email === 'string' ? raw.email : null,
      website: typeof raw.website === 'string' ? raw.website : null,
      is_open: raw.is_open === true,
      is_featured: raw.is_featured === true,
      division: typeof raw.division === 'string' ? raw.division : null,
      district: typeof raw.district === 'string' ? raw.district : null,
      upazila_or_thana: typeof raw.upazila_or_thana === 'string' ? raw.upazila_or_thana : null,
      opening_hours: raw.opening_hours ?? null,
      zone: zone ? { id: String(zone.id ?? ''), name: String(zone.name ?? '') } : null,
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: MarketDetailsProps): Promise<Metadata> {
  const { id, locale } = await params;
  const marketData = await getMarketData(id);
  const t = await getTranslations({ locale, namespace: 'markets' });
  const tSeo = await getTranslations({ locale, namespace: 'seo' });

  const backendBrand = await getBackendBrand(locale as AppLocale);
  const brand = backendBrand ?? tSeo('brand');

  if (!marketData) {
    return {
      title: `${t('notFoundTitle')} | ${brand}`,
      description: t('notFoundDesc'),
    };
  }

  const title = `${marketData.name} | ${brand}`;
  const description =
    marketData.description || t('seoDefaultDesc', { name: marketData.name });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function MarketDetailsPage({ params }: MarketDetailsProps) {
  const { id } = await params;
  const marketData = await getMarketData(id);

  if (!marketData) {
    notFound();
  }

  return <MarketDetailsClient marketData={marketData} />;
}

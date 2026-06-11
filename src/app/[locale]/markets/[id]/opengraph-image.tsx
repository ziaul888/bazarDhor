import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { cookies } from 'next/headers';
import { routing, LOCALE_TO_HEADER, LOCALIZATION_HEADER, type AppLocale } from '@/i18n/routing';
import { marketServerApi } from '@/lib/api/services/server/market-server';

// Why: Per-market OG image so a shared link to /[locale]/markets/[id] renders
// with the actual market name + address as the social preview, not the
// fallback brand image.
export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'BazarDhor market page';

async function fetchMarket(id: string, locale: AppLocale) {
  try {
    const cookieStore = await cookies();
    const zoneId = cookieStore.get('zoneId')?.value;
    if (!zoneId) return null;
    const market = await marketServerApi.getMarketById(id, {
      zoneId,
      [LOCALIZATION_HEADER]: LOCALE_TO_HEADER[locale],
    });
    return market as Record<string, unknown> | null;
  } catch {
    return null;
  }
}

export default async function MarketOpengraphImage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const resolvedLocale: AppLocale = hasLocale(routing.locales, locale)
    ? (locale as AppLocale)
    : routing.defaultLocale;
  const tSeo = await getTranslations({ locale: resolvedLocale, namespace: 'seo' });

  const brand = tSeo('brand');
  const market = await fetchMarket(id, resolvedLocale);
  const name = (market?.name as string) || brand;
  const address = (market?.address as string) || '';
  const type = (market?.type as string) || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top — brand chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '24px',
            fontWeight: 600,
            opacity: 0.9,
          }}
        >
          <span
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 800,
            }}
          >
            {brand.slice(0, 1)}
          </span>
          <span>{brand}</span>
        </div>

        {/* Middle — market name + type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {type ? (
            <div
              style={{
                fontSize: '28px',
                fontWeight: 600,
                opacity: 0.85,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {type}
            </div>
          ) : null}
          <div
            style={{
              fontSize: name.length > 28 ? '76px' : '96px',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              maxWidth: '1040px',
              display: 'block',
              overflow: 'hidden',
            }}
          >
            {name}
          </div>
        </div>

        {/* Bottom — address */}
        <div
          style={{
            fontSize: '28px',
            lineHeight: 1.35,
            opacity: 0.85,
            maxWidth: '1040px',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {address || tSeo('tagline')}
        </div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

// Routing locales referenced via routing.locales below for `hasLocale`.

// Why: Next App Router auto-detects this file and wires the returned image
// into every page's openGraph.images (and Twitter card) for the [locale]
// segment, so all locale-prefixed routes inherit a branded social preview
// without each page having to declare its own images array. Edge runtime
// keeps the image-generation cold-start small; the response is cached by
// Next so each unique URL only renders once until revalidated.
export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'BazarDhor — Today\'s local market prices';

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: resolvedLocale, namespace: 'seo' });

  const brand = t('brand');
  const tagline = t('tagline');
  const description = t('description');

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
        {/* Top — small label */}
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

        {/* Middle — brand title + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              fontSize: '108px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            {brand}
          </div>
          <div
            style={{
              fontSize: '52px',
              fontWeight: 600,
              lineHeight: 1.2,
              opacity: 0.95,
            }}
          >
            {tagline}
          </div>
        </div>

        {/* Bottom — description as one-line summary */}
        <div
          style={{
            fontSize: '26px',
            lineHeight: 1.35,
            opacity: 0.85,
            maxWidth: '900px',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description.length > 160 ? `${description.slice(0, 160)}…` : description}
        </div>
      </div>
    ),
    size,
  );
}

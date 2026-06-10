"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft,
  Heart,
  Share2,
  Navigation,
  Phone,
  MapPin,
  Clock,
  Globe,
  Mail,
} from 'lucide-react';
import { MarketItemsList } from './market-items-list';

interface MarketData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_path: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  is_open: boolean;
  is_featured: boolean;
  division: string | null;
  district: string | null;
  upazila_or_thana: string | null;
  opening_hours: unknown;
  zone: { id: string; name: string } | null;
}

interface MarketDetailsClientProps {
  marketData: MarketData;
}

const WEEKDAY_INDEX = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

type DayHours = { day: string; isClosed: boolean; opening: string; closing: string };

type HoursLabels = {
  closed: string;
  opensAt: (time: string) => string;
  closesAt: (time: string) => string;
  todayPrefix: string;
  dayShort: Record<string, string>;
};

function readDayEntry(value: unknown): DayHours | null {
  if (!value || typeof value !== 'object') return null;
  const obj = value as Record<string, unknown>;
  const day = typeof obj.day === 'string' ? obj.day.trim() : '';
  const isClosed = obj.is_closed === true;
  const opening = typeof obj.opening === 'string' ? obj.opening.trim() : '';
  const closing = typeof obj.closing === 'string' ? obj.closing.trim() : '';
  if (!day && !opening && !closing && !isClosed) return null;
  return { day, isClosed, opening, closing };
}

function formatRange(entry: DayHours, labels: HoursLabels): string {
  if (entry.isClosed) return labels.closed;
  if (entry.opening && entry.closing) return `${entry.opening} – ${entry.closing}`;
  if (entry.opening) return labels.opensAt(entry.opening);
  if (entry.closing) return labels.closesAt(entry.closing);
  return '';
}

// Why: backend returns opening_hours as an array of per-day records
// (`[{ day, is_closed, opening, closing }, ...]`). `String(obj)` was rendering
// "[object Object]" — this picks today's entry so the InfoRow shows the actual
// open/close times. Falls back to the first non-closed day for older payloads.
function formatOpeningHours(value: unknown, labels: HoursLabels): string | null {
  if (value == null) return null;
  if (typeof value === 'string') return value.trim() || null;

  // Array of day records (current backend shape)
  if (Array.isArray(value)) {
    const entries = value.map(readDayEntry).filter((e): e is DayHours => e !== null);
    if (entries.length === 0) return null;

    const todayKey = WEEKDAY_INDEX[new Date().getDay()];
    const today = entries.find((e) => e.day.toLowerCase() === todayKey);
    if (today) {
      const range = formatRange(today, labels);
      return range ? `${labels.todayPrefix} · ${range}` : null;
    }

    const firstOpen = entries.find((e) => !e.isClosed && (e.opening || e.closing));
    if (firstOpen) {
      const range = formatRange(firstOpen, labels);
      const label = labels.dayShort[firstOpen.day.toLowerCase()] ?? firstOpen.day;
      return range ? `${label} · ${range}` : null;
    }

    return labels.closed;
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    if (obj.is_closed === true) return labels.closed;

    const opening = typeof obj.opening === 'string' ? obj.opening.trim() : '';
    const closing = typeof obj.closing === 'string' ? obj.closing.trim() : '';
    if (opening && closing) return `${opening} – ${closing}`;
    if (opening) return opening;

    // Per-day dict shape: { monday: '8-6', tuesday: '8-6', ... }
    const dayLines = Object.entries(obj)
      .filter(([k]) => k.toLowerCase() in labels.dayShort)
      .map(([k, v]) => {
        const label = labels.dayShort[k.toLowerCase()];
        const raw = typeof v === 'string' ? v : v && typeof v === 'object'
          ? formatOpeningHours(v, labels)
          : null;
        return raw ? `${label}: ${raw}` : null;
      })
      .filter((line): line is string => Boolean(line));
    if (dayLines.length > 0) return dayLines.join(' · ');
  }

  return null;
}

export function MarketDetailsClient({ marketData }: MarketDetailsClientProps) {
  const t = useTranslations('markets');
  const tNav = useTranslations('nav');
  const [isFavorite, setIsFavorite] = useState(false);

  const hasCoords =
    typeof marketData.latitude === 'number' &&
    typeof marketData.longitude === 'number';

  const hoursLabels: HoursLabels = {
    closed: t('closedLabel'),
    opensAt: (time: string) => t('opensAt', { time }),
    closesAt: (time: string) => t('closesAt', { time }),
    todayPrefix: t('todayPrefix'),
    dayShort: {
      monday: t('dayMon'),
      tuesday: t('dayTue'),
      wednesday: t('dayWed'),
      thursday: t('dayThu'),
      friday: t('dayFri'),
      saturday: t('daySat'),
      sunday: t('daySun'),
    },
  };
  const openingHoursText = formatOpeningHours(marketData.opening_hours, hoursLabels);

  return (
    <div className="pb-24">
      <header className="container mx-auto max-w-3xl lg:max-w-6xl px-4 pt-5 pb-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/markets"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {tNav('markets')}
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label={t('favorite')}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-muted/60"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              type="button"
              aria-label={t('share')}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-muted/60"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-4">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold leading-tight">{marketData.name}</h1>
          <span
            className={`flex-none text-[11px] font-medium px-2 py-0.5 rounded-full ${
              marketData.is_open
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {marketData.is_open ? t('openLabel') : t('closedLabel')}
          </span>
        </div>
        {marketData.zone && (
          <p className="text-xs text-muted-foreground mt-1">{marketData.zone.name}</p>
        )}
        {marketData.description && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {marketData.description}
          </p>
        )}
      </section>

      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 mt-4">
        <div className="border-y lg:border lg:rounded-xl bg-card divide-y">
          {marketData.address && (
            <InfoRow icon={<MapPin className="h-4 w-4" />} label={t('address')} value={marketData.address} />
          )}
          {openingHoursText && (
            <InfoRow
              icon={<Clock className="h-4 w-4" />}
              label={t('hours')}
              value={openingHoursText}
            />
          )}
          {marketData.phone && (
            <InfoRow
              icon={<Phone className="h-4 w-4" />}
              label={t('phone')}
              value={marketData.phone}
              href={`tel:${marketData.phone}`}
            />
          )}
          {marketData.email && (
            <InfoRow
              icon={<Mail className="h-4 w-4" />}
              label={t('emailLabel')}
              value={marketData.email}
              href={`mailto:${marketData.email}`}
            />
          )}
          {marketData.website && (
            <InfoRow
              icon={<Globe className="h-4 w-4" />}
              label={t('website')}
              value={marketData.website}
              href={
                marketData.website.startsWith('http')
                  ? marketData.website
                  : `https://${marketData.website}`
              }
              external
            />
          )}
          {hasCoords && (
            <InfoRow
              icon={<Navigation className="h-4 w-4" />}
              label={t('directions')}
              value={t('openInMaps')}
              href={`https://www.google.com/maps/dir/?api=1&destination=${marketData.latitude},${marketData.longitude}`}
              external
              accent
            />
          )}
        </div>
      </section>

      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 mt-6">
        <h2 className="px-4 lg:px-0 text-base font-semibold mb-2">{t('allItems')}</h2>
        <MarketItemsList marketId={String(marketData.id)} />
      </section>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  href,
  external = false,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  accent?: boolean;
}) {
  const content = (
    <>
      <span
        aria-hidden
        className={`flex-none w-9 h-9 rounded-full ${
          accent ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
        } flex items-center justify-center`}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[11px] text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <span
          className={`block text-sm truncate ${accent ? 'text-primary font-medium' : 'font-medium'}`}
        >
          {value}
        </span>
      </span>
    </>
  );

  const className =
    'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors';

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {content}
      </a>
    );
  }
  return <div className={className}>{content}</div>;
}

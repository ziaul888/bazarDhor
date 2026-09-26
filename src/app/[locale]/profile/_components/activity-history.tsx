"use client";

import { useState } from 'react';
import {
  TrendingUp,
  Star,
  Heart,
  MessageSquare,
  Calendar,
  Clock,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useActivityStatistics, useActivities } from '@/lib/api/hooks/useUser';
import type { ActivityTypeFilter, UserActivity } from '@/lib/api/types';

// Why: keyed by the backend's open-ended `type` string so a new activity type
// only needs one entry here; anything unknown falls back to a neutral icon
// instead of crashing the timeline.
const TYPE_STYLES: Record<string, { icon: LucideIcon; iconColor: string; bgColor: string }> = {
  price_update: { icon: TrendingUp, iconColor: 'text-green-600', bgColor: 'bg-green-500/10' },
  review: { icon: Star, iconColor: 'text-yellow-600', bgColor: 'bg-yellow-500/10' },
  favorite: { icon: Heart, iconColor: 'text-red-600', bgColor: 'bg-red-500/10' },
  comment: { icon: MessageSquare, iconColor: 'text-purple-600', bgColor: 'bg-purple-500/10' },
};

const FALLBACK_STYLE = { icon: Clock, iconColor: 'text-muted-foreground', bgColor: 'bg-muted' };

// Only types the backend emits today; `visit`/`purchase` are reserved and the
// endpoint answers 422 if they are sent.
const filterOptions: ActivityTypeFilter[] = [
  'all',
  'price_update',
  'review',
  'favorite',
  'comment',
];

const RELATIVE_UNITS = [
  { unit: 'year', ms: 31_536_000_000 },
  { unit: 'month', ms: 2_592_000_000 },
  { unit: 'day', ms: 86_400_000 },
  { unit: 'hour', ms: 3_600_000 },
  { unit: 'minute', ms: 60_000 },
] as const;

// Why: the contract sends raw ISO timestamps and asks the client to render
// relative time; Intl.RelativeTimeFormat covers both locales ("2 hours ago" /
// "২ ঘণ্টা আগে") without pulling in a date library.
const formatRelativeTime = (iso: string, locale: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const diff = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  for (const { unit, ms } of RELATIVE_UNITS) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return rtf.format(Math.round(diff / 1000), 'second');
};

export function ActivityHistory() {
  const t = useTranslations('profile.activity');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [filter, setFilter] = useState<ActivityTypeFilter>('all');

  const statistics = useActivityStatistics();
  const activities = useActivities(filter);

  const items = activities.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold">{t('title')}</h3>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ActivityTypeFilter)}
            className="hidden sm:block px-3 py-2 border border-border rounded-md bg-background text-sm"
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {t(`filters.${option}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile
          label={t('stats.priceUpdates')}
          value={statistics.data ? statistics.data.price_updates : '—'}
          className="text-green-600"
        />
        <StatTile
          label={t('stats.reviewsWritten')}
          value={statistics.data ? statistics.data.reviews_written : '—'}
          className="text-yellow-600"
        />
        <StatTile
          label={t('stats.favoriteMarkets')}
          value={statistics.data ? statistics.data.favorite_markets : '—'}
          className="text-red-600"
        />
        <StatTile
          label={t('stats.marketsVisited')}
          value={statistics.data ? statistics.data.markets_visited : '—'}
          className="text-blue-600"
        />
      </div>

      {/* Activity Timeline */}
      <div className="bg-card rounded-xl border">
        <div className="p-6">
          {activities.isPending ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-4 animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3.5 w-1/2 bg-muted rounded" />
                    <div className="h-3 w-3/4 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.isError ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-3">{t('loadError')}</p>
              <Button variant="outline" size="sm" onClick={() => activities.refetch()}>
                {tCommon('retry')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} locale={locale} />
              ))}
            </div>
          )}

          {!activities.isPending && !activities.isError && items.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('noActivityTitle')}</h3>
              <p className="text-muted-foreground">{t('noActivityDescription')}</p>
            </div>
          )}
        </div>

        {/* Load More */}
        {activities.hasNextPage && (
          <div className="border-t p-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => activities.fetchNextPage()}
              disabled={activities.isFetchingNextPage}
            >
              {activities.isFetchingNextPage ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {t('loadMore')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  className,
}: {
  label: string;
  value: number | string;
  className?: string;
}) {
  return (
    <div className="bg-card rounded-lg p-4 border text-center">
      <div className={`text-2xl font-bold ${className ?? ''}`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function ActivityRow({ activity, locale }: { activity: UserActivity; locale: string }) {
  const t = useTranslations('profile.activity.item');
  const { icon: Icon, iconColor, bgColor } = TYPE_STYLES[activity.type] ?? FALLBACK_STYLE;

  // Pre-filled with the fallback so an unrecognized type (or a missing payload)
  // still renders a row instead of crashing.
  let title: string = t('unknownTitle');
  let description: string | null = null;

  if (activity.type === 'price_update' && activity.price_update) {
    const p = activity.price_update;
    title = t('priceUpdateTitle', { item: p.item_name, market: p.market_name });
    description = p.old_price
      ? t('priceUpdateDescription', {
          oldPrice: p.old_price,
          newPrice: p.new_price,
          unit: p.unit,
        })
      : t('priceUpdateFirstSubmission', { newPrice: p.new_price, unit: p.unit });
  } else if (activity.type === 'review' && activity.review) {
    const p = activity.review;
    title = t('reviewTitle', { market: p.market_name });
    const stars = t('reviewStars', { count: p.rating });
    description = p.comment ? `${stars} — "${p.comment}"` : stars;
  } else if (activity.type === 'favorite' && activity.favorite) {
    const p = activity.favorite;
    title =
      p.action === 'removed'
        ? t('favoriteRemoved', { market: p.market_name })
        : t('favoriteAdded', { market: p.market_name });
  } else if (activity.type === 'comment' && activity.comment) {
    const p = activity.comment;
    title = t('commentTitle', { market: p.market_name });
    description = p.body;
  }

  const time = formatRelativeTime(activity.created_at, locale);

  return (
    <div className="flex items-start space-x-4">
      {/* Icon */}
      <div
        className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
      >
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm">{title}</h4>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

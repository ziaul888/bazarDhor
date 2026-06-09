"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Clock, MapPin, Star, Store, Tag } from 'lucide-react';
import { useRandomMarkets } from '@/lib/api/hooks/useMarkets';

const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';

type RawMarket = NonNullable<ReturnType<typeof useRandomMarkets>['data']>[number];

function resolveImage(value?: string | null) {
  if (!value) return undefined;
  const t = value.trim();
  if (!t) return undefined;
  if (t.startsWith('http') || t.startsWith('/')) return t;
  return `${IMAGE_BASE_URL}${t}`;
}

function formatDistance(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) return `${value} km`;
  if (typeof value === 'string' && value.trim()) {
    return value.includes('km') ? value : `${value} km`;
  }
  return null;
}

export function NearbyMarketsCard() {
  const { data: markets, isLoading } = useRandomMarkets();
  const rows = (markets ?? []).slice(0, 4);

  return (
    <section className="px-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold">Nearby markets</h2>
        <Link
          href="/markets"
          className="inline-flex items-center gap-0.5 text-xs text-primary font-medium hover:underline"
        >
          See all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)
        ) : rows.length === 0 ? (
          <div className="rounded-xl border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
            No markets in your zone yet.
          </div>
        ) : (
          rows.map((m) => <MarketRow key={m.id} market={m} />)
        )}
      </div>
    </section>
  );
}

function MarketRow({ market }: { market: RawMarket }) {
  const [imgError, setImgError] = useState(false);
  const raw = market as unknown as Record<string, unknown>;
  const image = resolveImage(typeof raw.image_path === 'string' ? raw.image_path : undefined);
  const address =
    typeof raw.address === 'string' && raw.address.trim()
      ? raw.address
      : typeof raw.location === 'string'
        ? raw.location
        : '';
  const distance = formatDistance(raw.distance_km ?? raw.distance ?? raw.distanceKm);
  const isOpen = raw.is_open === true || raw.is_open === 1 || raw.is_open === '1';
  const hasImage = Boolean(image) && !imgError;

  const openHours = raw.opening_hours && typeof raw.opening_hours === 'object'
    ? (raw.opening_hours as Record<string, unknown>)
    : null;
  const hours = openHours?.is_closed
    ? 'Closed'
    : typeof openHours?.opening === 'string'
      ? openHours.opening
      : typeof raw.openTime === 'string'
        ? raw.openTime
        : null;

  const type =
    typeof raw.type === 'string' && raw.type.trim()
      ? raw.type
      : typeof raw.market_type === 'string'
        ? raw.market_type
        : null;

  const ratingValue =
    typeof raw.rating === 'number'
      ? raw.rating
      : typeof raw.avg_rating === 'number'
        ? raw.avg_rating
        : null;
  const rating = ratingValue && ratingValue > 0 ? ratingValue.toFixed(1) : null;

  const isFeatured = raw.is_featured === true || raw.featured === true;

  return (
    <Link
      href={`/markets/${market.id}`}
      className="group flex items-stretch rounded-xl border bg-card overflow-hidden hover:bg-muted/40 transition-colors"
    >
      <span className="relative flex-none w-20 self-stretch bg-primary/10 text-primary flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <Image
            src={image!}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <Store className="h-6 w-6" />
        )}
        {/* {isFeatured ? (
          <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 rounded-full bg-yellow-400 text-yellow-900 text-[9px] font-semibold px-1.5 py-0.5 shadow-sm">
            ★
          </span>
        ) : null} */}
      </span>

      <span className="flex-1 min-w-0 px-4 py-3">
        <span className="flex items-start gap-2">
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold truncate group-hover:text-primary transition-colors">
              {market.name}
            </span>
            {address ? (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground truncate mt-0.5">
                <MapPin className="h-3 w-3 flex-none" />
                <span className="truncate">{address}</span>
              </span>
            ) : null}
          </span>
          <span
            className={`flex-none text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
              isOpen
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </span>

        <span className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground mt-2">
          {hours ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="truncate">{hours}</span>
            </span>
          ) : null}
          {type ? (
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {type}
            </span>
          ) : null}
          {rating ? (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="tabular-nums">{rating}</span>
            </span>
          ) : null}
          {distance ? (
            <span className="ml-auto font-medium text-foreground tabular-nums">{distance}</span>
          ) : null}
        </span>
      </span>
    </Link>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-stretch rounded-xl border bg-card overflow-hidden animate-pulse">
      <div className="w-20 self-stretch min-h-[5.5rem] bg-muted" />
      <div className="flex-1 px-4 py-3 space-y-2">
        <div className="h-3.5 w-2/3 bg-muted rounded" />
        <div className="h-2.5 w-1/2 bg-muted rounded" />
        <div className="h-2.5 w-3/5 bg-muted rounded" />
      </div>
    </div>
  );
}

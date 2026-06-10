"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Activity, ImageIcon, MapPin, Sparkles, Store } from 'lucide-react';
import { useRandomMarkets } from '@/lib/api/hooks/useMarkets';
import { useBanners } from '@/lib/api/hooks/useBanners';
import { usePulse } from '@/lib/api/hooks/useStats';
import { useZone } from '@/providers/zone-provider';
import type { Banner } from '@/lib/api/types';

const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';

function resolveImage(value?: string | null) {
  if (!value) return undefined;
  const t = value.trim();
  if (!t) return undefined;
  if (t.startsWith('http') || t.startsWith('/')) return t;
  return `${IMAGE_BASE_URL}${t}`;
}

export function HomeBento() {
  const { data: markets } = useRandomMarkets();
  const { data: bannersData, isLoading: isBannersLoading } = useBanners(10, 1);
  const { data: pulse } = usePulse();
  const { zone } = useZone();

  const banners = useMemo<Banner[]>(() => {
    if (!bannersData) return [];
    return bannersData
      .filter((b) => b.is_active !== false)
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [bannersData]);

  // Why: rendering `new Date()` directly causes a server/client hydration mismatch.
  // How: format on the client only.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    setToday(
      new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date())
    );
  }, []);

  const stats = {
    recentPrices: pulse?.recent_prices ?? 0,
    markets: pulse?.markets_total ?? 0,
    items: pulse?.items_total ?? 0,
    contributors: pulse?.contributors ?? 0,
    window: pulse?.window ?? '24h',
  };

  return (
    <section className="sm:px-4 sm:pt-4 space-y-3">
      {/* Hero slider — banners curated by admin */}
      {isBannersLoading ? (
        <div className="h-52 sm:h-64 sm:rounded-2xl border-y sm:border bg-card overflow-hidden">
          <div className="h-full w-full bg-muted/60 animate-pulse" />
        </div>
      ) : banners.length > 0 ? (
        <BannerSlider banners={banners} />
      ) : (
        <EmptyTile
          icon={<Sparkles className="h-5 w-5 text-primary/60" />}
          label="No banners yet"
          hint="Promotions will show up here when they're live."
          className="h-52 sm:h-64"
        />
      )}

      {/* Stats + Zone — side-by-side */}
      <div className="grid grid-cols-2 gap-3 px-4 sm:px-0">
        <div className="rounded-2xl border bg-card p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Activity className="h-3.5 w-3.5 text-primary" />
            Today&apos;s pulse
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold tabular-nums">
              {stats.recentPrices}
            </span>
            <span className="text-[11px] text-muted-foreground">prices · {stats.window}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {stats.markets} markets · {stats.items} items
            {stats.contributors > 0 ? ` · ${stats.contributors} contributors` : ''}
          </p>
        </div>

        <Link
          href="/markets"
          className="rounded-2xl border bg-card p-3 hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Your zone
            </span>
            {today ? <span className="text-[11px]">{today}</span> : null}
          </div>
          <p className="text-sm font-semibold truncate">{zone?.name || 'Detecting…'}</p>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <Store className="h-3 w-3" />
            {markets?.length ?? 0} nearby markets →
          </p>
        </Link>
      </div>
    </section>
  );
}

const SLIDE_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD = 50;

function BannerSlider({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    if (banners.length <= 1 || hovered) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [banners.length, hovered]);

  useEffect(() => {
    if (index >= banners.length) setIndex(0);
  }, [banners.length, index]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    const delta = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;
    if (Math.abs(delta) < SWIPE_THRESHOLD || banners.length <= 1) return;
    if (delta < 0) {
      setIndex((i) => (i + 1) % banners.length);
    } else {
      setIndex((i) => (i - 1 + banners.length) % banners.length);
    }
  };

  return (
    <div
      className="relative overflow-hidden sm:rounded-2xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((banner) => (
          <BannerSlide key={banner.id} banner={banner} />
        ))}
      </div>
    </div>
  );
}

function BannerSlide({ banner }: { banner: Banner }) {
  const [errored, setErrored] = useState(false);
  const image = resolveImage(banner.image_path);
  const hasImage = Boolean(image) && !errored;

  // Why: admin-supplied colors come as hex strings; Tailwind classes can't be
  // generated from them, so apply via inline style on the badge.
  const badgeStyle =
    banner.badge_text
      ? {
          color: banner.badge_color ?? undefined,
          backgroundColor: banner.badge_background_color ?? undefined,
        }
      : undefined;

  const content = (
    <div className="group flex-none w-full relative h-52 sm:h-64 bg-card overflow-hidden text-left">
      {hasImage ? (
        <Image
          src={image!}
          alt={banner.title}
          fill
          sizes="(max-width: 1024px) 100vw, 720px"
          className="object-cover transition-transform group-hover:scale-[1.03]"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-primary/40" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      {banner.badge_text ? (
        <span
          style={badgeStyle}
          className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full text-xs font-semibold px-2.5 py-1 shadow-sm"
        >
          {banner.badge_icon ? (
            <BadgeIcon src={banner.badge_icon} />
          ) : null}
          {banner.badge_text}
        </span>
      ) : null}

      <div className="absolute bottom-3 left-3 right-3 text-white">
        <p className="text-lg sm:text-2xl font-semibold leading-tight truncate">
          {banner.title}
        </p>
        {banner.description ? (
          <p className="text-xs sm:text-sm text-white/80 mt-1 line-clamp-2">
            {banner.description}
          </p>
        ) : null}
        {banner.button_text ? (
          <span className="inline-flex mt-2 items-center rounded-full bg-white text-foreground text-xs font-semibold px-3 py-1.5 shadow-sm">
            {banner.button_text}
          </span>
        ) : null}
      </div>
    </div>
  );

  if (banner.url) {
    const isExternal = /^https?:\/\//.test(banner.url);
    if (isExternal) {
      return (
        <a
          href={banner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none w-full"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={banner.url} className="flex-none w-full">
        {content}
      </Link>
    );
  }

  return <div className="flex-none w-full">{content}</div>;
}

function BadgeIcon({ src }: { src: string }) {
  // Treat short strings (emoji / single-char glyphs) as text, anything that
  // looks like a URL or path as an image.
  const isImage = src.includes('/') || /\.(png|jpe?g|gif|svg|webp)$/i.test(src);
  if (!isImage) {
    return <span aria-hidden>{src}</span>;
  }
  const resolved = resolveImage(src);
  if (!resolved) return null;
  return (
    <span className="relative inline-block w-3.5 h-3.5 overflow-hidden">
      <Image
        src={resolved}
        alt=""
        fill
        sizes="14px"
        className="object-contain"
      />
    </span>
  );
}

function EmptyTile({
  icon,
  label,
  hint,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={`sm:rounded-2xl border-y sm:border bg-card flex flex-col items-center justify-center text-center px-4 ${className}`}
    >
      <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        {icon}
      </span>
      <p className="text-sm font-medium">{label}</p>
      {hint ? <p className="text-xs text-muted-foreground mt-0.5">{hint}</p> : null}
    </div>
  );
}

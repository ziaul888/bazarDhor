"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  Flame,
  MapPin,
  Package,
  Sparkles,
  Store,
  TrendingDown,
  Users,
} from 'lucide-react';
import { useRandomMarkets, useRandomProducts } from '@/lib/api/hooks/useMarkets';
import { useZone } from '@/providers/zone-provider';
import { ProductPriceDialog } from '@/components/product-price-dialog';
import { useSubmitProductPrice } from '@/lib/api/hooks/useUser';
import { handleApiError } from '@/lib/api/client';
import { toast } from 'sonner';

const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';
const taka = new Intl.NumberFormat('en-IN');
const ACTIVITY_WINDOW_MS = 1000 * 60 * 60 * 24;

type Deal = {
  productId: string;
  name: string;
  image?: string;
  marketId: string;
  marketName: string;
  price: number;
  original: number;
  savingsPct: number;
  unit?: string;
};

type FeedItem = {
  key: string;
  productName: string;
  initial: string;
  price: number;
  marketName: string;
  marketId: string;
  unit?: string;
  lastUpdate: number;
};

function resolveImage(value?: string | null) {
  if (!value) return undefined;
  const t = value.trim();
  if (!t) return undefined;
  if (t.startsWith('http') || t.startsWith('/')) return t;
  return `${IMAGE_BASE_URL}${t}`;
}

function parseTs(value: string): number {
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : 0;
}

function timeAgo(ts: number, now: number) {
  if (!ts) return 'recently';
  const diff = Math.max(0, now - ts);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  const wk = Math.floor(day / 7);
  if (wk < 4) return `${wk}w`;
  return `${Math.floor(day / 30)}mo`;
}

export function HomeBento() {
  const { data: products, isLoading: isProductsLoading } = useRandomProducts();
  const { data: markets } = useRandomMarkets();
  const { zone } = useZone();

  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const submit = useSubmitProductPrice();

  const deals = useMemo<Deal[]>(() => {
    if (!products) return [];
    const list: Deal[] = [];
    for (const p of products) {
      const mp = p.market_prices?.[0];
      if (!mp) continue;
      const original = mp.price ?? 0;
      const discount = mp.discount_price ?? 0;
      if (!discount || !original || discount >= original) continue;
      list.push({
        productId: p.id,
        name: p.name,
        image: resolveImage(p.image_path),
        marketId: String(mp.market?.id ?? ''),
        marketName: mp.market?.name || 'Local market',
        price: discount,
        original,
        savingsPct: Math.round(((original - discount) / original) * 100),
        unit: p.unit?.symbol || p.unit?.name || undefined,
      });
    }
    return list.sort((a, b) => b.savingsPct - a.savingsPct);
  }, [products]);

  const heroDeals = deals.slice(0, 3);
  const trending = deals.slice(3, 6);

  const activity = useMemo<FeedItem[]>(() => {
    if (!products) return [];
    const rows: FeedItem[] = [];
    for (const p of products) {
      for (const mp of p.market_prices ?? []) {
        const ts = parseTs(mp.last_update);
        const price = mp.discount_price && mp.discount_price > 0 ? mp.discount_price : mp.price;
        if (!price) continue;
        rows.push({
          key: `${p.id}-${mp.id}`,
          productName: p.name,
          initial: p.name.trim().charAt(0).toUpperCase() || '?',
          price,
          marketName: mp.market?.name || 'Local market',
          marketId: String(mp.market?.id ?? ''),
          unit: p.unit?.symbol || p.unit?.name || undefined,
          lastUpdate: ts,
        });
      }
    }
    return rows.sort((a, b) => b.lastUpdate - a.lastUpdate).slice(0, 5);
  }, [products]);

  const stats = useMemo(() => {
    const now = Date.now();
    const since = now - ACTIVITY_WINDOW_MS;
    let recentPrices = 0;
    const marketIds = new Set<string>();
    const productIds = new Set<string>();
    for (const p of products ?? []) {
      productIds.add(p.id);
      for (const mp of p.market_prices ?? []) {
        if (mp.market?.id) marketIds.add(String(mp.market.id));
        if (parseTs(mp.last_update) >= since) recentPrices += 1;
      }
    }
    return {
      recentPrices,
      markets: marketIds.size || (markets?.length ?? 0),
      items: productIds.size,
    };
  }, [products, markets]);

  const handleOpen = (deal: Deal) => {
    setActiveDeal(deal);
    setNewPrice(deal.price.toString());
  };

  const handleSave = async () => {
    if (!activeDeal) return;
    const parsed = Number.parseFloat(newPrice);
    if (Number.isNaN(parsed) || parsed <= 0) {
      toast.error('Enter a valid price.');
      return;
    }
    const fd = new FormData();
    fd.append('product_id', String(activeDeal.productId));
    fd.append('market_id', String(activeDeal.marketId));
    fd.append('submitted_price', parsed.toFixed(2));
    fd.append('proof_image', 'null');
    try {
      await submit.mutateAsync(fd);
      toast.success('Price submitted.');
      setActiveDeal(null);
    } catch (e) {
      toast.error(handleApiError(e));
    }
  };

  const now = Date.now();
  const loading = isProductsLoading;

  return (
    <section className="px-4 pt-4 space-y-3">
      {/* Hero slider — auto-rotates top deals, swipeable on mobile */}
      {loading ? (
        <div className="h-52 sm:h-64 rounded-2xl border bg-card overflow-hidden">
          <div className="h-full w-full bg-muted/60 animate-pulse" />
        </div>
      ) : heroDeals.length > 0 ? (
        <HeroSlider
          deals={heroDeals}
          onOpen={handleOpen}
          paused={Boolean(activeDeal)}
        />
      ) : (
        <EmptyTile
          icon={<Sparkles className="h-5 w-5 text-primary/60" />}
          label="No deals yet"
          hint="Submit a price to start the feed."
          className="h-52 sm:h-64"
        />
      )}

      {/* Stats + Zone — side-by-side */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border bg-card p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Activity className="h-3.5 w-3.5 text-primary" />
            Today&apos;s pulse
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold tabular-nums">
              {stats.recentPrices}
            </span>
            <span className="text-[11px] text-muted-foreground">prices · 24h</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {stats.markets} markets · {stats.items} items
          </p>
        </div>

        <Link
          href="/markets"
          className="rounded-2xl border bg-card p-3 hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Your zone
          </div>
          <p className="text-sm font-semibold truncate">{zone?.name || 'Detecting…'}</p>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <Store className="h-3 w-3" />
            {markets?.length ?? 0} nearby markets →
          </p>
        </Link>
      </div>

      {/* Trending mini-list */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <p className="text-xs font-semibold flex items-center gap-1.5">
            <TrendingDown className="h-3.5 w-3.5 text-green-600" />
            Trending down
          </p>
          <Link href="/items" className="text-[11px] text-primary font-medium hover:underline">
            See all
          </Link>
        </div>
        {loading ? (
          <div className="divide-y">
            {Array.from({ length: 2 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : trending.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-muted-foreground">
            No trending items right now.
          </div>
        ) : (
          <div className="divide-y">
            {trending.map((d) => (
              <button
                type="button"
                key={`${d.productId}-${d.marketId}`}
                onClick={() => handleOpen(d)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/40 transition-colors"
              >
                <TrendingThumb src={d.image} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium truncate">{d.name}</span>
                  <span className="block text-[11px] text-muted-foreground truncate">
                    @{d.marketName}
                  </span>
                </span>
                <span className="flex-none text-right leading-tight">
                  <span className="block text-sm font-semibold text-primary tabular-nums">
                    ৳ {taka.format(d.price)}
                  </span>
                  <span className="block text-[10px] text-green-600 font-medium">
                    −{d.savingsPct}%
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Activity feed */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <p className="text-xs font-semibold flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            Latest submissions
          </p>
          <Link href="/items" className="text-[11px] text-primary font-medium hover:underline">
            See all
          </Link>
        </div>
        {loading ? (
          <div className="divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : activity.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-muted-foreground">
            No recent submissions yet.
          </div>
        ) : (
          <div className="divide-y">
            {activity.map((row) => (
              <Link
                key={row.key}
                href={row.marketId ? `/markets/${row.marketId}` : '/markets'}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40 transition-colors"
              >
                <span
                  aria-hidden
                  className="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center"
                >
                  {row.initial}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm truncate">
                    <span className="font-medium">{row.productName}</span>
                    <span className="text-muted-foreground"> · </span>
                    <span className="text-muted-foreground">{row.marketName}</span>
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {timeAgo(row.lastUpdate, now)} ago
                  </span>
                </span>
                <span className="flex-none text-sm font-semibold text-primary tabular-nums">
                  ৳{taka.format(row.price)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <ProductPriceDialog
        open={Boolean(activeDeal)}
        onOpenChange={(open) => !open && setActiveDeal(null)}
        item={
          activeDeal
            ? {
                id: activeDeal.productId,
                name: activeDeal.name,
                marketName: activeDeal.marketName,
                marketId: activeDeal.marketId,
                currentPrice: activeDeal.price,
                image: activeDeal.image ?? '',
              }
            : null
        }
        newPrice={newPrice}
        onNewPriceChange={setNewPrice}
        onSave={handleSave}
        confirmLabel={submit.isPending ? 'Submitting...' : 'Submit Price'}
        disableSave={!newPrice || Number.parseFloat(newPrice) <= 0 || !activeDeal?.marketId}
        saving={submit.isPending}
      />
    </section>
  );
}

const SLIDE_INTERVAL_MS = 5000;

const SWIPE_THRESHOLD = 50;

function HeroSlider({
  deals,
  onOpen,
  paused,
}: {
  deals: Deal[];
  onOpen: (deal: Deal) => void;
  paused: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    if (deals.length <= 1 || paused || hovered) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % deals.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [deals.length, paused, hovered]);

  useEffect(() => {
    if (index >= deals.length) setIndex(0);
  }, [deals.length, index]);

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
    if (Math.abs(delta) < SWIPE_THRESHOLD || deals.length <= 1) return;
    if (delta < 0) {
      setIndex((i) => (i + 1) % deals.length);
    } else {
      setIndex((i) => (i - 1 + deals.length) % deals.length);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
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
        {deals.map((deal) => (
          <HeroSlide
            key={`${deal.productId}-${deal.marketId}`}
            deal={deal}
            onClick={() => onOpen(deal)}
          />
        ))}
      </div>
    </div>
  );
}

function HeroSlide({ deal, onClick }: { deal: Deal; onClick: () => void }) {
  const [errored, setErrored] = useState(false);
  const hasImage = Boolean(deal.image && deal.image.trim().length > 0) && !errored;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex-none w-full relative h-52 sm:h-64 bg-card overflow-hidden text-left"
    >
      {hasImage ? (
        <Image
          src={deal.image!}
          alt={deal.name}
          fill
          sizes="(max-width: 1024px) 100vw, 720px"
          className="object-cover transition-transform group-hover:scale-[1.03]"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center">
          <Package className="h-12 w-12 text-primary/40" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-green-500 text-white text-xs font-semibold px-2.5 py-1 shadow-sm">
        <Flame className="h-3.5 w-3.5" />
        Hottest · save {deal.savingsPct}%
      </span>
      <div className="absolute bottom-3 left-3 right-3 text-white">
        <p className="text-[11px] uppercase tracking-wide text-white/70 truncate">
          @{deal.marketName}
        </p>
        <p className="text-lg sm:text-2xl font-semibold leading-tight truncate">
          {deal.name}
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl sm:text-3xl font-bold tabular-nums">
            ৳ {taka.format(deal.price)}
          </span>
          <span className="text-sm text-white/70 line-through tabular-nums">
            ৳ {taka.format(deal.original)}
          </span>
          {deal.unit ? (
            <span className="text-[11px] text-white/70">/ {deal.unit}</span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

function TrendingThumb({ src }: { src?: string }) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src && src.trim().length > 0) && !errored;
  return (
    <span className="relative flex-none w-10 h-10 rounded-lg overflow-hidden bg-primary/10 text-primary flex items-center justify-center">
      {showImage ? (
        <Image
          src={src!}
          alt=""
          fill
          sizes="40px"
          className="object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <Package className="h-4 w-4" />
      )}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-muted" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2.5 w-2/3 bg-muted rounded" />
        <div className="h-2 w-1/3 bg-muted rounded" />
      </div>
      <div className="h-3 w-10 bg-muted rounded" />
    </div>
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
      className={`rounded-2xl border bg-card flex flex-col items-center justify-center text-center px-4 ${className}`}
    >
      <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        {icon}
      </span>
      <p className="text-sm font-medium">{label}</p>
      {hint ? <p className="text-xs text-muted-foreground mt-0.5">{hint}</p> : null}
    </div>
  );
}

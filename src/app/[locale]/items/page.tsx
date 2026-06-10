"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Check, ChevronDown, Search, Store } from 'lucide-react';
import { PriceRow, type PriceRowItem } from '@/app/[locale]/_components/price-row';
import {
  FeedFilterPopover,
  applyFeedFilter,
  parseTs,
  type FeedFilter,
} from '@/app/[locale]/_components/feed-filter';
import { useRandomMarkets, useRandomProducts } from '@/lib/api/hooks/useMarkets';
import { useCategories } from '@/lib/api/hooks/useCategories';

type Product = NonNullable<ReturnType<typeof useRandomProducts>['data']>[number];
type RawMarket = NonNullable<ReturnType<typeof useRandomMarkets>['data']>[number];
type SelectedMarket = { id: string; name: string };

const PAGE_SIZE = 20;
const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';

function resolveImage(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `${IMAGE_BASE_URL}${trimmed}`;
}

function mapToRow(p: Product): PriceRowItem | null {
  const lowest = p.market_prices?.[0];
  if (!lowest) return null;
  const hasDiscount = lowest.discount_price && lowest.discount_price > 0;
  const trend = (lowest as { price_trend?: string }).price_trend;
  const normalizedTrend: PriceRowItem['priceTrend'] =
    trend === 'up' || trend === 'down' || trend === 'stable' ? trend : undefined;
  return {
    id: p.id,
    name: p.name,
    marketId: lowest.market?.id,
    marketName: lowest.market?.name || 'Local market',
    price: hasDiscount ? lowest.discount_price! : (lowest.price || 0),
    unit: p.unit?.symbol || p.unit?.name || undefined,
    image: resolveImage(p.image_path),
    lastUpdate: lowest.last_update || undefined,
    priceTrend: normalizedTrend,
  };
}

export default function ItemsPage() {
  const t = useTranslations('items');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const tMarkets = useTranslations('markets');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [activeMarket, setActiveMarket] = useState<SelectedMarket | null>(null);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('random');
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const { data: categories } = useCategories();
  const { data: markets, isLoading: isMarketsLoading } = useRandomMarkets();
  const { data: products, isLoading } = useRandomProducts({
    sort_by: feedFilter,
    ...(activeCategory !== 'all' ? { category_id: activeCategory } : {}),
    ...(activeMarket ? { market_id: activeMarket.id } : {}),
  });

  const allRows = useMemo(() => {
    if (!products) return [];
    const filteredByCategory: Product[] = activeCategory === 'all'
      ? products
      : products.filter((p) => String(p.category?.id) === activeCategory);

    const filteredByMarket: Product[] = activeMarket
      ? filteredByCategory.filter((p) =>
          (p.market_prices ?? []).some((mp) => String(mp.market?.id) === activeMarket.id)
        )
      : filteredByCategory;

    const sorted = applyFeedFilter(filteredByMarket, feedFilter, (p) => {
      const mp = p.market_prices?.[0];
      return {
        price: mp?.price ?? 0,
        discountPrice: mp?.discount_price ?? null,
        lastUpdateTs: parseTs(mp?.last_update),
      };
    });

    const rows = sorted
      .map(mapToRow)
      .filter((r): r is PriceRowItem => r !== null);

    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.marketName.toLowerCase().includes(q)
    );
  }, [products, activeCategory, activeMarket, feedFilter, searchQuery]);

  const rows = allRows.slice(0, visible);
  const hasMore = allRows.length > rows.length;

  return (
    <div className="pb-24">
      <div className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 lg:mt-4">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
          <div className="lg:min-w-0">
            <section>
              <div className="flex items-center justify-between gap-2 px-4 pt-6">
                <h2 className="text-base font-semibold">{t('pageTitle')}</h2>
                <div className="flex items-center gap-2">
                  <MarketPicker
                    markets={markets ?? []}
                    isLoading={isMarketsLoading}
                    selected={activeMarket}
                    onSelect={(next) => {
                      setActiveMarket(next);
                      setVisible(PAGE_SIZE);
                    }}
                    labels={{
                      all: t('marketAll'),
                      title: t('marketFilter'),
                      loading: t('marketLoading'),
                      none: t('marketNone'),
                    }}
                  />
                  <FeedFilterPopover
                    active={feedFilter}
                    onChange={(next) => {
                      setFeedFilter(next);
                      setVisible(PAGE_SIZE);
                    }}
                  />
                </div>
              </div>

              <div className="px-4 pt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setVisible(PAGE_SIZE);
                    }}
                    placeholder={t('searchPlaceholder')}
                    className="w-full h-10 pl-9 pr-3 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="px-4 pt-3 pb-2 sticky top-0 z-10 bg-background">
                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
                  <Chip
                    label={tCommon('all')}
                    active={activeCategory === 'all'}
                    onClick={() => {
                      setActiveCategory('all');
                      setVisible(PAGE_SIZE);
                    }}
                  />
                  {categories?.map((c) => (
                    <Chip
                      key={c.id}
                      label={c.name}
                      active={activeCategory === String(c.id)}
                      onClick={() => {
                        setActiveCategory(String(c.id));
                        setVisible(PAGE_SIZE);
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="divide-y border-y bg-card">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
                ) : rows.length === 0 ? (
                  <EmptyState title={t('emptyTitle')} hint={t('emptyHint')} />
                ) : (
                  rows.map((r) => <PriceRow key={`${r.id}-${r.marketId ?? 'na'}`} item={r} />)
                )}
              </div>

              {hasMore && (
                <div className="px-4 py-6 text-center">
                  <button
                    type="button"
                    onClick={() => setVisible((n) => n + PAGE_SIZE)}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    {tCommon('loadMore')}
                  </button>
                </div>
              )}
            </section>
          </div>

          <aside className="lg:pt-6 lg:sticky lg:top-4 lg:self-start lg:space-y-4">
            <div className="hidden lg:block px-4 text-xs text-muted-foreground space-y-1.5">
              <Link className="block hover:text-foreground" href="/markets">
                {tMarkets('browseAll')}
              </Link>
              <Link className="block hover:text-foreground" href="/markets/compare">
                {tMarkets('compareTwo')}
              </Link>
              <Link className="block hover:text-foreground" href="/about">
                {tNav('about')}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-none px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-muted-foreground border-border hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

function MarketPicker({
  markets,
  isLoading,
  selected,
  onSelect,
  labels,
}: {
  markets: RawMarket[];
  isLoading: boolean;
  selected: SelectedMarket | null;
  onSelect: (next: SelectedMarket | null) => void;
  labels: { all: string; title: string; loading: string; none: string };
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`inline-flex items-center gap-1.5 max-w-[180px] px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
          selected
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background border-border hover:bg-muted/60'
        }`}
      >
        <Store className="h-3.5 w-3.5" />
        <span className="truncate">{selected ? selected.name : labels.all}</span>
        <ChevronDown className="h-3.5 w-3.5 flex-none" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-20 w-64 rounded-lg border bg-card shadow-md overflow-hidden"
        >
          <div className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
            {labels.title}
          </div>
          <div className="max-h-64 overflow-y-auto pb-1">
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                selected ? 'hover:bg-muted/60' : 'text-primary font-medium'
              }`}
            >
              <span>{labels.all}</span>
              {!selected ? <Check className="h-4 w-4 flex-none" /> : null}
            </button>
            {isLoading ? (
              <div className="px-3 py-4 text-xs text-muted-foreground">{labels.loading}</div>
            ) : markets.length === 0 ? (
              <div className="px-3 py-4 text-xs text-muted-foreground">{labels.none}</div>
            ) : (
              markets.map((m) => {
                const isActive = selected?.id === m.id;
                return (
                  <button
                    key={m.id}
                    role="menuitemradio"
                    aria-checked={isActive}
                    type="button"
                    onClick={() => {
                      onSelect({ id: m.id, name: m.name });
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                      isActive ? 'text-primary font-medium' : 'hover:bg-muted/60'
                    }`}
                  >
                    <span className="truncate">{m.name}</span>
                    {isActive ? <Check className="h-4 w-4 flex-none" /> : null}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/5 bg-muted rounded" />
        <div className="h-2.5 w-1/3 bg-muted rounded" />
      </div>
      <div className="h-6 w-16 bg-muted rounded" />
    </div>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="px-4 py-16 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}

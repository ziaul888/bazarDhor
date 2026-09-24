"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Search, MapPin, GitCompare, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { MarketListItem } from '@/components/market-card';
import { useMarketList, useSearchMarkets } from '@/lib/api/hooks/useMarkets';
import type { Market } from '@/lib/api/types';
import {
  extractMarketArray,
  mapMarketFromApi,
  MARKET_LIST_PARAMS,
} from '../_lib/market-mapper';

const PAGE_SIZE = 10;

// Why: these must be the exact `MarketType` enum values the backend compares
// with `where('type', $type)` — anything else silently filters everything out.
// How: each option pairs a backend enum value with its translation key; the
// selected value is sent as the `type` query param so filtering happens
// server-side.
type TypeFilter = 'Wholesale Market' | 'Retail Market';

// Why: `null` stands for the "All" chip — it sends no `type` param, so the
// backend returns every market.
const TYPE_FILTERS: {
  value: TypeFilter | null;
  labelKey: 'filterAll' | 'filterWholesale' | 'filterRetail';
}[] = [
  { value: null, labelKey: 'filterAll' },
  { value: 'Wholesale Market', labelKey: 'filterWholesale' },
  { value: 'Retail Market', labelKey: 'filterRetail' },
];

interface MarketsPageClientProps {
  // Why: server-fetched initial list so the very first paint (and Googlebot's
  // single-shot HTML view) already includes real markets. The client still
  // mounts useMarketList to keep the list fresh as the user moves zones.
  initialMarkets: Market[];
}

export function MarketsPageClient({ initialMarkets }: MarketsPageClientProps) {
  const t = useTranslations('markets');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [marketSource, setMarketSource] = useState<Market[]>(initialMarkets);
  const [searchSource, setSearchSource] = useState<Market[]>([]);
  const [sortDesc, setSortDesc] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilter | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Why: both the distance direction and the market type are applied server-side
  // (the backend supports `sort_order` and an exact-match `type` param), so every
  // chip change lands in the query params and React Query refetches.
  const marketListParams = {
    ...MARKET_LIST_PARAMS,
    sort_by: 'distance' as const,
    sort_order: (sortDesc ? 'desc' : 'asc') as 'asc' | 'desc',
    ...(typeFilter ? { type: typeFilter } : {}),
  };

  const { data: marketListData, isLoading: isMarketListLoading } = useMarketList(marketListParams);
  const { data: searchData, isFetching: isSearchFetching } = useSearchMarkets(
    debouncedQuery,
    undefined,
    typeFilter ?? undefined,
  );

  // Why: the server search only kicks in for 3+ characters; requiring the
  // debounced query too keeps the UI from flapping between list/search sources
  // on every keystroke, while clearing the box restores the full list instantly.
  const isSearchActive = searchQuery.length > 2 && debouncedQuery.length > 2;

  // Localized distance unit so cards read "৯.৪৭ কিমি" on bn and "9.47 km" on en.
  const kmUnit = tCommon('kmUnit');

  const filteredMarkets = useMemo(() => {
    const list = isSearchActive ? searchSource : marketSource;
    if (isSearchActive || !searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.address.toLowerCase().includes(q) ||
        m.specialties.some((s) => s.toLowerCase().includes(q)),
    );
  }, [marketSource, searchSource, isSearchActive, searchQuery]);

  useEffect(() => {
    // Why: while a refetch is in flight the new query has no data yet — keep
    // showing the previous list instead of flashing empty. Once data arrives it
    // replaces the list even when empty (a filter matching nothing is a real
    // result the user must see).
    if (marketListData === undefined) return;
    setMarketSource(
      extractMarketArray(marketListData).map((item, index) => mapMarketFromApi(item, index, kmUnit)),
    );
  }, [marketListData, kmUnit]);

  useEffect(() => {
    setSearchSource(
      extractMarketArray(searchData).map((item, index) => mapMarketFromApi(item, index, kmUnit)),
    );
  }, [searchData, kmUnit]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [searchQuery, debouncedQuery, typeFilter, sortDesc]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(query), 400);
  };

  const handleSelectType = (type: TypeFilter | null) => {
    setTypeFilter((current) => (current === type ? null : type));
  };

  const rows = filteredMarkets.slice(0, visible);
  const hasMore = filteredMarkets.length > rows.length;
  // Why: only show skeletons if we don't already have an initial server list.
  // If the server pre-rendered cards, keep them visible while the query refreshes.
  const showSkeletons = isMarketListLoading && rows.length === 0;

  return (
    <div className="pb-24">
      <div className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 lg:mt-4">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
          <div className="lg:min-w-0">
            <section>
              <div className="px-4 pt-6 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold">{t('nearby')}</h2>
                <Link
                  href="/markets/compare"
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  {t('compareShort')}
                </Link>
              </div>

              <div className="px-4 pt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full h-10 pl-9 pr-9 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                  {isSearchFetching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                  )}
                </div>
              </div>

              <div className="px-4 pt-3 pb-2 sticky top-0 z-10 bg-background">
                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
                  {/* Distance toggles the server sort direction (nearest ↔ farthest). */}
                  <Chip
                    label={t('sortDistance')}
                    active
                    icon={sortDesc ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                    onClick={() => setSortDesc((v) => !v)}
                  />
                  {TYPE_FILTERS.map((option) => (
                    <Chip
                      key={option.labelKey}
                      label={t(option.labelKey)}
                      active={typeFilter === option.value}
                      onClick={() => handleSelectType(option.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="px-4 space-y-3">
                {showSkeletons ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl border bg-card overflow-hidden">
                      <RowSkeleton />
                    </div>
                  ))
                ) : rows.length === 0 ? (
                  <div className="rounded-xl border bg-card">
                    <EmptyState title={t('emptyTitle')} hint={t('emptyHint')} />
                  </div>
                ) : (
                  rows.map((m) => <MarketListItem key={m.id} market={m} />)
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
              <Link className="block hover:text-foreground" href="/markets/compare">
                {t('compareTwo')}
              </Link>
              <Link className="block hover:text-foreground" href="/items">
                {t('browseAllItems')}
              </Link>
              <Link className="block hover:text-foreground" href="/about">
                {t('aboutApp')}
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <div className="lg:hidden container mx-auto max-w-3xl px-4 pt-8 text-center text-xs text-muted-foreground">
        <Link href="/markets/compare" className="hover:text-foreground">
          {t('compareMarkets')}
        </Link>
        <span className="mx-2">·</span>
        <Link href="/items" className="hover:text-foreground">
          {tNav('items')}
        </Link>
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-none px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap inline-flex items-center gap-1 ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-muted-foreground border-border hover:text-foreground'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-16 h-16 rounded-lg bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/5 bg-muted rounded" />
        <div className="h-2.5 w-1/3 bg-muted rounded" />
        <div className="h-2.5 w-1/4 bg-muted rounded" />
      </div>
    </div>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="px-4 py-16 text-center">
      <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
        <MapPin className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}

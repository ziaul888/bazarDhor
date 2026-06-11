"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Search, MapPin, GitCompare, Loader2 } from 'lucide-react';
import { MarketListItem } from '@/components/market-card';
import { useMarketList, useSearchMarkets } from '@/lib/api/hooks/useMarkets';
import type { Market } from '@/lib/api/types';
import {
  extractMarketArray,
  mapMarketFromApi,
  MARKET_LIST_PARAMS,
} from '../_lib/market-mapper';

const PAGE_SIZE = 10;

type SortOption = 'distance' | 'rating' | 'name' | 'retails' | 'dealer';
type ApiSort = 'distance' | 'rating' | 'name';

const SORT_KEYS: SortOption[] = ['distance', 'rating', 'name', 'retails', 'dealer'];
const SORT_TO_KEY: Record<SortOption, string> = {
  distance: 'sortDistance',
  rating: 'sortRating',
  name: 'sortName',
  retails: 'sortRetails',
  dealer: 'sortDealer',
};

const TYPE_FILTERS: SortOption[] = ['retails', 'dealer'];
const isTypeFilter = (value: SortOption): boolean => TYPE_FILTERS.includes(value);
const REAL_SORTS = new Set<SortOption>(['distance', 'rating', 'name']);

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
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>(initialMarkets);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Why: retails/dealer are client-side type filters, not real sort keys.
  // How: send `sort_by` only for the real sort options; otherwise default to
  // distance-asc so the list stays sensibly ordered before the type filter runs.
  const effectiveSort: ApiSort = REAL_SORTS.has(sortBy) ? (sortBy as ApiSort) : 'distance';
  const marketListParams = {
    ...MARKET_LIST_PARAMS,
    sort_by: effectiveSort,
    sort_order: (effectiveSort === 'distance' ? 'asc' : 'desc') as 'asc' | 'desc',
  };

  const { data: marketListData, isLoading: isMarketListLoading } = useMarketList(marketListParams);
  const { data: searchData, isFetching: isSearchFetching } = useSearchMarkets(debouncedQuery);

  const isSearchActive = debouncedQuery.length > 2;

  const applyFilter = (markets: Market[], query: string) => {
    if (!query) return markets;
    const q = query.toLowerCase();
    return markets.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.address.toLowerCase().includes(q) ||
        m.specialties.some((s) => s.toLowerCase().includes(q)),
    );
  };

  const sortMarkets = (markets: Market[], by: SortOption) => {
    if (isTypeFilter(by)) {
      const needle = by.toLowerCase();
      return markets.filter((m) => (m.type || '').toLowerCase().includes(needle));
    }

    const sorted = [...markets];
    switch (by) {
      case 'distance':
        sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return sorted;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(query), 400);
    if (query.length <= 2) {
      setFilteredMarkets(sortMarkets(applyFilter(marketSource, query), sortBy));
      setVisible(PAGE_SIZE);
    }
  };

  const handleSort = (next: SortOption) => {
    setSortBy(next);
    setFilteredMarkets(sortMarkets(filteredMarkets, next));
    setVisible(PAGE_SIZE);
  };

  useEffect(() => {
    const markets = extractMarketArray(marketListData);
    if (markets.length === 0) return;
    const mapped = markets.map(mapMarketFromApi);
    setMarketSource(mapped);
    if (!isSearchActive) {
      setFilteredMarkets(sortMarkets(applyFilter(mapped, searchQuery), sortBy));
      setVisible(PAGE_SIZE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketListData]);

  useEffect(() => {
    if (!isSearchActive) return;
    const markets = extractMarketArray(searchData);
    const mapped = markets.map(mapMarketFromApi);
    setFilteredMarkets(sortMarkets(mapped, sortBy));
    setVisible(PAGE_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData, isSearchActive]);

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
                  {SORT_KEYS.map((key) => (
                    <Chip
                      key={key}
                      label={t(
                        SORT_TO_KEY[key] as
                          | 'sortDistance'
                          | 'sortRating'
                          | 'sortName'
                          | 'sortRetails'
                          | 'sortDealer',
                      )}
                      active={sortBy === key}
                      onClick={() => handleSort(key)}
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

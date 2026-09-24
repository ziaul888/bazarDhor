"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowDown, ArrowUp, Loader2, Search, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/ui/back-button';
import { MarketSelector } from './_components/market-selector';
import { CategorySelect } from './_components/category-select';
import { ComparisonTable } from './_components/comparison-table';
import { useCompareMarketProducts, useCompareMarkets, useRandomMarkets } from '@/lib/api/hooks/useMarkets';
import { useCategories } from '@/lib/api/hooks/useCategories';
import type { Market } from '@/lib/api/types';

const DEFAULT_LOCATION = { lat: 23.8103, lng: 90.4125 };

type ComparedProductRow = {
  id: string;
  name: string;
  image: string;
  category: string;
  unit: string;
  market1Price: number | null;
  market2Price: number | null;
  // Present when the API attaches price_range {min,max} to a market side —
  // displayed instead of the single figure, and savings use the midpoint.
  market1Range: { min: number; max: number } | null;
  market2Range: { min: number; max: number } | null;
  // From the backend's price_difference when present; client-side math as fallback.
  difference: number | null;
  savingsPct: number | null;
  cheaperSide: 1 | 2 | 0;
};

const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const getString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return '';
};

const normalizeImagePath = (value: unknown): string => {
  const path = getString(value);
  if (!path) return '';
  return path.startsWith('http') ? path : `${IMAGE_BASE_URL}${path}`;
};

const extractComparedProductRows = (payload: unknown): ComparedProductRow[] => {
  const root = isRecord(payload) ? payload : {};
  const candidates = [
    root.data,
    root.products,
    root.items,
    root.comparisons,
    payload,
  ];

  const rawList = candidates.find(Array.isArray);
  if (!Array.isArray(rawList)) {
    return [];
  }

  return rawList
    .map((entry, index) => {
      if (!isRecord(entry)) return null;

      const market1 = isRecord(entry.market_1) ? entry.market_1 : null;
      const market2 = isRecord(entry.market_2) ? entry.market_2 : null;
      const product = isRecord(entry.product) ? entry.product : null;
      const category = isRecord(entry.category) ? entry.category : null;
      const unit = isRecord(entry.unit) ? entry.unit : null;

      const market1Price =
        getNumber(entry.market_1_price) ??
        getNumber(entry.market1_price) ??
        getNumber(market1?.discount_price) ??
        getNumber(market1?.price);

      const market2Price =
        getNumber(entry.market_2_price) ??
        getNumber(entry.market2_price) ??
        getNumber(market2?.discount_price) ??
        getNumber(market2?.price);

      // Range-aware: a market side may carry price_range {min,max} like the
      // market_prices payload does elsewhere. The chip then shows the band,
      // and savings math uses the midpoint as the "typical" price until the
      // backend sends a range-aware price_difference.
      const toRange = (source: Record<string, unknown> | null): { min: number; max: number } | null => {
        const raw = isRecord(source?.price_range) ? source!.price_range : null;
        if (!raw) return null;
        const min = getNumber(raw.min);
        const max = getNumber(raw.max);
        return min !== null && max !== null && min <= max ? { min, max } : null;
      };
      const market1Range = toRange(market1);
      const market2Range = toRange(market2);
      const rangeMid = (range: { min: number; max: number } | null) =>
        range ? (range.min + range.max) / 2 : null;
      const m1Effective = rangeMid(market1Range) ?? market1Price;
      const m2Effective = rangeMid(market2Range) ?? market2Price;

      // Prefer the backend's own price_difference; only recompute when absent.
      // Its amount/percentage are SIGNED — negative means market_1 is cheaper —
      // so normalize both to a positive magnitude and take the side from
      // cheaper_market instead of the sign.
      const rawDiff = isRecord(entry.price_difference) ? entry.price_difference : null;
      const rawAmount = getNumber(rawDiff?.amount);
      const rawPct = getNumber(rawDiff?.percentage);
      const cheaperRaw = getString(rawDiff?.cheaper_market);
      const bothPresent = m1Effective !== null && m2Effective !== null;
      const higherPrice = bothPresent ? Math.max(m1Effective!, m2Effective!) : null;
      const difference =
        (rawAmount !== null ? Math.abs(rawAmount) : null) ??
        (bothPresent ? Math.abs(m1Effective! - m2Effective!) : null);
      const savingsPct =
        (rawPct !== null ? Math.abs(rawPct) : null) ??
        (difference !== null && higherPrice && higherPrice > 0
          ? (difference / higherPrice) * 100
          : null);
      const cheaperSide: 1 | 2 | 0 =
        cheaperRaw === 'market_1'
          ? 1
          : cheaperRaw === 'market_2'
            ? 2
            : bothPresent && m1Effective! < m2Effective!
              ? 1
              : bothPresent && m2Effective! < m1Effective!
                ? 2
                : 0;

      return {
        id: getString(entry.id || entry.product_id || product?.id) || `product-${index + 1}`,
        name: getString(entry.name || entry.product_name || entry.title || product?.name) || 'Unnamed Product',
        image: normalizeImagePath(entry.image || entry.image_path || product?.image || product?.image_path),
        category: getString(category?.name || entry.category_name || entry.category) || 'Unknown Category',
        unit: getString(unit?.symbol || unit?.name || entry.unit_name || entry.unit) || 'unit',
        market1Price,
        market2Price,
        market1Range,
        market2Range,
        difference,
        savingsPct,
        cheaperSide,
      };
    })
    .filter((row): row is ComparedProductRow => row !== null);
};

// Half-width price cell under its market's column. Presentational only: the
// winner side gets the success tint, and the ১/২ chip (same style as the
// sticky selectors) tells which market the price belongs to.
// Sticky list header — pairs the ১/২ chip with the market name so the price
// columns always read against the right market while scrolling.
function PriceColumn({
  chip,
  price,
  winner,
}: {
  chip: string;
  price: string;
  winner: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 ${
        winner ? 'bg-success/10' : 'bg-muted/40'
      }`}
    >
      <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center flex-none">
        {chip}
      </span>
      <span
        className={`text-sm font-semibold tabular-nums truncate ${
          winner ? 'text-success' : ''
        }`}
      >
        {price}
      </span>
    </div>
  );
}

export default function CompareMarketsPage() {
  const t = useTranslations('compare');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  // Why: render prices/differences in the user's locale digits (Bengali in bn-BD).
  const nf = useMemo(() => new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-IN'), [locale]);
  const searchParams = useSearchParams();
  const urlMarketId1 = searchParams.get('market_id_1') ?? searchParams.get('m1') ?? '';
  const urlMarketId2 = searchParams.get('market_id_2') ?? searchParams.get('m2') ?? '';

  const { data: randomMarkets, isLoading: isLoadingRandomMarkets } = useRandomMarkets();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const markets = useMemo(() => randomMarkets ?? [], [randomMarkets]);

  const [userLoc, setUserLoc] = useState(DEFAULT_LOCATION);
  const [selectedMarket1, setSelectedMarket1] = useState<Market | null>(null);
  const [selectedMarket2, setSelectedMarket2] = useState<Market | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [productQuery, setProductQuery] = useState('');

  // Why: the VS bar animates in when it transitions from "in flow" to "stuck",
  // so the user sees the two market names slide in while scrolling the products
  // (their explicit ask) instead of the bar just freezing in place.
  // How: while stuck, the bar's rect.top equals its sticky offset (~55-64px);
  // anything below 80px therefore means it is pinned.
  const [isBarStuck, setIsBarStuck] = useState(false);
  const vsBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const bar = vsBarRef.current;
      if (!bar) return;
      setIsBarStuck(bar.getBoundingClientRect().top < 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const appliedUrlKeyRef = useRef<string>('');

  useEffect(() => {
    const storedLat = localStorage.getItem('user_lat');
    const storedLng = localStorage.getItem('user_lng');
    if (!storedLat || !storedLng) return;

    const lat = Number.parseFloat(storedLat);
    const lng = Number.parseFloat(storedLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    setUserLoc({ lat, lng });
  }, []);

  useEffect(() => {
    if (markets.length === 0) return;

    // Always ensure we have initial selections.
    setSelectedMarket1((current) => current ?? markets[0] ?? null);
    setSelectedMarket2((current) => {
      if (current) return current;
      const firstId = markets[0]?.id;
      return markets.find((market) => market.id !== firstId) ?? null;
    });

    const hasUrlParams = Boolean(urlMarketId1 || urlMarketId2);
    if (!hasUrlParams) return;

    const urlKey = `${urlMarketId1}|${urlMarketId2}`;
    if (appliedUrlKeyRef.current === urlKey) return;

    const nextMarket1 = urlMarketId1 ? markets.find((market) => market.id === urlMarketId1) : undefined;
    const nextMarket2 = urlMarketId2 ? markets.find((market) => market.id === urlMarketId2) : undefined;

    // Wait until url params can be resolved into market objects.
    if ((urlMarketId1 && !nextMarket1) || (urlMarketId2 && !nextMarket2)) return;

    const resolvedMarket1 = nextMarket1 ?? markets[0] ?? null;
    let resolvedMarket2 =
      nextMarket2 ??
      markets.find((market) => market.id !== resolvedMarket1?.id) ??
      null;

    if (resolvedMarket1 && resolvedMarket2 && resolvedMarket1.id === resolvedMarket2.id) {
      resolvedMarket2 = markets.find((market) => market.id !== resolvedMarket1.id) ?? null;
    }

    setSelectedMarket1(resolvedMarket1);
    setSelectedMarket2(resolvedMarket2);
    appliedUrlKeyRef.current = urlKey;
  }, [markets, urlMarketId1, urlMarketId2]);

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(String(categories[0].id));
    }
  }, [categories, selectedCategoryId]);

  const compareQuery = useCompareMarkets(
    {
      market_id_1: selectedMarket1?.id ?? '',
      market_id_2: selectedMarket2?.id ?? '',
      user_lat: userLoc.lat,
      user_lng: userLoc.lng,
    },
    Boolean(selectedMarket1 && selectedMarket2)
  );

  const comparison = compareQuery.data?.data;
  const selectedCategory = categories.find((category) => String(category.id) === selectedCategoryId) ?? null;

  const compareProductsQuery = useCompareMarketProducts(
    {
      market_id_1: selectedMarket1?.id ?? '',
      market_id_2: selectedMarket2?.id ?? '',
      category_id: selectedCategoryId,
      limit: 25,
      offset: 1,
    },
    Boolean(selectedMarket1 && selectedMarket2 && selectedCategoryId)
  );

  const comparedProducts = useMemo(
    () => extractComparedProductRows(compareProductsQuery.data?.data),
    [compareProductsQuery.data]
  );

  // Overall verdict: which market wins on more rows, plus the combined saving
  // across all compared products — shown in the strip under the sticky bar.
  const m1Wins = comparedProducts.filter((p) => p.cheaperSide === 1).length;
  const m2Wins = comparedProducts.filter((p) => p.cheaperSide === 2).length;
  const totalSaving = comparedProducts.reduce((sum, p) => sum + (p.difference ?? 0), 0);
  const verdict =
    comparedProducts.length === 0
      ? null
      : {
          totalSaving,
          title:
            m1Wins === m2Wins
              ? t('verdictTie')
              : t('verdictCheaper', {
                  market: (m1Wins > m2Wins ? selectedMarket1?.name : selectedMarket2?.name) ?? '—',
                  count: nf.format(Math.max(m1Wins, m2Wins)),
                  total: nf.format(comparedProducts.length),
                }),
          detail: t('verdictDetail', {
            total: nf.format(comparedProducts.length),
            count: nf.format(m1Wins + m2Wins),
          }),
        };

  const trimmedQuery = productQuery.trim();

  const visibleProducts = useMemo(() => {
    const needle = trimmedQuery.toLowerCase();
    if (!needle) return comparedProducts;
    return comparedProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(needle) ||
        product.category.toLowerCase().includes(needle)
    );
  }, [comparedProducts, trimmedQuery]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setProductQuery('');
  };

  return (
    <div className="pb-24">
      <header className="container mx-auto max-w-3xl lg:max-w-6xl px-4 pt-5 pb-3">
        <BackButton
          variant="ghost"
          size="sm"
          fallbackHref="/markets"
          label={tNav('markets')}
          className="-ml-2 h-8 px-2 text-sm text-muted-foreground hover:text-foreground"
        />
      </header>

      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-4">
        <h1 className="text-xl sm:text-2xl font-semibold leading-tight">{t('pageTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('pageSubtitle')}</p>
      </section>

      <div className="container mx-auto max-w-3xl lg:max-w-6xl px-4 mt-6">
        {/* Sticky VS bar — both markets stay visible while scrolling products.
            When it pins, it slides in (slideInDown) and gains a shadow so the
            entrance reads as an animation, not a sudden freeze. */}
        <div
          ref={vsBarRef}
          className={`sticky top-[55px] sm:top-16 z-20 -mx-4 px-4 bg-background/95 backdrop-blur border-b mt-4 transition-shadow ${
            isBarStuck ? 'animate-[slideInDown_0.25s_ease-out] shadow-md shadow-black/5' : ''
          }`}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-1.5 sm:gap-3 py-2">
            <MarketSelector
              markets={markets}
              selectedMarket={selectedMarket1}
              onMarketSelect={setSelectedMarket1}
              excludeMarketId={selectedMarket2?.id}
              disabled={isLoadingRandomMarkets}
              badgeLabel={nf.format(1)}
            />
            <div className="flex items-center">
              <span
                aria-hidden
                className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-none"
              >
                VS
              </span>
            </div>
            <MarketSelector
              markets={markets}
              selectedMarket={selectedMarket2}
              onMarketSelect={setSelectedMarket2}
              excludeMarketId={selectedMarket1?.id}
              disabled={isLoadingRandomMarkets}
              badgeLabel={nf.format(2)}
              align="right"
            />
          </div>
        </div>

        {/* Verdict strip — instant overall answer from the compared data.
            Mobile: text gets the full width, saving drops to its own tinted row
            so the sentence never gets squeezed. sm+: single row as before. */}
        {verdict ? (
          <section className="mt-4 rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3 min-w-0">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-none">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] sm:text-sm font-bold leading-snug">{verdict.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{verdict.detail}</p>
              </div>
            </div>
            {verdict.totalSaving > 0 ? (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-success/10 px-3 py-2 flex-none sm:ml-auto sm:block sm:bg-transparent sm:px-0 sm:py-0 sm:text-right">
                <p className="text-xs sm:text-[10px] text-muted-foreground">
                  {t('totalSavingLabel')}
                </p>
                <p className="text-base sm:text-sm font-bold text-success tabular-nums">
                  ৳{nf.format(Number(verdict.totalSaving.toFixed(2)))}
                </p>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* Products (left) and market details table (right) sit side by side on
            large screens — with many products the metrics would otherwise sit
            below a long scroll. Stacks on mobile. */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2 items-start">

        <div className="rounded-xl border bg-card h-full flex flex-col">
          <div className="flex flex-col gap-3 border-b px-4 py-3">
            <div>
              <h2 className="text-base font-semibold">{t('productSection')}</h2>
              <p className="text-xs text-muted-foreground">{t('productSectionHint')}</p>
            </div>

            {/* Pickers: choose the category to compare, then narrow to a product */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <CategorySelect
                categories={categories}
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                disabled={isLoadingCategories || categories.length === 0}
              />

              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={productQuery}
                  onChange={(event) => setProductQuery(event.target.value)}
                  placeholder={t('searchProductPlaceholder')}
                  aria-label={t('searchProductPlaceholder')}
                  disabled={comparedProducts.length === 0}
                  className="h-9 pl-8 pr-8 text-sm"
                />
                {trimmedQuery ? (
                  <button
                    type="button"
                    onClick={() => setProductQuery('')}
                    aria-label={tCommon('clear')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {!selectedMarket1 || !selectedMarket2 ? (
            <div className="px-6 py-10 text-center text-muted-foreground">{t('selectTwoFirst')}</div>
          ) : isLoadingCategories ? (
            <div className="flex flex-col items-center justify-center px-6 py-12">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">{t('loadingCategories')}</p>
            </div>
          ) : !selectedCategoryId ? (
            <div className="px-6 py-10 text-center text-muted-foreground">{t('noCategories')}</div>
          ) : compareProductsQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center px-6 py-12">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">{t('loadingProducts')}</p>
            </div>
          ) : compareProductsQuery.isError ? (
            <div className="px-6 py-10 text-center">
              <p className="font-medium text-warning">{t('loadFailed')}</p>
            </div>
          ) : comparedProducts.length === 0 ? (
            <div className="px-6 py-10 text-center text-muted-foreground">
              {t('noProducts', { category: selectedCategory?.name || '—' })}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-muted-foreground">{t('noProductMatches', { query: trimmedQuery })}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setProductQuery('')}
              >
                {tCommon('clear')}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {visibleProducts.map((product) => {
                const {
                  market1Price,
                  market2Price,
                  market1Range,
                  market2Range,
                  difference,
                  savingsPct,
                  cheaperSide,
                } = product;
                // Range beats the single figure. The unit lives on the category
                // line so the price itself stays short enough to never truncate.
                const fmtPrice = (
                  v: number | null,
                  range: { min: number; max: number } | null
                ) => {
                  if (range) {
                    return `৳${nf.format(range.min)}–${nf.format(range.max)}`;
                  }
                  return v !== null ? `৳${nf.format(v)}` : tCommon('na');
                };

                return (
                  <div key={product.id} className="px-3 py-3 sm:px-4">
                    {/* Header: thumb + name + savings badge. flex-wrap lets the
                        badge drop below the name on narrow screens instead of
                        squeezing the name into a sliver. */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-md object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate leading-tight">{product.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {product.category} · {product.unit}
                        </p>
                      </div>
                      {savingsPct !== null && difference !== null && difference > 0 ? (
                        <span className="flex-none inline-flex items-center gap-1 rounded-full bg-success/10 text-success text-[11px] font-semibold px-2.5 py-1">
                          {cheaperSide === 1 ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : cheaperSide === 2 ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : null}
                          {t('saveBadge', {
                            percent: nf.format(
                              Number(savingsPct.toFixed(savingsPct >= 10 ? 0 : 1))
                            ),
                          })}
                          {/* The taka amount reads clearly next to its percent */}
                          <span className="tabular-nums">
                            · ৳{nf.format(Number(difference.toFixed(difference >= 10 ? 0 : 1)))}
                          </span>
                        </span>
                      ) : null}
                    </div>

                    {/* Prices: two columns matching the sticky bar order. The
                        ১/২ chips carry the mapping, so the market name isn't
                        repeated on every row. */}
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <PriceColumn
                        chip={nf.format(1)}
                        price={fmtPrice(market1Price, market1Range)}
                        winner={cheaperSide === 1}
                      />
                      <PriceColumn
                        chip={nf.format(2)}
                        price={fmtPrice(market2Price, market2Range)}
                        winner={cheaperSide === 2}
                      />
                    </div>

                    {difference === 0 ? (
                      <p className="mt-1.5 text-xs text-muted-foreground">{t('samePrice')}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

          {/* Comparison Results — no section header; the sticky bar already
              names both markets, the table goes straight to the metrics */}
          <div className="rounded-xl border bg-card h-full flex flex-col">
            {compareQuery.isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">{t('loadingComparison')}</p>
              </div>
            ) : compareQuery.isError ? (
              <div className="px-6 py-10 text-center">
                <p className="text-warning font-medium">{t('comparisonFailed')}</p>
              </div>
            ) : comparison?.market_1 && comparison?.market_2 ? (
              <ComparisonTable market1={comparison.market_1} market2={comparison.market_2} />
            ) : (
              <div className="px-6 py-10 text-center text-muted-foreground">
                {t('selectTwoForDetails')}
              </div>
            )}
          </div>

        </div>{/* end grid */}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => compareQuery.refetch()}
            disabled={!selectedMarket1 || !selectedMarket2 || compareQuery.isFetching}
          >
            {t('refreshComparison')}
          </Button>
          {selectedMarket1 && (
            <Button size="sm" asChild>
              <Link href={`/markets/${selectedMarket1.id}` as never}>
                {t('viewMarket', { name: selectedMarket1.name })}
              </Link>
            </Button>
          )}
          {selectedMarket2 && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/markets/${selectedMarket2.id}` as never}>
                {t('viewMarket', { name: selectedMarket2.name })}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

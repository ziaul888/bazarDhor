"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { MarketSelector } from './_components/market-selector';
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

      return {
        id: getString(entry.id || entry.product_id || product?.id) || `product-${index + 1}`,
        name: getString(entry.name || entry.product_name || entry.title || product?.name) || 'Unnamed Product',
        image: normalizeImagePath(entry.image || entry.image_path || product?.image || product?.image_path),
        category: getString(category?.name || entry.category_name || entry.category) || 'Unknown Category',
        unit: getString(unit?.symbol || unit?.name || entry.unit_name || entry.unit) || 'unit',
        market1Price,
        market2Price,
      };
    })
    .filter((row): row is ComparedProductRow => row !== null);
};

export default function CompareMarketsPage() {
  const t = useTranslations('compare');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
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
        {/* Market Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-sm font-semibold mb-2">{t('firstMarket')}</h2>
            <MarketSelector
              markets={markets}
              selectedMarket={selectedMarket1}
              onMarketSelect={setSelectedMarket1}
              excludeMarketId={selectedMarket2?.id}
              disabled={isLoadingRandomMarkets}
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-2">{t('secondMarket')}</h2>
            <MarketSelector
              markets={markets}
              selectedMarket={selectedMarket2}
              onMarketSelect={setSelectedMarket2}
              excludeMarketId={selectedMarket1?.id}
              disabled={isLoadingRandomMarkets}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">

        <div className="rounded-xl border bg-card h-full flex flex-col">
          <div className="flex flex-col gap-4 border-b px-4 py-3 sm:flex-row sm:items-end sm:justify-between sm:px-4">
            <div>
              <h2 className="text-base font-semibold">{t('productSection')}</h2>
              <p className="text-xs text-muted-foreground">{t('productSectionHint')}</p>
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
          ) : (
            <div className="flex flex-col divide-y">
              {comparedProducts.map((product) => {
                const { market1Price, market2Price } = product;
                const bothPresent = market1Price !== null && market2Price !== null;
                const difference = bothPresent ? Math.abs(market1Price! - market2Price!) : null;
                const higherPrice = bothPresent ? Math.max(market1Price!, market2Price!) : null;
                const savingsPct =
                  difference !== null && higherPrice && higherPrice > 0
                    ? (difference / higherPrice) * 100
                    : null;
                const cheaperSide =
                  bothPresent && market1Price! < market2Price!
                    ? 1
                    : bothPresent && market2Price! < market1Price!
                      ? 2
                      : 0;
                const fmtPrice = (v: number | null) =>
                  v !== null ? `৳${v.toFixed(2)} / ${product.unit}` : 'N/A';

                return (
                  <div key={product.id} className="px-3 py-2.5 sm:px-4">
                    {/* Header: thumb + name + savings badge */}
                    <div className="flex items-center gap-2.5">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-md object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-md bg-muted shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate leading-tight">{product.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {product.category}
                        </p>
                      </div>
                      {savingsPct !== null && difference !== null && difference > 0 ? (
                        <span className="flex-none inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-semibold px-2 py-0.5">
                          {cheaperSide === 1 ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : cheaperSide === 2 ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : null}
                          Save {savingsPct.toFixed(savingsPct >= 10 ? 0 : 1)}%
                        </span>
                      ) : null}
                    </div>

                    {/* Prices: both on one line */}
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div
                        className={`rounded-md px-2.5 py-1.5 ${
                          cheaperSide === 1
                            ? 'bg-green-50 dark:bg-green-900/15'
                            : 'bg-muted/40'
                        }`}
                      >
                        <p className="text-[10px] text-muted-foreground truncate leading-none mb-0.5">
                          {selectedMarket1?.name}
                        </p>
                        <p
                          className={`font-semibold tabular-nums truncate ${
                            cheaperSide === 1 ? 'text-green-700 dark:text-green-400' : ''
                          }`}
                        >
                          {fmtPrice(market1Price)}
                        </p>
                      </div>
                      <div
                        className={`rounded-md px-2.5 py-1.5 ${
                          cheaperSide === 2
                            ? 'bg-green-50 dark:bg-green-900/15'
                            : 'bg-muted/40'
                        }`}
                      >
                        <p className="text-[10px] text-muted-foreground truncate leading-none mb-0.5">
                          {selectedMarket2?.name}
                        </p>
                        <p
                          className={`font-semibold tabular-nums truncate ${
                            cheaperSide === 2 ? 'text-green-700 dark:text-green-400' : ''
                          }`}
                        >
                          {fmtPrice(market2Price)}
                        </p>
                      </div>
                    </div>

                    {difference !== null && difference > 0 ? (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {t('differenceLabel')} ৳{difference.toFixed(2)}
                      </p>
                    ) : difference === 0 ? (
                      <p className="mt-1 text-[10px] text-muted-foreground">{t('samePrice')}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

          {/* Comparison Results */}
          <div className="rounded-xl border bg-card h-full flex flex-col">
            <div className="border-b px-4 py-3 sm:px-4">
              <h2 className="text-base font-semibold">{t('marketSection')}</h2>
              <p className="text-xs text-muted-foreground">{t('marketSectionHint')}</p>
            </div>
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

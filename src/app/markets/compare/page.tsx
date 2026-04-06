"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
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

const IMAGE_BASE_URL = 'https://bazardor.chhagolnaiyasportareana.xyz/storage/';

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <BackButton
              variant="ghost"
              size="sm"
              fallbackHref="/markets"
              label="Back to Markets"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Compare Markets</h1>
            <p className="text-muted-foreground">Compare details and features between two markets</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Market Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Select First Market</h2>
            <MarketSelector
              markets={markets}
              selectedMarket={selectedMarket1}
              onMarketSelect={setSelectedMarket1}
              excludeMarketId={selectedMarket2?.id}
              disabled={isLoadingRandomMarkets}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Select Second Market</h2>
            <MarketSelector
              markets={markets}
              selectedMarket={selectedMarket2}
              onMarketSelect={setSelectedMarket2}
              excludeMarketId={selectedMarket1?.id}
              disabled={isLoadingRandomMarkets}
            />
          </div>
        </div>

        <div className="mt-10 rounded-2xl border bg-card">
          <div className="flex flex-col gap-4 border-b px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <h2 className="text-2xl font-bold">Product Comparison</h2>
              <p className="text-sm text-muted-foreground">
                Compare product prices between the selected markets by category.
              </p>
            </div>
          </div>

          {!selectedMarket1 || !selectedMarket2 ? (
            <div className="px-6 py-10 text-center text-muted-foreground">
              Select two markets first to compare their products.
            </div>
          ) : isLoadingCategories ? (
            <div className="flex flex-col items-center justify-center px-6 py-12">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading product categories…</p>
            </div>
          ) : !selectedCategoryId ? (
            <div className="px-6 py-10 text-center text-muted-foreground">
              No categories available to load product comparisons.
            </div>
          ) : compareProductsQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center px-6 py-12">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading product comparison…</p>
            </div>
          ) : compareProductsQuery.isError ? (
            <div className="px-6 py-10 text-center">
              <p className="font-medium text-warning">Could not load product comparison right now.</p>
            </div>
          ) : comparedProducts.length === 0 ? (
            <div className="px-6 py-10 text-center text-muted-foreground">
              No compared products found for {selectedCategory?.name || 'this category'}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/40 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold sm:px-6">Product</th>
                    <th className="px-4 py-3 font-semibold">{selectedMarket1?.name}</th>
                    <th className="px-4 py-3 font-semibold">{selectedMarket2?.name}</th>
                    <th className="px-4 py-3 font-semibold sm:px-6">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {comparedProducts.map((product) => {
                    const market1Price = product.market1Price;
                    const market2Price = product.market2Price;
                    const difference =
                      market1Price !== null && market2Price !== null
                        ? Math.abs(market1Price - market2Price)
                        : null;
                    const cheaperMarket =
                      market1Price !== null && market2Price !== null
                        ? market1Price < market2Price
                          ? selectedMarket1?.name
                          : market2Price < market1Price
                            ? selectedMarket2?.name
                            : 'Same price'
                        : 'Unavailable';

                    return (
                      <tr key={product.id} className="border-t align-top">
                        <td className="px-4 py-4 sm:px-6">
                          <div className="flex min-w-[220px] items-center gap-3">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-muted" />
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {product.category} / {product.unit}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-medium">
                          {market1Price !== null ? `৳${market1Price.toFixed(2)}` : 'N/A'}
                        </td>
                        <td className="px-4 py-4 font-medium">
                          {market2Price !== null ? `৳${market2Price.toFixed(2)}` : 'N/A'}
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          {difference !== null ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 font-medium">
                                {cheaperMarket === selectedMarket1?.name ? (
                                  <ArrowDown className="h-4 w-4 text-green-600" />
                                ) : cheaperMarket === selectedMarket2?.name ? (
                                  <ArrowUp className="h-4 w-4 text-blue-600" />
                                ) : null}
                                <span>{cheaperMarket}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Difference: ৳{difference.toFixed(2)}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Comparison Results */}
        {compareQuery.isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading comparison…</p>
          </div>
        ) : compareQuery.isError ? (
          <div className="text-center py-10 border rounded-xl bg-muted/10">
            <p className="text-warning font-medium">Comparison failed. Please try again.</p>
          </div>
        ) : comparison?.market_1 && comparison?.market_2 ? (
          <ComparisonTable market1={comparison.market_1} market2={comparison.market_2} />
        ) : (
          <div className="text-center py-10 border rounded-xl bg-muted/10">
            <p className="text-muted-foreground">
              Select two markets to view comparison.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => compareQuery.refetch()}
            disabled={!selectedMarket1 || !selectedMarket2 || compareQuery.isFetching}
          >
            Refresh Comparison
          </Button>
          {selectedMarket1 && (
            <Button asChild>
              <Link href={`/markets/${selectedMarket1.id}`}>View {selectedMarket1.name}</Link>
            </Button>
          )}
          {selectedMarket2 && (
            <Button variant="outline" asChild>
              <Link href={`/markets/${selectedMarket2.id}`}>View {selectedMarket2.name}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

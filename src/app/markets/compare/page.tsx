"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { MarketSelector } from './_components/market-selector';
import { ComparisonTable } from './_components/comparison-table';
import { useCompareMarkets, useMarket, useRandomMarkets } from '@/lib/api/hooks/useMarkets';
import type { Market } from '@/lib/api/types';

const DEFAULT_LOCATION = { lat: 23.8103, lng: 90.4125 };

export default function CompareMarketsPage() {
  const searchParams = useSearchParams();
  const urlMarketId1 = searchParams.get('market_id_1') ?? searchParams.get('m1') ?? '';
  const urlMarketId2 = searchParams.get('market_id_2') ?? searchParams.get('m2') ?? '';

  const { data: randomMarkets, isLoading: isLoadingRandomMarkets } = useRandomMarkets();
  const { data: urlMarket1Response } = useMarket(urlMarketId1);
  const { data: urlMarket2Response } = useMarket(urlMarketId2);

  const urlMarket1 = urlMarket1Response?.data;
  const urlMarket2 = urlMarket2Response?.data;

  const markets = useMemo(() => {
    const merged = new Map<string, Market>();
    for (const market of [urlMarket1, urlMarket2, ...(randomMarkets ?? [])]) {
      if (!market) continue;
      merged.set(market.id, market);
    }
    return Array.from(merged.values());
  }, [randomMarkets, urlMarket1, urlMarket2]);

  const [userLoc, setUserLoc] = useState(DEFAULT_LOCATION);
  const [selectedMarket1, setSelectedMarket1] = useState<Market | null>(null);
  const [selectedMarket2, setSelectedMarket2] = useState<Market | null>(null);

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

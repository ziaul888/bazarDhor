"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ChevronDown, MapPin, Search, Store } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Market } from '@/lib/api/types';
import { marketTypeLabelKey } from '@/lib/market-type';

const DEFAULT_MARKET_IMAGE = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop";

// Why: the API's addresses typically start with the market's own name
// ("Karwan Bazar, Dhaka 1215"), which made the name read as duplicated when
// shown right under it. Trim that prefix so the line shows only the extra part.
const trimAddressPrefix = (name: string, address: string): string => {
  const n = name.trim();
  const a = address.trim();
  if (!n || !a) return a;
  if (a.toLowerCase().startsWith(n.toLowerCase())) {
    const rest = a.slice(n.length).replace(/^[\s,–—-]+/, '');
    if (rest) return rest;
  }
  return a;
};

interface MarketSelectorProps {
  markets: Market[];
  selectedMarket: Market | null;
  onMarketSelect: (market: Market) => void;
  excludeMarketId?: string;
  disabled?: boolean;
  // Renders the small numbered chip ("১"/"২") so the two sides of the
  // side-by-side compare bar stay distinguishable without big headings.
  badgeLabel?: string;
  // Which side of the trigger the dropdown anchors to — the open list then
  // visibly belongs to the selector that opened it instead of floating
  // centered between the two.
  align?: 'left' | 'right';
}

export function MarketSelector({
  markets,
  selectedMarket,
  onMarketSelect,
  excludeMarketId,
  disabled = false,
  badgeLabel,
  align = 'left',
}: MarketSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('markets');
  const tCommon = useTranslations('common');
  const tTypes = useTranslations('markets.marketTypes');

  const availableMarkets = markets.filter(market => market.id !== excludeMarketId);

  // Close on any pointer outside this selector — replaces the old full-screen
  // backdrop, which blocked scrolling and missed some taps.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  // Search narrows the list by market name or address before picking.
  const trimmedQuery = query.trim().toLowerCase();
  const visibleMarkets = trimmedQuery
    ? availableMarkets.filter(
        (market) =>
          market.name.toLowerCase().includes(trimmedQuery) ||
          (market.address ?? '').toLowerCase().includes(trimmedQuery)
      )
    : availableMarkets;

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      {/* Selected Market Display — compact so both markets fit side by side on mobile */}
      <button
        onClick={() => {
          setQuery('');
          setIsOpen(!isOpen);
        }}
        disabled={disabled || markets.length === 0}
        className="w-full p-2.5 sm:p-3 bg-card border rounded-xl hover:bg-accent transition-colors text-left disabled:opacity-50"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-none">
            {selectedMarket ? (
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={selectedMarket.image || DEFAULT_MARKET_IMAGE}
                  alt={selectedMarket.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted" />
            )}
            {badgeLabel ? (
              <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center shadow-sm">
                {badgeLabel}
              </span>
            ) : null}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xs sm:text-sm leading-tight truncate">
              {selectedMarket?.name ?? t('selectMarket')}
            </h3>
            {selectedMarket?.address ? (
              <p className="flex items-center gap-1 text-[10px] sm:text-[11px] text-muted-foreground truncate mt-0.5">
                <MapPin className="h-3 w-3 flex-none" />
                <span className="truncate">
                  {trimAddressPrefix(selectedMarket.name, selectedMarket.address)}
                </span>
              </p>
            ) : null}
          </div>

          <ChevronDown className={`h-4 w-4 flex-none text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {/* Dropdown Menu — anchored to its own trigger's side so it reads as
          belonging to that selector, not floating between the two */}
      {isOpen && !disabled && (
        <div className={`absolute z-30 top-full mt-1.5 w-[calc(100vw-2rem)] max-w-sm bg-card border rounded-xl shadow-lg ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}>
          {/* Search: narrow the list by name or address before picking */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchPlaceholder')}
                className="h-9 pl-8 pr-2 text-sm"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {visibleMarkets.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                {tCommon('noResults')}
              </p>
            ) : (
              visibleMarkets.map((market) => (
            <button
              key={market.id}
              onClick={() => {
                onMarketSelect(market);
                setIsOpen(false);
              }}
              className="w-full p-3 hover:bg-accent transition-colors text-left border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <Image
                    src={market.image || DEFAULT_MARKET_IMAGE}
                    alt={market.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm leading-tight truncate">{market.name}</h4>
                  {(() => {
                    const typeKey = marketTypeLabelKey(market.type);
                    const label = typeKey ? tTypes(typeKey) : market.type?.trim();
                    return label ? (
                      <p className="text-xs text-muted-foreground truncate">{label}</p>
                    ) : null;
                  })()}
                </div>

                <div className="flex flex-col items-end gap-1 flex-none">
                  <span className="text-[11px] text-muted-foreground">{market.distance}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    market.isOpen
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {market.isOpen ? t('openLabel') : t('closedLabel')}
                  </span>
                </div>
              </div>
            </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

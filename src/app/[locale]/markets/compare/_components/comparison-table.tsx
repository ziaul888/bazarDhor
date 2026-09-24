"use client";

import type { ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  CalendarDays,
  Car,
  Check,
  MapPin,
  Package,
  Store,
  Truck,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { ComparedMarket } from '@/lib/api/types';
import { marketTypeLabelKey } from '@/lib/market-type';

interface ComparisonTableProps {
  market1: ComparedMarket;
  market2: ComparedMarket;
}

type Side = 'm1' | 'm2' | null;

interface MetricItem {
  label: string;
  icon: LucideIcon;
  render1: () => ReactNode;
  render2: () => ReactNode;
  winner: Side;
}

interface MetricSection {
  category: string;
  items: MetricItem[];
}

const BooleanValue = ({ value, yes, no }: { value: boolean; yes: string; no: string }) => {
  return value ? (
    <span className="inline-flex items-center gap-1.5 text-success">
      <Check className="h-3.5 w-3.5" />
      <span className="font-medium">{yes}</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <X className="h-3.5 w-3.5" />
      <span className="font-medium">{no}</span>
    </span>
  );
};

export function ComparisonTable({ market1, market2 }: ComparisonTableProps) {
  const t = useTranslations('compare.table');
  const tCommon = useTranslations('common');
  const tTypes = useTranslations('markets.marketTypes');
  const locale = useLocale();

  // Why: the backend sends market types as English enum values ("Retail Market").
  // How: translate via markets.marketTypes when the value is a known enum, else
  // show the raw string.
  const formatMarketType = (type: string | null | undefined): string => {
    const key = marketTypeLabelKey(type);
    return (key ? tTypes(key) : type?.trim()) || tCommon('na');
  };

  const nf = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-IN');
  const formatNumber = (value: number) => nf.format(value);
  const formatDistanceKm = (value: number) => {
    if (!Number.isFinite(value)) return tCommon('na');
    return `${nf.format(Number(value.toFixed(2)))} ${tCommon('kmUnit')}`;
  };

  const distance1 = market1.distance_km;
  const distance2 = market2.distance_km;
  const products1 = market1.active_products_count;
  const products2 = market2.active_products_count;
  const openDays1 = market1.open_days_count;
  const openDays2 = market2.open_days_count;

  // Why: compute the winner per metric so the winning cell carries the
  // "Closer / More / Available" signal as a green tint in the compact table.
  const lowerWins = (a: number, b: number): Side => {
    if (!Number.isFinite(a) || !Number.isFinite(b) || a === b) return null;
    return a < b ? 'm1' : 'm2';
  };
  const higherWins = (a: number, b: number): Side => {
    if (!Number.isFinite(a) || !Number.isFinite(b) || a === b) return null;
    return a > b ? 'm1' : 'm2';
  };
  const presenceWins = (a: boolean, b: boolean): Side => {
    if (a === b) return null;
    return a ? 'm1' : 'm2';
  };

  const yes = tCommon('yes');
  const no = tCommon('no');

  const sections: MetricSection[] = [
    {
      category: t('basicInfo'),
      items: [
        {
          label: t('marketType'),
          icon: Store,
          render1: () => formatMarketType(market1.type),
          render2: () => formatMarketType(market2.type),
          winner: null,
        },
        {
          label: t('distance'),
          icon: MapPin,
          render1: () => formatDistanceKm(distance1),
          render2: () => formatDistanceKm(distance2),
          winner: lowerWins(distance1, distance2),
        },
        {
          label: t('activeProducts'),
          icon: Package,
          render1: () => formatNumber(products1),
          render2: () => formatNumber(products2),
          winner: higherWins(products1, products2),
        },
        {
          label: t('openDays'),
          icon: CalendarDays,
          render1: () => formatNumber(openDays1),
          render2: () => formatNumber(openDays2),
          winner: higherWins(openDays1, openDays2),
        },
      ],
    },
    {
      category: t('featuresServices'),
      items: [
        {
          label: t('parking'),
          icon: Car,
          render1: () => <BooleanValue value={market1.features.parking_available} yes={yes} no={no} />,
          render2: () => <BooleanValue value={market2.features.parking_available} yes={yes} no={no} />,
          winner: presenceWins(market1.features.parking_available, market2.features.parking_available),
        },
        {
          label: t('restroom'),
          icon: Store,
          render1: () => <BooleanValue value={market1.features.restroom_available} yes={yes} no={no} />,
          render2: () => <BooleanValue value={market2.features.restroom_available} yes={yes} no={no} />,
          winner: presenceWins(market1.features.restroom_available, market2.features.restroom_available),
        },
        {
          label: t('homeDelivery'),
          icon: Truck,
          render1: () => <BooleanValue value={market1.features.home_delivery} yes={yes} no={no} />,
          render2: () => <BooleanValue value={market2.features.home_delivery} yes={yes} no={no} />,
          winner: presenceWins(market1.features.home_delivery, market2.features.home_delivery),
        },
      ],
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Both markets already sit in the sticky selector bar above the page —
          no name header here, just the same ১/২ chips so the columns map back
          to the two selectors. */}
      <div className="grid grid-cols-[1.2fr_1fr_1fr] items-stretch border-b bg-muted/20">
        <div />
        <HeaderChip label={nf.format(1)} />
        <HeaderChip label={nf.format(2)} />
      </div>

      {sections.map((section) => (
        <div key={section.category}>
          <div className="px-3 py-1.5 bg-muted/30 border-b">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.category}
            </h4>
          </div>

          {section.items.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-[1.2fr_1fr_1fr] items-stretch border-b last:border-b-0"
            >
              <div className="flex items-center gap-1.5 px-3 py-2 min-w-0">
                <item.icon className="h-3.5 w-3.5 text-muted-foreground flex-none" />
                <span className="text-xs text-muted-foreground truncate">{item.label}</span>
              </div>
              <ValueCell isWinner={item.winner === 'm1'}>{item.render1()}</ValueCell>
              <ValueCell isWinner={item.winner === 'm2'}>{item.render2()}</ValueCell>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Minimal column marker — mirrors the numbered chips on the sticky selectors.
function HeaderChip({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-2 border-l border-border/60">
      {/* Same style as the selector badges so ১/২ means the same thing everywhere */}
      <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
        {label}
      </span>
    </div>
  );
}

function ValueCell({
  isWinner,
  children,
}: {
  isWinner: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex items-center justify-center px-1.5 sm:px-2 py-2 text-xs sm:text-sm text-center min-w-0 border-l border-border/60 ${
        isWinner ? 'bg-success/10 text-success font-semibold' : ''
      }`}
    >
      <span className="truncate">{children}</span>
    </div>
  );
}

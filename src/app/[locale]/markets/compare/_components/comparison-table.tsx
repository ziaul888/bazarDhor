"use client";

import type { ComponentType, ReactNode } from 'react';
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
  const locale = useLocale();

  const nf = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-IN');
  const formatNumber = (value: number) => nf.format(value);
  const formatDistanceKm = (value: number) => {
    if (!Number.isFinite(value)) return tCommon('na');
    return `${nf.format(Number(value.toFixed(2)))} km`;
  };

  const distance1 = market1.distance_km;
  const distance2 = market2.distance_km;
  const products1 = market1.active_products_count;
  const products2 = market2.active_products_count;
  const openDays1 = market1.open_days_count;
  const openDays2 = market2.open_days_count;

  // Why: compute the winner per metric so the row-level tint can carry the
  // "Closer / More / Available" signal — replaces the easy-to-miss inline
  // badge with a strong visual cue.
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
          render1: () => market1.type,
          render2: () => market2.type,
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
      {/* Legend — the two market names + truncated addresses, side by side */}
      <div className="grid grid-cols-2 divide-x border-b bg-muted/20">
        <MarketLegend name={market1.name} address={market1.address} />
        <MarketLegend name={market2.name} address={market2.address} />
      </div>

      {sections.map((section) => (
        <div key={section.category}>
          <div className="px-4 py-2 bg-muted/30 border-b">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.category}
            </h4>
          </div>

          <div className="p-3 space-y-2.5">
            {section.items.map((item) => (
              <MetricCard
                key={item.label}
                icon={item.icon}
                label={item.label}
                market1Name={market1.name}
                market2Name={market2.name}
                value1={item.render1()}
                value2={item.render2()}
                winner={item.winner}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MarketLegend({ name, address }: { name: string; address: string }) {
  return (
    <div className="p-3 min-w-0">
      <h3 className="font-semibold text-sm sm:text-base truncate">{name}</h3>
      {address ? (
        <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
          <MapPin className="h-3 w-3 flex-none" />
          <span className="truncate">{address}</span>
        </p>
      ) : null}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  market1Name,
  market2Name,
  value1,
  value2,
  winner,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  market1Name: string;
  market2Name: string;
  value1: ReactNode;
  value2: ReactNode;
  winner: Side;
}) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/20 border-b">
        <Icon className="h-3.5 w-3.5 text-muted-foreground flex-none" />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="divide-y">
        <ValueRow name={market1Name} value={value1} isWinner={winner === 'm1'} />
        <ValueRow name={market2Name} value={value2} isWinner={winner === 'm2'} />
      </div>
    </div>
  );
}

function ValueRow({
  name,
  value,
  isWinner,
}: {
  name: string;
  value: ReactNode;
  isWinner: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-3 py-2 text-sm transition-colors ${
        isWinner ? 'bg-green-50 dark:bg-green-900/15' : ''
      }`}
    >
      <span
        className={`truncate text-xs ${
          isWinner
            ? 'font-medium text-green-700 dark:text-green-400'
            : 'text-muted-foreground'
        }`}
      >
        {name}
      </span>
      <span className={`font-medium tabular-nums flex-none ${isWinner ? 'text-green-700 dark:text-green-400' : ''}`}>
        {value}
      </span>
    </div>
  );
}

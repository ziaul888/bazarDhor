"use client";

import { CalendarDays, Car, Check, MapPin, Package, Store, Truck, X } from 'lucide-react';
import type { ComparedMarket } from '@/lib/api/types';

interface ComparisonTableProps {
  market1: ComparedMarket;
  market2: ComparedMarket;
}

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const formatDistanceKm = (value: number) => {
  if (!Number.isFinite(value)) return 'N/A';
  return `${value.toFixed(2)} km`;
};

const BooleanValue = ({ value }: { value: boolean }) => {
  return value ? (
    <div className="inline-flex items-center space-x-2 text-success">
      <Check className="h-4 w-4" />
      <span className="font-medium">Yes</span>
    </div>
  ) : (
    <div className="inline-flex items-center space-x-2 text-muted-foreground">
      <X className="h-4 w-4" />
      <span className="font-medium">No</span>
    </div>
  );
};

const BetterBadge = ({ show, label }: { show: boolean; label: string }) => {
  if (!show) return null;
  return <span className="ml-2 inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">{label}</span>;
};

export function ComparisonTable({ market1, market2 }: ComparisonTableProps) {
  const distance1 = market1.distance_km;
  const distance2 = market2.distance_km;
  const m1Closer = Number.isFinite(distance1) && Number.isFinite(distance2) ? distance1 < distance2 : false;
  const m2Closer = Number.isFinite(distance1) && Number.isFinite(distance2) ? distance2 < distance1 : false;

  const products1 = market1.active_products_count;
  const products2 = market2.active_products_count;
  const m1MoreProducts = Number.isFinite(products1) && Number.isFinite(products2) ? products1 > products2 : false;
  const m2MoreProducts = Number.isFinite(products1) && Number.isFinite(products2) ? products2 > products1 : false;

  const openDays1 = market1.open_days_count;
  const openDays2 = market2.open_days_count;
  const m1MoreOpenDays = Number.isFinite(openDays1) && Number.isFinite(openDays2) ? openDays1 > openDays2 : false;
  const m2MoreOpenDays = Number.isFinite(openDays1) && Number.isFinite(openDays2) ? openDays2 > openDays1 : false;

  const rows = [
    {
      category: "Basic Information",
      items: [
        {
          label: "Market Type",
          icon: Store,
          render1: () => market1.type,
          render2: () => market2.type,
        },
        {
          label: "Distance",
          icon: MapPin,
          render1: () => (
            <span className="font-medium">
              {formatDistanceKm(distance1)}
              <BetterBadge show={m1Closer} label="Closer" />
            </span>
          ),
          render2: () => (
            <span className="font-medium">
              {formatDistanceKm(distance2)}
              <BetterBadge show={m2Closer} label="Closer" />
            </span>
          ),
        },
        {
          label: "Active Products",
          icon: Package,
          render1: () => (
            <span className="font-medium">
              {formatNumber(products1)}
              <BetterBadge show={m1MoreProducts} label="More" />
            </span>
          ),
          render2: () => (
            <span className="font-medium">
              {formatNumber(products2)}
              <BetterBadge show={m2MoreProducts} label="More" />
            </span>
          ),
        },
        {
          label: "Open Days (per week)",
          icon: CalendarDays,
          render1: () => (
            <span className="font-medium">
              {formatNumber(openDays1)}
              <BetterBadge show={m1MoreOpenDays} label="More" />
            </span>
          ),
          render2: () => (
            <span className="font-medium">
              {formatNumber(openDays2)}
              <BetterBadge show={m2MoreOpenDays} label="More" />
            </span>
          ),
        },
      ],
    },
    {
      category: "Features & Services",
      items: [
        {
          label: "Parking Available",
          icon: Car,
          render1: () => <BooleanValue value={market1.features.parking_available} />,
          render2: () => <BooleanValue value={market2.features.parking_available} />,
        },
        {
          label: "Restroom Available",
          icon: Store,
          render1: () => <BooleanValue value={market1.features.restroom_available} />,
          render2: () => <BooleanValue value={market2.features.restroom_available} />,
        },
        {
          label: "Home Delivery",
          icon: Truck,
          render1: () => <BooleanValue value={market1.features.home_delivery} />,
          render2: () => <BooleanValue value={market2.features.home_delivery} />,
        },
      ],
    },
  ] as const;

  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      {/* Market Headers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 border-b">
        <div className="p-6 border-b lg:border-b-0 lg:border-r">
          <h3 className="text-lg font-semibold mb-1">Comparison</h3>
          <p className="text-sm text-muted-foreground">Based on your current location</p>
        </div>

        <div className="p-6 border-b lg:border-b-0 lg:border-r">
          <h3 className="font-semibold text-lg truncate">{market1.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{market1.address}</p>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-lg truncate">{market2.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{market2.address}</p>
        </div>
      </div>

      {/* Comparison Rows */}
      {rows.map((section) => (
        <div key={section.category}>
          <div className="bg-muted/30 px-6 py-3 border-b">
            <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
              {section.category}
            </h4>
          </div>

          {section.items.map((item) => (
            <div key={item.label} className="grid grid-cols-1 lg:grid-cols-3 border-b last:border-b-0">
              <div className="p-4 lg:border-r bg-muted/10">
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </div>

              <div className="p-4 lg:border-r">{item.render1()}</div>
              <div className="p-4">{item.render2()}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}


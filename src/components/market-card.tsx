"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Store, Check, ArrowRight, Tag, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Market {
  id: number | string;
  name: string;
  address: string;
  location?: string;
  distance: string;
  rating: number;
  reviews: number;
  vendors?: number;
  type?: string;
  image: string;
  isOpen: boolean;
  openTime: string;
  specialties: string[];
  priceRange?: string;
  showPriceChange?: boolean;
  showPriceRange?: boolean;
  categoryItems?: number;
  featured?: boolean;
  isVerified?: boolean;
}

interface MarketCardProps {
  market: Market;
  showCategoryItems?: boolean;
  showPriceChange?: boolean;
  showPriceRange?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export function MarketCard({
  market,
  showCategoryItems = false,
  variant = 'default',
  className = '',
}: MarketCardProps) {
  const isCompact = variant === 'compact';
  const [imgError, setImgError] = useState(false);

  const locationLine = market.location || market.address;
  const distanceSuffix =
    market.distance && market.distance !== 'N/A' ? ` • ${market.distance}` : '';
  const marketType = market.type && market.type.trim().length > 0 ? market.type : 'Market';
  const statusLabel = market.isOpen ? 'Open' : 'Closed';
  void showCategoryItems;

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 group py-0 gap-0 border border-border/60 ${className}`}>
      {/* Image */}
      <div className={`relative overflow-hidden ${isCompact ? 'h-36' : 'h-48'} bg-muted`}>
        {market.image && !imgError ? (
          <Image
            src={market.image}
            alt={market.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col items-center justify-center p-4 text-center">
            <Store className="h-10 w-10 text-primary/20 mb-2" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-primary/40 leading-tight">
              {market.name}
            </span>
          </div>
        )}

        {/* Open / Closed badge — top right */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow ${
              market.isOpen
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            {market.isOpen && <Check className="h-3 w-3 stroke-[3]" />}
            {market.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Content */}
      <Link href={`/markets/${market.id}`} className="block">
        <div className={`${isCompact ? 'p-3' : 'p-4'}`}>
          {/* Market icon + name + location */}
          <div className="flex items-start gap-3">
            {/* Store icon */}
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Store className="h-5 w-5 text-orange-500" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Name + arrow */}
              <div className="flex items-center gap-1 mb-0.5">
                <h3
                  className={`font-bold leading-tight line-clamp-1 flex-1 ${
                    isCompact ? 'text-sm' : 'text-sm sm:text-base'
                  }`}
                >
                  {market.name}
                </h3>
                <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
              </div>

              {/* Location + distance */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs line-clamp-1">
                  {locationLine}
                  {distanceSuffix}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/60 my-3" />

          {/* 3-column stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Market Type */}
            <div>
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Tag className="h-4 w-4 text-primary" />
                <span className="font-bold text-xs leading-tight line-clamp-1">
                  {marketType}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Type</p>
            </div>

            {/* Market Status */}
            <div>
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Activity
                  className={`h-4 w-4 ${market.isOpen ? 'text-green-500' : 'text-gray-400'}`}
                />
                <span
                  className={`font-bold text-xs leading-tight ${
                    market.isOpen ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {statusLabel}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Status</p>
            </div>

            {/* Hours */}
            <div>
              <div className="flex items-center justify-center gap-0.5 mb-0.5">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="font-bold text-xs leading-tight">
                  {market.openTime || '—'}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Hours</p>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

// Horizontal list-item variant
export function MarketListItem({
  market,
  showCategoryItems = false,
  className = '',
}: MarketCardProps) {
  const [imgError, setImgError] = useState(false);

  const locationLine = market.location || market.address;
  const distanceSuffix =
    market.distance && market.distance !== 'N/A' ? ` • ${market.distance}` : '';

  return (
    <Card className={`hover:shadow-md transition-all duration-300 overflow-hidden py-0 gap-0 ${className}`}>
      <div className="flex items-stretch min-h-28 sm:min-h-32">
        {/* Thumbnail */}
        <div className="relative w-28 sm:w-36 flex-shrink-0 bg-muted self-stretch">
          {!imgError ? (
            <Image
              src={market.image}
              alt={market.name}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
              <Store className="h-8 w-8 text-primary/20" />
            </div>
          )}
          {/* Open badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                market.isOpen ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
              }`}
            >
              {market.isOpen && <Check className="h-2.5 w-2.5 stroke-[3]" />}
              {market.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Info */}
        <Link href={`/markets/${market.id}`} className="flex-1 min-w-0 p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <div className="w-7 h-7 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Store className="h-4 w-4 text-orange-500" />
              </div>
              <h3 className="font-bold text-sm sm:text-base line-clamp-1 flex-1">{market.name}</h3>
              <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            </div>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="text-xs line-clamp-1">{locationLine}{distanceSuffix}</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold line-clamp-1">{market.type || 'Market'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className={`h-3.5 w-3.5 ${market.isOpen ? 'text-green-500' : 'text-gray-400'}`} />
              <span className={`text-xs font-semibold ${market.isOpen ? 'text-green-600' : 'text-gray-500'}`}>
                {market.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">{market.openTime}</span>
            </div>
          </div>
        </Link>
      </div>
    </Card>
  );
}

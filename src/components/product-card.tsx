"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Clock, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type ProductCardItem = {
  id: number | string;
  name: string;
  marketName: string;
  marketId?: number | string;
  currentPrice: number;
  image: string;
  category: string;
  priceChange: 'up' | 'down' | 'stable' | string;
  lastUpdated: string;
  unit?: string;
};

interface ProductCardProps {
  item: ProductCardItem;
  onUpdatePrice?: (item: ProductCardItem) => void;
  pricePrefix?: string;
  showUpdateButton?: boolean;
  updateButtonLabel?: string;
}

export function ProductCard({
  item,
  onUpdatePrice,
  pricePrefix = '৳',
  showUpdateButton = true,
  updateButtonLabel = 'Update Price',
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 py-0 gap-0 group h-full flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center">
        {!imageError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col items-center justify-center p-4">
            <Package className="h-10 w-10 text-primary/20" />
          </div>
        )}
        {/* Price Trend Badge */}
        <div className="absolute top-1 right-1">
          <span
            className={`px-1.5 py-0.5 text-white text-xs font-bold rounded-full flex items-center space-x-1 ${
              item.priceChange === 'up' ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {item.priceChange === 'up' ? (
              <TrendingUp className="h-2.5 w-2.5" />
            ) : (
              <TrendingDown className="h-2.5 w-2.5" />
            )}
          </span>
        </div>
        {/* Category Badge */}
        <div className="absolute bottom-1 left-1">
          <span className="px-1.5 py-0.5 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
            {item.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="p-2 sm:p-3 flex-1 flex flex-col">
        {/* Item Name */}
        <h3 className="text-xs sm:text-sm font-semibold mb-1 line-clamp-2 min-h-[2.5rem]">
          {item.name}
        </h3>

        {/* Market Name */}
        {item.marketId ? (
          <Link
            href={`/markets/${item.marketId}`}
            className="text-[10px] sm:text-xs text-muted-foreground mb-2 line-clamp-1 italic hover:text-primary hover:not-italic font-medium transition-all"
          >
            @{item.marketName}
          </Link>
        ) : (
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 line-clamp-1 italic">
            @{item.marketName}
          </p>
        )}

        {/* Current Price */}
        <div className="mb-1">
          <span className="text-sm sm:text-base font-bold text-primary">
            {pricePrefix}
            {item.currentPrice}
          </span>
          {item.unit ? (
            <span className="text-[10px] text-muted-foreground ml-1">/ {item.unit}</span>
          ) : null}
        </div>

        {/* Last Updated */}
        <div className="mb-3 mt-auto">
          <div className="flex items-center text-[10px] text-muted-foreground/80">
            <Clock className="h-3 w-3 mr-1" />
            {item.lastUpdated}
          </div>
        </div>

        {/* Update Price Button */}
        {showUpdateButton ? (
          <button
            onClick={() => onUpdatePrice?.(item)}
            className="w-full py-1.5 text-[10px] sm:text-xs bg-primary/10 text-primary rounded-md font-bold hover:bg-primary hover:text-white transition-all duration-300"
          >
            {updateButtonLabel}
          </button>
        ) : null}
      </CardContent>
    </Card>
  );
}

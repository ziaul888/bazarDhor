"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Star, TrendingUp, TrendingDown, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface Market {
  id: number | string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  image: string;
  isOpen: boolean;
  openTime: string;
  specialties: string[];
  priceRange?: string;
  priceChange?: 'up' | 'down';
  categoryItems?: number;
  featured?: boolean;
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
  showPriceChange = false,
  showPriceRange = true,
  variant = 'default',
  className = ''
}: MarketCardProps) {
  const isCompact = variant === 'compact';
  const [imgError, setImgError] = useState(false);

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 py-0 gap-0 ${className}`}>
      {/* Market Image */}
      <div className={`relative overflow-hidden ${isCompact ? 'h-32' : 'h-48'} bg-muted flex items-center justify-center`}>
        {!imgError ? (
          <Image
            src={market.image}
            alt={market.name}
            fill
            className="object-cover"
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

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${market.isOpen
            ? 'bg-green-500 text-white'
            : 'bg-gray-500 text-white'
            }`}>
            {market.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>

        {/* Featured Badge */}
        {market.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
              Featured
            </span>
          </div>
        )}



        {/* Distance Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-1 bg-black/70 text-white rounded-full text-xs backdrop-blur-sm">
            {market.distance}
          </span>
        </div>
      </div>

      {/* Market Info */}
      <CardContent className={`${isCompact ? 'p-3' : 'p-4'}`}>
        {/* Market Name & Rating */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate ${isCompact ? 'text-sm' : 'text-lg'}`}>
              {market.name}
            </h3>
            <p className={`text-muted-foreground truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {market.address}
            </p>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{market.rating}</span>
            {!isCompact && (
              <span className="text-xs text-muted-foreground">({market.reviews})</span>
            )}
          </div>
        </div>

        {/* Category Items (if enabled) */}
        {showCategoryItems && market.categoryItems && (
          <div className="bg-muted/30 rounded-lg p-2 mb-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Items Available:</span>
              <span className="font-medium">{market.categoryItems}</span>
            </div>
          </div>
        )}

        {/* Details */}
        {!isCompact && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{market.openTime}</span>
            </div>

          </div>
        )}
        {/* Specialties */}
        <div className="flex flex-wrap gap-1 mb-4">
          {market.specialties.slice(0, isCompact ? 1 : 2).map((specialty, index) => (
            <span
              key={index}
              className={`px-2 py-1 bg-accent text-accent-foreground rounded-md ${isCompact ? 'text-xs' : 'text-xs'
                }`}
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Actions */}
        <CardFooter className="flex space-x-2 px-0 pt-4">
          <Button className="flex-1" size={isCompact ? "sm" : "default"} asChild>
            <Link href={`/markets/${market.id}`}>
              View Market
            </Link>
          </Button>
          <Button variant="outline" size={isCompact ? "sm" : "default"}>
            <MapPin className="h-4 w-4" />
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

// Market List Item Component for horizontal layout
export function MarketListItem({
  market,
  showCategoryItems = false,
  showPriceChange = false,
  className = ''
}: MarketCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="flex items-center space-x-4">
        {/* Market Image */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
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
        </div>

        {/* Market Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{market.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{market.address}</p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{market.rating}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${market.isOpen
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 text-white'
                }`}>
                {market.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Distance:</span>
              <div className="font-medium">{market.distance}</div>
            </div>
            {showCategoryItems && market.categoryItems && (
              <div>
                <span className="text-muted-foreground">Items:</span>
                <div className="font-medium">{market.categoryItems}</div>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Hours:</span>
              <div className="font-medium">{market.openTime}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          <Button size="sm" asChild>
            <Link href={`/markets/${market.id}`}>
              View Market
            </Link>
          </Button>
          {/* <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4" />
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}

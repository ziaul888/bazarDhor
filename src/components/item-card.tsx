"use client";

import Image from 'next/image';
import { Heart, Star, TrendingUp, TrendingDown, MapPin, Clock, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ItemCardProps {
  item: {
    id: number;
    name: string;
    marketName: string;
    marketId?: number;
    currentPrice: number;
    previousPrice?: number;
    image: string;
    category: string;
    priceChange?: "up" | "down" | "stable";
    priceChangePercent?: number;
    lastUpdated: string;
    unit?: string;
    inStock?: boolean;
    rating?: number;
    reviews?: number;
    distance?: string;
    vendor?: {
      id: number;
      name: string;
      rating: number;
    };
    description?: string;
    organic?: boolean;
    featured?: boolean;
  };
  onAddToCart?: (itemId: number) => void;
  onToggleFavorite?: (itemId: number) => void;
  isFavorite?: boolean;
  showDistance?: boolean;
  compact?: boolean;
}

export function ItemCard({ 
  item, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite = false,
  showDistance = true,
  compact = false
}: ItemCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    onAddToCart?.(item.id);
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(item.id);
  };

  const getPriceChangeColor = () => {
    if (!item.priceChange) return 'text-gray-500';
    return item.priceChange === 'up' ? 'text-red-500' : 'text-green-500';
  };

  const getPriceChangeIcon = () => {
    if (!item.priceChange || item.priceChange === 'stable') return null;
    return item.priceChange === 'up' ? 
      <TrendingUp className="h-3 w-3" /> : 
      <TrendingDown className="h-3 w-3" />;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group ${
      compact ? 'hover:scale-102' : 'hover:scale-105'
    }`}>
      {/* Image Section */}
      <div className={`relative overflow-hidden ${compact ? 'aspect-[4/3]' : 'aspect-[3/2]'}`}>
        {!imageError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-110 ${
              isImageLoading ? 'blur-sm' : 'blur-0'
            }`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setImageError(true);
              setIsImageLoading(false);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="text-2xl mb-2">📦</div>
              <div className="text-xs">No Image</div>
            </div>
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute inset-0">
          {/* Top Left Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {item.featured && (
              <span className="px-2 py-1 bg-primary text-white text-xs font-bold rounded-full">
                Featured
              </span>
            )}
            {item.organic && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                Organic
              </span>
            )}
            {!item.inStock && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Top Right - Favorite Button */}
          <div className="absolute top-2 right-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Price Change Badge */}
          {item.priceChange && item.priceChange !== 'stable' && (
            <div className="absolute top-2 right-14">
              <span className={`px-2 py-1 text-white text-xs font-bold rounded-full flex items-center space-x-1 ${
                item.priceChange === 'up' ? 'bg-red-500' : 'bg-green-500'
              }`}>
                {getPriceChangeIcon()}
                {item.priceChangePercent && (
                  <span>{Math.abs(item.priceChangePercent)}%</span>
                )}
              </span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
              {item.category}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={`p-3 ${compact ? 'space-y-2' : 'space-y-3'}`}>
        {/* Item Name */}
        <div>
          <h3 className={`font-semibold text-gray-900 line-clamp-2 ${
            compact ? 'text-sm' : 'text-base'
          }`}>
            {item.name}
          </h3>
          {item.description && !compact && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Market and Vendor Info */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-600 truncate">{item.marketName}</span>
            {showDistance && item.distance && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-600">{item.distance}</span>
              </>
            )}
          </div>
          
          {item.vendor && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">by</span>
              <span className="text-xs font-medium text-gray-700">{item.vendor.name}</span>
              {item.vendor.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{item.vendor.rating}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rating and Reviews */}
        {item.rating && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{item.rating}</span>
            </div>
            {item.reviews && (
              <span className="text-xs text-gray-500">({item.reviews} reviews)</span>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`font-bold ${compact ? 'text-lg' : 'text-xl'} text-gray-900`}>
                ${item.currentPrice}
              </span>
              {item.unit && (
                <span className="text-sm text-gray-500">/{item.unit}</span>
              )}
            </div>
            
            {item.previousPrice && item.previousPrice !== item.currentPrice && (
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-400 line-through">
                  ${item.previousPrice}
                </span>
                {item.priceChangePercent && (
                  <span className={`text-xs font-medium ${getPriceChangeColor()}`}>
                    {item.priceChange === 'up' ? '+' : '-'}{Math.abs(item.priceChangePercent)}%
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Last Updated */}
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              Updated {formatTimeAgo(item.lastUpdated)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!item.inStock}
          className={`w-full ${compact ? 'py-2 text-sm' : 'py-2.5'} bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200 ${
            !item.inStock ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
          }`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
}
"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Share2,
  Navigation,
  Phone,
  MapPin,
  Clock,
  Globe,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketItemsList } from './market-items-list';

interface MarketData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_path: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  is_open: boolean;
  is_featured: boolean;
  division: string | null;
  district: string | null;
  upazila_or_thana: string | null;
  opening_hours: unknown;
  zone: { id: string; name: string } | null;
}

interface MarketDetailsClientProps {
  marketData: MarketData;
}

export function MarketDetailsClient({ marketData }: MarketDetailsClientProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const hasCoords =
    typeof marketData.latitude === 'number' &&
    typeof marketData.longitude === 'number';


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/markets">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">{marketData.name}</h1>
                {marketData.zone && (
                  <p className="text-sm text-muted-foreground">{marketData.zone.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Market Info Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-3 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:gap-8">

            {/* Left — info */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2 lg:mb-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  marketData.is_open
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {marketData.is_open ? 'Open Now' : 'Closed'}
                </span>
                {marketData.is_featured && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Featured
                  </span>
                )}
                {/* address inline on mobile only */}
                {marketData.address && (
                  <span className="flex lg:hidden items-center gap-1 text-xs text-muted-foreground truncate max-w-[220px]">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    {marketData.address}
                  </span>
                )}
              </div>

              {/* Description */}
              {marketData.description && (
                <p className="text-muted-foreground mb-3 text-xs sm:text-sm line-clamp-2 lg:line-clamp-3">
                  {marketData.description}
                </p>
              )}

              {/* Contact grid — 2 cols on desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2 text-xs lg:text-sm">
                {marketData.address && (
                  <div className="hidden lg:flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary/60" />
                    <span>{marketData.address}</span>
                  </div>
                )}
                {marketData.opening_hours != null && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
                    <span>{String(marketData.opening_hours)}</span>
                  </div>
                )}
                {marketData.phone && (
                  <a href={`tel:${marketData.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
                    {marketData.phone}
                  </a>
                )}
                {marketData.email && (
                  <a href={`mailto:${marketData.email}`} className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors truncate">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
                    <span className="truncate">{marketData.email}</span>
                  </a>
                )}
                {marketData.website && (
                  <a
                    href={marketData.website.startsWith('http') ? marketData.website : `https://${marketData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors truncate"
                  >
                    <Globe className="h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
                    <span className="truncate">{marketData.website}</span>
                  </a>
                )}
              </div>

              {/* Directions — mobile only */}
              {hasCoords && (
                <div className="flex lg:hidden mt-3">
                  <Button size="sm" variant="outline" className="h-7 px-3 text-xs" asChild>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${marketData.latitude},${marketData.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="h-3 w-3 mr-1.5" />
                      Get Directions
                    </a>
                  </Button>
                </div>
              )}
            </div>

            {/* Right — directions button, desktop only */}
            {hasCoords && (
              <div className="hidden lg:flex flex-col justify-center flex-shrink-0">
                <Button size="sm" asChild>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${marketData.latitude},${marketData.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="h-3.5 w-3.5 mr-2" />
                    Get Directions
                  </a>
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold">All Items</h3>
          </div>
          <MarketItemsList marketId={String(marketData.id)} />
        </div>
      </div>
    </div>
  );
}

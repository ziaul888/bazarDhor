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
import { MarketMap } from './market-map';

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

  const locationParts = [
    marketData.upazila_or_thana,
    marketData.district,
    marketData.division,
  ].filter(Boolean).join(', ');

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
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Market Details */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      marketData.is_open
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {marketData.is_open ? 'Open Now' : 'Closed'}
                    </span>
                    {marketData.is_featured && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {marketData.description && (
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  {marketData.description}
                </p>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {marketData.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <span>{marketData.address}</span>
                      {locationParts && (
                        <p className="text-xs text-muted-foreground mt-0.5">{locationParts}</p>
                      )}
                    </div>
                  </div>
                )}
                {marketData.opening_hours != null && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{String(marketData.opening_hours)}</span>
                  </div>
                )}
                {marketData.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <a href={`tel:${marketData.phone}`} className="hover:text-primary transition-colors">
                      {marketData.phone}
                    </a>
                  </div>
                )}
                {marketData.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <a href={`mailto:${marketData.email}`} className="hover:text-primary transition-colors truncate">
                      {marketData.email}
                    </a>
                  </div>
                )}
                {marketData.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <a
                      href={marketData.website.startsWith('http') ? marketData.website : `https://${marketData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors truncate"
                    >
                      {marketData.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Map & Directions */}
            <div className="lg:col-span-1">
              <div className="bg-muted/30 rounded-lg p-4 h-48 lg:h-full min-h-[200px] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Location</h3>
                </div>

                <div className="flex-1 rounded-lg overflow-hidden mb-3 relative z-0">
                  {hasCoords ? (
                    <MarketMap
                      latitude={marketData.latitude!}
                      longitude={marketData.longitude!}
                      name={marketData.name}
                      address={marketData.address}
                    />
                  ) : (
                    <div className="h-full bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Location unavailable</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    className="w-full"
                    asChild
                    disabled={!hasCoords}
                  >
                    <a
                      href={hasCoords ? `https://www.google.com/maps/dir/?api=1&destination=${marketData.latitude},${marketData.longitude}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Directions
                    </a>
                  </Button>
                 
                </div>
              </div>
            </div>
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

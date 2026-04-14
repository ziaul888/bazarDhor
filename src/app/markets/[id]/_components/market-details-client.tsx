"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Heart, 
  Share2, 
  Navigation, 
  Phone, 
  Star,
  Users,
  MapPin,
  Clock,
  Globe,
  Car,
  CreditCard,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketItemsList } from './market-items-list';

interface MarketDetailsClientProps {
  marketData: {
    id: string | number;
    name: string;
    description?: string;
    address?: string;
    distance?: string;
    phone?: string;
    website?: string;
    openTime?: string;
    coordinates: { lat: number; lng: number };
    rating?: number;
    reviews?: number;
    vendors?: number;
    priceRange?: string;
    socialMedia?: { facebook?: string; instagram?: string };
    type?: string;
    isOpen?: boolean;
    acceptsCards?: boolean;
    hasDelivery?: boolean;
    features?: {
      freeParking?: boolean;
      organicCertified?: boolean;
    };
  };
}

export function MarketDetailsClient({ marketData }: MarketDetailsClientProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const rating = typeof marketData.rating === 'number' ? marketData.rating : 0;
  const reviews = typeof marketData.reviews === 'number' ? marketData.reviews : 0;

  // Generate structured data for SEO
  const businessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": marketData.name,
    "description": marketData.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": marketData.address,
      "addressLocality": "Local Area",
      "addressRegion": "State",
      "postalCode": "12345",
      "addressCountry": "Country"
    },
    "telephone": marketData.phone,
    "openingHours": marketData.openTime,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": marketData.coordinates.lat,
      "longitude": marketData.coordinates.lng
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating.toString(),
      "reviewCount": reviews.toString()
    },
    "priceRange": marketData.priceRange,
    "sameAs": [
      `https://facebook.com/${marketData.socialMedia?.facebook || ''}`,
      `https://instagram.com/${marketData.socialMedia?.instagram || ''}`
    ].filter(url => url.includes('://'))
  };
  
  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://freshmarketfinder.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Markets",
        "item": "https://freshmarketfinder.com/markets"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": marketData.name,
        "item": `https://freshmarketfinder.com/markets/${marketData.id}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Enhancement - Business Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessData)
        }}
      />
      
      {/* SEO Enhancement - Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
      
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
                <p className="text-sm text-muted-foreground">{marketData.type}</p>
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
                      marketData.isOpen
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {marketData.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                    <span className="text-sm text-muted-foreground">{marketData.type}</span>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{rating}</span>
                      <span className="text-sm text-muted-foreground">({reviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{marketData.vendors} vendors</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                {marketData.description}
              </p>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{marketData.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{marketData.openTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{marketData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{marketData.website}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                {marketData.features?.freeParking && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-full text-xs">
                    <Car className="h-3 w-3" />
                    <span>Free Parking</span>
                  </span>
                )}
                {marketData.acceptsCards && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-info/10 text-info rounded-full text-xs">
                    <CreditCard className="h-3 w-3" />
                    <span>Cards Accepted</span>
                  </span>
                )}
                {marketData.hasDelivery && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-warning/10 text-warning rounded-full text-xs">
                    <Truck className="h-3 w-3" />
                    <span>Delivery</span>
                  </span>
                )}
                {marketData.features?.organicCertified && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-full text-xs">
                    <span>🌱</span>
                    <span>Organic</span>
                  </span>
                )}
              </div>
            </div>

            {/* Map & Directions */}
            <div className="lg:col-span-1">
              <div className="bg-muted/30 rounded-lg p-4 h-48 lg:h-full min-h-[200px] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Location</h3>
                  <span className="text-xs text-muted-foreground">{marketData.distance} away</span>
                </div>

                {/* Placeholder for map */}
                <div className="flex-1 bg-muted rounded-lg flex items-center justify-center mb-3">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Interactive Map</p>
                    <p className="text-xs">Coming Soon</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" className="w-full">
                    <Navigation className="h-3 w-3 mr-1" />
                    Directions
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        {/* Items List */}
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

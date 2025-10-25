"use client";

import Image from 'next/image';
import { MapPin, Clock, Star, Users, CreditCard, Car, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Market {
  id: number;
  name: string;
  address: string;
  distance: string;
  openTime: string;
  rating: number;
  reviews: number;
  vendors: number;
  image: string;
  isOpen: boolean;
  specialties: string[];
  featured: boolean;
  type: string;
  priceRange: string;
  hasParking: boolean;
  acceptsCards: boolean;
  hasDelivery: boolean;
}

interface MarketCardProps {
  market: Market;
  viewMode: 'grid' | 'list';
}

export function MarketCard({ market, viewMode }: MarketCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="flex flex-col sm:flex-row">
          {/* Market Image */}
          <div className="relative w-full sm:w-48 h-48 sm:h-32 overflow-hidden">
            <Image
              src={market.image}
              alt={market.name}
              fill
              className="object-cover"
            />
            
            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                market.isOpen
                  ? 'bg-success text-success-foreground'
                  : 'bg-muted text-muted-foreground'
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
          </div>

          {/* Market Info */}
          <div className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                {/* Market Name & Rating */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                      {market.name}
                    </h3>
                    <span className="text-sm text-muted-foreground">{market.type}</span>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{market.rating}</span>
                    <span className="text-xs text-muted-foreground">({market.reviews})</span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{market.distance} away</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{market.openTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{market.vendors} vendors</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{market.priceRange}</span>
                    <span className="text-sm text-muted-foreground">Price Range</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex items-center space-x-3 mb-3">
                  {market.hasParking && (
                    <div className="flex items-center space-x-1">
                      <Car className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">Parking</span>
                    </div>
                  )}
                  {market.acceptsCards && (
                    <div className="flex items-center space-x-1">
                      <CreditCard className="h-3 w-3 text-info" />
                      <span className="text-xs text-info">Cards</span>
                    </div>
                  )}
                  {market.hasDelivery && (
                    <div className="flex items-center space-x-1">
                      <Truck className="h-3 w-3 text-warning" />
                      <span className="text-xs text-warning">Delivery</span>
                    </div>
                  )}
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1">
                  {market.specialties.slice(0, 3).map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <Button className="w-full sm:w-auto">
                  View Market
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
      {/* Market Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={market.image}
          alt={market.name}
          fill
          className="object-cover"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            market.isOpen
              ? 'bg-success text-success-foreground'
              : 'bg-muted text-muted-foreground'
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
          <span className="px-2 py-1 bg-black/70 text-white rounded-full text-xs font-medium backdrop-blur-sm">
            {market.distance}
          </span>
        </div>
      </div>

      {/* Market Info */}
      <div className="p-4">
        {/* Market Name & Rating */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
              {market.name}
            </h3>
            <span className="text-sm text-muted-foreground">{market.type}</span>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{market.rating}</span>
            <span className="text-xs text-muted-foreground">({market.reviews})</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground line-clamp-1">{market.address}</span>
        </div>

        {/* Opening Hours */}
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground">{market.openTime}</span>
        </div>

        {/* Vendors Count & Price Range */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground">{market.vendors} vendors</span>
          </div>
          <span className="text-sm font-medium">{market.priceRange}</span>
        </div>

        {/* Features */}
        <div className="flex items-center space-x-3 mb-3">
          {market.hasParking && (
            <div className="flex items-center space-x-1">
              <Car className="h-3 w-3 text-success" />
              <span className="text-xs text-success">Parking</span>
            </div>
          )}
          {market.acceptsCards && (
            <div className="flex items-center space-x-1">
              <CreditCard className="h-3 w-3 text-info" />
              <span className="text-xs text-info">Cards</span>
            </div>
          )}
          {market.hasDelivery && (
            <div className="flex items-center space-x-1">
              <Truck className="h-3 w-3 text-warning" />
              <span className="text-xs text-warning">Delivery</span>
            </div>
          )}
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1 mb-4">
          {market.specialties.slice(0, 2).map((specialty, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs"
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <Button className="w-full">
          View Market
        </Button>
      </div>
    </div>
  );
}
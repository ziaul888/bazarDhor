"use client";

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Star, Users, CreditCard, Car, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Market } from '@/lib/api/types';

interface MarketCardProps {
    market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
    return (
        <Link href={`/markets/${market.id}`}>
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${market.isOpen
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
                        <h3 className="text-base sm:text-lg font-semibold hover:text-primary transition-colors line-clamp-1">
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
        </Link>
    );
}
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Star, Users, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const markets = [
    {
        id: 1,
        name: "Downtown Farmers Market",
        address: "123 Main Street, Downtown",
        distance: "0.5 km",
        rating: 4.8,
        reviews: 245,
        vendors: 32,
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=200&fit=crop",
        openHours: "8:00 AM - 6:00 PM",
        features: {
            freeParking: true,
            organicCertified: true,
            delivery: true,
        },
        avgPrices: {
            produce: 4.50,
            bread: 6.99,
        }
    },
    {
        id: 2,
        name: "Riverside Artisan Market",
        address: "456 River Road, Riverside",
        distance: "1.2 km",
        rating: 4.7,
        reviews: 189,
        vendors: 28,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
        openHours: "9:00 AM - 5:00 PM",
        features: {
            organicCertified: true,
            petFriendly: true,
            creditCards: true,
        },
        avgPrices: {
            produce: 5.20,
            bread: 7.50,
        }
    },
    {
        id: 3,
        name: "Central Plaza Market",
        address: "789 Plaza Avenue, Central",
        distance: "2.1 km",
        rating: 4.6,
        reviews: 156,
        vendors: 45,
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=200&fit=crop",
        openHours: "7:00 AM - 7:00 PM",
        features: {
            freeParking: true,
            creditCards: true,
            delivery: true,
        },
        avgPrices: {
            produce: 3.99,
            bread: 5.99,
        }
    },
    {
        id: 4,
        name: "Sunset Weekend Market",
        address: "321 Sunset Boulevard, West",
        distance: "3.5 km",
        rating: 4.9,
        reviews: 298,
        vendors: 38,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
        openHours: "10:00 AM - 4:00 PM",
        features: {
            freeParking: true,
            organicCertified: true,
            petFriendly: true,
        },
        avgPrices: {
            produce: 4.75,
            bread: 8.99,
        }
    }
];

export function CompareMarketsSection() {
    const [selectedMarket1, setSelectedMarket1] = useState(markets[0]);
    const [selectedMarket2, setSelectedMarket2] = useState(markets[1]);
    const [dropdown1Open, setDropdown1Open] = useState(false);
    const [dropdown2Open, setDropdown2Open] = useState(false);

    const MarketCard = ({ market }: { market: typeof markets[0] }) => (
        <div className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
                <Image
                    src={market.image}
                    alt={market.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{market.name}</h3>
                    <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{market.rating} ({market.reviews} reviews)</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Basic Info */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{market.distance} away</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{market.openHours}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{market.vendors} vendors</span>
                    </div>
                </div>

                {/* Key Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {market.features.freeParking && (
                        <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">Free Parking</span>
                    )}
                    {market.features.organicCertified && (
                        <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">Organic</span>
                    )}
                    {market.features.delivery && (
                        <span className="px-2 py-1 bg-info/10 text-info text-xs rounded-full">Delivery</span>
                    )}
                    {market.features.petFriendly && (
                        <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">Pet Friendly</span>
                    )}
                    {market.features.creditCards && (
                        <span className="px-2 py-1 bg-info/10 text-info text-xs rounded-full">Cards Accepted</span>
                    )}
                </div>

                {/* Sample Prices */}
                <div className="text-sm text-muted-foreground">
                    <p>Avg prices: Produce ${market.avgPrices.produce} • Bread ${market.avgPrices.bread}</p>
                </div>
            </div>
        </div>
    );

    return (
        <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">Compare Markets</h2>
                    <p className="text-muted-foreground">Find the best market for your needs</p>
                </div>

                {/* Market Selection Dropdowns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Market 1 Selector */}
                    <div className="relative">
                        <label className="block text-sm font-medium mb-2">Select First Market</label>
                        <button
                            onClick={() => setDropdown1Open(!dropdown1Open)}
                            className="w-full p-3 bg-card border rounded-lg flex items-center justify-between hover:bg-accent transition-colors"
                        >
                            <span className="font-medium">{selectedMarket1.name}</span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${dropdown1Open ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdown1Open && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                {markets.map((market) => (
                                    <button
                                        key={market.id}
                                        onClick={() => {
                                            setSelectedMarket1(market);
                                            setDropdown1Open(false);
                                        }}
                                        className="w-full p-3 text-left hover:bg-accent transition-colors border-b border-border/50 last:border-b-0"
                                    >
                                        <div className="font-medium">{market.name}</div>
                                        <div className="text-sm text-muted-foreground">{market.distance} • {market.vendors} vendors</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Market 2 Selector */}
                    <div className="relative">
                        <label className="block text-sm font-medium mb-2">Select Second Market</label>
                        <button
                            onClick={() => setDropdown2Open(!dropdown2Open)}
                            className="w-full p-3 bg-card border rounded-lg flex items-center justify-between hover:bg-accent transition-colors"
                        >
                            <span className="font-medium">{selectedMarket2.name}</span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${dropdown2Open ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdown2Open && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                {markets.map((market) => (
                                    <button
                                        key={market.id}
                                        onClick={() => {
                                            setSelectedMarket2(market);
                                            setDropdown2Open(false);
                                        }}
                                        className="w-full p-3 text-left hover:bg-accent transition-colors border-b border-border/50 last:border-b-0"
                                    >
                                        <div className="font-medium">{market.name}</div>
                                        <div className="text-sm text-muted-foreground">{market.distance} • {market.vendors} vendors</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Two Markets Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <MarketCard market={selectedMarket1} />
                    <MarketCard market={selectedMarket2} />
                </div>

                {/* Compare Button */}
                <div className="text-center">
                    <Button asChild className="px-8 py-3 text-lg">
                        <Link href="/markets/compare">
                            Compare Markets
                        </Link>
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                        See detailed comparison of prices, features, and more
                    </p>
                </div>
            </div>
        </section>
    );
}
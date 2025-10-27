"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Star, ChevronDown, ArrowRight, Scale, MapPin, Users } from 'lucide-react';
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

    return (
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
            <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6">
                        <div className="bg-gradient-to-r from-primary to-secondary p-3 sm:p-4 rounded-full shadow-lg">
                            <Scale className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center sm:text-left">
                            Compare Markets
                        </h2>
                    </div>
                    <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
                        Select two markets and discover which one offers the best value for your shopping needs
                    </p>
                </div>

                {/* Full Width Comparison Interface */}
                <div className="w-full max-w-7xl mx-auto">
                    {/* Market Selection Row */}
                    <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-gray-200/50 shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 mb-8 sm:mb-10 lg:mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start md:items-center">
                            {/* Market 1 Selection */}
                            <div className="relative">
                                <div className="text-center mb-4 sm:mb-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4">
                                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">1</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">First Market</h3>
                                </div>
                                
                                <button
                                    onClick={() => {
                                        setDropdown1Open(!dropdown1Open);
                                        setDropdown2Open(false);
                                    }}
                                    className="w-full p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-2 sm:border-3 border-primary/20 rounded-xl sm:rounded-2xl hover:border-primary/40 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-primary/20 group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="text-left flex-1 min-w-0">
                                            <div className="font-bold text-base sm:text-lg text-gray-900 mb-1 sm:mb-2 truncate">{selectedMarket1.name}</div>
                                            <div className="text-xs sm:text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 lg:space-x-3">
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                    <span className="truncate">{selectedMarket1.distance}</span>
                                                </div>
                                                <div className="hidden sm:flex items-center space-x-1">
                                                    <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">{selectedMarket1.vendors} vendors</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                                    <span>{selectedMarket1.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronDown className={`h-5 w-5 sm:h-6 sm:w-6 text-primary transition-transform group-hover:scale-110 flex-shrink-0 ml-2 ${dropdown1Open ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                {dropdown1Open && (
                                    <div className="absolute top-full left-0 right-0 mt-2 sm:mt-4 bg-white border-2 border-primary/20 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl z-40 max-h-60 sm:max-h-80 overflow-y-auto">
                                        {markets.filter(m => m.id !== selectedMarket2.id).map((market) => (
                                            <button
                                                key={market.id}
                                                onClick={() => {
                                                    setSelectedMarket1(market);
                                                    setDropdown1Open(false);
                                                }}
                                                className="w-full p-3 sm:p-4 lg:p-5 text-left hover:bg-primary/5 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-xl first:sm:rounded-t-2xl last:rounded-b-xl last:sm:rounded-b-2xl"
                                            >
                                                <div className="font-semibold text-sm sm:text-base text-gray-900 mb-1 truncate">{market.name}</div>
                                                <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-1 sm:gap-2">
                                                    <span>{market.distance}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="hidden sm:inline">{market.vendors} vendors</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        <span>{market.rating}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Market 2 Selection */}
                            <div className="relative">
                                <div className="text-center mb-4 sm:mb-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-secondary/10 rounded-full mb-3 sm:mb-4">
                                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary">2</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Second Market</h3>
                                </div>
                                
                                <button
                                    onClick={() => {
                                        setDropdown2Open(!dropdown2Open);
                                        setDropdown1Open(false);
                                    }}
                                    className="w-full p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-2 sm:border-3 border-secondary/20 rounded-xl sm:rounded-2xl hover:border-secondary/40 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-secondary/20 group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="text-left flex-1 min-w-0">
                                            <div className="font-bold text-base sm:text-lg text-gray-900 mb-1 sm:mb-2 truncate">{selectedMarket2.name}</div>
                                            <div className="text-xs sm:text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 lg:space-x-3">
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                    <span className="truncate">{selectedMarket2.distance}</span>
                                                </div>
                                                <div className="hidden sm:flex items-center space-x-1">
                                                    <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">{selectedMarket2.vendors} vendors</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                                    <span>{selectedMarket2.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronDown className={`h-5 w-5 sm:h-6 sm:w-6 text-secondary transition-transform group-hover:scale-110 flex-shrink-0 ml-2 ${dropdown2Open ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                {dropdown2Open && (
                                    <div className="absolute top-full left-0 right-0 mt-2 sm:mt-4 bg-white border-2 border-secondary/20 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl z-40 max-h-60 sm:max-h-80 overflow-y-auto">
                                        {markets.filter(m => m.id !== selectedMarket1.id).map((market) => (
                                            <button
                                                key={market.id}
                                                onClick={() => {
                                                    setSelectedMarket2(market);
                                                    setDropdown2Open(false);
                                                }}
                                                className="w-full p-3 sm:p-4 lg:p-5 text-left hover:bg-secondary/5 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-xl first:sm:rounded-t-2xl last:rounded-b-xl last:sm:rounded-b-2xl"
                                            >
                                                <div className="font-semibold text-sm sm:text-base text-gray-900 mb-1 truncate">{market.name}</div>
                                                <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-1 sm:gap-2">
                                                    <span>{market.distance}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="hidden sm:inline">{market.vendors} vendors</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        <span>{market.rating}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center px-2 sm:px-0">
                        <Button asChild size="lg" className="w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg sm:shadow-xl lg:shadow-2xl hover:shadow-xl sm:hover:shadow-2xl lg:hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                            <Link href="/markets/compare" className="flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4">
                                <Scale className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
                                <span className="truncate">Compare These Markets</span>
                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
                            </Link>
                        </Button>
                        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed">
                            Get detailed price comparisons, vendor information, features, and make the best choice for your shopping
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
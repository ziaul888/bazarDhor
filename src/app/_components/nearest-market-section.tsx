"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { MarketCard } from '@/components/market-card';
import { useRandomMarkets } from '@/lib/api/hooks/useMarkets';
import { useMemo } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const nearestMarkets = [
    {
        id: 1,
        name: "Downtown Farmers Market",
        address: "123 Main Street, Downtown",
        distance: "0.5 km",
        openTime: "8:00 AM - 6:00 PM",
        rating: 4.8,
        reviews: 245,
        vendors: 32,
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Fresh Produce", "Artisan Crafts"],
        featured: true
    },
    {
        id: 2,
        name: "Riverside Artisan Market",
        address: "456 River Road, Riverside",
        distance: "1.2 km",
        openTime: "9:00 AM - 5:00 PM",
        rating: 4.7,
        reviews: 189,
        vendors: 28,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Handmade Goods", "Local Food"],
        featured: false
    },
    {
        id: 3,
        name: "Central Plaza Market",
        address: "789 Plaza Avenue, Central",
        distance: "2.1 km",
        openTime: "7:00 AM - 7:00 PM",
        rating: 4.6,
        reviews: 156,
        vendors: 45,
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop",
        isOpen: false,
        specialties: ["Organic Food", "Vintage Items"],
        featured: false
    },
    {
        id: 4,
        name: "Sunset Weekend Market",
        address: "321 Sunset Boulevard, West",
        distance: "3.5 km",
        openTime: "10:00 AM - 4:00 PM",
        rating: 4.9,
        reviews: 298,
        vendors: 38,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Street Food", "Live Music"],
        featured: true
    },
    {
        id: 5,
        name: "Heritage Square Market",
        address: "654 Heritage Lane, Old Town",
        distance: "4.2 km",
        openTime: "8:30 AM - 5:30 PM",
        rating: 4.5,
        reviews: 134,
        vendors: 25,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Antiques", "Local Crafts"],
        featured: false
    }
];

const IMAGE_BASE_URL = 'https://bazardor.chhagolnaiyasportareana.xyz/storage/';

export function NearestMarketSection() {
    const { data: apiMarkets, isLoading, error } = useRandomMarkets();

    const markets = useMemo(() => {
        if (apiMarkets && apiMarkets.length > 0) {
            return apiMarkets.slice(0, 10).map((m: any) => ({
                id: m.id,
                name: m.name,
                address: m.address || 'Address not available',
                distance: m.distance_km ? `${m.distance_km} km` : 'N/A',
                openTime: m.opening_hours?.is_closed ? 'Closed' : (m.opening_hours?.opening || '8:00 AM - 8:00 PM'),
                rating: 4.5, // API doesn't seem to provide rating yet
                reviews: 0,
                vendors: 0,
                image: m.image_path ? `${IMAGE_BASE_URL}${m.image_path}` : "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
                isOpen: m.is_open || false,
                specialties: [m.type || "Local Market"],
                featured: m.is_featured || false
            }));
        }
        return nearestMarkets;
    }, [apiMarkets]);

    if (isLoading) {
        return (
            <section className="py-4 sm:py-8 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-muted-foreground">Finding nearest markets...</p>
                </div>
            </section>
        );
    }
    return (
        <section className="py-4 sm:py-8 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Nearest Markets</h2>
                        <p className="text-muted-foreground">Discover local markets around you</p>
                    </div>

                    {/* Navigation Buttons - Desktop */}
                    <div className="hidden sm:flex space-x-2">
                        <button className="market-slider-prev w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="market-slider-next w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    {/* Markets Slider */}
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        navigation={{
                            prevEl: '.market-slider-prev',
                            nextEl: '.market-slider-next',
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                        }}
                        loop={true}
                        className="market-swiper"
                    >
                        {markets.map((market) => (
                            <SwiperSlide key={market.id}>
                                <MarketCard market={market} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Mobile Navigation Buttons */}
                    <button className="market-slider-prev sm:hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm">
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button className="market-slider-next sm:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {/* View All Button */}
                <div className="text-center mt-6">
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                        View All Markets
                    </button>
                </div>
            </div>
        </section>
    );
}
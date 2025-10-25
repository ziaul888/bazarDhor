"use client";

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, MapPin, Clock, Star, Users } from 'lucide-react';

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

export function NearestMarketSection() {
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
                        {nearestMarkets.map((market) => (
                            <SwiperSlide key={market.id}>
                                <div className="group bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                                    {/* Market Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        {/* <Image
                                            src={market.image}
                                            alt={market.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        /> */}

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
                                            <h3 className="text-base sm:text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                                                {market.name}
                                            </h3>
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

                                        {/* Vendors Count */}
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span className="text-sm text-muted-foreground">{market.vendors} vendors</span>
                                        </div>

                                        {/* Specialties */}
                                        <div className="flex flex-wrap gap-1">
                                            {market.specialties.slice(0, 2).map((specialty, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs"
                                                >
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
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
"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Plus, Minus, Tag } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const bestPriceItems = [
    {
        id: 1,
        name: "Fresh Chicken (1kg)",
        marketName: "City Meat Market",
        avgPrice: 8.99,
        currentPrice: 7.50,
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop",
        category: "Meat & Poultry",
        savings: "17%"
    },
    {
        id: 2,
        name: "Organic Tomatoes (500g)",
        marketName: "Green Valley Farm",
        avgPrice: 4.99,
        currentPrice: 3.99,
        image: "https://images.unsplash.com/photo-1546470427-e5ac89cd0b31?w=300&h=300&fit=crop",
        category: "Vegetables",
        savings: "20%"
    },
    {
        id: 3,
        name: "Fresh Milk (1L)",
        marketName: "Dairy Fresh Co.",
        avgPrice: 3.50,
        currentPrice: 2.99,
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop",
        category: "Dairy",
        savings: "15%"
    },
    {
        id: 4,
        name: "Basmati Rice (2kg)",
        marketName: "Grain House",
        avgPrice: 12.99,
        currentPrice: 10.50,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop",
        category: "Grains",
        savings: "19%"
    },
    {
        id: 5,
        name: "Fresh Salmon (500g)",
        marketName: "Ocean Fresh Market",
        avgPrice: 15.99,
        currentPrice: 13.50,
        image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=300&fit=crop",
        category: "Seafood",
        savings: "16%"
    },
    {
        id: 6,
        name: "Mixed Vegetables (1kg)",
        marketName: "Farm Direct",
        avgPrice: 6.50,
        currentPrice: 5.25,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop",
        category: "Vegetables",
        savings: "19%"
    }
];

export function BestPriceSection() {
    return (
        <section className="py-8 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Tag className="h-6 w-6 text-destructive" />
                            <h2 className="text-2xl sm:text-3xl font-bold">Best Price Items</h2>
                        </div>
                        <p className="text-muted-foreground">Best grocery deals from local markets</p>
                    </div>

                    {/* Navigation Buttons - Desktop */}
                    <div className="hidden sm:flex space-x-2">
                        <button className="price-slider-prev w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="price-slider-next w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    {/* Products Slider */}
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        navigation={{
                            prevEl: '.price-slider-prev',
                            nextEl: '.price-slider-next',
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                        }}
                        loop={true}
                        className="price-swiper"
                    >
                        {bestPriceItems.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300">
                                    {/* Product Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Savings Badge */}
                                        <div className="absolute top-2 right-2">
                                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                                Save {item.savings}
                                            </span>
                                        </div>
                                        {/* Category Badge */}
                                        <div className="absolute bottom-2 left-2">
                                            <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        {/* Item Name */}
                                        <h3 className="font-semibold text-base mb-1 line-clamp-1">
                                            {item.name}
                                        </h3>

                                        {/* Market Name */}
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {item.marketName}
                                        </p>

                                        {/* Price Comparison */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-green-600">${item.currentPrice}</span>
                                                <span className="text-sm text-muted-foreground line-through">${item.avgPrice}</span>
                                            </div>
                                        </div>

                                        {/* Update Price Button */}
                                        <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                            Update Price
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Mobile Navigation Buttons */}
                    <button className="price-slider-prev sm:hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm">
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button className="price-slider-next sm:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {/* View All Button */}
                <div className="text-center mt-6">
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                        View All Items
                    </button>
                </div>
            </div>
        </section>
    );
}
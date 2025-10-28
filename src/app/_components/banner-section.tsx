"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { ArrowRight, MapPin, DollarSign, Beef, Carrot, TrendingDown, Users, Clock } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const bannerSlides = [
    {
        id: 1,
        badge: { icon: MapPin, text: "Find Nearest Market" },
        title: "Fresh Groceries",
        subtitle: "From Local Markets Near You",
        description: "Discover the freshest vegetables, fruits, meat, and daily essentials from markets within 5km of your location.",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop&auto=format",
        emoji: "🛒",
        gradient: "from-green-600 via-green-500 to-green-400",
        primaryBtn: "Find Markets",
        secondaryBtn: "View Products"
    },
    {
        id: 2,
        badge: { icon: DollarSign, text: "Best Price Guarantee" },
        title: "Compare Prices",
        subtitle: "Across All Local Markets",
        description: "Get the best deals on fresh produce, meat, and groceries. Compare prices and update market rates in real-time.",
        image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=300&fit=crop&auto=format",
        emoji: "💰",
        gradient: "from-blue-600 via-blue-500 to-blue-400",
        primaryBtn: "Compare Prices",
        secondaryBtn: "Update Prices"
    },
    {
        id: 3,
        badge: { icon: Beef, text: "Fresh Meat & Poultry" },
        title: "Premium Meat",
        subtitle: "Farm Fresh Quality",
        description: "Source the finest cuts of meat, chicken, and seafood from trusted local butchers and meat markets.",
        image: "https://images.unsplash.com/photo-1588347818481-c7c1b6b8b4b4?w=300&h=300&fit=crop&auto=format",
        emoji: "🥩",
        gradient: "from-red-600 via-red-500 to-red-400",
        primaryBtn: "Browse Meat",
        secondaryBtn: "Find Butchers"
    },
    {
        id: 4,
        badge: { icon: Carrot, text: "Farm Fresh Produce" },
        title: "Organic Vegetables",
        subtitle: "Straight from Local Farms",
        description: "Get the freshest organic vegetables, seasonal fruits, and herbs directly from local farmers and vendors.",
        image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=300&h=300&fit=crop&auto=format",
        emoji: "🥕",
        gradient: "from-orange-600 via-orange-500 to-orange-400",
        primaryBtn: "Shop Organic",
        secondaryBtn: "Meet Farmers"
    }
];

export function BannerSection() {
    return (
        <section className="py-4 sm:py-8 lg:py-8">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6">
                {/* Main Promotional Banner Slider */}
                <div className="mb-6 sm:mb-4">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                            bulletClass: 'banner-pagination-bullet',
                            bulletActiveClass: 'banner-pagination-bullet-active',
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        className="banner-slider rounded-xl sm:rounded-2xl overflow-hidden"
                    >
                        {bannerSlides.map((slide) => (
                            <SwiperSlide key={slide.id}>
                                <div className={`relative overflow-hidden bg-gradient-to-r ${slide.gradient} text-white`}>
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                        }} />
                                    </div>

                                    <div className="relative px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-12 xl:py-12">
                                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
                                            {/* Left Content */}
                                            <div className="flex-1 text-center lg:text-left w-full lg:w-auto">
                                                <div className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/20 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                                                    <slide.badge.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                                    <span className="truncate">{slide.badge.text}</span>
                                                </div>

                                                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                                                    <span className="block">{slide.title}</span>
                                                    <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-normal opacity-90 mt-1">
                                                        {slide.subtitle}
                                                    </span>
                                                </h2>

                                                <p className="text-sm sm:text-base lg:text-lg opacity-90 mb-4 sm:mb-6 max-w-sm sm:max-w-md lg:max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                                    {slide.description}
                                                </p>

                                                <div className="flex flex-col xs:flex-row sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start">
                                                    <button className="px-4 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center justify-center text-sm sm:text-base">
                                                        <span className="truncate">{slide.primaryBtn}</span>
                                                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5 sm:ml-2 flex-shrink-0" />
                                                    </button>
                                                    <button className="px-4 py-2.5 sm:px-6 sm:py-3 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base">
                                                        <span className="truncate">{slide.secondaryBtn}</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Right Image/Illustration */}
                                            <div className="flex-shrink-0 order-first lg:order-last">
                                                <div className="relative">
                                                    <Image
                                                        src={slide.image}
                                                        alt={slide.title}
                                                        width={256}
                                                        height={256}
                                                        className="w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-xl sm:rounded-2xl object-cover shadow-xl lg:shadow-2xl"
                                                    />
                                                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-400 rounded-full flex items-center justify-center text-lg sm:text-xl lg:text-2xl animate-bounce">
                                                        {slide.emoji}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Feature Cards */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                            <MapPin className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold mb-2">Nearest Markets</h3>
                        <p className="text-sm text-muted-foreground">Find local markets within 5km radius with GPS location</p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                            <TrendingDown className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold mb-2">Price Comparison</h3>
                        <p className="text-sm text-muted-foreground">Compare prices across markets and get best deals</p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold mb-2">Real-time Updates</h3>
                        <p className="text-sm text-muted-foreground">Live price updates and market availability status</p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold mb-2">Community Driven</h3>
                        <p className="text-sm text-muted-foreground">Users can update prices and share market information</p>
                    </div>
                </div> */}

            </div>

            {/* Custom Pagination Styles */}
            <style jsx global>{`
        .banner-pagination-bullet {
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          margin: 0 3px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        @media (min-width: 640px) {
          .banner-pagination-bullet {
            width: 8px;
            height: 8px;
            margin: 0 4px;
          }
        }
        
        .banner-pagination-bullet-active {
          background: #ffffff;
          transform: scale(1.2);
        }
        
        .banner-slider .swiper-pagination {
          bottom: 12px !important;
        }
        
        @media (min-width: 640px) {
          .banner-slider .swiper-pagination {
            bottom: 20px !important;
          }
        }
        
        /* Custom breakpoint for extra small screens */
        @media (min-width: 475px) {
          .xs\\:w-40 { width: 10rem; }
          .xs\\:h-40 { height: 10rem; }
          .xs\\:flex-row { flex-direction: row; }
        }
      `}</style>
        </section>
    );
}
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
        <section className="py-12">
            <div className="container mx-auto px-4">
                {/* Main Promotional Banner Slider */}
                <div className="mb-8">
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
                        className="banner-slider rounded-2xl overflow-hidden"
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

                                    <div className="relative px-6 py-8 sm:px-8 sm:py-12 lg:px-12">
                                        <div className="flex flex-col lg:flex-row items-center justify-between">
                                            {/* Left Content */}
                                            <div className="flex-1 text-center lg:text-left mb-6 lg:mb-0">
                                                <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                                                    <slide.badge.icon className="h-4 w-4 mr-2" />
                                                    {slide.badge.text}
                                                </div>

                                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                                                    {slide.title}
                                                    <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal opacity-90">
                                                        {slide.subtitle}
                                                    </span>
                                                </h2>

                                                <p className="text-lg opacity-90 mb-6 max-w-md mx-auto lg:mx-0">
                                                    {slide.description}
                                                </p>

                                                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                                    <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center justify-center">
                                                        {slide.primaryBtn}
                                                        <ArrowRight className="h-4 w-4 ml-2" />
                                                    </button>
                                                    <button className="px-6 py-3 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                                        {slide.secondaryBtn}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Right Image/Illustration */}
                                            <div className="flex-shrink-0 lg:ml-8">
                                                <div className="relative">
                                                    <Image
                                                        src={slide.image}
                                                        alt={slide.title}
                                                        width={256}
                                                        height={256}
                                                        className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-2xl object-cover shadow-2xl"
                                                    />
                                                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                            <MapPin className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Nearest Markets</h3>
                        <p className="text-sm text-muted-foreground">Find local markets within 5km radius with GPS location</p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                            <TrendingDown className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Price Comparison</h3>
                        <p className="text-sm text-muted-foreground">Compare prices across markets and get best deals</p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Real-time Updates</h3>
                        <p className="text-sm text-muted-foreground">Live price updates and market availability status</p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Community Driven</h3>
                        <p className="text-sm text-muted-foreground">Users can update prices and share market information</p>
                    </div>
                </div>

            </div>

            {/* Custom Pagination Styles */}
            <style jsx global>{`
        .banner-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .banner-pagination-bullet-active {
          background: #ffffff;
          transform: scale(1.2);
        }
        
        .banner-slider .swiper-pagination {
          bottom: 20px !important;
        }
      `}</style>
        </section>
    );
}
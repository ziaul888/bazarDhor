"use client";

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { ArrowRight, Beef, Leaf, ShoppingCart, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const sliderData = [
  {
    id: 'fresh',
    title: 'Fresh Produce',
    icon: Leaf,
    slides: [
      {
        id: 1,
        title: "Organic Vegetables",
        price: "From $3.99/kg",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=250&fit=crop",
        badge: "Fresh Today"
      },
      {
        id: 2,
        title: "Seasonal Fruits",
        price: "From $2.50/kg",
        image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=250&fit=crop",
        badge: "Sweet & Juicy"
      },
      {
        id: 3,
        title: "Herbs & Leafy Greens",
        price: "From $1.99/bunch",
        image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=250&fit=crop",
        badge: "Organic"
      }
    ]
  },
  {
    id: 'meat',
    title: 'Meat & Poultry',
    icon: Beef,
    slides: [
      {
        id: 1,
        title: "Fresh Chicken",
        price: "From $7.99/kg",
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=250&fit=crop",
        badge: "Farm Fresh"
      },
      {
        id: 2,
        title: "Premium Beef",
        price: "From $18.50/kg",
        image: "https://images.unsplash.com/photo-1588347818481-c7c1b6b8b4b4?w=400&h=250&fit=crop",
        badge: "Grade A"
      },
      {
        id: 3,
        title: "Fresh Seafood",
        price: "From $15.99/kg",
        image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=250&fit=crop",
        badge: "Daily Catch"
      }
    ]
  },
  {
    id: 'groceries',
    title: 'Daily Groceries',
    icon: ShoppingCart,
    slides: [
      {
        id: 1,
        title: "Fresh Dairy Products",
        price: "From $2.99/L",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=250&fit=crop",
        badge: "Farm Fresh"
      },
      {
        id: 2,
        title: "Grains & Pulses",
        price: "From $4.99/kg",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=250&fit=crop",
        badge: "Premium Quality"
      },
      {
        id: 3,
        title: "Spices & Condiments",
        price: "From $1.50/pack",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=250&fit=crop",
        badge: "Authentic"
      }
    ]
  }
];

const adsData = [
  {
    id: 1,
    title: "Premium Market Partnership",
    subtitle: "Get 20% off your first order",
    description: "Join our premium partner markets and enjoy exclusive discounts on fresh produce.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop",
    badge: "Limited Time",
    ctaText: "Claim Offer",
    highlight: "20% OFF"
  },
  {
    id: 2,
    title: "Fresh Delivery Service",
    subtitle: "Same-day delivery available",
    description: "Order before 2 PM and get your groceries delivered the same day.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=200&fit=crop",
    badge: "Fast Delivery",
    ctaText: "Order Now",
    highlight: "Same Day"
  }
];

const systemInfo = {
  title: "About Our Platform",
  features: [
    "Real-time market comparison",
    "Smart price tracking",
    "Local vendor network",
    "Secure payment system"
  ],
  stats: {
    markets: "500+",
    users: "10K+",
    cities: "25+"
  }
};

export function TripleSlider() {
  return (
    <section className="pb-3 sm:pb-4 md:pb-8">
      <div className="container mx-auto px-4">
        {/* Ads Section */}
        <div className="mt-4 md:mt-8">

          {/* Desktop: Grid Layout - 1 Info Section + 2 Images */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {/* First section: System Information */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-primary p-2 rounded-lg mr-3">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{systemInfo.title}</h3>
              </div>

              <div className="space-y-3 mb-4">
                {systemInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-primary/20">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{systemInfo.stats.markets}</div>
                  <div className="text-xs text-gray-600">Markets</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{systemInfo.stats.users}</div>
                  <div className="text-xs text-gray-600">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{systemInfo.stats.cities}</div>
                  <div className="text-xs text-gray-600">Cities</div>
                </div>
              </div>
            </div>

            {/* Second and third sections: Ads as images */}
            {adsData.map((ad) => (
              <div key={ad.id} className="group bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/40">
                <div className="relative h-62 overflow-hidden">
                  <Image
                    src={ad.image}
                    alt={ad.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Ads Badge */}
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    AD
                  </div>

                  {/* Highlight Badge */}
                  <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                    {ad.highlight}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                    {ad.badge}
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-3 right-3">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                      {ad.ctaText}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Horizontal Scroll - 1 Info Section + 2 Images */}
          <div className="md:hidden">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {/* First section: System Information for Mobile */}
              <div className="flex-shrink-0 w-80 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-primary p-1.5 rounded-lg mr-2">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{systemInfo.title}</h3>
                </div>

                <div className="space-y-2 mb-3">
                  {systemInfo.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-700">
                      <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-primary/20">
                  <div className="text-center">
                    <div className="text-sm font-bold text-primary">{systemInfo.stats.markets}</div>
                    <div className="text-xs text-gray-600">Markets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-primary">{systemInfo.stats.users}</div>
                    <div className="text-xs text-gray-600">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-primary">{systemInfo.stats.cities}</div>
                    <div className="text-xs text-gray-600">Cities</div>
                  </div>
                </div>
              </div>

              {/* Second and third sections: Ads as images */}
              {adsData.map((ad) => (
                <div key={ad.id} className="flex-shrink-0 w-80 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 overflow-hidden">
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={ad.image}
                      alt={ad.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Ads Badge */}
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      AD
                    </div>

                    {/* Highlight Badge */}
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                      {ad.highlight}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute bottom-2 left-2 bg-white/90 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                      {ad.badge}
                    </div>
                  </div>

                  {/* Mobile Content */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{ad.title}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{ad.description}</p>
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white text-xs">
                      {ad.ctaText}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Pagination Styles for each slider */}
      <style jsx global>{`
        .fresh-pagination-bullet,
        .meat-pagination-bullet,
        .groceries-pagination-bullet,
        .fresh-mobile-pagination-bullet,
        .meat-mobile-pagination-bullet,
        .groceries-mobile-pagination-bullet,
        .mobile-triple-pagination-bullet {
          width: 6px;
          height: 6px;
          background: rgba(194, 159, 109, 0.4);
          border-radius: 50%;
          margin: 0 3px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .fresh-pagination-bullet-active,
        .meat-pagination-bullet-active,
        .groceries-pagination-bullet-active,
        .fresh-mobile-pagination-bullet-active,
        .meat-mobile-pagination-bullet-active,
        .groceries-mobile-pagination-bullet-active,
        .mobile-triple-pagination-bullet-active {
          background: #C29F6D;
          transform: scale(1.3);
        }
        
        .swiper-pagination {
          bottom: 12px !important;
        }
        
        .mobile-triple-slider .swiper-pagination {
          bottom: -30px !important;
          position: relative;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
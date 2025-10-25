"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

const heroSlides = [
  {
    id: 1,
    title: "Artisanal Handcrafted Goods",
    subtitle: "Discover unique, handmade treasures",
    description: "Explore our curated collection of artisanal products made with love and traditional craftsmanship.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
    cta: "Shop Collection",
    badge: "New Arrivals"
  },
  {
    id: 2,
    title: "Organic Farm Fresh",
    subtitle: "From farm to your table",
    description: "Premium organic produce and artisanal foods sourced directly from local farms and makers.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=600&fit=crop",
    cta: "Browse Markets",
    badge: "Fresh Daily"
  },
  {
    id: 3,
    title: "Sustainable Living",
    subtitle: "Eco-friendly choices for modern life",
    description: "Discover sustainable products that help you live more consciously while supporting local artisans.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop",
    cta: "Go Green",
    badge: "Eco-Friendly"
  }
];

export function HeroSlider() {
  return (
    <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden rounded-xl">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        loop={true}
        className="h-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl text-white">
                    {/* Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-foreground text-sm font-medium mb-4">
                      <Star className="h-3 w-3 mr-1" />
                      {slide.badge}
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
                      {slide.title}
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl lg:text-2xl mb-4 text-white/90 font-medium">
                      {slide.subtitle}
                    </p>
                    
                    {/* Description */}
                    <p className="text-base sm:text-lg mb-8 text-white/80 max-w-xl leading-relaxed">
                      {slide.description}
                    </p>
                    
                    {/* CTA Button */}
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      {slide.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Buttons */}
      <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 group">
        <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </button>
      
      <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 group">
        <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </button>
      
      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 20px !important;
        }
        
        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          margin: 0 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active-custom {
          background: white;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
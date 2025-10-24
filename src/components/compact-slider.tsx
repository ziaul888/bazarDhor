"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const slides = [
  {
    id: 1,
    title: "Fresh Organic Produce",
    subtitle: "Farm to Table",
    description: "Discover locally sourced, organic fruits and vegetables from trusted farmers in your area.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=300&fit=crop",
    cta: "Shop Fresh",
    badge: "New Arrivals"
  },
  {
    id: 2,
    title: "Handcrafted Artisan Goods",
    subtitle: "Made with Love",
    description: "Unique, handmade products crafted by local artisans using traditional techniques.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=300&fit=crop",
    cta: "Explore Crafts",
    badge: "Bestsellers"
  },
  {
    id: 3,
    title: "Sustainable Living",
    subtitle: "Eco-Friendly Choices",
    description: "Environmentally conscious products that help you live sustainably while supporting local makers.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=300&fit=crop",
    cta: "Go Green",
    badge: "Eco-Friendly"
  }
];

export function CompactSlider() {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              prevEl: '.compact-slider-prev',
              nextEl: '.compact-slider-next',
            }}
            pagination={{
              clickable: true,
              bulletClass: 'compact-slider-bullet',
              bulletActiveClass: 'compact-slider-bullet-active',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="rounded-xl overflow-hidden shadow-lg"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative h-64 sm:h-72 lg:h-80">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40" />
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex items-center">
                    <div className="w-full px-6 sm:px-8 lg:px-12">
                      <div className="max-w-lg text-white">
                        {/* Badge */}
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-foreground text-sm font-medium mb-3">
                          {slide.badge}
                        </div>
                        
                        {/* Subtitle */}
                        <p className="text-sm sm:text-base text-white/80 mb-2 font-medium">
                          {slide.subtitle}
                        </p>
                        
                        {/* Title */}
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                          {slide.title}
                        </h2>
                        
                        {/* Description */}
                        <p className="text-sm sm:text-base mb-4 text-white/90 leading-relaxed max-w-md">
                          {slide.description}
                        </p>
                        
                        {/* CTA Button */}
                        <Button 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          {slide.cta}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Buttons */}
          <button className="compact-slider-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 group">
            <ChevronLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </button>
          
          <button className="compact-slider-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 group">
            <ChevronRight className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
      
      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 16px !important;
        }
        
        .compact-slider-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .compact-slider-bullet-active {
          background: white;
          transform: scale(1.3);
        }
      `}</style>
    </section>
  );
}
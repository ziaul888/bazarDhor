"use client";

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { ArrowRight, Beef, Leaf, ShoppingCart } from 'lucide-react';
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

export function TripleSlider() {
  return (
    <section className="py-4 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {sliderData.map((category) => (
            <div key={category.id} className="bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Category Header */}
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center space-x-2">
                  <category.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                </div>
              </div>

              {/* Slider */}
              <div className="relative">
                <Swiper
                  modules={[Pagination, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={{
                    clickable: true,
                    bulletClass: `${category.id}-pagination-bullet`,
                    bulletActiveClass: `${category.id}-pagination-bullet-active`,
                  }}
                  autoplay={{
                    delay: 3000 + (sliderData.indexOf(category) * 1000), // Stagger autoplay
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  className="h-64"
                >
                  {category.slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                      <div className="relative h-full">
                        {/* Product Image */}
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-4">
                          {/* Badge */}
                          <div className="mb-2">
                            <span className="inline-block px-2 py-1 bg-primary/20 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-full border border-primary/30">
                              {slide.badge}
                            </span>
                          </div>

                          {/* Title & Price */}
                          <div className="text-white">
                            <h4 className="font-semibold text-lg mb-1">{slide.title}</h4>
                            <p className="text-sm text-white/90 mb-3">{slide.price}</p>

                            {/* CTA Button */}
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 text-sm font-medium"
                            >
                              View More
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Single Slider */}
        <div className="md:hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{
              clickable: true,
              bulletClass: 'mobile-triple-pagination-bullet',
              bulletActiveClass: 'mobile-triple-pagination-bullet-active',
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="mobile-triple-slider"
          >
            {sliderData.map((category) => (
              <SwiperSlide key={category.id}>
                <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
                  {/* Category Header */}
                  <div className="p-4 border-b bg-muted/30">
                    <div className="flex items-center space-x-2">
                      <category.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{category.title}</h3>
                    </div>
                  </div>

                  {/* Inner Slider for Category Products */}
                  <div className="relative">
                    <Swiper
                      modules={[Pagination, Autoplay]}
                      spaceBetween={0}
                      slidesPerView={1}
                      pagination={{
                        clickable: true,
                        bulletClass: `${category.id}-mobile-pagination-bullet`,
                        bulletActiveClass: `${category.id}-mobile-pagination-bullet-active`,
                      }}
                      autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                      }}
                      loop={true}
                      className="h-64"
                    >
                      {category.slides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                          <div className="relative h-full">
                            {/* Product Image */}
                            <Image
                              src={slide.image}
                              alt={slide.title}
                              fill
                              className="object-cover"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/30" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-4">
                              {/* Badge */}
                              <div className="mb-2">
                                <span className="inline-block px-2 py-1 bg-primary/20 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-full border border-primary/30">
                                  {slide.badge}
                                </span>
                              </div>

                              {/* Title & Price */}
                              <div className="text-white">
                                <h4 className="font-semibold text-lg mb-1">{slide.title}</h4>
                                <p className="text-sm text-white/90 mb-3">{slide.price}</p>

                                {/* CTA Button */}
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 text-sm font-medium"
                                >
                                  View More
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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
      `}</style>
    </section>
  );
}
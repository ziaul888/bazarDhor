"use client";

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const categories = [
  {
    id: 1,
    name: "Fresh Vegetables",
    description: "Organic vegetables, leafy greens, and seasonal produce",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    vendors: 85,
    rating: 4.8,
    icon: "🥬",
    popular: true
  },
  {
    id: 2,
    name: "Fresh Fruits",
    description: "Seasonal fruits, berries, and tropical varieties",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop",
    vendors: 72,
    rating: 4.9,
    icon: "🍎",
    popular: true
  },
  {
    id: 3,
    name: "Meat & Poultry",
    description: "Fresh cuts, chicken, beef, and specialty meats",
    image: "https://images.unsplash.com/photo-1588347818481-c7c1b6b8b4b4?w=400&h=300&fit=crop",
    vendors: 45,
    rating: 4.7,
    icon: "🥩",
    popular: true
  },
  {
    id: 4,
    name: "Seafood",
    description: "Fresh fish, shellfish, and marine delicacies",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop",
    vendors: 28,
    rating: 4.6,
    icon: "🐟",
    popular: false
  },
  {
    id: 5,
    name: "Dairy & Eggs",
    description: "Fresh milk, cheese, yogurt, and farm eggs",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
    vendors: 35,
    rating: 4.5,
    icon: "🥛",
    popular: false
  },
  {
    id: 6,
    name: "Grains & Pulses",
    description: "Rice, wheat, lentils, and organic grains",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    vendors: 42,
    rating: 4.4,
    icon: "🌾",
    popular: false
  },
  {
    id: 7,
    name: "Spices & Herbs",
    description: "Fresh herbs, ground spices, and seasonings",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
    vendors: 38,
    rating: 4.7,
    icon: "🌿",
    popular: false
  },
  {
    id: 8,
    name: "Bakery Items",
    description: "Fresh bread, pastries, and baked goods",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    vendors: 25,
    rating: 4.6,
    icon: "🥖",
    popular: false
  }
];

export function CategorySection() {
  return (
    <section className="py-4 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">Fresh groceries from local markets</p>
          </div>

          {/* Navigation Buttons - Desktop */}
          <div className="hidden sm:flex space-x-2">
            <button className="category-slider-prev w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="category-slider-next w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Categories Slider */}
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={3}
            navigation={{
              prevEl: '.category-slider-prev',
              nextEl: '.category-slider-next',
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 24,
              },
            }}
            loop={true}
            className="category-swiper"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <div className="group bg-card rounded-lg border overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer">
                  {/* Category Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                    {/* Category Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-lg shadow-sm">
                        {category.icon}
                      </div>
                    </div>
                  </div>

                  {/* Category Name */}
                  <div className="p-2 text-center">
                    <h3 className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-1">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Mobile Navigation Buttons */}
          <button className="category-slider-prev sm:hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm">
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button className="category-slider-next sm:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
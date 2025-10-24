"use client";

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Heart, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const products = [
  {
    id: 1,
    name: "Handwoven Basket",
    price: 45.99,
    originalPrice: 59.99,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    badge: "Bestseller",
    isLiked: false
  },
  {
    id: 2,
    name: "Organic Honey Jar",
    price: 18.50,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    badge: "New",
    isLiked: true
  },
  {
    id: 3,
    name: "Ceramic Coffee Mug",
    price: 24.99,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop",
    badge: "Handmade",
    isLiked: false
  },
  {
    id: 4,
    name: "Artisan Soap Set",
    price: 32.00,
    originalPrice: 40.00,
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    badge: "Sale",
    isLiked: false
  },
  {
    id: 5,
    name: "Wooden Cutting Board",
    price: 55.00,
    rating: 4.8,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop",
    badge: "Premium",
    isLiked: true
  },
  {
    id: 6,
    name: "Knitted Wool Scarf",
    price: 38.99,
    rating: 4.9,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop",
    badge: "Cozy",
    isLiked: false
  }
];

export function ProductCarousel() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Handpicked artisanal goods from local makers</p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="hidden sm:flex space-x-2">
            <button className="product-carousel-prev w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="product-carousel-next w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            prevEl: '.product-carousel-prev',
            nextEl: '.product-carousel-next',
          }}
          pagination={{
            clickable: true,
            bulletClass: 'product-pagination-bullet',
            bulletActiveClass: 'product-pagination-bullet-active',
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="pb-12"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="bg-card rounded-xl border hover:shadow-lg transition-all duration-300 group overflow-hidden">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.badge === 'Sale' ? 'bg-destructive text-destructive-foreground' :
                      product.badge === 'New' ? 'bg-success text-success-foreground' :
                      'bg-primary text-primary-foreground'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                  
                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-colors group/heart">
                    <Heart className={`h-4 w-4 transition-colors ${
                      product.isLiked 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-600 group-hover/heart:text-red-500'
                    }`} />
                  </button>
                  
                  {/* Quick Add Button */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Quick Add
                    </Button>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .product-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #C29F6D;
          opacity: 0.3;
          border-radius: 50%;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .product-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
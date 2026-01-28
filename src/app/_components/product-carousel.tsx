"use client";

import { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useRandomProducts } from '@/lib/api/hooks/useMarkets';
import { ProductCard } from '@/components/product-card';
import { ProductPriceDialog } from '@/components/product-price-dialog';

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

const IMAGE_BASE_URL = 'https://bazardor.chhagolnaiyasportareana.xyz/storage/';

export function ProductCarousel() {
  const { data: apiProducts, isLoading } = useRandomProducts();
  const [items, setItems] = useState<Array<{
    id: number | string;
    name: string;
    marketName: string;
    marketId?: number | string;
    currentPrice: number;
    image: string;
    category: string;
    priceChange: 'up' | 'down' | 'stable' | string;
    lastUpdated: string;
    unit?: string;
  }>>([]);
  const [selectedItem, setSelectedItem] = useState<(typeof items)[number] | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mappedProducts = useMemo(() => {
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts.map((p) => {
        const lowestPrice = p.market_prices[0];
        const hasDiscount = lowestPrice?.discount_price && lowestPrice.discount_price > 0;
        const currentPrice = hasDiscount ? lowestPrice.discount_price : (lowestPrice?.price || 0);
        const originalPrice = hasDiscount ? lowestPrice.price : null;

        return {
          id: p.id,
          name: p.name,
          marketName: lowestPrice?.market?.name || 'Local Market',
          marketId: lowestPrice?.market?.id,
          currentPrice,
          image: p.image_path ? (p.image_path.startsWith('http') ? p.image_path : `${IMAGE_BASE_URL}${p.image_path}`) : '',
          category: p.category?.name || 'Featured',
          priceChange: originalPrice && currentPrice < originalPrice ? 'down' : 'up',
          lastUpdated: lowestPrice?.last_update || 'Recently',
          unit: p.unit?.symbol || p.unit?.name || 'unit'
        };
      });
    }
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      marketName: 'Local Market',
      currentPrice: product.price,
      image: product.image,
      category: product.badge || 'Featured',
      priceChange: product.originalPrice && product.price < product.originalPrice ? 'down' : 'up',
      lastUpdated: 'Recently',
      unit: 'unit'
    }));
  }, [apiProducts]);

  useEffect(() => {
    setItems(mappedProducts);
  }, [mappedProducts]);

  const handleUpdatePrice = (item: (typeof items)[number]) => {
    setSelectedItem(item);
    setNewPrice(item.currentPrice.toString());
    setIsModalOpen(true);
  };

  const handleSavePrice = () => {
    if (!selectedItem) return;
    const parsed = parseFloat(newPrice);
    if (Number.isNaN(parsed)) return;
    setItems(prev =>
      prev.map(item =>
        item.id === selectedItem.id
          ? { ...item, currentPrice: parsed, lastUpdated: 'Just now' }
          : item
      )
    );
    setIsModalOpen(false);
  };

  const handlePredefinedAmount = (amount: number) => {
    if (selectedItem) {
      const currentPrice = parseFloat(newPrice) || selectedItem.currentPrice;
      const newPriceValue = Math.max(0, currentPrice + amount);
      setNewPrice(newPriceValue.toFixed(2));
    }
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading fresh products...</p>
        </div>
      </div>
    );
  }
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
          {items.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                item={product}
                onUpdatePrice={handleUpdatePrice}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <ProductPriceDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={selectedItem}
        newPrice={newPrice}
        onNewPriceChange={setNewPrice}
        onSave={handleSavePrice}
        onQuickAdjust={handlePredefinedAmount}
        disableSave={!newPrice || parseFloat(newPrice) <= 0}
      />

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

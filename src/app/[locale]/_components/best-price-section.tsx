"use client";

import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { useRandomProducts } from '@/lib/api/hooks/useMarkets';
import { ProductCard } from '@/components/product-card';

const bestPriceItems = [
    {
        id: 1,
        name: "Fresh Chicken (1kg)",
        marketName: "City Meat Market",
        currentPrice: 7.50,
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop",
        category: "Meat & Poultry",
        priceChange: "down",
        lastUpdated: "2 hours ago"
    },
    {
        id: 2,
        name: "Organic Tomatoes (500g)",
        marketName: "Green Valley Farm",
        currentPrice: 3.99,
        image: "https://images.unsplash.com/photo-1546470427-e5ac89cd0b31?w=300&h=300&fit=crop",
        category: "Vegetables",
        priceChange: "down",
        lastUpdated: "1 hour ago"
    },
    {
        id: 3,
        name: "Fresh Milk (1L)",
        marketName: "Dairy Fresh Co.",
        currentPrice: 2.99,
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop",
        category: "Dairy",
        priceChange: "up",
        lastUpdated: "3 hours ago"
    },
    {
        id: 4,
        name: "Basmati Rice (2kg)",
        marketName: "Grain House",
        currentPrice: 10.50,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop",
        category: "Grains",
        priceChange: "down",
        lastUpdated: "30 min ago"
    },
    {
        id: 5,
        name: "Fresh Salmon (500g)",
        marketName: "Ocean Fresh Market",
        currentPrice: 13.50,
        image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=300&fit=crop",
        category: "Seafood",
        priceChange: "up",
        lastUpdated: "4 hours ago"
    },
    {
        id: 6,
        name: "Mixed Vegetables (1kg)",
        marketName: "Farm Direct",
        currentPrice: 5.25,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop",
        category: "Vegetables",
        priceChange: "down",
        lastUpdated: "1 hour ago"
    },
    {
        id: 7,
        name: "Fresh Bread (1 loaf)",
        marketName: "Baker's Corner",
        currentPrice: 2.50,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop",
        category: "Bakery",
        priceChange: "up",
        lastUpdated: "45 min ago"
    },
    {
        id: 8,
        name: "Bananas (1kg)",
        marketName: "Tropical Fruits",
        currentPrice: 1.99,
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop",
        category: "Fruits",
        priceChange: "down",
        lastUpdated: "2 hours ago"
    },
    {
        id: 9,
        name: "Greek Yogurt (500g)",
        marketName: "Dairy Fresh Co.",
        currentPrice: 4.25,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop",
        category: "Dairy",
        priceChange: "up",
        lastUpdated: "1 hour ago"
    },
    {
        id: 10,
        name: "Olive Oil (500ml)",
        marketName: "Mediterranean Store",
        currentPrice: 8.99,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop",
        category: "Oils",
        priceChange: "down",
        lastUpdated: "3 hours ago"
    },
    {
        id: 11,
        name: "Fresh Eggs (12 pcs)",
        marketName: "Farm Fresh",
        currentPrice: 3.75,
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop",
        category: "Dairy",
        priceChange: "up",
        lastUpdated: "2 hours ago"
    },
    {
        id: 12,
        name: "Apples (1kg)",
        marketName: "Orchard Direct",
        currentPrice: 4.50,
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
        category: "Fruits",
        priceChange: "down",
        lastUpdated: "1 hour ago"
    }
];

const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';

type BestPriceItem = {
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
};

export function BestPriceSection() {
    const { data: apiProducts, isLoading } = useRandomProducts();
    const [items, setItems] = useState<BestPriceItem[]>([]);

    // Update items when API data changes
    useEffect(() => {
        if (apiProducts && apiProducts.length > 0) {
            const mapped = apiProducts.slice(0, 10).map((p) => {
                const lowestPrice = p.market_prices[0];
                const hasDiscount = lowestPrice?.discount_price && lowestPrice.discount_price > 0;

                return {
                    id: p.id,
                    name: p.name,
                    marketId: lowestPrice?.market?.id,
                    marketName: lowestPrice?.market?.name || 'Local Market',
                    currentPrice: hasDiscount ? lowestPrice.discount_price : (lowestPrice?.price || 0),
                    image: p.image_path ? (p.image_path.startsWith('http') ? p.image_path : `${IMAGE_BASE_URL}${p.image_path}`) : '',
                    category: p.category?.name || 'Fresh Items',
                    priceChange: Math.random() > 0.5 ? 'up' : 'down', // Local simulation for UI
                    lastUpdated: lowestPrice?.last_update || 'Recently',
                    unit: p.unit?.symbol || p.unit?.name || 'unit'
                };
            });
            setItems(mapped);
        } else if (!isLoading) {
            // Fallback if no products from API
            setItems(bestPriceItems.map(item => ({
                ...item,
                unit: 'unit'
            })));
        }
    }, [apiProducts, isLoading]);


    return (
        <section className="py-4 sm:py-8 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                        <Tag className="h-6 w-6 text-destructive" />
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Market Prices</h2>
                    </div>
                    <p className="text-muted-foreground">Real-time prices from local markets</p>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 animate-pulse">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="rounded-xl border bg-muted overflow-hidden">
                                <div className="h-32 sm:h-36 bg-muted-foreground/15" />
                                <div className="p-3 space-y-2">
                                    <div className="h-3.5 bg-muted-foreground/20 rounded w-3/4" />
                                    <div className="h-3 bg-muted-foreground/15 rounded w-1/2" />
                                    <div className="h-5 bg-muted-foreground/20 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4">
                        {items.map((item) => (
                            <ProductCard
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </div>
                )}

                {/* View All Button */}
                {/* <div className="text-center mt-6">
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                        View All Items
                    </button>
                </div> */}
            </div>
        </section>
    );
}

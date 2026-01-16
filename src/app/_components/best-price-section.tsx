"use client";

import Image from 'next/image';
import { TrendingUp, TrendingDown, Tag } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

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

export function BestPriceSection() {
    const [items, setItems] = useState(bestPriceItems);
    const [selectedItem, setSelectedItem] = useState<typeof bestPriceItems[0] | null>(null);
    const [newPrice, setNewPrice] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUpdatePrice = (item: typeof bestPriceItems[0]) => {
        setSelectedItem(item);
        setNewPrice(item.currentPrice.toString());
        setIsModalOpen(true);
    };

    const handleSavePrice = () => {
        if (selectedItem && newPrice) {
            const updatedItems = items.map(item =>
                item.id === selectedItem.id
                    ? { ...item, currentPrice: parseFloat(newPrice), lastUpdated: 'Just now' }
                    : item
            );
            setItems(updatedItems);
            setIsModalOpen(false);
            setSelectedItem(null);
            setNewPrice('');
        }
    };

    const handlePredefinedAmount = (amount: number) => {
        if (selectedItem) {
            const currentPrice = parseFloat(newPrice) || selectedItem.currentPrice;
            const newPriceValue = Math.max(0, currentPrice + amount);
            setNewPrice(newPriceValue.toFixed(2));
        }
    };

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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4">
                    {items.map((item) => (
                        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 py-0 gap-0">
                            {/* Product Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                                {/* Price Trend Badge */}
                                <div className="absolute top-1 right-1">
                                    <span className={`px-1.5 py-0.5 text-white text-xs font-bold rounded-full flex items-center space-x-1 ${item.priceChange === 'up' ? 'bg-red-500' : 'bg-green-500'
                                        }`}>
                                        {item.priceChange === 'up' ? (
                                            <TrendingUp className="h-2.5 w-2.5" />
                                        ) : (
                                            <TrendingDown className="h-2.5 w-2.5" />
                                        )}
                                    </span>
                                </div>
                                {/* Category Badge */}
                                <div className="absolute bottom-1 left-1">
                                    <span className="px-1.5 py-0.5 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            {/* Product Info */}
                            <CardContent className="p-2 sm:p-3">
                                {/* Item Name */}
                                <h3 className="text-xs sm:text-sm font-semibold mb-1 line-clamp-2">
                                    {item.name}
                                </h3>

                                {/* Market Name */}
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                                    {item.marketName}
                                </p>

                                {/* Current Price */}
                                <div className="mb-2">
                                    <span className="text-sm sm:text-base font-bold text-foreground">${item.currentPrice}</span>
                                </div>

                                {/* Last Updated */}
                                <div className="mb-2">
                                    <span className="text-xs text-muted-foreground">{item.lastUpdated}</span>
                                </div>

                                {/* Update Price Button */}
                                <button
                                    onClick={() => handleUpdatePrice(item)}
                                    className="w-full py-1.5 text-xs bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Update
                                </button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-6">
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                        View All Items
                    </button>
                </div>

                {/* Price Update Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Update Price</DialogTitle>
                        </DialogHeader>

                        {selectedItem && (
                            <div className="space-y-4">
                                {/* Product Info */}
                                <div className="flex items-center space-x-3">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                        <Image
                                            src={selectedItem.image}
                                            alt={selectedItem.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{selectedItem.name}</h3>
                                        <p className="text-xs text-muted-foreground">{selectedItem.marketName}</p>
                                        <p className="text-xs text-muted-foreground">Current: ${selectedItem.currentPrice}</p>
                                    </div>
                                </div>

                                {/* Quick Adjustment Buttons */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Quick Adjustments</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePredefinedAmount(-0.50)}
                                            className="text-xs"
                                        >
                                            -$0.50
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePredefinedAmount(-0.25)}
                                            className="text-xs"
                                        >
                                            -$0.25
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePredefinedAmount(-0.10)}
                                            className="text-xs"
                                        >
                                            -$0.10
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePredefinedAmount(0.10)}
                                            className="text-xs"
                                        >
                                            +$0.10
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePredefinedAmount(0.25)}
                                            className="text-xs"
                                        >
                                            +$0.25
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePredefinedAmount(0.50)}
                                            className="text-xs"
                                        >
                                            +$0.50
                                        </Button>
                                    </div>
                                </div>

                                {/* Price Input */}
                                <div className="space-y-2">
                                    <label htmlFor="price" className="text-sm font-medium">
                                        New Price ($)
                                    </label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        placeholder="Enter new price"
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSavePrice}
                                disabled={!newPrice || parseFloat(newPrice) <= 0}
                            >
                                Update Price
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}
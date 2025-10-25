"use client";

import { useState } from 'react';
import { Search, ArrowLeft, MapPin, Clock, Star, Users, Car, CreditCard, Truck, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MarketSelector } from './_components/market-selector';
import { ComparisonTable } from './_components/comparison-table';

const allMarkets = [
  {
    id: 1,
    name: "Downtown Farmers Market",
    address: "123 Main Street, Downtown",
    distance: "0.5 km",
    openTime: "8:00 AM - 6:00 PM",
    rating: 4.8,
    reviews: 245,
    vendors: 32,
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
    isOpen: true,
    specialties: ["Fresh Produce", "Organic Food"],
    featured: true,
    type: "Farmers Market",
    priceRange: "$$",
    hasParking: true,
    acceptsCards: true,
    hasDelivery: false,
    avgPrices: {
      vegetables: 4.50,
      fruits: 3.20,
      meat: 12.99,
      dairy: 3.50
    },
    openDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    established: "2015",
    marketSize: "Large"
  },
  {
    id: 2,
    name: "Riverside Organic Market",
    address: "456 River Road, Riverside",
    distance: "1.2 km",
    openTime: "9:00 AM - 5:00 PM",
    rating: 4.7,
    reviews: 189,
    vendors: 28,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    isOpen: true,
    specialties: ["Organic Food", "Local Produce"],
    featured: false,
    type: "Organic Market",
    priceRange: "$$$",
    hasParking: true,
    acceptsCards: true,
    hasDelivery: true,
    avgPrices: {
      vegetables: 5.20,
      fruits: 4.10,
      meat: 15.99,
      dairy: 4.25
    },
    openDays: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    established: "2018",
    marketSize: "Medium"
  },
  {
    id: 3,
    name: "Central Plaza Market",
    address: "789 Plaza Avenue, Central",
    distance: "2.1 km",
    openTime: "7:00 AM - 7:00 PM",
    rating: 4.6,
    reviews: 156,
    vendors: 45,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop",
    isOpen: false,
    specialties: ["Groceries", "Meat & Poultry"],
    featured: false,
    type: "Grocery Market",
    priceRange: "$",
    hasParking: false,
    acceptsCards: true,
    hasDelivery: false,
    avgPrices: {
      vegetables: 3.99,
      fruits: 2.80,
      meat: 10.50,
      dairy: 2.99
    },
    openDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    established: "2012",
    marketSize: "Large"
  },
  {
    id: 4,
    name: "Sunset Weekend Market",
    address: "321 Sunset Boulevard, West",
    distance: "3.5 km",
    openTime: "10:00 AM - 4:00 PM",
    rating: 4.9,
    reviews: 298,
    vendors: 38,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    isOpen: true,
    specialties: ["Street Food", "Artisan Goods"],
    featured: true,
    type: "Weekend Market",
    priceRange: "$$",
    hasParking: true,
    acceptsCards: false,
    hasDelivery: false,
    avgPrices: {
      vegetables: 4.75,
      fruits: 3.60,
      meat: 14.25,
      dairy: 3.80
    },
    openDays: ["Sat", "Sun"],
    established: "2020",
    marketSize: "Medium"
  }
];

export default function CompareMarketsPage() {
  const [selectedMarket1, setSelectedMarket1] = useState(allMarkets[0]);
  const [selectedMarket2, setSelectedMarket2] = useState(allMarkets[1]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/markets">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Markets
              </Button>
            </Link>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">Compare Markets</h1>
            <p className="text-muted-foreground">
              Compare prices, features, and details between two local markets
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Market Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Select First Market</h2>
            <MarketSelector
              markets={allMarkets}
              selectedMarket={selectedMarket1}
              onMarketSelect={setSelectedMarket1}
              excludeMarketId={selectedMarket2.id}
            />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Second Market</h2>
            <MarketSelector
              markets={allMarkets}
              selectedMarket={selectedMarket2}
              onMarketSelect={setSelectedMarket2}
              excludeMarketId={selectedMarket1.id}
            />
          </div>
        </div>

        {/* Comparison Table */}
        <ComparisonTable 
          market1={selectedMarket1}
          market2={selectedMarket2}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild>
            <Link href={`/markets/${selectedMarket1.id}`}>
              View {selectedMarket1.name}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/markets/${selectedMarket2.id}`}>
              View {selectedMarket2.name}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
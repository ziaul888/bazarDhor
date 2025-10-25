"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Heart, MapPin, Clock, Star, Users, Bell, BellOff, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const favoriteMarkets = [
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
    notifications: true,
    lastVisited: "2 days ago",
    totalVisits: 8
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
    notifications: true,
    lastVisited: "1 week ago",
    totalVisits: 5
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
    notifications: false,
    lastVisited: "2 weeks ago",
    totalVisits: 3
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
    notifications: true,
    lastVisited: "3 days ago",
    totalVisits: 12
  }
];

export function FavoriteMarkets() {
  const [markets, setMarkets] = useState(favoriteMarkets);

  const toggleNotifications = (marketId: number) => {
    setMarkets(prev => prev.map(market => 
      market.id === marketId 
        ? { ...market, notifications: !market.notifications }
        : market
    ));
  };

  const removeFavorite = (marketId: number) => {
    setMarkets(prev => prev.filter(market => market.id !== marketId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Favorite Markets</h3>
          <p className="text-sm text-muted-foreground">
            Markets you've saved for quick access and updates
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {markets.length} favorites
        </div>
      </div>

      {/* Favorites Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{markets.length}</div>
              <div className="text-sm text-muted-foreground">Favorite Markets</div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {markets.reduce((sum, market) => sum + market.totalVisits, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Visits</div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {markets.filter(market => market.notifications).length}
              </div>
              <div className="text-sm text-muted-foreground">With Notifications</div>
            </div>
          </div>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {markets.map((market) => (
          <div key={market.id} className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Market Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={market.image}
                alt={market.name}
                fill
                className="object-cover"
              />

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  market.isOpen
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {market.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>

              {/* Favorite Actions */}
              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={() => toggleNotifications(market.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    market.notifications
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/90 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {market.notifications ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <BellOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => removeFavorite(market.id)}
                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
              </div>

              {/* Distance Badge */}
              <div className="absolute bottom-3 right-3">
                <span className="px-2 py-1 bg-black/70 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                  {market.distance}
                </span>
              </div>
            </div>

            {/* Market Info */}
            <div className="p-4">
              {/* Market Name & Rating */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                    {market.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{market.address}</p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{market.rating}</span>
                  <span className="text-xs text-muted-foreground">({market.reviews})</span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{market.openTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{market.vendors} vendors</span>
                </div>
              </div>

              {/* Visit Stats */}
              <div className="flex items-center justify-between mb-3 p-2 bg-muted/30 rounded-lg">
                <div className="text-sm">
                  <span className="font-medium">{market.totalVisits}</span>
                  <span className="text-muted-foreground"> visits</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last: {market.lastVisited}
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1 mb-4">
                {market.specialties.slice(0, 2).map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button className="flex-1" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Market
                </Button>
                <Button variant="outline" size="sm">
                  Directions
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {markets.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No favorite markets yet</h3>
          <p className="text-muted-foreground mb-4">
            Start exploring markets and add them to your favorites for quick access.
          </p>
          <Button>
            Explore Markets
          </Button>
        </div>
      )}
    </div>
  );
}
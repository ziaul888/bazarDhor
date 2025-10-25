"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, MapPin, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Market {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  vendors: number;
  image: string;
  type: string;
  isOpen: boolean;
}

interface MarketSelectorProps {
  markets: Market[];
  selectedMarket: Market;
  onMarketSelect: (market: Market) => void;
  excludeMarketId?: number;
}

export function MarketSelector({ 
  markets, 
  selectedMarket, 
  onMarketSelect, 
  excludeMarketId 
}: MarketSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableMarkets = markets.filter(market => market.id !== excludeMarketId);

  return (
    <div className="relative">
      {/* Selected Market Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-card border rounded-xl hover:bg-accent transition-colors text-left"
      >
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={selectedMarket.image}
              alt={selectedMarket.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{selectedMarket.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{selectedMarket.type}</p>
            
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{selectedMarket.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{selectedMarket.distance}</span>
              </div>
            </div>
          </div>
          
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-xl shadow-lg z-10 max-h-80 overflow-y-auto">
          {availableMarkets.map((market) => (
            <button
              key={market.id}
              onClick={() => {
                onMarketSelect(market);
                setIsOpen(false);
              }}
              className="w-full p-4 hover:bg-accent transition-colors text-left border-b border-border last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={market.image}
                    alt={market.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{market.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{market.type}</p>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{market.rating}</span>
                      <span className="text-xs text-muted-foreground">({market.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{market.vendors} vendors</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">{market.distance}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    market.isOpen 
                      ? 'bg-success/10 text-success' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {market.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
"use client";

import { useState } from 'react';
import { X, MapPin, Clock, Star, DollarSign, Car, CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketFiltersProps {
  onFilterChange: (filters: Record<string, unknown>) => void;
  isMobile?: boolean;
}

export function MarketFilters({ onFilterChange, isMobile = false }: MarketFiltersProps) {
  const [filters, setFilters] = useState({
    isOpen: false,
    featured: false,
    distance: '',
    rating: '',
    priceRange: [] as string[],
    marketType: [] as string[],
    features: [] as string[]
  });

  const marketTypes = [
    'Farmers Market',
    'Organic Market', 
    'Grocery Market',
    'Weekend Market',
    'Artisan Market',
    'Specialty Market',
    'Seafood Market'
  ];

  const priceRanges = ['$', '$$', '$$$'];

  const features = [
    { id: 'hasParking', label: 'Parking Available', icon: Car },
    { id: 'acceptsCards', label: 'Accepts Cards', icon: CreditCard },
    { id: 'hasDelivery', label: 'Delivery Available', icon: Truck }
  ];

  const updateFilter = (key: string, value: string | boolean | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const currentArray = filters[key as keyof typeof filters] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilter(key, newArray);
  };

  const clearFilters = () => {
    const clearedFilters = {
      isOpen: false,
      featured: false,
      distance: '',
      rating: '',
      priceRange: [],
      marketType: [],
      features: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value
  );

  return (
    <div className={`${isMobile ? 'space-y-6' : 'bg-card rounded-xl border p-6 space-y-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Quick Filters</h4>
        
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isOpen}
              onChange={(e) => updateFilter('isOpen', e.target.checked)}
              className="rounded border-border"
            />
            <Clock className="h-4 w-4 text-success" />
            <span className="text-sm">Open Now</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={(e) => updateFilter('featured', e.target.checked)}
              className="rounded border-border"
            />
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm">Featured Markets</span>
          </label>
        </div>
      </div>

      {/* Distance */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Distance
        </h4>
        <select
          value={filters.distance}
          onChange={(e) => updateFilter('distance', e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-background text-sm"
        >
          <option value="">Any Distance</option>
          <option value="1">Within 1 km</option>
          <option value="2">Within 2 km</option>
          <option value="5">Within 5 km</option>
          <option value="10">Within 10 km</option>
        </select>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center">
          <Star className="h-4 w-4 mr-2" />
          Minimum Rating
        </h4>
        <select
          value={filters.rating}
          onChange={(e) => updateFilter('rating', e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-background text-sm"
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="4.0">4.0+ Stars</option>
          <option value="3.5">3.5+ Stars</option>
          <option value="3.0">3.0+ Stars</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center">
          <DollarSign className="h-4 w-4 mr-2" />
          Price Range
        </h4>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range) => (
            <button
              key={range}
              onClick={() => toggleArrayFilter('priceRange', range)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                filters.priceRange.includes(range)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Market Type */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Market Type</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {marketTypes.map((type) => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.marketType.includes(type)}
                onChange={() => toggleArrayFilter('marketType', type)}
                className="rounded border-border"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Features</h4>
        <div className="space-y-2">
          {features.map((feature) => (
            <label key={feature.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.features.includes(feature.id)}
                onChange={() => toggleArrayFilter('features', feature.id)}
                className="rounded border-border"
              />
              <feature.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{feature.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters Count */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {Object.values(filters).flat().filter(Boolean).length} filters active
            </span>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Reset All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
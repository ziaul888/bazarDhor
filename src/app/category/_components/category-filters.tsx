"use client";

import { useState } from 'react';
import { X, TrendingUp, TrendingDown, Star, DollarSign, Package, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryFiltersProps {
  onFilterChange: (filters: Record<string, unknown>) => void;
  isMobile?: boolean;
}

export function CategoryFilters({ onFilterChange, isMobile = false }: CategoryFiltersProps) {
  const [filters, setFilters] = useState({
    popular: false,
    priceChange: '',
    priceRange: '',
    productCount: '',
    marketCount: ''
  });

  const priceRanges = [
    { label: 'Under $5', value: 'under-5' },
    { label: '$5 - $10', value: '5-10' },
    { label: '$10 - $20', value: '10-20' },
    { label: 'Over $20', value: 'over-20' }
  ];

  const productCounts = [
    { label: '10+ Products', value: '10+' },
    { label: '25+ Products', value: '25+' },
    { label: '50+ Products', value: '50+' },
    { label: '75+ Products', value: '75+' }
  ];

  const marketCounts = [
    { label: '10+ Markets', value: '10+' },
    { label: '20+ Markets', value: '20+' },
    { label: '30+ Markets', value: '30+' },
    { label: '40+ Markets', value: '40+' }
  ];

  const updateFilter = (key: string, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      popular: false,
      priceChange: '',
      priceRange: '',
      productCount: '',
      marketCount: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    typeof value === 'boolean' ? value : value !== ''
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
              checked={filters.popular}
              onChange={(e) => updateFilter('popular', e.target.checked)}
              className="rounded border-border"
            />
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm">Popular Categories</span>
          </label>
        </div>
      </div>

      {/* Price Trend */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Price Trend
        </h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="priceChange"
              value=""
              checked={filters.priceChange === ''}
              onChange={(e) => updateFilter('priceChange', e.target.value)}
              className="rounded-full border-border"
            />
            <span className="text-sm">All Trends</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="priceChange"
              value="up"
              checked={filters.priceChange === 'up'}
              onChange={(e) => updateFilter('priceChange', e.target.value)}
              className="rounded-full border-border"
            />
            <TrendingUp className="h-4 w-4 text-red-500" />
            <span className="text-sm">Prices Going Up</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="priceChange"
              value="down"
              checked={filters.priceChange === 'down'}
              onChange={(e) => updateFilter('priceChange', e.target.value)}
              className="rounded-full border-border"
            />
            <TrendingDown className="h-4 w-4 text-green-500" />
            <span className="text-sm">Prices Going Down</span>
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center">
          <DollarSign className="h-4 w-4 mr-2" />
          Average Price Range
        </h4>
        <select
          value={filters.priceRange}
          onChange={(e) => updateFilter('priceRange', e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-background text-sm"
        >
          <option value="">Any Price Range</option>
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Product Count */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center">
          <Package className="h-4 w-4 mr-2" />
          Number of Products
        </h4>
        <select
          value={filters.productCount}
          onChange={(e) => updateFilter('productCount', e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-background text-sm"
        >
          <option value="">Any Amount</option>
          {productCounts.map((count) => (
            <option key={count.value} value={count.value}>
              {count.label}
            </option>
          ))}
        </select>
      </div>

      {/* Market Count */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Available in Markets
        </h4>
        <select
          value={filters.marketCount}
          onChange={(e) => updateFilter('marketCount', e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-background text-sm"
        >
          <option value="">Any Number</option>
          {marketCounts.map((count) => (
            <option key={count.value} value={count.value}>
              {count.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Count */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {Object.values(filters).filter(value => 
                typeof value === 'boolean' ? value : value !== ''
              ).length} filters active
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
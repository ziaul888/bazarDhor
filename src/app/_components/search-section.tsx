"use client";

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchSectionProps {
  isVisible: boolean;
  onClose: () => void;
}



export function SearchSection({ isVisible, onClose }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div 
      className={`bg-card/95 backdrop-blur-sm transition-all duration-500 ease-in-out overflow-hidden ${
        isVisible 
          ? 'max-h-[200px] opacity-100 translate-y-0' 
          : 'max-h-0 opacity-0 -translate-y-4'
      }`}
    >
      <div className={`container mx-auto px-4 py-4 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between mb-4 transition-all duration-500 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Search Local Markets & Groceries</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Input */}
        <div className={`relative transition-all duration-500 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for vegetables, meat, dairy, grains, or markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background transition-all duration-300 ${
                isVisible ? 'scale-100' : 'scale-95'
              }`}
            />
          </div>
          
          {/* Quick Filters */}
          <div className="flex items-center space-x-2 mt-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {["Nearby Markets", "Open Now", "Best Prices", "Fresh Today", "Organic Only"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedFilters.includes(filter)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:border-primary/50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>



        {/* Search Button */}
        {searchQuery && (
          <div className={`mt-4 flex justify-center transition-all duration-500 delay-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              <Search className="h-4 w-4 mr-2" />
              Search &quot;{searchQuery}&quot;
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
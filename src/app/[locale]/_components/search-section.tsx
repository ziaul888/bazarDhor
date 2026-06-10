"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchSectionProps {
  isVisible: boolean;
  onClose: () => void;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'market' | 'category';
  icon: string;
}

const searchSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'Fresh tomatoes', type: 'product', icon: '🍅' },
  { id: '2', text: 'Organic vegetables', type: 'category', icon: '🥬' },
  { id: '3', text: 'Central Market', type: 'market', icon: '🏪' },
  { id: '4', text: 'Local dairy products', type: 'category', icon: '🥛' },
  { id: '5', text: 'Farmers Market Downtown', type: 'market', icon: '🌾' },
  { id: '6', text: 'Fresh seafood', type: 'product', icon: '🐟' },
];

const recentSearches = [
  'Fresh vegetables',
  'Organic fruits',
  'Local bakery',
  'Meat market'
];

export function SearchSection({ isVisible, onClose }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  }, [isVisible]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);



  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Add to recent searches (in a real app, this would be stored)
      console.log('Searching for:', searchQuery);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className={`bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 backdrop-blur-md border-b border-border/30 shadow-lg transition-all duration-500 ease-in-out overflow-hidden ${isVisible
        ? 'max-h-[400px] opacity-100 translate-y-0'
        : 'max-h-0 opacity-0 -translate-y-4'
        }`}
    >
      <div className={`container mx-auto px-4 py-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
        {/* Header */}
        <div className={`flex items-center justify-between mb-6 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Find Fresh Groceries</h2>
              <p className="text-sm text-muted-foreground">Search local markets and products</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Input with Suggestions */}
        <div className={`relative transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for vegetables, meat, dairy, markets, or anything fresh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => !searchQuery && setShowSuggestions(false)}
              className={`w-full pl-12 pr-12 py-4 border-2 border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background/80 backdrop-blur-sm transition-all duration-300 text-base placeholder:text-muted-foreground/70 ${isVisible ? 'scale-100' : 'scale-95'
                }`}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/50 rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-sm">
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-3">Suggestions</div>
                {filteredSuggestions.slice(0, 5).map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-muted/50 rounded-lg transition-colors text-left"
                  >
                    <span className="text-lg">{suggestion.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{suggestion.text}</div>
                      <div className="text-xs text-muted-foreground capitalize">{suggestion.type}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches - Show when input is empty and focused */}
          {!searchQuery && !showSuggestions && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-3">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(search)}
                    className="px-3 py-1.5 text-sm bg-muted/50 hover:bg-muted rounded-full transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}


        </div>

        {/* Enhanced Search Button */}
        <div className={`mt-6 flex justify-center transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
          <Button 
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="h-4 w-4 mr-2" />
            {searchQuery ? `Search "${searchQuery}"` : 'Start Searching'}
          </Button>
        </div>
      </div>
    </div>
  );
}
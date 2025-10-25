"use client";

import { useState } from 'react';
import { TrendingUp, Star, Heart, MapPin, ShoppingCart, MessageSquare, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const activityData = [
  {
    id: 1,
    type: 'price_update',
    title: 'Updated tomato prices at Downtown Market',
    description: 'Changed price from $4.99 to $3.99 per kg',
    timestamp: '2 hours ago',
    icon: TrendingUp,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-500/10'
  },
  {
    id: 2,
    type: 'review',
    title: 'Reviewed Riverside Organic Market',
    description: 'Gave 5 stars - "Great selection of organic produce!"',
    timestamp: '1 day ago',
    icon: Star,
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-500/10'
  },
  {
    id: 3,
    type: 'favorite',
    title: 'Added Central Plaza Market to favorites',
    description: 'Now following updates from this market',
    timestamp: '3 days ago',
    icon: Heart,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-500/10'
  },
  {
    id: 4,
    type: 'visit',
    title: 'Visited Sunset Weekend Market',
    description: 'Checked in and browsed 12 vendors',
    timestamp: '5 days ago',
    icon: MapPin,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 5,
    type: 'price_update',
    title: 'Updated chicken prices at City Meat Market',
    description: 'Changed price from $8.99 to $7.50 per kg',
    timestamp: '1 week ago',
    icon: TrendingUp,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-500/10'
  },
  {
    id: 6,
    type: 'review',
    title: 'Reviewed Fresh Valley Market',
    description: 'Gave 4 stars - "Good variety but could be fresher"',
    timestamp: '1 week ago',
    icon: Star,
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-500/10'
  },
  {
    id: 7,
    type: 'comment',
    title: 'Commented on Heritage Square Market',
    description: 'Added tip: "Best time to visit is early morning for freshest items"',
    timestamp: '2 weeks ago',
    icon: MessageSquare,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-500/10'
  },
  {
    id: 8,
    type: 'purchase',
    title: 'Made purchase at Downtown Market',
    description: 'Bought organic vegetables worth $24.50',
    timestamp: '2 weeks ago',
    icon: ShoppingCart,
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-500/10'
  }
];

const filterOptions = [
  { value: 'all', label: 'All Activity' },
  { value: 'price_update', label: 'Price Updates' },
  { value: 'review', label: 'Reviews' },
  { value: 'favorite', label: 'Favorites' },
  { value: 'visit', label: 'Market Visits' },
  { value: 'comment', label: 'Comments' },
  { value: 'purchase', label: 'Purchases' }
];

export function ActivityHistory() {
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredActivity = filter === 'all' 
    ? activityData 
    : activityData.filter(item => item.type === filter);

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold">Activity History</h3>
          <p className="text-sm text-muted-foreground">
            Your recent interactions and contributions to the community
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="hidden sm:block px-3 py-2 border border-border rounded-md bg-background text-sm"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Filter Dropdown */}
      {showFilters && (
        <div className="sm:hidden bg-card border rounded-lg p-4">
          <div className="grid grid-cols-2 gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(option.value);
                  setShowFilters(false);
                }}
                className={`p-2 text-sm rounded-md transition-colors ${
                  filter === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border text-center">
          <div className="text-2xl font-bold text-green-600">47</div>
          <div className="text-sm text-muted-foreground">Price Updates</div>
        </div>
        <div className="bg-card rounded-lg p-4 border text-center">
          <div className="text-2xl font-bold text-yellow-600">23</div>
          <div className="text-sm text-muted-foreground">Reviews Written</div>
        </div>
        <div className="bg-card rounded-lg p-4 border text-center">
          <div className="text-2xl font-bold text-red-600">8</div>
          <div className="text-sm text-muted-foreground">Favorite Markets</div>
        </div>
        <div className="bg-card rounded-lg p-4 border text-center">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-sm text-muted-foreground">Markets Visited</div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-card rounded-xl border">
        <div className="p-6">
          <div className="space-y-4">
            {filteredActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`w-10 h-10 ${activity.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredActivity.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No activity found</h3>
              <p className="text-muted-foreground">
                No activities match the selected filter. Try selecting a different filter.
              </p>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredActivity.length > 0 && (
          <div className="border-t p-4 text-center">
            <Button variant="outline" size="sm">
              Load More Activity
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
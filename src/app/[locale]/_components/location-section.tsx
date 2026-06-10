"use client";

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddItem } from '@/components/add-item-context';
import { useZone } from '@/providers/zone-provider';

export function LocationSection() {
  const { zone, isLoading, error, refetchZone } = useZone();
  const { openAddDrawer } = useAddItem();
  const [locationStats, setLocationStats] = useState({
    markets: 0,
    vendors: 0,
    status: "Loading..."
  });

  // Mock stats based on zone - in real app this would come from API
  useEffect(() => {
    if (zone) {
      // Simulate fetching stats for the zone
      setLocationStats({
        markets: Math.floor(Math.random() * 20) + 5,
        vendors: Math.floor(Math.random() * 200) + 50,
        status: "Open Now"
      });
    }
  }, [zone]);

  return (
    <section className="py-3 sm:py-6 sm:border-b">
      <div className="container mx-auto px-0 sm:px-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-4 sm:px-0">

          {/* Left Side - Zone Display */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            {/* Current Zone */}
            <div className="flex items-center space-x-3 px-4 py-2.5 bg-card border border-border rounded-lg w-full sm:w-auto min-w-[280px]">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                {isLoading ? (
                  <div className="font-medium text-sm text-muted-foreground">Detecting zone...</div>
                ) : error ? (
                  <div className="font-medium text-sm text-destructive">Zone detection failed</div>
                ) : zone ? (
                  <>
                    <div className="font-medium text-sm truncate">{zone.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {zone.description || 'Your current zone'}
                    </div>
                  </>
                ) : (
                  <div className="font-medium text-sm text-muted-foreground">No zone detected</div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={refetchZone}
                disabled={isLoading}
                className="h-6 w-6 flex-shrink-0"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {/* Zone Stats */}
            <div className="flex items-center space-x-6 text-sm sm:ml-4">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Navigation className="h-4 w-4" />
                <span>{locationStats.markets} Markets</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span className={`font-medium ${locationStats.status.includes('Open') ? 'text-success' : 'text-warning'}`}>
                  {locationStats.status}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Quick Actions */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end mt-4 sm:mt-0">
            <Button 
              size="sm" 
              onClick={openAddDrawer}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground text-sm shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
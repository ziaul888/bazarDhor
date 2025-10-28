"use client";

import { useState } from 'react';
import { MapPin, ChevronDown, Navigation, Clock, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddItem } from '@/components/add-item-context';

const locations = [
  {
    name: "New York, NY",
    markets: 12,
    vendors: 150,
    distance: "2.3 miles",
    status: "Open Now"
  },
  {
    name: "Los Angeles, CA",
    markets: 8,
    vendors: 95,
    distance: "1.8 miles",
    status: "Open Now"
  },
  {
    name: "Chicago, IL",
    markets: 15,
    vendors: 180,
    distance: "3.1 miles",
    status: "Closes 6 PM"
  },
  {
    name: "Houston, TX",
    markets: 6,
    vendors: 75,
    distance: "4.2 miles",
    status: "Open Now"
  },
  {
    name: "Phoenix, AZ",
    markets: 9,
    vendors: 110,
    distance: "2.7 miles",
    status: "Open Now"
  },
  {
    name: "Philadelphia, PA",
    markets: 11,
    vendors: 125,
    distance: "1.5 miles",
    status: "Closes 7 PM"
  }
];

export function LocationSection() {
  const [currentLocation, setCurrentLocation] = useState(locations[0]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const { openAddDrawer } = useAddItem();

  return (
    <section className="py-3 sm:py-6 sm:border-b">
      <div className="container mx-auto px-0 sm:px-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 px-4 sm:px-0">

          {/* Left Side - Location Selector */}
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            {/* Current Location */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center space-x-3 px-4 py-2.5 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors w-full sm:min-w-[200px]"
              >
                <div className="flex items-center space-x-2 flex-1">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{currentLocation.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{currentLocation.distance} away</div>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ${isLocationOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Location Dropdown */}
              {isLocationOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-20 w-full sm:min-w-[280px]">
                  {locations.map((location) => (
                    <button
                      key={location.name}
                      onClick={() => {
                        setCurrentLocation(location);
                        setIsLocationOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{location.name}</div>
                          <div className="text-xs text-muted-foreground">{location.distance} • {location.markets} markets</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-medium ${location.status.includes('Open') ? 'text-success' : 'text-warning'}`}>
                            {location.status}
                          </div>
                          <div className="text-xs text-muted-foreground">{location.vendors} vendors</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location Stats */}
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Navigation className="h-4 w-4" />
                <span>{currentLocation.markets} Markets</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span className={`font-medium ${currentLocation.status.includes('Open') ? 'text-success' : 'text-warning'}`}>
                  {currentLocation.status}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Quick Actions */}
          <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:items-center sm:space-x-3 sm:w-auto sm:justify-end">
            <Button variant="outline" size="sm" className="text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              View Map
            </Button>
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
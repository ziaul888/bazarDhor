"use client";

import Image from 'next/image';
import { MapPin, Clock, Star, Users, Car, CreditCard, Truck, Check, X, Calendar, Building, DollarSign } from 'lucide-react';

interface Market {
  id: number;
  name: string;
  address: string;
  distance: string;
  openTime: string;
  rating: number;
  reviews: number;
  vendors: number;
  image: string;
  isOpen: boolean;
  specialties: string[];
  type: string;
  priceRange: string;
  hasParking: boolean;
  acceptsCards: boolean;
  hasDelivery: boolean;
  avgPrices: {
    vegetables: number;
    fruits: number;
    meat: number;
    dairy: number;
  };
  openDays: string[];
  established: string;
  marketSize: string;
}

interface ComparisonTableProps {
  market1: Market;
  market2: Market;
}

export function ComparisonTable({ market1, market2 }: ComparisonTableProps) {
  const comparisonRows = [
    {
      category: "Basic Information",
      items: [
        {
          label: "Market Type",
          icon: Building,
          market1Value: market1.type,
          market2Value: market2.type,
          type: "text"
        },
        {
          label: "Distance",
          icon: MapPin,
          market1Value: market1.distance,
          market2Value: market2.distance,
          type: "text"
        },
        {
          label: "Opening Hours",
          icon: Clock,
          market1Value: market1.openTime,
          market2Value: market2.openTime,
          type: "text"
        },
        {
          label: "Open Days",
          icon: Calendar,
          market1Value: market1.openDays.join(", "),
          market2Value: market2.openDays.join(", "),
          type: "text"
        },
        {
          label: "Established",
          icon: Building,
          market1Value: market1.established,
          market2Value: market2.established,
          type: "text"
        }
      ]
    },
    {
      category: "Ratings & Reviews",
      items: [
        {
          label: "Rating",
          icon: Star,
          market1Value: market1.rating,
          market2Value: market2.rating,
          type: "rating"
        },
        {
          label: "Total Reviews",
          icon: Users,
          market1Value: market1.reviews,
          market2Value: market2.reviews,
          type: "number"
        },
        {
          label: "Number of Vendors",
          icon: Users,
          market1Value: market1.vendors,
          market2Value: market2.vendors,
          type: "number"
        },
        {
          label: "Market Size",
          icon: Building,
          market1Value: market1.marketSize,
          market2Value: market2.marketSize,
          type: "text"
        }
      ]
    },
    {
      category: "Features & Services",
      items: [
        {
          label: "Parking Available",
          icon: Car,
          market1Value: market1.hasParking,
          market2Value: market2.hasParking,
          type: "boolean"
        },
        {
          label: "Accepts Cards",
          icon: CreditCard,
          market1Value: market1.acceptsCards,
          market2Value: market2.acceptsCards,
          type: "boolean"
        },
        {
          label: "Delivery Service",
          icon: Truck,
          market1Value: market1.hasDelivery,
          market2Value: market2.hasDelivery,
          type: "boolean"
        }
      ]
    },
    {
      category: "Average Prices",
      items: [
        {
          label: "Vegetables (per kg)",
          icon: DollarSign,
          market1Value: `$${market1.avgPrices.vegetables}`,
          market2Value: `$${market2.avgPrices.vegetables}`,
          type: "price",
          compareValues: [market1.avgPrices.vegetables, market2.avgPrices.vegetables]
        },
        {
          label: "Fruits (per kg)",
          icon: DollarSign,
          market1Value: `$${market1.avgPrices.fruits}`,
          market2Value: `$${market2.avgPrices.fruits}`,
          type: "price",
          compareValues: [market1.avgPrices.fruits, market2.avgPrices.fruits]
        },
        {
          label: "Meat (per kg)",
          icon: DollarSign,
          market1Value: `$${market1.avgPrices.meat}`,
          market2Value: `$${market2.avgPrices.meat}`,
          type: "price",
          compareValues: [market1.avgPrices.meat, market2.avgPrices.meat]
        },
        {
          label: "Dairy (per L)",
          icon: DollarSign,
          market1Value: `$${market1.avgPrices.dairy}`,
          market2Value: `$${market2.avgPrices.dairy}`,
          type: "price",
          compareValues: [market1.avgPrices.dairy, market2.avgPrices.dairy]
        }
      ]
    }
  ];

  const renderValue = (value: string | number | boolean, type: string, compareValues?: number[], isFirst?: boolean) => {
    switch (type) {
      case "boolean":
        return value ? (
          <div className="flex items-center space-x-1 text-success">
            <Check className="h-4 w-4" />
            <span>Yes</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-muted-foreground">
            <X className="h-4 w-4" />
            <span>No</span>
          </div>
        );
      
      case "rating":
        return (
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{value}</span>
          </div>
        );
      
      case "number":
        return <span className="font-medium">{value.toLocaleString()}</span>;
      
      case "price":
        if (compareValues) {
          const [val1, val2] = compareValues;
          const isBetter = isFirst ? val1 < val2 : val2 < val1;
          return (
            <span className={`font-medium ${isBetter ? 'text-success' : ''}`}>
              {value}
              {isBetter && <span className="ml-1 text-xs">✓ Better</span>}
            </span>
          );
        }
        return <span className="font-medium">{value}</span>;
      
      default:
        return <span>{value}</span>;
    }
  };

  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      {/* Market Headers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 border-b">
        <div className="p-6 border-b lg:border-b-0 lg:border-r">
          <h3 className="text-lg font-semibold mb-4">Comparison</h3>
        </div>
        
        <div className="p-6 border-b lg:border-b-0 lg:border-r">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={market1.image}
                alt={market1.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{market1.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{market1.address}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {market1.specialties.slice(0, 2).map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={market2.image}
                alt={market2.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{market2.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{market2.address}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {market2.specialties.slice(0, 2).map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Rows */}
      {comparisonRows.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {/* Section Header */}
          <div className="bg-muted/30 px-6 py-3 border-b">
            <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
              {section.category}
            </h4>
          </div>
          
          {/* Section Items */}
          {section.items.map((item, itemIndex) => (
            <div key={itemIndex} className="grid grid-cols-1 lg:grid-cols-3 border-b last:border-b-0">
              <div className="p-4 lg:border-r bg-muted/10">
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </div>
              
              <div className="p-4 lg:border-r">
                {renderValue(item.market1Value, item.type, 'compareValues' in item ? item.compareValues : undefined, true)}
              </div>
              
              <div className="p-4">
                {renderValue(item.market2Value, item.type, 'compareValues' in item ? item.compareValues : undefined, false)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
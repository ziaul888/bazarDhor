import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { marketServerApi } from '@/lib/api/services/server/market-server';
import { cookies } from 'next/headers';
import { MarketDetailsClient } from './_components/market-details-client';

interface MarketDetailsProps {
  params: { id: string };
}

// Fetch market data server-side
async function getMarketData(id: string) {
  const cookieStore = await cookies();
  const zoneId = cookieStore.get('zoneId')?.value;

  if (!zoneId) {
    return null;
  }

  const marketHeaders = { zoneId };
  
  try {
    const market = await marketServerApi.getMarketById(id, marketHeaders);
    
    if (!market) {
      return null;
    }
    
    // Mock additional data that would come from API
    const mockMarketData = {
      ...market,
      fullAddress: market.address,
      coordinates: { lat: 40.7128, lng: -74.0060 },
      images: [
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop"
      ],
      isOpen: true,
      specialties: ["Fresh Produce", "Artisan Crafts", "Organic Food", "Local Honey"],
      featured: true,
      type: "Farmers Market",
      priceRange: "$",
      hasParking: true,
      acceptsCards: true,
      hasDelivery: false,
      phone: "+1 (555) 123-4567",
      website: "www.downtownmarket.com",
      email: "info@downtownmarket.com",
      established: "1985",
      operatingDays: ["Monday", "Wednesday", "Friday", "Saturday"],
      features: {
        freeParking: true,
        organicCertified: true,
        petFriendly: true,
        wheelchairAccessible: true,
        restrooms: true,
        atm: true
      },
      socialMedia: {
        facebook: "downtownmarket",
        instagram: "downtown_market",
        twitter: "downtownmarket"
      }
    };
    
    return mockMarketData;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return null;
  }
}



// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: MarketDetailsProps): Promise<Metadata> {
  const marketData = await getMarketData(params.id);
  
  if (!marketData) {
    return {
      title: 'Market Not Found',
      description: 'The requested market could not be found.',
    };
  }
  
  const title = `${marketData.name} - Fresh Market Finder`;
  const description = marketData.description || `Find fresh groceries and products at ${marketData.name}. Compare prices and discover local vendors.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function MarketDetailsPage({ params }: MarketDetailsProps) {
  const marketData = await getMarketData(params.id);
  
  if (!marketData) {
    notFound();
  }
  
  return <MarketDetailsClient marketData={marketData} />;


}

# Zone API Configuration - Usage Examples

## Quick Start

Import and use the zone detection API in your components:

```tsx
import { useGetZone, useGetZoneMutation } from '@/lib/api';

// In your component
const { data, isLoading, error } = useGetZone({
  lat: 23.8103,
  lng: 90.4125
});

console.log(data?.zone); // Zone information
console.log(data?.inZone); // Boolean - whether coordinates are in a zone
```

## Files Created

1. **[endpoints.ts](file:///home/bappy/Desktop/my-nextjs-app/src/lib/api/endpoints.ts)** - Centralized API endpoints
2. **[config.ts](file:///home/bappy/Desktop/my-nextjs-app/src/lib/api/services/config.ts)** - Config service with get-zone API
3. **[useConfig.ts](file:///home/bappy/Desktop/my-nextjs-app/src/lib/api/hooks/useConfig.ts)** - React Query hooks
4. **[types.ts](file:///home/bappy/Desktop/my-nextjs-app/src/lib/api/types.ts)** - Updated with Zone types

## API Endpoint

```typescript
POST /api/config/get-zone

Payload:
{
  "lat": 23.8103,
  "lng": 90.4125
}

Response:
{
  "zone": {
    "id": "zone-1",
    "name": "Dhaka Central",
    "coordinates": { "lat": 23.8103, "lng": 90.4125 },
    "radius": 5,
    "isActive": true,
    "deliveryAvailable": true,
    "markets": ["market-1", "market-2"]
  },
  "distance": 0.5,
  "inZone": true,
  "nearbyZones": []
}
```

## Usage Examples

### 1. Query Pattern (Automatic)

```tsx
'use client';

import { useGetZone } from '@/lib/api';

export default function LocationDetector() {
  const coordinates = { lat: 23.8103, lng: 90.4125 };
  
  const { data, isLoading, error } = useGetZone(coordinates);
  
  if (isLoading) return <div>Detecting zone...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.inZone ? (
        <div>
          <h3>You are in: {data.zone?.name}</h3>
          <p>Delivery available: {data.zone?.deliveryAvailable ? 'Yes' : 'No'}</p>
        </div>
      ) : (
        <div>No zone found for your location</div>
      )}
    </div>
  );
}
```

### 2. Mutation Pattern (On-Demand)

```tsx
'use client';

import { useState } from 'react';
import { useGetZoneMutation } from '@/lib/api';

export default function ZoneChecker() {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  
  const { mutate, data, isPending } = useGetZoneMutation();
  
  const checkZone = () => {
    mutate({ 
      lat: parseFloat(lat), 
      lng: parseFloat(lng) 
    });
  };
  
  return (
    <div>
      <input 
        value={lat} 
        onChange={(e) => setLat(e.target.value)}
        placeholder="Latitude"
      />
      <input 
        value={lng} 
        onChange={(e) => setLng(e.target.value)}
        placeholder="Longitude"
      />
      <button onClick={checkZone} disabled={isPending}>
        Check Zone
      </button>
      
      {data && (
        <div>Zone: {data.zone?.name || 'Not found'}</div>
      )}
    </div>
  );
}
```

### 3. Using Browser Geolocation

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useGetZone } from '@/lib/api';

export default function AutoZoneDetector() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);
  
  const { data } = useGetZone(coords, !!coords);
  
  return (
    <div>
      {coords ? (
        <div>
          Location: {coords.lat}, {coords.lng}
          {data?.zone && <p>Zone: {data.zone.name}</p>}
        </div>
      ) : (
        <div>Getting your location...</div>
      )}
    </div>
  );
}
```

## Direct API Usage

```typescript
import { configApi } from '@/lib/api/services/config';

// Direct service call
const zoneData = await configApi.getZone({
  lat: 23.8103,
  lng: 90.4125
});

console.log(zoneData.zone);
console.log(zoneData.inZone);
console.log(zoneData.nearbyZones);
```

## All Available Endpoints

```typescript
import { API_ENDPOINTS } from '@/lib/api/endpoints';

// Config endpoints
API_ENDPOINTS.CONFIG.GET_ZONE // '/config/get-zone'
API_ENDPOINTS.CONFIG.SETTINGS // '/config/settings'
API_ENDPOINTS.CONFIG.APP_CONFIG // '/config/app'

// Auth endpoints
API_ENDPOINTS.AUTH.LOGIN // '/auth/login'
API_ENDPOINTS.AUTH.REGISTER // '/auth/register'

// Markets endpoints
API_ENDPOINTS.MARKETS.LIST // '/markets'
API_ENDPOINTS.MARKETS.DETAIL('123') // '/markets/123'

// ... and more
```

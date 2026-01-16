# Zone Provider - Global Zone Detection

The zone API is now called at the root level and available throughout the entire app!

## How It Works

1. **Automatic Location Detection**: When the app loads, it automatically tries to get the user's location
2. **Fallback Strategy**: If geolocation fails, it uses a default location (Dhaka: 23.8103, 90.4125)
3. **Persistent Storage**: Coordinates and zone data are cached in localStorage
4. **Global Access**: Zone data is available in any component via the `useZone` hook

## Architecture

```
Root Layout
├── QueryProvider (React Query)
└── ZoneProvider ← Calls get-zone API here
    └── Rest of App (has access to zone data)
```

## Files Modified/Created

1. **[zone-provider.tsx](file:///home/bappy/Desktop/my-nextjs-app/src/providers/zone-provider.tsx)** - New provider component
2. **[layout.tsx](file:///home/bappy/Desktop/my-nextjs-app/src/app/layout.tsx)** - Added ZoneProvider

## Usage in Components

### Get Current Zone

```tsx
'use client';

import { useZone } from '@/providers/zone-provider';

export default function MyComponent() {
  const { zone, isLoading, zoneData } = useZone();

  if (isLoading) return <div>Loading zone...</div>;

  return (
    <div>
      {zone ? (
        <div>
          <h3>Current Zone: {zone.name}</h3>
          <p>Delivery: {zone.deliveryAvailable ? 'Yes' : 'No'}</p>
          <p>Distance: {zoneData?.distance}km from center</p>
        </div>
      ) : (
        <p>No zone detected</p>
      )}
    </div>
  );
}
```

### Update User Location

```tsx
'use client';

import { useZone } from '@/providers/zone-provider';

export default function LocationPicker() {
  const { updateLocation, isLoading } = useZone();

  const selectNewLocation = () => {
    // User selected new coordinates
    updateLocation(23.7461, 90.3764);
  };

  return (
    <button onClick={selectNewLocation} disabled={isLoading}>
      Change Location
    </button>
  );
}
```

### Refresh Zone Data

```tsx
'use client';

import { useZone } from '@/providers/zone-provider';

export default function RefreshButton() {
  const { refetchZone, isLoading } = useZone();

  return (
    <button onClick={refetchZone} disabled={isLoading}>
      Refresh Zone
    </button>
  );
}
```

## Automatic Features

### 1. Geolocation on Mount
- Automatically requests user's location when app loads
- Saves to localStorage for future visits
- 5-minute cache for location data

### 2. Fallback Handling
- If geolocation permission denied → uses default location
- If geolocation times out (10s) → uses default location
- If geolocation not supported → uses default location

### 3. Data Persistence
```typescript
// Stored in localStorage:
- 'user_lat' → User's latitude
- 'user_lng' → User's longitude  
- 'user_zone' → Full zone object (JSON)
```

### 4. Smart Caching
- Uses stored coordinates on subsequent visits
- Only requests new location if cache is empty
- React Query caches API response

## API Flow

```
App Load
    ↓
ZoneProvider mounts
    ↓
Check localStorage for coordinates
    ↓
    ├─ Found → Use stored coords
    │   ↓
    │   Call get-zone API
    │
    └─ Not Found → Request geolocation
        ↓
        ├─ Success → Save coords, call API
        └─ Fail → Use default, call API
            ↓
        API Response
            ↓
        Save zone to localStorage
            ↓
        Zone data available globally
```

## Context Shape

```typescript
interface ZoneContextType {
  // Current zone object
  zone: Zone | null;
  
  // Full API response
  zoneData: GetZoneResponse | null;
  
  // Loading state
  isLoading: boolean;
  
  // Any errors
  error: Error | null;
  
  // Refresh current zone
  refetchZone: () => void;
  
  // Update to new coordinates
  updateLocation: (lat: number, lng: number) => void;
}
```

## Example: Show Zone-Specific Content

```tsx
'use client';

import { useZone } from '@/providers/zone-provider';

export default function MarketList() {
  const { zone, isLoading } = useZone();

  if (isLoading) return <Skeleton />;

  // Filter markets by zone
  const marketsInZone = zone?.markets || [];

  return (
    <div>
      <h2>Markets in {zone?.name}</h2>
      {marketsInZone.map(marketId => (
        <MarketCard key={marketId} id={marketId} />
      ))}
    </div>
  );
}
```

## Example: Zone-Based Delivery Check

```tsx
'use client';

import { useZone } from '@/providers/zone-provider';

export default function DeliveryInfo() {
  const { zone } = useZone();

  return (
    <div>
      {zone?.deliveryAvailable ? (
        <div className="bg-green-100 p-4">
          ✅ Delivery available in {zone.name}
        </div>
      ) : (
        <div className="bg-red-100 p-4">
          ❌ Delivery not available in your area
        </div>
      )}
    </div>
  );
}
```

## Benefits

✅ **Single API Call**: Zone is fetched once at app load, not per page
✅ **Global Access**: Any component can access zone data
✅ **No Prop Drilling**: Use the hook anywhere
✅ **Automatic Updates**: Change location and all components update
✅ **Persistent**: Survives page refreshes
✅ **Optimized**: Cached with React Query

## Testing

The zone provider will:
1. Try to get your actual location (if browser supports it)
2. On first load, you'll see a browser permission prompt
3. If allowed, your real coordinates are used
4. If denied, default location (Dhaka) is used
5. Check browser console for zone detection logs

## Debugging

```tsx
// In any component
const { zone, zoneData, error } = useZone();

console.log('Current Zone:', zone);
console.log('Zone Data:', zoneData);
console.log('Error:', error);

// Check localStorage
console.log('Stored Lat:', localStorage.getItem('user_lat'));
console.log('Stored Lng:', localStorage.getItem('user_lng'));
console.log('Stored Zone:', localStorage.getItem('user_zone'));
```

The zone API is now fully integrated at the root level! 🎉

# ✅ Zone Auto-Detection - No Permission Required!

The zone API is now called **automatically** when the user opens the app, using **IP-based geolocation** (no browser permission popup).

## How It Works

### When User Opens the App:

1. 🌍 **App loads** → ZoneProvider initiates
2. 📡 **IP Geolocation** → Gets approximate location from IP address (no permission needed)
3. 📍 **Calls Zone API** → `POST /api/config/get-zone` with lat/lng
4. 💾 **Saves Data** → Stores in localStorage (full object) and Cookies (zoneId)
5. 🔑 **Automatic Headers** → `zoneId` added to every API call header automatically from Cookies
6. ✅ **Zone Available** → All components can access zone data

**No browser permission popup!** Location is detected automatically from the user's IP address.

---

## Automatic Header Injection
The `apiClient` (axios) is configured with a request interceptor that automatically pulls the `zoneId` from **Cookies** and adds it to the headers of every request.

```typescript
// Header added to every API request:
headers: {
  'zoneId': 'your-current-zone-id', // Retrieved from cookie
  'Authorization': 'Bearer ...'
}
```

This ensures the backend always knows which zone the user belongs to without needing to pass it manually in every service call.

---

## Location Detection Strategy

### Priority Order:

1. **Stored Location** (if user visited before)
   - Uses saved coordinates from localStorage
   - Fastest, no API call needed

2. **IP-Based Geolocation** (default for new users)
   - Uses `ipapi.co` to detect location from IP
   - ✅ No permission required
   - ✅ Works immediately
   - ⚠️ Less accurate (city-level)

3. **GPS Location** (optional, user-triggered)
   - User can click "Use Precise Location"
   - Requires browser permission
   - ✅ Very accurate (meter-level)

4. **Default Location** (fallback)
   - If IP geolocation fails
   - Uses Dhaka, Bangladesh (23.8103, 90.4125)

---

## Usage Examples

### Get Current Zone

```tsx
'use client';

import { useZone } from '@/providers/zone-provider';

export default function MarketList() {
  const { zone, isLoading } = useZone();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Markets in {zone?.name}</h2>
      {/* Your content */}
    </div>
  );
}
```

### Allow User to Enable Precise Location

```tsx
'use client';

import { useZone } from '@/providers/zone-provider';

export default function LocationSettings() {
  const { zone, usePreciseLocation } = useZone();

  return (
    <div>
      <p>Current Zone: {zone?.name}</p>
      <button onClick={usePreciseLocation}>
        📍 Use Precise GPS Location
      </button>
    </div>
  );
}
```

### Check Location Source

```tsx
const locationSource = localStorage.getItem('location_source');
// Values: 'ip', 'gps', 'manual', 'default'
```

---

## API Context

```typescript
const {
  zone,                // Current zone object
  zoneData,            // Full API response
  isLoading,           // Loading state
  error,               // Any errors
  refetchZone,         // Refresh zone
  updateLocation,      // Manually set location
  usePreciseLocation   // Request GPS location
} = useZone();
```

---

## Automatic Flow

```
User Opens App
      ↓
Check localStorage
      ↓
   ┌──────┴──────┐
   │             │
Found?        Not Found
   │             │
   ↓             ↓
Use Stored   Get IP Location
Coords       (ipapi.co)
   │             │
   └──────┬──────┘
          ↓
   Call Zone API
   /api/config/get-zone
          ↓
   Save to localStorage
          ↓
   Zone Available Globally
```

---

## Why IP-Based Geolocation?

✅ **No Permission Required** - Works immediately  
✅ **User-Friendly** - No scary popup  
✅ **Good Enough** - City-level accuracy sufficient for zones  
✅ **Fast** - Single API call  
✅ **Fallback Available** - Can upgrade to GPS if needed

---

## Stored Data

```typescript
localStorage.setItem('user_lat', '23.8103');
localStorage.setItem('user_lng', '90.4125');
localStorage.setItem('location_source', 'ip'); 
localStorage.setItem('user_zone', JSON.stringify(zoneData));

// Cookie:
Cookies.set('zoneId', 'zone-123');
```

---

## Example: Zone-Based Features

### Filter Markets by Zone
```tsx
const { zone } = useZone();
const localMarkets = allMarkets.filter(m => 
  zone?.markets.includes(m.id)
);
```

### Delivery Availability
```tsx
const { zone } = useZone();
const canDeliver = zone?.deliveryAvailable;
```

### Dynamic Pricing
```tsx
const { zoneData } = useZone();
const deliveryFee = calculateFee(zoneData?.distance);
```

---

## Testing

1. Open your app in browser
2. Zone is automatically detected (no popup!)
3. Check console: "Detecting zone..." 
4. Zone data appears instantly
5. No user interaction required!

---

## Benefits

🎯 **Automatic** - Detects on app load  
🚀 **Fast** - IP geolocation is quick  
💾 **Persistent** - Cached in localStorage  
🔒 **Privacy-Friendly** - No GPS tracking by default  
⚡ **Zero Friction** - No permission prompts  
🎨 **Optional Precision** - Users can enable GPS if they want

---

**The zone API automatically detects the user's location when they hit the app!** All data that depends on zone can access it through `useZone()`. 🎉

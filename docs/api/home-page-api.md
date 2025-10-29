# Home Page API Documentation

This document outlines all the API endpoints required for the home page sections of the Bazar application.

## Base URL
```
https://api.bazardhor.com/v1
```

## Authentication
All API requests require authentication via Bearer token:
```
Authorization: Bearer <your_access_token>
```

---

## 1. Location Section API

### Get User Locations
**Endpoint:** `GET /locations`

**Description:** Retrieve available locations with market information

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "New York, NY",
      "markets": 12,
      "vendors": 150,
      "distance": "2.3 miles",
      "status": "Open Now",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    }
  ]
}
```

### Update User Location
**Endpoint:** `PUT /user/location`

**Request Body:**
```json
{
  "locationId": 1,
  "coordinates": {
    "lat": 40.7128,
    "lng": -74.0060
  }
}
```

---

## 2. Category Section API

### Get Categories
**Endpoint:** `GET /categories`

**Query Parameters:**
- `limit` (optional): Number of categories to return (default: 10)
- `popular` (optional): Filter by popular categories (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Vegetables",
      "slug": "fresh-vegetables",
      "vendors": 85,
      "markets": 42,
      "totalItems": 1250,
      "rating": 4.8,
      "icon": "🥬",
      "popular": true,
      "image": "https://example.com/vegetables.jpg"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "hasNext": true
  }
}
```

### Get Category Details
**Endpoint:** `GET /categories/{slug}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Vegetables",
    "slug": "fresh-vegetables",
    "description": "Fresh organic vegetables from local farms",
    "vendors": 85,
    "markets": 42,
    "totalItems": 1250,
    "rating": 4.8,
    "icon": "🥬",
    "popular": true,
    "subcategories": [
      {
        "id": 101,
        "name": "Leafy Greens",
        "itemCount": 250
      }
    ]
  }
}
```

---

## 3. Nearest Markets API

### Get Nearest Markets
**Endpoint:** `GET /markets/nearest`

**Query Parameters:**
- `lat` (required): User latitude
- `lng` (required): User longitude
- `radius` (optional): Search radius in km (default: 10)
- `limit` (optional): Number of markets to return (default: 5)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Downtown Farmers Market",
      "address": "123 Main Street, Downtown",
      "distance": "0.5 km",
      "openTime": "8:00 AM - 6:00 PM",
      "rating": 4.8,
      "reviews": 245,
      "vendors": 32,
      "image": "https://example.com/market1.jpg",
      "isOpen": true,
      "specialties": ["Fresh Produce", "Artisan Crafts"],
      "featured": true,
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      },
      "contact": {
        "phone": "+1234567890",
        "email": "info@downtownmarket.com"
      }
    }
  ]
}
```

### Get Market Details
**Endpoint:** `GET /markets/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Downtown Farmers Market",
    "description": "A vibrant farmers market in the heart of downtown",
    "address": "123 Main Street, Downtown",
    "distance": "0.5 km",
    "openTime": "8:00 AM - 6:00 PM",
    "rating": 4.8,
    "reviews": 245,
    "vendors": 32,
    "images": [
      "https://example.com/market1.jpg",
      "https://example.com/market1-2.jpg"
    ],
    "isOpen": true,
    "specialties": ["Fresh Produce", "Artisan Crafts"],
    "featured": true,
    "amenities": {
      "parking": true,
      "restrooms": true,
      "wheelchairAccessible": true,
      "petFriendly": false
    },
    "operatingHours": [
      {
        "day": "Monday",
        "open": "08:00",
        "close": "18:00"
      }
    ]
  }
}
```

---

## 4. Best Price Section API

### Get Best Price Items
**Endpoint:** `GET /items/best-prices`

**Query Parameters:**
- `category` (optional): Filter by category
- `location` (optional): Filter by location
- `limit` (optional): Number of items to return (default: 12)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Fresh Chicken (1kg)",
      "marketName": "City Meat Market",
      "marketId": 5,
      "currentPrice": 7.50,
      "previousPrice": 8.00,
      "image": "https://example.com/chicken.jpg",
      "category": "Meat & Poultry",
      "priceChange": "down",
      "priceChangePercent": -6.25,
      "lastUpdated": "2024-01-15T14:30:00Z",
      "unit": "kg",
      "inStock": true,
      "vendor": {
        "id": 101,
        "name": "Fresh Meat Co.",
        "rating": 4.7
      }
    }
  ]
}
```

### Update Item Price
**Endpoint:** `PUT /items/{id}/price`

**Request Body:**
```json
{
  "price": 7.25,
  "marketId": 5,
  "vendorId": 101
}
```

**Response:**
```json
{
  "success": true,
  "message": "Price updated successfully",
  "data": {
    "id": 1,
    "currentPrice": 7.25,
    "previousPrice": 7.50,
    "priceChange": "down",
    "lastUpdated": "2024-01-15T15:45:00Z"
  }
}
```

---

## 5. Triple Slider API

### Get Slider Content
**Endpoint:** `GET /content/sliders`

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "fresh",
        "title": "Fresh Produce",
        "icon": "Leaf",
        "slides": [
          {
            "id": 1,
            "title": "Organic Vegetables",
            "price": "From $3.99/kg",
            "image": "https://example.com/vegetables.jpg",
            "badge": "Fresh Today",
            "link": "/category/vegetables"
          }
        ]
      }
    ],
    "ads": [
      {
        "id": 1,
        "title": "Premium Market Partnership",
        "subtitle": "Get 20% off your first order",
        "description": "Join our premium partner markets and enjoy exclusive discounts on fresh produce.",
        "image": "https://example.com/ad1.jpg",
        "badge": "Limited Time",
        "ctaText": "Claim Offer",
        "highlight": "20% OFF",
        "link": "/offers/premium"
      }
    ],
    "systemInfo": {
      "title": "About Our Platform",
      "features": [
        "Real-time market comparison",
        "Smart price tracking",
        "Local vendor network",
        "Secure payment system"
      ],
      "stats": {
        "markets": "500+",
        "users": "10K+",
        "cities": "25+"
      }
    }
  }
}
```

---

## 6. Compare Markets API

### Get Markets for Comparison
**Endpoint:** `GET /markets/compare`

**Query Parameters:**
- `lat` (required): User latitude
- `lng` (required): User longitude
- `limit` (optional): Number of markets to return (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Downtown Farmers Market",
      "address": "123 Main Street, Downtown",
      "distance": "0.5 km",
      "rating": 4.8,
      "reviews": 245,
      "vendors": 32,
      "image": "https://example.com/market1.jpg",
      "openHours": "8:00 AM - 6:00 PM",
      "features": {
        "freeParking": true,
        "organicCertified": true,
        "delivery": true,
        "petFriendly": false,
        "creditCards": true
      },
      "avgPrices": {
        "produce": 4.50,
        "bread": 6.99,
        "meat": 12.50,
        "dairy": 3.25
      }
    }
  ]
}
```

### Compare Two Markets
**Endpoint:** `POST /markets/compare`

**Request Body:**
```json
{
  "market1Id": 1,
  "market2Id": 2,
  "categories": ["produce", "meat", "dairy"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "market1": {
      "id": 1,
      "name": "Downtown Farmers Market",
      "totalScore": 8.5,
      "priceScore": 7.8,
      "qualityScore": 9.2,
      "avgPrices": {
        "produce": 4.50,
        "meat": 12.50,
        "dairy": 3.25
      }
    },
    "market2": {
      "id": 2,
      "name": "Riverside Artisan Market",
      "totalScore": 8.2,
      "priceScore": 8.1,
      "qualityScore": 8.8,
      "avgPrices": {
        "produce": 5.20,
        "meat": 11.80,
        "dairy": 3.50
      }
    },
    "comparison": {
      "winner": "market1",
      "priceDifference": {
        "produce": -0.70,
        "meat": 0.70,
        "dairy": -0.25
      },
      "recommendations": [
        "Market 1 is better for produce and dairy",
        "Market 2 offers better meat prices"
      ]
    }
  }
}
```

---

## 7. Search API

### Search Items and Markets
**Endpoint:** `GET /search`

**Query Parameters:**
- `q` (required): Search query
- `type` (optional): Search type (items, markets, vendors, all)
- `category` (optional): Filter by category
- `location` (optional): Filter by location
- `limit` (optional): Number of results (default: 20)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Fresh Tomatoes",
        "price": 3.99,
        "market": "Downtown Market",
        "image": "https://example.com/tomatoes.jpg",
        "category": "Vegetables"
      }
    ],
    "markets": [
      {
        "id": 1,
        "name": "Downtown Farmers Market",
        "distance": "0.5 km",
        "rating": 4.8,
        "image": "https://example.com/market1.jpg"
      }
    ],
    "vendors": [
      {
        "id": 1,
        "name": "Fresh Produce Co.",
        "market": "Downtown Market",
        "rating": 4.7,
        "specialties": ["Organic Vegetables"]
      }
    ]
  },
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "hasNext": true
  }
}
```

---

## 8. Banner/Promotions API

### Get Active Banners
**Endpoint:** `GET /banners`

**Query Parameters:**
- `location` (optional): Filter by location
- `active` (optional): Filter active banners (default: true)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Weekend Special Offers",
      "subtitle": "Up to 30% off on fresh produce",
      "image": "https://example.com/banner1.jpg",
      "ctaText": "Shop Now",
      "ctaLink": "/offers/weekend",
      "startDate": "2024-01-15T00:00:00Z",
      "endDate": "2024-01-17T23:59:59Z",
      "priority": 1,
      "targetAudience": "all"
    }
  ]
}
```

---

## 9. Newsletter API

### Subscribe to Newsletter
**Endpoint:** `POST /newsletter/subscribe`

**Request Body:**
```json
{
  "email": "user@example.com",
  "preferences": {
    "weeklyDeals": true,
    "newMarkets": true,
    "priceAlerts": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter",
  "data": {
    "email": "user@example.com",
    "subscriptionId": "sub_123456789"
  }
}
```

---

## 10. App Download API

### Get App Download Links
**Endpoint:** `GET /app/download-links`

**Response:**
```json
{
  "success": true,
  "data": {
    "ios": {
      "url": "https://apps.apple.com/app/bazardhor",
      "version": "1.2.0",
      "size": "45.2 MB"
    },
    "android": {
      "url": "https://play.google.com/store/apps/details?id=com.bazardhor",
      "version": "1.2.0",
      "size": "38.5 MB"
    },
    "features": [
      "Real-time price tracking",
      "Location-based market finder",
      "Offline shopping lists",
      "Push notifications for deals"
    ]
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "lat",
        "message": "Latitude is required"
      }
    ]
  }
}
```

### Common Error Codes:
- `VALIDATION_ERROR`: Invalid request parameters
- `UNAUTHORIZED`: Invalid or missing authentication token
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

---

## Rate Limiting

API requests are limited to:
- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 1000 requests per minute
- **Search endpoints**: 50 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
```

---

## Pagination

Paginated endpoints use consistent pagination format:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "pagination": {
    "total": 500,
    "page": 1,
    "limit": 20,
    "totalPages": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Caching

- **Static content**: Cached for 24 hours
- **Price data**: Cached for 5 minutes
- **Market data**: Cached for 1 hour
- **User-specific data**: Not cached

Use `Cache-Control: no-cache` header to bypass cache when needed.
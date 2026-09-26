# Activity API contract (for backend)

Profile → Activity tab needs two endpoints. Both require `Authorization: Bearer <token>`,
`zoneId` and `X-localization` headers (attached automatically by the frontend's axios client).
Market/item names inside payloads should respect `X-localization` where translations exist.

Activity types the backend can actually emit today: `price_update`, `review`, `favorite`, `comment`.
(`visit` and `purchase` are reserved for future flows — frontend renders an icon per type,
unknown types fall back gracefully.)

---

## 1. `GET /api/users/activity-statistics`

Counts for the profile header stats and the Activity tab tiles.

**Response — `ApiResponse` shape (`{ data, message, success }`):**

```json
{
  "success": true,
  "message": "Activity statistics fetched successfully",
  "data": {
    "price_updates": 47,
    "reviews_written": 23,
    "favorite_markets": 8,
    "markets_visited": 12
  }
}
```

| Field | Type | Notes |
|---|---|---|
| `data.price_updates` | int | total price submissions by the user |
| `data.reviews_written` | int | reviews written |
| `data.favorite_markets` | int | markets currently in favorites |
| `data.markets_visited` | int | distinct markets the user interacted with (fallback: distinct markets in their activities) |

---

## 2. `GET /api/users/activities?page=1&limit=10&type=price_update`

Paginated activity feed, newest first. `type` is optional (UI dropdown filter);
omit/`all` = no filter. `offset` must equal `(page-1) * limit`.

**Response — `BackendApiResponse` shape (`{ response_code, message, total_size, limit, offset, data, errors }`):**

```json
{
  "response_code": "user_activities_200",
  "message": "User activities fetched successfully",
  "total_size": 47,
  "limit": 10,
  "offset": 0,
  "errors": null,
  "data": [
    {
      "id": "e835c1f9-0cad-41d2-ad7f-c12ee367ae3e",
      "type": "price_update",
      "created_at": "2026-09-26T07:30:00.000000Z",
      "price_update": {
        "item_name": "Tomato",
        "market_name": "Downtown Market",
        "unit": "kg",
        "old_price": "4.99",
        "new_price": "3.99"
      }
    },
    {
      "id": "b2d4...",
      "type": "review",
      "created_at": "2026-09-25T14:05:00.000000Z",
      "review": {
        "market_name": "Riverside Organic Market",
        "rating": 5,
        "comment": "Great selection of organic produce!"
      }
    },
    {
      "id": "c3e5...",
      "type": "favorite",
      "created_at": "2026-09-23T09:12:00.000000Z",
      "favorite": {
        "market_name": "Central Plaza Market",
        "action": "added"
      }
    },
    {
      "id": "d4f6...",
      "type": "comment",
      "created_at": "2026-09-12T16:40:00.000000Z",
      "comment": {
        "market_name": "Heritage Square Market",
        "body": "Best time to visit is early morning for freshest items"
      }
    }
  ]
}
```

### Common fields (every item)

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | unique activity id |
| `type` | string enum | `price_update` \| `review` \| `favorite` \| `comment` |
| `created_at` | ISO-8601 UTC | frontend renders relative time ("2 hours ago" / "২ ঘণ্টা আগে") — do not pre-format |

### Per-type payload (key matches `type`; only the relevant key is present)

| `type` | Fields |
|---|---|
| `price_update` | `item_name` (string), `market_name` (string), `unit` (string), `old_price` (string, nullable on first submission), `new_price` (string) |
| `review` | `market_name` (string), `rating` (int 1–5), `comment` (string, nullable) |
| `favorite` | `market_name` (string), `action` (`added` \| `removed`) |
| `comment` | `market_name` (string), `body` (string) |

Notes:
- Prices are decimal **strings** (`"3.99"`), consistent with the existing price endpoints.
- `old_price: null` is allowed — first submission for that item+market.
- User-generated text (`review.comment`, `comment.body`) passes through as-is; the frontend escapes it.

---

## How the frontend composes sentences (for reference — not backend's job)

`messages/{en,bn}.json` will hold per-type ICU templates, e.g.:

```
price_update → "Updated {item} prices at {market}" / "{market}-এ {item} এর দাম আপডেট করেছেন"
review       → "Reviewed {market}" / "{market} এর রিভিউ দিয়েছেন"
favorite     → "Added {market} to favorites" / "{market} প্রিয়তে যোগ করেছেন"
comment      → "Commented on {market}" / "{market}-এ মন্তব্য করেছেন"
```

So adding a new activity type later = one new template pair + one icon mapping in the frontend.

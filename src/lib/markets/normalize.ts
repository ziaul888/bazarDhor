const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';
const DEFAULT_MARKET_IMAGE =
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop';

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return [value.trim()];
  }
  return [];
};

const toNumber = (value: unknown, fallback: number) => {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const toBoolean = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (value === 1 || value === '1') return true;
  if (value === 0 || value === '0') return false;
  return fallback;
};

const formatDistance = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return `${value} km`;
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.includes('km') || value.includes('mi') ? value : `${value} km`;
  }
  return 'N/A';
};

const toImageUrl = (value: unknown) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return DEFAULT_MARKET_IMAGE;
  }
  return value.startsWith('http') ? value : `${IMAGE_BASE_URL}${value}`;
};

export const extractMarketArray = (response: unknown): Record<string, unknown>[] => {
  if (!response) return [];
  if (Array.isArray(response)) {
    return response.filter(
      (item): item is Record<string, unknown> => typeof item === 'object' && item !== null,
    );
  }
  if (typeof response === 'object') {
    const root = response as Record<string, unknown>;
    const direct = root.data ?? root.markets ?? root.market_list ?? root.marketList;

    if (Array.isArray(direct)) {
      return direct.filter(
        (item): item is Record<string, unknown> => typeof item === 'object' && item !== null,
      );
    }

    if (direct && typeof direct === 'object') {
      const nested =
        (direct as Record<string, unknown>).data ??
        (direct as Record<string, unknown>).markets ??
        (direct as Record<string, unknown>).market_list;

      if (Array.isArray(nested)) {
        return nested.filter(
          (item): item is Record<string, unknown> => typeof item === 'object' && item !== null,
        );
      }
    }
  }
  return [];
};

export type NormalizedMarket = ReturnType<typeof mapMarketFromApi>;

export function mapMarketFromApi(item: Record<string, unknown>, index: number) {
  const categories = toStringArray(item.categories ?? item.category ?? item.category_name);
  const specialties = toStringArray(item.specialties ?? item.speciality ?? categories);

  return {
    id: String(item.id ?? item.market_id ?? item.marketId ?? `market-${index + 1}`),
    name: String(item.name ?? item.market_name ?? 'Local Market'),
    address: String(item.address ?? item.location ?? 'Address unavailable'),
    distance: formatDistance(item.distance ?? item.distance_km ?? item.distanceKm),
    rating: toNumber(item.rating ?? item.avg_rating, 0),
    reviews: toNumber(item.reviews ?? item.review_count ?? item.total_reviews, 0),
    vendors: toNumber(item.vendors ?? item.vendor_count ?? item.total_vendors, 0),
    image: toImageUrl(item.image ?? item.image_path ?? item.thumbnail),
    isOpen: toBoolean(item.isOpen ?? item.is_open ?? item.open_now),
    openTime: String(item.openTime ?? item.open_time ?? item.opening_time ?? 'Hours vary'),
    specialties: specialties.length > 0 ? specialties : ['Fresh Produce'],
    priceRange: String(item.priceRange ?? item.price_range ?? '$$'),
    categoryItems: toNumber(item.categoryItems ?? item.product_count ?? item.item_count, 0),
    priceChange: (toNumber(item.price_change, 0) ?? 0) > 0 ? 'up' : ('down' as const),
    featured: toBoolean(item.featured ?? item.is_featured),
  };
}

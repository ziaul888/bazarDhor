// Why: the backend sends `Market.type` as fixed English enum values
// (`App\Enums\MarketType`: "Retail Market", "Wholesale Market", …) which must
// be localized per locale before display.
// How: `marketTypeLabelKey()` maps an enum value to a key inside the
// `markets.marketTypes` messages namespace; unknown/missing values return null
// so callers can fall back to the raw string (or a generic label).

export type MarketTypeLabelKey =
  | 'retail'
  | 'wholesale'
  | 'farmers'
  | 'supermarket'
  | 'localShop'
  | 'other';

const MARKET_TYPE_LABEL_KEYS: Record<string, MarketTypeLabelKey> = {
  'Retail Market': 'retail',
  'Wholesale Market': 'wholesale',
  'Farmers Market': 'farmers',
  Supermarket: 'supermarket',
  'Local Shop': 'localShop',
  Other: 'other',
};

export const marketTypeLabelKey = (
  type: string | null | undefined,
): MarketTypeLabelKey | null => (type ? (MARKET_TYPE_LABEL_KEYS[type] ?? null) : null);

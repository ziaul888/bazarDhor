# Banner `type=feature` + TripleSlider Integration

This document describes the changes made to support filtering banners by `type` (e.g. `feature`) and reusing that API in homepage sections.

## Summary

- `useBanners()` and `bannersApi.getBanners()` now accept an optional `type` parameter and forward it to the API request.
- `BannerSection` fetches banners with `type=feature`.
- `TripleSlider` fetches banners with `type=feature` and renders them in the existing “ads” cards (fallbacks to the previous static data if the API returns no banners).

## Files Changed

### `src/lib/api/services/banners.ts`

- Added optional `type?: string` argument.
- Sends `type` as a query parameter when provided.

### `src/lib/api/hooks/useBanners.ts`

- Added optional `type?: string` argument.
- Includes `type` in the React Query key so different banner types cache separately.

### `src/app/_components/banner-section.tsx`

- Uses `useBanners(10, 1, 'feature')`.

### `src/app/_components/triple-slider.tsx`

- Uses `useBanners(10, 1, 'feature')`.
- Maps API banners into the existing card UI; keeps the old static `adsData` as a fallback.

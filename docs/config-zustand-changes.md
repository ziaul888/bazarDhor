# Server-side Config + Zustand Store

This document describes the changes made to fetch the app config from the backend on the server and store it in Zustand for reuse across the app.

## What changed

- Added `appConfig` + `settings` fields to the Zustand store (`useAppStore`).
- Added a server-side config fetch helper (`configServerApi`) that calls the backend config endpoints.
- Root layout now fetches config on the server and hydrates it into Zustand on the client.

## Files

### `src/store/app-store.ts`

- Added:
  - `appConfig: Record<string, unknown> | null`
  - `settings: Record<string, unknown> | null`
  - actions: `setAppConfig`, `setSettings`
- Persisted `appConfig` and `settings` via `partialize`.

### `src/lib/api/services/server/config-server.ts`

- Added `configServerApi.getAppConfig()` → calls `GET /config/app`
- Added `configServerApi.getSettings()` → calls `GET /config/settings`
- Uses `fetchClient` and `next: { revalidate: 3600 }` caching.

### `src/providers/config-bootstrap.tsx`

- Client bootstrap component that writes the server-fetched values into Zustand.

### `src/app/layout.tsx`

- Fetches config on the server (forwards `zoneId` cookie as a header when available).
- Renders `<ConfigBootstrap />` to seed Zustand on the client.

## Usage (any client component)

```ts
import { useAppStore } from '@/store/app-store';

const appConfig = useAppStore((s) => s.appConfig);
const settings = useAppStore((s) => s.settings);
```


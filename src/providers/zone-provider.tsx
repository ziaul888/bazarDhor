'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useGetZoneMutation } from '@/lib/api';
import type { GetZoneResponse, Zone } from '@/lib/api/types';
import Cookies from 'js-cookie';

interface ZoneContextType {
    zone: Zone | null;
    zoneData: GetZoneResponse | null;
    isLoading: boolean;
    error: Error | null;
    refetchZone: () => void;
    updateLocation: (lat: number, lng: number) => void;
    usePreciseLocation: () => void;
}

const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

interface ZoneProviderProps {
    children: ReactNode;
}

const DEFAULT_LOCATION = { lat: 23.8103, lng: 90.4125 };
const IP_GEO_TIMEOUT_MS = 5000;
const GPS_TIMEOUT_MS = 8000;

const toCoordinate = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string') {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
};

const isValidLatLng = (lat: number, lng: number) =>
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

const parseCoordinates = (latValue: unknown, lngValue: unknown) => {
    const lat = toCoordinate(latValue);
    const lng = toCoordinate(lngValue);

    if (lat === null || lng === null || !isValidLatLng(lat, lng)) {
        return null;
    }

    return { lat, lng };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const fetchJsonWithTimeout = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), IP_GEO_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    } catch {
        return null;
    } finally {
        window.clearTimeout(timeoutId);
    }
};

/**
 * Zone Provider - Automatically detects user's zone when app loads
 * Uses IP-based geolocation (no permission required)
 */
export function ZoneProvider({ children }: ZoneProviderProps) {
    const [zoneData, setZoneData] = useState<GetZoneResponse | null>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [geoError, setGeoError] = useState<Error | null>(null);

    const { mutate, data, isPending, error } = useGetZoneMutation();

    // Why: prefer the device's actual current location over IP fallback so the
    // zone API receives a precise lat/lng. Resolves to null on denial, error,
    // unsupported environments, or if the user doesn't respond within the timeout.
    const getLocationFromGPS = (): Promise<{ lat: number; lng: number } | null> =>
        new Promise((resolve) => {
            if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
                resolve(null);
                return;
            }
            let settled = false;
            const finish = (value: { lat: number; lng: number } | null) => {
                if (settled) return;
                settled = true;
                resolve(value);
            };
            const timeoutId = window.setTimeout(() => finish(null), GPS_TIMEOUT_MS);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    window.clearTimeout(timeoutId);
                    const parsed = parseCoordinates(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    finish(parsed);
                },
                () => {
                    window.clearTimeout(timeoutId);
                    finish(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: GPS_TIMEOUT_MS,
                    maximumAge: 60_000,
                }
            );
        });

    /**
     * Get location from IP address (no permission required)
     */
    const getLocationFromIP = async () => {
        // Try multiple providers because ad-blockers/network rules can block one endpoint.
        const providers = [
            {
                url: 'https://ipapi.co/json/',
                extract: (payload: unknown) => {
                    if (!isRecord(payload)) {
                        return null;
                    }
                    return parseCoordinates(payload.latitude, payload.longitude);
                },
            },
            {
                url: 'https://ipwho.is/',
                extract: (payload: unknown) => {
                    if (!isRecord(payload) || payload.success === false) {
                        return null;
                    }
                    return parseCoordinates(payload.latitude, payload.longitude);
                },
            },
        ];

        for (const provider of providers) {
            const payload = await fetchJsonWithTimeout(provider.url);
            const coordinates = provider.extract(payload);
            if (coordinates) {
                return coordinates;
            }
        }

        if (process.env.NODE_ENV === 'development') {
            console.warn('IP geolocation unavailable, using default location.');
        }

        return null;
    };

    /**
     * Initialize zone detection on app load
     */
    useEffect(() => {
        const initializeZone = async () => {
            // Check if we have stored coordinates first
            const storedLat = localStorage.getItem('user_lat');
            const storedLng = localStorage.getItem('user_lng');

            if (storedLat && storedLng) {
                // Reuse a previously-resolved precise location if it's still valid.
                const parsedStoredCoordinates = parseCoordinates(storedLat, storedLng);
                if (parsedStoredCoordinates) {
                    setCoordinates(parsedStoredCoordinates);
                    mutate(parsedStoredCoordinates);
                    return;
                }

                // Clear corrupted coordinates and continue with GPS/IP/default fallback
                localStorage.removeItem('user_lat');
                localStorage.removeItem('user_lng');
            }

            // Try the device GPS first — this is the user's actual current location.
            // If permission is denied or unsupported, falls through to IP / default.
            const gpsLocation = await getLocationFromGPS();
            if (gpsLocation) {
                localStorage.setItem('user_lat', gpsLocation.lat.toString());
                localStorage.setItem('user_lng', gpsLocation.lng.toString());
                localStorage.setItem('location_source', 'gps');

                setCoordinates(gpsLocation);
                mutate(gpsLocation);
                return;
            }

            // Try IP-based geolocation (no permission needed)
            const ipLocation = await getLocationFromIP();

            if (ipLocation) {
                // Save and use IP-based location
                localStorage.setItem('user_lat', ipLocation.lat.toString());
                localStorage.setItem('user_lng', ipLocation.lng.toString());
                localStorage.setItem('location_source', 'ip');

                setCoordinates(ipLocation);
                mutate(ipLocation);
            } else {
                // Last resort: hardcoded default
                localStorage.setItem('user_lat', DEFAULT_LOCATION.lat.toString());
                localStorage.setItem('user_lng', DEFAULT_LOCATION.lng.toString());
                localStorage.setItem('location_source', 'default');

                setCoordinates(DEFAULT_LOCATION);
                mutate(DEFAULT_LOCATION);
            }
        };

        initializeZone();
    }, [mutate]);

    /**
     * Use precise GPS location (requires permission)
     * Can be called manually by user action
     */
    const usePreciseLocation = () => {
        if (!('geolocation' in navigator)) {
            setGeoError(new Error('Geolocation not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Store precise coordinates
                localStorage.setItem('user_lat', lat.toString());
                localStorage.setItem('user_lng', lng.toString());
                localStorage.setItem('location_source', 'gps');

                setCoordinates({ lat, lng });
                mutate({ lat, lng });
                setGeoError(null);
            },
            (error) => {
                console.error('Geolocation error:', error.message);
                setGeoError(new Error(error.message));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    // Update zone data when mutation succeeds
    useEffect(() => {
        if (data) {
            setZoneData(data);

            // Store zone info in localStorage
            if (data && data.id) {
                localStorage.setItem('user_zone', JSON.stringify(data));
                Cookies.set('zoneId', data.id, { expires: 7, path: '/' }); // Expires in 7 days
                localStorage.removeItem('zoneId'); // Cleanup old localStorage key
            }
        }
    }, [data]);

    const refetchZone = () => {
        if (coordinates) {
            mutate(coordinates);
        }
    };

    const updateLocation = (lat: number, lng: number) => {
        localStorage.setItem('user_lat', lat.toString());
        localStorage.setItem('user_lng', lng.toString());
        localStorage.setItem('location_source', 'manual');
        setCoordinates({ lat, lng });
        mutate({ lat, lng });
    };

    const value: ZoneContextType = {
        zone: zoneData,
        zoneData,
        isLoading: isPending,
        error: (error as Error) || geoError,
        refetchZone,
        updateLocation,
        usePreciseLocation,
    };

    return <ZoneContext.Provider value={value}>{children}</ZoneContext.Provider>;
}

/**
 * Hook to access zone context
 */
export function useZone() {
    const context = useContext(ZoneContext);
    if (context === undefined) {
        throw new Error('useZone must be used within a ZoneProvider');
    }
    return context;
}

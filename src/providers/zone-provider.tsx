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

/**
 * Zone Provider - Automatically detects user's zone when app loads
 * Uses IP-based geolocation (no permission required)
 */
export function ZoneProvider({ children }: ZoneProviderProps) {
    const [zoneData, setZoneData] = useState<GetZoneResponse | null>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [geoError, setGeoError] = useState<Error | null>(null);

    const { mutate, data, isPending, error } = useGetZoneMutation();

    /**
     * Get location from IP address (no permission required)
     */
    const getLocationFromIP = async () => {
        try {
            // Use ipapi.co for free IP geolocation
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            if (data.latitude && data.longitude) {
                return {
                    lat: data.latitude,
                    lng: data.longitude,
                };
            }

            throw new Error('Could not detect location from IP');
        } catch (error) {
            console.error('IP geolocation failed:', error);
            return null;
        }
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
                // Use stored coordinates
                const lat = parseFloat(storedLat);
                const lng = parseFloat(storedLng);
                setCoordinates({ lat, lng });
                mutate({ lat, lng });
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
                // Fallback to default location (Dhaka, Bangladesh)
                const defaultLat = 23.8103;
                const defaultLng = 90.4125;

                localStorage.setItem('user_lat', defaultLat.toString());
                localStorage.setItem('user_lng', defaultLng.toString());
                localStorage.setItem('location_source', 'default');

                setCoordinates({ lat: defaultLat, lng: defaultLng });
                mutate({ lat: defaultLat, lng: defaultLng });
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

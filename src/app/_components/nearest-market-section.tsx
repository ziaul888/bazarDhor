"use client";

import { Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRandomMarkets } from '@/lib/api/hooks/useMarkets';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

type LeafletMap = {
    setView: (center: [number, number], zoom: number) => void;
    fitBounds: (bounds: unknown, options?: { padding?: [number, number] }) => void;
    flyTo: (center: [number, number] | { lat: number; lng: number }, zoom: number, options?: { duration?: number }) => void;
    getZoom: () => number;
    invalidateSize: () => void;
    remove: () => void;
};

type LeafletMarker = {
    bindPopup: (content: string) => LeafletMarker;
    on: (event: string, handler: () => void) => LeafletMarker;
    openPopup: () => void;
    getLatLng: () => { lat: number; lng: number };
    remove: () => void;
};

type LeafletIcon = unknown;

type LeafletPolyline = {
    addTo: (map: LeafletMap) => LeafletPolyline;
    remove: () => void;
};

type LeafletGlobal = {
    map: (element: HTMLDivElement, options?: Record<string, unknown>) => LeafletMap;
    tileLayer: (urlTemplate: string, options?: Record<string, unknown>) => { addTo: (map: LeafletMap) => void };
    marker: (coords: [number, number], options?: { icon?: LeafletIcon }) => { addTo: (map: LeafletMap) => LeafletMarker };
    polyline: (coords: [number, number][], options?: Record<string, unknown>) => LeafletPolyline;
    latLngBounds: (coords: [number, number][]) => unknown;
    divIcon: (options?: Record<string, unknown>) => LeafletIcon;
};

type MarketMapItem = {
    id: number | string;
    name: string;
    address: string;
    distance: string;
    openTime: string;
    rating: number;
    reviews: number;
    vendors: number;
    image: string;
    isOpen: boolean;
    specialties: string[];
    featured: boolean;
    latitude: number;
    longitude: number;
};

const nearestMarkets = [
    {
        id: 1,
        name: "Downtown Farmers Market",
        address: "123 Main Street, Downtown",
        distance: "0.5 km",
        openTime: "8:00 AM - 6:00 PM",
        rating: 4.8,
        reviews: 245,
        vendors: 32,
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Fresh Produce", "Artisan Crafts"],
        featured: true,
        latitude: 23.8162,
        longitude: 90.4141
    },
    {
        id: 2,
        name: "Riverside Artisan Market",
        address: "456 River Road, Riverside",
        distance: "1.2 km",
        openTime: "9:00 AM - 5:00 PM",
        rating: 4.7,
        reviews: 189,
        vendors: 28,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Handmade Goods", "Local Food"],
        featured: false,
        latitude: 23.8099,
        longitude: 90.421
    },
    {
        id: 3,
        name: "Central Plaza Market",
        address: "789 Plaza Avenue, Central",
        distance: "2.1 km",
        openTime: "7:00 AM - 7:00 PM",
        rating: 4.6,
        reviews: 156,
        vendors: 45,
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop",
        isOpen: false,
        specialties: ["Organic Food", "Vintage Items"],
        featured: false,
        latitude: 23.8046,
        longitude: 90.4087
    },
    {
        id: 4,
        name: "Sunset Weekend Market",
        address: "321 Sunset Boulevard, West",
        distance: "3.5 km",
        openTime: "10:00 AM - 4:00 PM",
        rating: 4.9,
        reviews: 298,
        vendors: 38,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Street Food", "Live Music"],
        featured: true,
        latitude: 23.8232,
        longitude: 90.4018
    },
    {
        id: 5,
        name: "Heritage Square Market",
        address: "654 Heritage Lane, Old Town",
        distance: "4.2 km",
        openTime: "8:30 AM - 5:30 PM",
        rating: 4.5,
        reviews: 134,
        vendors: 25,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
        isOpen: true,
        specialties: ["Antiques", "Local Crafts"],
        featured: false,
        latitude: 23.8002,
        longitude: 90.4296
    }
];

const IMAGE_BASE_URL = 'https://bazardor.chhagolnaiyasportareana.xyz/storage/';
const DEFAULT_MARKET_IMAGE = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop";
const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 };
const LEAFLET_SCRIPT_ID = 'leaflet-js-cdn';
const LEAFLET_CSS_ID = 'leaflet-css-cdn';
const OSRM_ROUTE_URL = 'https://router.project-osrm.org/route/v1/driving';

const getLeaflet = () => {
    if (typeof window === 'undefined') {
        return undefined;
    }
    return (window as Window & { L?: LeafletGlobal }).L;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const toNumber = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string') {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
};

const toBoolean = (value: unknown) => {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        return value === 1;
    }
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (['1', 'true', 'yes', 'open'].includes(normalized)) {
            return true;
        }
        if (['0', 'false', 'no', 'closed'].includes(normalized)) {
            return false;
        }
    }
    return false;
};

const formatDistance = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return `${value} km`;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
        return value.includes('km') ? value : `${value} km`;
    }
    return 'N/A';
};

const isValidCoordinate = (lat: number | null, lng: number | null): lat is number =>
    lat !== null && lng !== null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

const isFiniteLatLng = (lat: unknown, lng: unknown): lat is number =>
    typeof lat === 'number'
    && Number.isFinite(lat)
    && typeof lng === 'number'
    && Number.isFinite(lng)
    && lat >= -90
    && lat <= 90
    && lng >= -180
    && lng <= 180;

const getFallbackCoordinates = (index: number) => {
    const angle = (index / 10) * Math.PI * 2;
    const radius = 0.01 + index * 0.0018;
    return {
        latitude: Number((DEFAULT_CENTER.lat + Math.sin(angle) * radius).toFixed(6)),
        longitude: Number((DEFAULT_CENTER.lng + Math.cos(angle) * radius).toFixed(6)),
    };
};

const resolveCoordinates = (market: Record<string, unknown>, index: number): { latitude: number; longitude: number } => {
    const location = isRecord(market.location) ? market.location : null;
    const coordinates = isRecord(market.coordinates) ? market.coordinates : null;
    const geo = isRecord(market.geo) ? market.geo : null;

    const candidates: Array<[unknown, unknown]> = [
        [market.latitude, market.longitude],
        [market.lat, market.lng],
        [market.lat, market.lon],
        [market.user_lat, market.user_lng],
        [location?.lat, location?.lng],
        [location?.latitude, location?.longitude],
        [coordinates?.lat, coordinates?.lng],
        [coordinates?.latitude, coordinates?.longitude],
        [geo?.lat, geo?.lng],
    ];

    for (const [latValue, lngValue] of candidates) {
        const lat = toNumber(latValue);
        const lng = toNumber(lngValue);
        if (lat !== null && lng !== null && isValidCoordinate(lat, lng)) {
            return { latitude: lat, longitude: lng };
        }
    }

    return getFallbackCoordinates(index);
};

const getStoredUserLocation = (): { lat: number; lng: number } | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const storedLat = window.localStorage.getItem('user_lat');
    const storedLng = window.localStorage.getItem('user_lng');
    const lat = toNumber(storedLat);
    const lng = toNumber(storedLng);

    if (lat !== null && lng !== null && isFiniteLatLng(lat, lng)) {
        return { lat, lng };
    }

    return null;
};

const fetchRouteCoordinates = async (
    userLocation: { lat: number; lng: number },
    marketLocation: { lat: number; lng: number }
): Promise<[number, number][]> => {
    const routeUrl = `${OSRM_ROUTE_URL}/${userLocation.lng},${userLocation.lat};${marketLocation.lng},${marketLocation.lat}?overview=full&geometries=geojson`;
    const response = await fetch(routeUrl);
    if (!response.ok) {
        throw new Error('Route request failed');
    }

    const data = await response.json() as {
        routes?: Array<{
            geometry?: {
                coordinates?: Array<[number, number]>;
            };
        }>;
    };

    const rawCoordinates = data.routes?.[0]?.geometry?.coordinates;
    if (!Array.isArray(rawCoordinates) || rawCoordinates.length < 2) {
        throw new Error('No route found');
    }

    const parsedCoordinates = rawCoordinates
        .map(([lng, lat]) => [lat, lng] as [number, number])
        .filter(([lat, lng]) => isFiniteLatLng(lat, lng));

    if (parsedCoordinates.length < 2) {
        throw new Error('Invalid route geometry');
    }

    return parsedCoordinates;
};

const createMarketMarkerIcon = (L: LeafletGlobal): LeafletIcon =>
    L.divIcon({
        className: '',
        html: `
            <div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-8px);">
                <div style="width:18px;height:18px;border-radius:9999px;background:#ef4444;border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>
                <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:10px solid #ef4444;margin-top:-2px;"></div>
            </div>
        `,
        iconSize: [24, 34],
        iconAnchor: [12, 30],
        popupAnchor: [0, -26],
    });

const createUserMarkerIcon = (L: LeafletGlobal): LeafletIcon =>
    L.divIcon({
        className: '',
        html: `
            <div style="width:18px;height:18px;border-radius:9999px;background:#2563eb;border:3px solid #ffffff;box-shadow:0 0 0 4px rgba(37,99,235,0.25),0 2px 8px rgba(0,0,0,0.3);"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });

const escapeHtml = (text: string) =>
    text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

const getMarketDetailsHref = (id: string | number) =>
    `/markets/${encodeURIComponent(String(id))}`;

const createMarketPopupHtml = (market: Pick<MarketMapItem, 'id' | 'name' | 'address'>) => {
    const detailsHref = getMarketDetailsHref(market.id);

    return `
        <div style="line-height:1.35;min-width:220px;">
            <a href="${detailsHref}" style="font-weight:700;color:#111827;text-decoration:none;">
                ${escapeHtml(market.name)}
            </a><br/>
            <span style="color:#4b5563;">${escapeHtml(market.address)}</span><br/>
            <a href="${detailsHref}" style="display:inline-block;margin-top:6px;color:#2563eb;text-decoration:underline;">
                View market details
            </a>
        </div>
    `;
};

const loadLeaflet = async () => {
    if (typeof window === 'undefined') {
        throw new Error('Leaflet can only run in the browser');
    }

    const existingLeaflet = getLeaflet();
    if (existingLeaflet) {
        return existingLeaflet;
    }

    if (!document.getElementById(LEAFLET_CSS_ID)) {
        const css = document.createElement('link');
        css.id = LEAFLET_CSS_ID;
        css.rel = 'stylesheet';
        css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(css);
    }

    return new Promise<LeafletGlobal>((resolve, reject) => {
        const currentLeaflet = getLeaflet();
        if (currentLeaflet) {
            resolve(currentLeaflet);
            return;
        }

        const existingScript = document.getElementById(LEAFLET_SCRIPT_ID) as HTMLScriptElement | null;

        const resolveLeaflet = () => {
            const loadedLeaflet = getLeaflet();
            if (!loadedLeaflet) {
                reject(new Error('Leaflet script loaded but global L is unavailable'));
                return;
            }
            resolve(loadedLeaflet);
        };

        if (existingScript) {
            existingScript.addEventListener('load', resolveLeaflet, { once: true });
            existingScript.addEventListener('error', () => reject(new Error('Failed to load Leaflet script')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.id = LEAFLET_SCRIPT_ID;
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = resolveLeaflet;
        script.onerror = () => reject(new Error('Failed to load Leaflet script'));
        document.body.appendChild(script);
    });
};

export function NearestMarketSection() {
    const { data: apiMarkets, isLoading, error } = useRandomMarkets();
    const [selectedMarketId, setSelectedMarketId] = useState<string | number | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);
    const [routeError, setRouteError] = useState<string | null>(null);

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const markersRef = useRef<Map<string | number, LeafletMarker>>(new Map());
    const userMarkerRef = useRef<LeafletMarker | null>(null);
    const routeLineRef = useRef<LeafletPolyline | null>(null);
    const marketsRef = useRef<MarketMapItem[]>([]);

    const markets = useMemo(() => {
        if (apiMarkets && apiMarkets.length > 0) {
            const rawMarkets = apiMarkets as unknown as Array<Record<string, unknown>>;

            return rawMarkets.slice(0, 10).map((market, index) => {
                const { latitude, longitude } = resolveCoordinates(market, index);
                const rawDistance = market.distance_km ?? market.distance ?? market.distanceKm;
                const openHours = isRecord(market.opening_hours) ? market.opening_hours : null;

                return {
                    id: (market.id as string | number) ?? `market-${index + 1}`,
                    name: typeof market.name === 'string' ? market.name : 'Local Market',
                    address: typeof market.address === 'string' && market.address.trim().length > 0
                        ? market.address
                        : 'Address not available',
                    distance: formatDistance(rawDistance),
                    openTime: openHours?.is_closed
                        ? 'Closed'
                        : (typeof openHours?.opening === 'string' ? openHours.opening : '8:00 AM - 8:00 PM'),
                    rating: 4.5,
                    reviews: 0,
                    vendors: 0,
                    image: typeof market.image_path === 'string' && market.image_path.length > 0
                        ? `${IMAGE_BASE_URL}${market.image_path}`
                        : DEFAULT_MARKET_IMAGE,
                    isOpen: toBoolean(market.is_open ?? market.isOpen ?? market.open_now),
                    specialties: [typeof market.type === 'string' ? market.type : 'Local Market'],
                    featured: Boolean(market.is_featured),
                    latitude,
                    longitude,
                };
            }) satisfies MarketMapItem[];
        }
        return nearestMarkets as MarketMapItem[];
    }, [apiMarkets]);

    const marketSignature = useMemo(
        () => markets.map((market) => `${market.id}:${market.latitude}:${market.longitude}`).join('|'),
        [markets]
    );

    useEffect(() => {
        const storedLocation = getStoredUserLocation();
        if (storedLocation) {
            setUserLocation(storedLocation);
            return;
        }

        if (!('geolocation' in navigator)) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const nextLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                if (isFiniteLatLng(nextLocation.lat, nextLocation.lng)) {
                    setUserLocation(nextLocation);
                }
            },
            () => {
                // Ignore geolocation failure and leave route unavailable.
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 60000,
            }
        );
    }, []);

    useEffect(() => {
        setSelectedMarketId((current) => {
            if (markets.length === 0) {
                return null;
            }
            const exists = current !== null && markets.some((market) => market.id === current);
            return exists ? current : markets[0].id;
        });
    }, [markets]);

    useEffect(() => {
        marketsRef.current = markets;
    }, [markets]);

    useEffect(() => {
        let cancelled = false;

        const setupMap = async () => {
            if (!mapContainerRef.current || markets.length === 0) {
                return;
            }

            try {
                const L = await loadLeaflet();
                if (cancelled || !mapContainerRef.current) {
                    return;
                }

                if (!mapRef.current) {
                    mapRef.current = L.map(mapContainerRef.current, {
                        zoomControl: true,
                        scrollWheelZoom: false,
                    });

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors',
                        maxZoom: 19,
                    }).addTo(mapRef.current);
                }

                markersRef.current.forEach((marker) => marker.remove());
                markersRef.current.clear();
                userMarkerRef.current?.remove();
                userMarkerRef.current = null;
                routeLineRef.current?.remove();
                routeLineRef.current = null;

                const boundsCoordinates: [number, number][] = [];
                const marketMarkerIcon = createMarketMarkerIcon(L);
                markets.forEach((market) => {
                    if (!isFiniteLatLng(market.latitude, market.longitude)) {
                        return;
                    }

                    const marker = L.marker([market.latitude, market.longitude], { icon: marketMarkerIcon })
                        .addTo(mapRef.current as LeafletMap)
                        .bindPopup(createMarketPopupHtml(market))
                        .on('click', () => {
                            setSelectedMarketId(market.id);
                        });

                    markersRef.current.set(market.id, marker);
                    boundsCoordinates.push([market.latitude, market.longitude]);
                });

                if (userLocation && isFiniteLatLng(userLocation.lat, userLocation.lng)) {
                    const userMarkerIcon = createUserMarkerIcon(L);
                    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userMarkerIcon })
                        .addTo(mapRef.current as LeafletMap)
                        .bindPopup('<div><strong>Your Location</strong></div>');
                }

                if (boundsCoordinates.length === 1) {
                    mapRef.current.setView(boundsCoordinates[0], 13);
                } else if (boundsCoordinates.length > 1) {
                    mapRef.current.fitBounds(L.latLngBounds(boundsCoordinates), { padding: [36, 36] });
                } else {
                    mapRef.current.setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 12);
                }

                setIsMapReady(true);
                setMapError(null);

                window.requestAnimationFrame(() => {
                    mapRef.current?.invalidateSize();
                });
            } catch (setupError) {
                if (!cancelled) {
                    setMapError('Map could not be loaded. Please try again.');
                    setIsMapReady(false);
                    console.error('Leaflet setup error:', setupError);
                }
            }
        };

        setupMap();

        return () => {
            cancelled = true;
        };
    }, [markets, userLocation]);

    useEffect(() => {
        let cancelled = false;

        const focusAndRoute = async () => {
            if (!selectedMarketId || !mapRef.current) {
                routeLineRef.current?.remove();
                routeLineRef.current = null;
                setRouteError(null);
                return;
            }

            const selectedMarket = marketsRef.current.find((market) => market.id === selectedMarketId);
            if (!selectedMarket || !isFiniteLatLng(selectedMarket.latitude, selectedMarket.longitude)) {
                return;
            }

            const targetCenter: [number, number] = [selectedMarket.latitude, selectedMarket.longitude];

            const marker = markersRef.current.get(selectedMarketId);
            if (marker) {
                try {
                    marker.openPopup();
                } catch {
                    // Ignore popup failures and keep focusing behavior.
                }
            }

            const currentZoom = mapRef.current.getZoom();
            const safeZoom = Number.isFinite(currentZoom) ? Math.max(currentZoom, 14) : 14;

            if (!userLocation || !isFiniteLatLng(userLocation.lat, userLocation.lng)) {
                routeLineRef.current?.remove();
                routeLineRef.current = null;
                setRouteError('Enable location to draw route to market.');
                try {
                    mapRef.current.flyTo(targetCenter, safeZoom, { duration: 0.5 });
                } catch {
                    mapRef.current.setView(targetCenter, safeZoom);
                }
                return;
            }

            try {
                const routeCoordinates = await fetchRouteCoordinates(userLocation, {
                    lat: selectedMarket.latitude,
                    lng: selectedMarket.longitude,
                });
                const L = await loadLeaflet();

                if (cancelled || !mapRef.current) {
                    return;
                }

                routeLineRef.current?.remove();
                routeLineRef.current = L.polyline(routeCoordinates, {
                    color: '#2563eb',
                    weight: 4,
                    opacity: 0.9,
                }).addTo(mapRef.current);

                mapRef.current.fitBounds(L.latLngBounds(routeCoordinates), { padding: [36, 36] });
                setRouteError(null);
            } catch {
                if (cancelled || !mapRef.current) {
                    return;
                }

                routeLineRef.current?.remove();
                routeLineRef.current = null;
                setRouteError('Could not load route right now.');

                try {
                    mapRef.current.flyTo(targetCenter, safeZoom, { duration: 0.5 });
                } catch {
                    mapRef.current.setView(targetCenter, safeZoom);
                }
            }
        };

        focusAndRoute();

        return () => {
            cancelled = true;
        };
    }, [selectedMarketId, userLocation, marketSignature]);

    useEffect(() => {
        const markerInstances = markersRef.current;

        return () => {
            markerInstances.forEach((marker) => marker.remove());
            markerInstances.clear();
            userMarkerRef.current?.remove();
            userMarkerRef.current = null;
            routeLineRef.current?.remove();
            routeLineRef.current = null;
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    if (isLoading) {
        return (
            <section className="py-4 sm:py-8 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-muted-foreground">Finding nearest markets...</p>
                </div>
            </section>
        );
    }
    return (
        <section className="py-4 sm:py-8 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Nearest Markets</h2>
                        <p className="text-muted-foreground">Explore nearby shops on OpenStreetMap</p>
                    </div>
                </div>

                <div className="relative z-0 rounded-2xl border border-border overflow-hidden bg-card">
                    {!isMapReady && !mapError && (
                        <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-center">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                                <p className="text-sm text-muted-foreground">Loading map...</p>
                            </div>
                        </div>
                    )}
                    {mapError && (
                        <div className="absolute inset-0 z-10 bg-background/90 flex items-center justify-center px-4 text-center">
                            <p className="text-sm text-destructive">{mapError}</p>
                        </div>
                    )}
                    <div ref={mapContainerRef} className="relative z-0 h-[300px] sm:h-[380px] lg:h-[430px] w-full" />
                </div>

                <div className="relative z-20 -mt-[30px] sm:-mt-[38px] lg:-mt-[43px]">
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={12}
                        slidesPerView={1.1}
                        slidesOffsetBefore={12}
                        slidesOffsetAfter={12}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 14,
                                slidesOffsetBefore: 14,
                                slidesOffsetAfter: 14,
                            },
                            1280: {
                                slidesPerView: 3,
                                spaceBetween: 16,
                                slidesOffsetBefore: 16,
                                slidesOffsetAfter: 16,
                            },
                        }}
                        className="nearest-markets-slider pb-8"
                    >
                        {markets.map((market) => {
                            const isSelected = selectedMarketId === market.id;
                            return (
                                <SwiperSlide key={market.id}>
                                    <div
                                        className={`h-full rounded-xl border p-4 bg-background transition-all ${isSelected
                                            ? 'border-primary shadow-[0_0_0_1px_hsl(var(--primary))]'
                                            : 'border-border hover:border-primary/40'
                                            }`}
                                    >
                                        <Link
                                            href={`/markets/${market.id}`}
                                            className="block rounded-md mb-3 hover:bg-muted/40 transition-colors p-1 -m-1"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm sm:text-base leading-tight">{market.name}</p>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{market.address}</p>
                                                </div>
                                                <span className={`text-[11px] px-2 py-1 rounded-full whitespace-nowrap ${market.isOpen
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {market.isOpen ? 'Open' : 'Closed'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                                                <span>{market.distance}</span>
                                                <span>{market.openTime}</span>
                                            </div>
                                        </Link>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedMarketId(market.id)}
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-primary/30 text-primary hover:bg-primary/10 text-xs sm:text-sm font-medium transition-colors"
                                            >
                                                <MapPin className="h-4 w-4" />
                                                Show on map
                                            </button>
                                            <Link
                                                href={`/markets/${market.id}`}
                                                className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm font-medium transition-colors"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>

                {routeError && (
                    <p className="text-xs text-muted-foreground mt-2">
                        {routeError}
                    </p>
                )}

                {error && (
                    <p className="text-xs text-muted-foreground mt-3">
                        Live market data is unavailable right now. Showing fallback nearby markets.
                    </p>
                )}

                <div className="text-center mt-6">
                    <Link
                        href="/markets"
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium inline-block"
                    >
                        View All Markets
                    </Link>
                </div>
            </div>
        </section>
    );
}

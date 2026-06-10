"use client";

import { useEffect, useRef } from 'react';

interface MarketMapProps {
    latitude: number;
    longitude: number;
    name: string;
    address: string | null;
}

const LEAFLET_SCRIPT_ID = 'leaflet-js-market';
const LEAFLET_CSS_ID = 'leaflet-css-market';

export function MarketMap({ latitude, longitude, name, address }: MarketMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<unknown>(null);

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            if (!containerRef.current || mapRef.current) return;

            if (!document.getElementById(LEAFLET_CSS_ID)) {
                const css = document.createElement('link');
                css.id = LEAFLET_CSS_ID;
                css.rel = 'stylesheet';
                css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(css);
            }

            await new Promise<void>((resolve, reject) => {
                const win = window as Window & { L?: unknown };
                if (win.L) { resolve(); return; }
                const existing = document.getElementById(LEAFLET_SCRIPT_ID) as HTMLScriptElement | null;
                const onLoad = () => resolve();
                const onErr = () => reject(new Error('Leaflet failed'));
                if (existing) {
                    existing.addEventListener('load', onLoad, { once: true });
                    existing.addEventListener('error', onErr, { once: true });
                    return;
                }
                const s = document.createElement('script');
                s.id = LEAFLET_SCRIPT_ID;
                s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                s.async = true;
                s.onload = onLoad;
                s.onerror = onErr;
                document.body.appendChild(s);
            });

            if (cancelled || !containerRef.current) return;

            const L = (window as Window & { L: unknown }).L as {
                map: (el: HTMLDivElement, opts?: object) => {
                    setView: (c: [number, number], z: number) => void;
                    remove: () => void;
                };
                tileLayer: (url: string, opts?: object) => { addTo: (m: unknown) => void };
                marker: (c: [number, number]) => { addTo: (m: unknown) => unknown; bindPopup: (s: string) => { openPopup: () => void } };
            };

            const map = L.map(containerRef.current, { scrollWheelZoom: false });
            mapRef.current = map;
            map.setView([latitude, longitude], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);

            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup(`<strong>${name}</strong>${address ? `<br/>${address}` : ''}`)
                .openPopup();
        };

        init();

        return () => {
            cancelled = true;
            if (mapRef.current) {
                (mapRef.current as { remove: () => void }).remove();
                mapRef.current = null;
            }
        };
    }, [latitude, longitude, name, address]);

    return <div ref={containerRef} className="h-full w-full" />;
}

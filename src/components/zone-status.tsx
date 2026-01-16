'use client';

import { useZone } from '@/providers/zone-provider';

/**
 * Zone status widget - Shows current zone and allows precise location
 */
export default function ZoneStatus() {
    const { zone, zoneData, isLoading, usePreciseLocation } = useZone();

    if (isLoading) {
        return (
            <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-blue-50 p-3 shadow-lg">
                <div className="flex items-center gap-2">
                    <svg
                        className="h-4 w-4 animate-spin text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    <span className="text-xs text-blue-900">Detecting zone...</span>
                </div>
            </div>
        );
    }

    const locationSource = typeof window !== 'undefined'
        ? localStorage.getItem('location_source')
        : null;

    return (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-white p-3 shadow-lg border border-gray-200">
            <div className="space-y-2">
                {zone ? (
                    <>
                        <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm font-semibold text-gray-900">{zone.name}</span>
                        </div>

                        {zoneData && (
                            <div className="space-y-1 text-xs text-gray-600">
                                <p>
                                    Status:{' '}
                                    {zone.is_active ? (
                                        <span className="text-green-600 font-medium">Active</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">Inactive</span>
                                    )}
                                </p>
                            </div>
                        )}

                        {locationSource === 'ip' && (
                            <button
                                onClick={usePreciseLocation}
                                className="w-full rounded border border-blue-600 bg-blue-50 px-2 py-1 text-xs text-blue-700 hover:bg-blue-100"
                            >
                                📍 Use Precise Location
                            </button>
                        )}
                    </>
                ) : (
                    <p className="text-xs text-gray-600">No zone detected</p>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useGetZone, useGetZoneMutation } from '@/lib/api';

/**
 * Example component demonstrating zone detection API usage
 */
export default function ZoneDetectionExample() {
    const [lat, setLat] = useState('23.8103');
    const [lng, setLng] = useState('90.4125');
    const [enableQuery, setEnableQuery] = useState(false);

    // Method 1: Using query hook (automatic)
    const coordinates = enableQuery ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;
    const { data: queryData, isLoading: queryLoading } = useGetZone(coordinates, enableQuery);

    // Method 2: Using mutation hook (on-demand)
    const { mutate, data: mutationData, isPending } = useGetZoneMutation();

    const handleCheckZone = () => {
        mutate({
            lat: parseFloat(lat),
            lng: parseFloat(lng),
        });
    };

    const handleAutoDetect = () => {
        setEnableQuery(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Zone Detection API</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Test the get-zone API with lat/lng coordinates
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Method 1: Query Pattern */}
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold text-gray-900">
                            Method 1: Query Hook
                        </h2>
                        <p className="mb-4 text-sm text-gray-600">
                            Automatic fetching when coordinates are provided
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Latitude
                                </label>
                                <input
                                    type="text"
                                    value={lat}
                                    onChange={(e) => setLat(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="23.8103"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Longitude
                                </label>
                                <input
                                    type="text"
                                    value={lng}
                                    onChange={(e) => setLng(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="90.4125"
                                />
                            </div>

                            <button
                                onClick={handleAutoDetect}
                                disabled={queryLoading}
                                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {queryLoading ? 'Detecting...' : 'Auto Detect Zone'}
                            </button>

                            {queryData && (
                                <div className="mt-4 rounded-lg bg-green-50 p-4">
                                    <p className="font-semibold text-green-900">
                                        {queryData.id ? '✓ Zone Found' : '✗ No Zone'}
                                    </p>
                                    {queryData.id && (
                                        <div className="mt-2 space-y-1 text-sm text-green-800">
                                            <p>
                                                <strong>Name:</strong> {queryData.name}
                                            </p>
                                            <p>
                                                <strong>Status:</strong>{' '}
                                                {queryData.is_active ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Method 2: Mutation Pattern */}
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold text-gray-900">
                            Method 2: Mutation Hook
                        </h2>
                        <p className="mb-4 text-sm text-gray-600">
                            On-demand fetching with button click
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Latitude
                                </label>
                                <input
                                    type="text"
                                    value={lat}
                                    onChange={(e) => setLat(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="23.8103"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Longitude
                                </label>
                                <input
                                    type="text"
                                    value={lng}
                                    onChange={(e) => setLng(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="90.4125"
                                />
                            </div>

                            <button
                                onClick={handleCheckZone}
                                disabled={isPending}
                                className="w-full rounded-lg bg-purple-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isPending ? 'Checking...' : 'Check Zone'}
                            </button>

                            {mutationData && (
                                <div className="mt-4 rounded-lg bg-purple-50 p-4">
                                    <p className="font-semibold text-purple-900">
                                        {mutationData.id ? '✓ Zone Found' : '✗ No Zone'}
                                    </p>
                                    {mutationData.id && (
                                        <div className="mt-2 space-y-1 text-sm text-purple-800">
                                            <p>
                                                <strong>Name:</strong> {mutationData.name}
                                            </p>
                                            <p>
                                                <strong>Status:</strong>{' '}
                                                {mutationData.is_active ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* API Information */}
                <div className="mt-8 rounded-xl bg-white p-6 shadow-lg">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">API Details</h3>
                    <div className="space-y-2 rounded-lg bg-gray-50 p-4 font-mono text-sm">
                        <p>
                            <strong>Endpoint:</strong> POST /api/config/get-zone
                        </p>
                        <p>
                            <strong>Payload:</strong> {`{ "lat": ${lat}, "lng": ${lng} }`}
                        </p>
                        <p>
                            <strong>Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL}
                        </p>
                    </div>
                </div>

                {/* Documentation Link */}
                <div className="mt-6 text-center">
                    <a
                        href="/ZONE_API_USAGE.md"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        📚 View Full Documentation
                    </a>
                </div>
            </div>
        </div>
    );
}

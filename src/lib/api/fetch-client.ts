export interface FetchOptions extends RequestInit {
    params?: Record<string, string | number | undefined>;
    throwOnError?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bazardor.chhagolnaiyasportareana.xyz/api';
const ZONE_OPTIONAL_ENDPOINTS = new Set(['/config/get-zone']);

function normalizeEndpoint(endpoint: string): string {
    if (!endpoint) return '';

    try {
        if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
            return new URL(endpoint).pathname;
        }
    } catch {
        // ignore and use fallback
    }

    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

function getHeaderValue(headers: HeadersInit | undefined, key: string): string | undefined {
    if (!headers) return undefined;

    const normalizedKey = key.toLowerCase();

    if (headers instanceof Headers) {
        return headers.get(key) ?? headers.get(normalizedKey) ?? undefined;
    }

    if (Array.isArray(headers)) {
        const match = headers.find(([headerKey]) => headerKey.toLowerCase() === normalizedKey);
        return match?.[1];
    }

    const headerRecord = headers as Record<string, string | undefined>;
    return headerRecord[key] ?? headerRecord[normalizedKey];
}

export async function fetchClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T | null> {
    const { params, headers, throwOnError = true, ...rest } = options;
    const endpointPath = normalizeEndpoint(endpoint);
    const zoneId = getHeaderValue(headers as HeadersInit | undefined, 'zoneId')
        ?? getHeaderValue(headers as HeadersInit | undefined, 'x-zone-id');

    if (!zoneId && !ZONE_OPTIONAL_ENDPOINTS.has(endpointPath)) {
        if (throwOnError) {
            throw new Error(`Zone is required before requesting ${endpointPath}`);
        }
        return null;
    }

    // 1. Construct URL with query parameters
    let url = `${BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, value.toString());
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += (url.includes('?') ? '&' : '?') + queryString;
        }
    }

    // 2. Perform fetch
    try {
        const response = await fetch(url, {
            ...rest,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers,
            },
        });

        // 3. Handle errors
        if (!response.ok) {
            if (!throwOnError) {
                return null;
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API error: ${response.status}`);
        }

        // 4. Return parsed response
        const result = await response.json();

        // Unwrap 'data' if present
        if (result && typeof result === 'object' && 'data' in result && !('success' in result && result.success === false)) {
            return result.data as T;
        }

        return result as T;
    } catch (error) {
        if (throwOnError) {
            throw error;
        }
        console.error(`Fetch error for ${url}:`, error);
        return null;
    }
}

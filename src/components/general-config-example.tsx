"use client";

import { useConfig } from '@/hooks/use-config';

/**
 * Example component showing how to access general config from anywhere in the project
 */
export function GeneralConfigExample() {
  const { config, freshConfig, isLoading, error, getConfigValue } = useConfig();

  // Example of getting specific config values
  const appName = getConfigValue('appName', 'Default App');
  const apiVersion = getConfigValue('version', '1.0.0');

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-3">General Config Access</h3>
      
      {/* Specific Values */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-1">App Name:</h4>
          <p className="text-sm font-medium">{appName}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-1">API Version:</h4>
          <p className="text-sm font-medium">{apiVersion}</p>
        </div>
      </div>

      {/* From Zustand Store */}
      <div className="mb-4">
        <h4 className="font-medium text-sm text-muted-foreground mb-2">Cached Config (Store):</h4>
        {config ? (
          <pre className="text-xs bg-muted p-2 rounded max-h-32 overflow-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">No config in store yet</p>
        )}
      </div>

      {/* From API (Fresh Data) */}
      <div>
        <h4 className="font-medium text-sm text-muted-foreground mb-2">Fresh Config (API):</h4>
        {isLoading && <p className="text-sm">Loading...</p>}
        {error && <p className="text-sm text-red-500">Error: {error.message}</p>}
        {freshConfig && (
          <pre className="text-xs bg-muted p-2 rounded max-h-32 overflow-auto">
            {JSON.stringify(freshConfig, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
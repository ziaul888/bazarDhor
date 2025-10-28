"use client";

import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import { getPWADisplayMode, isPWAInstalled } from '@/lib/pwa-utils';

export function PWAStatus() {
  const [displayMode, setDisplayMode] = useState<string>('unknown');
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setDisplayMode(getPWADisplayMode());
    setIsInstalled(isPWAInstalled());
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Only show in development or for debugging
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded-lg backdrop-blur-sm z-50">
      <div className="flex items-center space-x-2">
        {isInstalled ? (
          <Smartphone className="h-3 w-3 text-green-400" />
        ) : (
          <Monitor className="h-3 w-3 text-blue-400" />
        )}
        <span>{isInstalled ? 'PWA' : 'Browser'}</span>
        
        {isOnline ? (
          <Wifi className="h-3 w-3 text-green-400" />
        ) : (
          <WifiOff className="h-3 w-3 text-red-400" />
        )}
        
        <span className="text-gray-300">|</span>
        <span>{displayMode}</span>
      </div>
    </div>
  );
}
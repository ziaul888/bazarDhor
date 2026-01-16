"use client";

import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/use-pwa';

export function OfflineIndicator() {
  const { isOnline } = usePWA();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineMessage(true);
      setWasOffline(true);
    } else if (wasOffline) {
      // Show "back online" message briefly
      setShowOfflineMessage(true);
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div className={`fixed top-16 md:top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 transition-all duration-300 ${
      showOfflineMessage ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <Card className={`shadow-lg backdrop-blur-sm py-3 gap-0 ${
        isOnline 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-orange-50 border-orange-200 text-orange-800'
      }`}>
        <CardContent className="flex items-center space-x-2 p-3">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-orange-600" />
          )}
          <span className="text-sm font-medium">
            {isOnline ? 'Back online!' : 'You\'re offline'}
          </span>
          {!isOnline && (
            <p className="text-xs mt-1 text-orange-700">
              Some features may be limited. Cached content is still available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
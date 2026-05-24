"use client";

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useZone } from '@/providers/zone-provider';

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

export function HomeHeader() {
  const { zone } = useZone();
  // Why: rendering `new Date()` directly causes a server/client hydration mismatch
  // because the server timestamp differs from the client's. Defer to client-only.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    setToday(dateFmt.format(new Date()));
  }, []);

  return (
    <header className="container mx-auto max-w-3xl lg:max-w-6xl px-4 pt-5 pb-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-sm font-medium min-w-0">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="truncate">{zone?.name || 'Detecting location…'}</span>
        </div>
        {today ? (
          <span className="flex-none text-xs text-muted-foreground">Today · {today}</span>
        ) : null}
      </div>
    </header>
  );
}

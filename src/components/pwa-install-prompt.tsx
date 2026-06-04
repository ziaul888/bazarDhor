"use client";

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { usePWA } from '@/hooks/use-pwa';

const DISMISS_KEY = 'pwa-install-dismissed';
const TOAST_ID = 'pwa-install';
const FIRST_LOAD_DELAY_MS = 1500;

// Renders nothing — the prompt surfaces as a Sonner toast so it lives in the
// same top-center notification slot as the rest of the app.
export function PWAInstallPrompt() {
  const { canInstall, isInstalled, install } = usePWA();
  const shownRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (shownRef.current) return;
    if (!canInstall || isInstalled) return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    const timer = window.setTimeout(() => {
      shownRef.current = true;
      toast('Install BazarDhor', {
        id: TOAST_ID,
        description: 'Add the app to your home screen for faster access.',
        duration: Infinity,
        action: {
          label: 'Install',
          onClick: async () => {
            try {
              await install();
              localStorage.setItem(DISMISS_KEY, 'installed');
            } catch (error) {
              console.error('Installation failed:', error);
            } finally {
              toast.dismiss(TOAST_ID);
            }
          },
        },
        cancel: {
          label: 'Not now',
          onClick: () => {
            localStorage.setItem(DISMISS_KEY, 'dismissed');
            toast.dismiss(TOAST_ID);
          },
        },
        onDismiss: () => {
          localStorage.setItem(DISMISS_KEY, 'dismissed');
        },
      });
    }, FIRST_LOAD_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [canInstall, isInstalled, install]);

  return null;
}

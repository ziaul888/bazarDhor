// PWA utility functions

export const isPWAInstalled = (): boolean => {
  // Check if running in standalone mode (installed PWA)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isInWebAppiOS = (window.navigator as { standalone?: boolean }).standalone === true;
  
  return isStandalone || isInWebAppiOS;
};

export const canInstallPWA = (): boolean => {
  // Check if PWA can be installed (beforeinstallprompt event support)
  return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
};

export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update notification
              showUpdateNotification();
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

const showUpdateNotification = (): void => {
  // You can implement a custom update notification here
  if (confirm('A new version is available. Reload to update?')) {
    window.location.reload();
  }
};

export const getInstallPrompt = (): Promise<Event> => {
  return new Promise((resolve) => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      resolve(e);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  });
};

// Check if device supports PWA features
export const getPWADisplayMode = (): string => {
  const isStandalone = window.matchMedia('(display-mode: standalone)');
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)');
  const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)');
  const isBrowser = window.matchMedia('(display-mode: browser)');

  if (isFullscreen.matches) return 'fullscreen';
  if (isStandalone.matches) return 'standalone';
  if (isMinimalUI.matches) return 'minimal-ui';
  if (isBrowser.matches) return 'browser';
  
  return 'unknown';
};

// Analytics for PWA usage
export const trackPWAUsage = (): void => {
  const displayMode = getPWADisplayMode();
  const isInstalled = isPWAInstalled();
  
  // You can send this data to your analytics service
  console.log('PWA Usage:', {
    displayMode,
    isInstalled,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });
};
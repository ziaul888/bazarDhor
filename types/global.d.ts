// Global type declarations

declare module 'swiper/css';
declare module 'swiper/css/*';
declare module 'swiper/swiper.css';
declare module 'swiper/*.css';

declare module 'minimatch' {
  function minimatch(target: string, pattern: string, options?: any): boolean;
  export = minimatch;
}

// PWA types
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface Navigator {
  standalone?: boolean;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}
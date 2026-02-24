import type { Metadata, Viewport } from "next";
import { Poppins, Source_Code_Pro, Playfair_Display, Open_Sans } from "next/font/google";
import "./globals.css";
import { MobileNavbar } from "@/components/mobile-navbar";
import { BottomNav } from "@/components/bottom-nav";
import { SearchProvider } from "./_components/search-context";
import { AuthProvider } from "@/components/auth/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { Footer } from "./_components/footer";
import { QueryProvider } from "@/providers/query-provider";
import { AddItemProvider } from "@/components/add-item-context";
import { AddItemDrawer } from "@/components/add-item-drawer";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { OfflineIndicator } from "@/components/offline-indicator";
import { PWAStatus } from "@/components/pwa-status";
import { Notifications } from "@/components/notifications";
import { Toaster } from "sonner";
import { ZoneProvider } from "@/providers/zone-provider";
import { cookies } from "next/headers";
import { configServerApi } from "@/lib/api/services/server/config-server";
import { ConfigBootstrap } from "@/providers/config-bootstrap";


// Primary fonts - Modern and friendly
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  display: "swap",
});

// Alternative fonts for variety
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#10b981",
};

export const metadata: Metadata = {
  title: {
    template: '%s | Fresh Market Finder',
    default: 'Fresh Market Finder - Find Local Groceries'
  },
  description: "Discover fresh groceries from local markets and farmers. Compare prices, find the best deals, and support your community.",
  manifest: "/manifest.json",
  alternates: {
    canonical: 'https://freshmarketfinder.com',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Market Finder",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Fresh Market Finder",
    title: "Fresh Market Finder - Find Local Groceries",
    description: "Discover fresh groceries from local markets and farmers. Compare prices, find the best deals, and support your community.",
    locale: 'en_US',
    url: 'https://freshmarketfinder.com',
  },
  twitter: {
    card: "summary_large_image",
    title: "Fresh Market Finder - Find Local Groceries",
    description: "Discover fresh groceries from local markets and farmers. Compare prices, find the best deals, and support your community.",
    creator: '@freshmarketfinder',
  },
  keywords: ['market finder', 'local markets', 'grocery prices', 'farmers market', 'price comparison', 'fresh produce'],
  authors: [{ name: 'Fresh Market Finder Team' }],
  creator: 'Fresh Market Finder',
  publisher: 'Fresh Market Finder',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const zoneId = cookieStore.get('zoneId')?.value;

  const [appConfig, settings, generalConfig] = zoneId
    ? await Promise.all([
        configServerApi.getAppConfig({ zoneId }),
        configServerApi.getSettings({ zoneId }),
        configServerApi.getGeneralConfig({ zoneId }),
      ])
    : [null, null, null];

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Market Finder" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${poppins.variable} ${sourceCodePro.variable} ${playfairDisplay.variable} ${openSans.variable} font-poppins antialiased`}
      >
        <QueryProvider>
          <ConfigBootstrap appConfig={appConfig} settings={settings} generalConfig={generalConfig} />
          <ZoneProvider>
            <SearchProvider>
              <AuthProvider>
                <AddItemProvider>
                  <MobileNavbar />
                  <main className="min-h-screen pb-20 md:pb-0">
                    {children}
                  </main>
                  <Footer />
                  <BottomNav />
                  <AuthModal />
                  <AddItemDrawer />
                  <PWAInstallPrompt />
                  <OfflineIndicator />
                  <PWAStatus />
                  <Notifications />
                  <Toaster position="top-right" richColors closeButton />
                </AddItemProvider>
              </AuthProvider>
            </SearchProvider>
          </ZoneProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

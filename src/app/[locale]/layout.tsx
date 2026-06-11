import type { Metadata, Viewport } from "next";
import { Poppins, Source_Code_Pro, Playfair_Display, Open_Sans } from "next/font/google";
import "../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { MobileNavbar } from "@/components/mobile-navbar";
import { BottomNav } from "@/components/bottom-nav";
import { SearchProvider } from "./_components/search-context";
import { AuthProvider } from "@/components/auth/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { Footer } from "./_components/footer";
import { QueryProvider } from "@/providers/query-provider";
import { AddItemProvider } from "@/components/add-item-context";
import { AddItemDrawer } from "@/components/add-item-drawer";
import { GlobalFloatingAddButton } from "@/components/floating-add-button";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { OfflineIndicator } from "@/components/offline-indicator";
import { PWAStatus } from "@/components/pwa-status";
import { Notifications } from "@/components/notifications";
import { Toaster } from "sonner";
import { ZoneProvider } from "@/providers/zone-provider";
import { cookies } from "next/headers";
import { configServerApi } from "@/lib/api/services/server/config-server";
import { ConfigBootstrap } from "@/providers/config-bootstrap";
import { RouteTransition } from "@/components/route-transition";
import { routing, LOCALE_TO_HEADER, LOCALIZATION_HEADER, type AppLocale } from "@/i18n/routing";


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
  themeColor: "#38bdf8",
};

// Why: keep the canonical site origin in one constant so metadata, OG URLs,
// sitemap, and robots.ts all agree. Override with NEXT_PUBLIC_SITE_URL once
// the production domain is set.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bazardhor.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'seo' });

  const brand = t('brand');
  const titleDefault = t('titleDefault');
  const titleTemplate = t('titleTemplate');
  const description = t('description');
  const keywords = t('keywords').split(',').map((k) => k.trim()).filter(Boolean);
  const ogLocale = locale === 'bn' ? 'bn_BD' : 'en_US';

  // Build language alternates with absolute URLs so hreflang is valid.
  const languages: Record<string, string> = {};
  for (const lng of routing.locales) {
    languages[lng === 'bn' ? 'bn-BD' : 'en-US'] = `${SITE_URL}/${lng}`;
  }
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: titleTemplate,
      default: titleDefault,
    },
    description,
    manifest: '/manifest.json',
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: brand,
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: 'website',
      siteName: brand,
      title: titleDefault,
      description,
      locale: ogLocale,
      url: `${SITE_URL}/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: titleDefault,
      description,
    },
    keywords,
    authors: [{ name: brand }],
    creator: brand,
    publisher: brand,
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
}

// Why: enables static rendering for every locale at build time. Without this
// next-intl will fall back to dynamic rendering for everything under [locale].
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const localization = LOCALE_TO_HEADER[locale as AppLocale];
  const cookieStore = await cookies();
  const zoneId = cookieStore.get('zoneId')?.value;

  // Why: server-side config bootstrap needs both the zoneId (for the existing
  // zone guard) and the active locale so the backend can pick a language.
  const serverHeaders = {
    ...(zoneId ? { zoneId } : {}),
    [LOCALIZATION_HEADER]: localization,
  };

  const [appConfig, settings, generalConfig] = zoneId
    ? await Promise.all([
        configServerApi.getAppConfig(serverHeaders),
        configServerApi.getSettings(serverHeaders),
        configServerApi.getGeneralConfig(serverHeaders),
      ])
    : [null, null, null];

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#38bdf8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BazarDhor" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#38bdf8" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${poppins.variable} ${sourceCodePro.variable} ${playfairDisplay.variable} ${openSans.variable} font-poppins antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <QueryProvider>
            <ConfigBootstrap appConfig={appConfig} settings={settings} generalConfig={generalConfig} />
            <ZoneProvider>
              <SearchProvider>
                <AuthProvider>
                  <AddItemProvider>
                    <MobileNavbar />
                    <main className="min-h-screen pb-20 md:pb-0">
                      <RouteTransition>{children}</RouteTransition>
                    </main>
                    <div className="hidden md:block">
                      <Footer />
                    </div>
                    <BottomNav />
                    <AuthModal />
                    <AddItemDrawer />
                    <GlobalFloatingAddButton />
                    <PWAInstallPrompt />
                    <OfflineIndicator />
                    <PWAStatus />
                    <Notifications />
                    <Toaster position="top-center" richColors closeButton />
                  </AddItemProvider>
                </AuthProvider>
              </SearchProvider>
            </ZoneProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

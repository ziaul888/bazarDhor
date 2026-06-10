"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-context";
import { useConfig } from "@/hooks/use-config";

import {
  Home,
  Store,
  Tag,
  Info,
  User,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBrandInitial, resolveBrandImage } from "@/lib/branding";
import { cn } from "@/lib/utils";
import { LocaleSwitch } from "@/components/locale-switch";

export function MobileNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { openAuthModal, hasHydrated, isAuthenticated, user } = useAuth();
  const { getConfigValue } = useConfig();
  const t = useTranslations("nav");

  // Why: nav labels are translated so we build the list inside the component;
  // hrefs stay locale-less because next-intl middleware prefixes them.
  const navigation = [
    { name: t("home"), href: "/", icon: Home },
    { name: t("markets"), href: "/markets", icon: Store },
    { name: t("items"), href: "/items", icon: Tag },
    { name: t("about"), href: "/about", icon: Info },
  ];

  const avatarUrl = typeof user?.avatar === "string" && user.avatar.trim() ? user.avatar : undefined;
  const userDisplayName = user?.name?.trim() || t("profile");
  const companyName = getConfigValue<string>("business_name", "MyApp") || "MyApp";
  const brandLogo = resolveBrandImage(getConfigValue<string | null>("logo", null));
  const brandInitial = getBrandInitial(companyName);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
            : "bg-background border-b"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 items-center h-14 sm:h-16 lg:flex lg:justify-between">
            {/* Mobile-only left spacer to balance the right actions and keep the logo centered. */}
            <div aria-hidden className="lg:hidden" />

            {/* Logo — centered on mobile, left-aligned on desktop */}
            <Link
              href="/"
              className="flex items-center space-x-2 justify-self-center lg:justify-self-auto"
            >
              <div className="relative h-8 w-20 overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 shadow-lg ring-1 ring-primary/20">
                {brandLogo ? (
                  <Image
                    src={brandLogo}
                    alt={companyName}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">{brandInitial}</span>
                  </div>
                )}
              </div>
              <span className="font-bold text-lg sm:text-xl hidden lg:block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {companyName}
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-2 py-1 text-sm font-medium transition-all duration-200 relative group",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-colors duration-200",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-muted-foreground/30 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center justify-end space-x-1 sm:space-x-2">
              {hasHydrated &&
                (isAuthenticated ? (
                  <Button
                    asChild
                    variant="ghost"
                    className="hidden lg:flex h-9 px-3 text-sm font-medium"
                  >
                    <Link href="/profile" aria-label={userDisplayName} title={userDisplayName}>
                      <span className="flex items-center">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={userDisplayName}
                            className="h-6 w-6 rounded-full object-cover mr-2"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <User className="h-4 w-4 mr-2" />
                        )}
                        {t("profile")}
                      </span>
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="hidden lg:flex h-9 px-3 text-sm font-medium"
                    aria-label={t("signIn")}
                    onClick={() => openAuthModal("signin")}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {t("signIn")}
                  </Button>
                ))}

              {/* Mobile avatar — shown only when signed in */}
              {hasHydrated && isAuthenticated && (
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 overflow-hidden rounded-full lg:hidden"
                >
                  <Link href="/profile" aria-label={userDisplayName} title={userDisplayName}>
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={userDisplayName}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </Link>
                </Button>
              )}

              {/* Mobile sign-in — shown only when not signed in */}
              {hasHydrated && !isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 lg:hidden"
                  aria-label={t("signIn")}
                  onClick={() => openAuthModal("signin")}
                >
                  <LogIn className="h-4 w-4" />
                </Button>
              )}

              <LocaleSwitch className="ml-1" />
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-14 sm:h-16" />
    </>
  );
}

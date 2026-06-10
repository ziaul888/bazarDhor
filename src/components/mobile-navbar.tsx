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
  const companyName = getConfigValue<string>("business_name", "BazarDhor") || "BazarDhor";
  const brandLogo = resolveBrandImage(getConfigValue<string | null>("logo", null));
  const brandInitial = getBrandInitial(companyName);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[box-shadow,background-color,border-color] duration-200",
          "bg-background/90 backdrop-blur-md",
          isScrolled
            ? "border-b border-border shadow-[0_1px_0_0_rgba(0,0,0,0.02)]"
            : "border-b border-border/40"
        )}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            {/* Brand — left-aligned everywhere */}
            <Link
              href="/"
              aria-label={companyName}
              className="flex items-center gap-2 min-w-0 -ml-1 px-1 py-1 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="relative inline-flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm ring-1 ring-primary/10">
                {brandLogo ? (
                  <Image
                    src={brandLogo}
                    alt={companyName}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                ) : (
                  <span className="font-bold text-sm leading-none">{brandInitial}</span>
                )}
              </span>
              <span className="font-semibold text-base sm:text-lg truncate min-w-0">
                {companyName}
              </span>
            </Link>

            {/* Desktop primary nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "relative inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 flex-none">
              <LocaleSwitch />

              {hasHydrated && isAuthenticated && (
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 overflow-hidden rounded-full p-0"
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

              {hasHydrated && !isAuthenticated && (
                <>
                  {/* Compact icon on mobile, full button on lg+ */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 lg:hidden rounded-full"
                    aria-label={t("signIn")}
                    onClick={() => openAuthModal("signin")}
                  >
                    <LogIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="default"
                    className="hidden lg:inline-flex h-9 px-3 text-sm font-medium rounded-full"
                    onClick={() => openAuthModal("signin")}
                  >
                    <LogIn className="h-4 w-4 mr-1.5" />
                    {t("signIn")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer so fixed nav doesn't overlay first content */}
      <div className="h-14 sm:h-16" aria-hidden />
    </>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-context";
import { useLogout } from "@/lib/api/hooks/useAuth";
import { useConfig } from "@/hooks/use-config";
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";

import {
  Home,
  Store,
  Tag,
  Info,
  User,
  LogIn,
  LogOut,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getBrandInitial, resolveBrandImage } from "@/lib/branding";
import { cn } from "@/lib/utils";
import { LocaleSwitch } from "@/components/locale-switch";

export function MobileNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { openAuthModal, hasHydrated, isAuthenticated, user } = useAuth();
  const { getConfigValue } = useConfig();
  const logoutMutation = useLogout();
  const t = useTranslations("nav");
  const tSeo = useTranslations("seo");
  const tToasts = useTranslations("toasts");
  // Why: the sign-out confirmation reuses the profile page's strings so both
  // entry points read identically.
  const tProfile = useTranslations("profile.overview");
  const tCommon = useTranslations("common");
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  // Why: logout is offered inline next to the avatar on large screens (mobile keeps
  // it inside the profile page). The fallback mirrors the profile page so a failed
  // API call can never leave the header stuck in a signed-in state.
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      useAppStore.getState().logout();
      if (typeof window !== "undefined") localStorage.removeItem("auth_token");
    }
    setConfirmLogoutOpen(false);
    toast.success(tToasts("logoutSuccess"));
  };

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
  // Why: prefer the admin-configured brand from /config, falling back to the
  // localized SEO brand so the navbar matches the footer and page titles.
  const localizedBrand = tSeo("brand");
  const companyName = getConfigValue<string>("business_name", localizedBrand) || localizedBrand;
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
                <>
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

                  {/* Sign out — large screens only; on mobile it lives in the profile page */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:inline-flex h-9 w-9 rounded-full text-muted-foreground hover:text-destructive"
                    aria-label={t("signOut")}
                    title={t("signOut")}
                    onClick={() => setConfirmLogoutOpen(true)}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
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

      {/* Sign-out confirmation — same dialog/strings as the profile page */}
      {hasHydrated && isAuthenticated && (
        <Dialog open={confirmLogoutOpen} onOpenChange={setConfirmLogoutOpen}>
          <DialogContent className="max-w-xs rounded-2xl">
            <DialogHeader>
              <DialogTitle>{tProfile("logoutConfirmTitle")}</DialogTitle>
              <DialogDescription>{tProfile("logoutConfirmDescription")}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-row gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmLogoutOpen(false)}>
                {tCommon("cancel")}
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {tProfile("confirmLogout")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

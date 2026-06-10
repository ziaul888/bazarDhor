"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LocaleSwitchProps {
  className?: string;
}

export function LocaleSwitch({ className }: LocaleSwitchProps) {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const active = useLocale() as AppLocale;
  const [, startTransition] = useTransition();

  const switchTo = (next: AppLocale) => {
    if (next === active) return;
    startTransition(() => {
      // Why: replace keeps the current path (sans locale prefix); next-intl
      // re-prefixes it with the new locale and pushes the route.
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      role="group"
      aria-label={t("switchLanguage")}
      className={cn(
        "inline-flex items-center rounded-full border bg-background p-0.5 text-xs font-medium",
        className,
      )}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === active;
        const label = locale === "bn" ? t("languageBn") : t("languageEn");
        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchTo(locale)}
            aria-pressed={isActive}
            className={cn(
              "px-2 py-0.5 rounded-full transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

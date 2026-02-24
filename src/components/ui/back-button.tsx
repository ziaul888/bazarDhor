"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BackButtonProps = Omit<React.ComponentProps<typeof Button>, "children" | "onClick"> & {
  fallbackHref?: string;
  label?: string;
  showLabel?: boolean;
  iconClassName?: string;
};

export function BackButton({
  fallbackHref = "/",
  label = "Back",
  showLabel = true,
  iconClassName,
  className,
  ...buttonProps
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = React.useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }, [fallbackHref, router]);

  return (
    <Button
      className={cn("flex items-center", className)}
      onClick={handleBack}
      type="button"
      {...buttonProps}
    >
      <ArrowLeft className={cn("h-4 w-4", showLabel && "mr-2", iconClassName)} aria-hidden="true" />
      {showLabel ? label : <span className="sr-only">{label}</span>}
    </Button>
  );
}

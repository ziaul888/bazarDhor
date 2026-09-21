"use client";

import type { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

interface RecaptchaProviderProps {
  children: ReactNode;
}

// Why: wraps the app with Google reCAPTCHA v3 only when a site key is
// configured. Without a key the provider would inject a noisy "Invalid site
// key" badge into the page; gating on env keeps local development clean while
// production gets bot protection on price submissions.
export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
  if (!SITE_KEY) return <>{children}</>;

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}

import type { ReactNode } from "react";

// Why: Next.js requires `app/layout.tsx` to exist when other root-level files
// like not-found.tsx are present. The actual <html>/<body> tags and providers
// live in app/[locale]/layout.tsx (the localized layout). This file is a
// pass-through so the locale router can take over.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

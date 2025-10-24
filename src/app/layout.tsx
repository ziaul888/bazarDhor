import type { Metadata } from "next";
import { Poppins, Source_Code_Pro, Playfair_Display, Open_Sans } from "next/font/google";
import "./globals.css";
import { MobileNavbar } from "@/components/mobile-navbar";
import { BottomNav } from "@/components/bottom-nav";
import { SearchProvider } from "./_components/search-context";

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

export const metadata: Metadata = {
  title: "MyApp - Modern Mobile-First App",
  description: "A beautiful, responsive mobile-first application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${sourceCodePro.variable} ${playfairDisplay.variable} ${openSans.variable} font-poppins antialiased`}
      >
        <SearchProvider>
          <MobileNavbar />
          <main className="min-h-screen pb-20 md:pb-0">
            {children}
          </main>
          <BottomNav />
        </SearchProvider>
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Grid3X3, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";


const bottomNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Markets", href: "/markets", icon: Store },
  { name: "Category", href: "/category", icon: Grid3X3 },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Background with blur */}
      <div className="bg-background/80 backdrop-blur-md border-t">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-around py-2">
            {bottomNavItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-3 transition-all duration-200 min-w-[60px] relative group",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="relative">
                    <item.icon 
                      className={cn(
                        "h-5 w-5 mb-1 transition-all duration-200",
                        isActive && "scale-110"
                      )} 
                    />
                    {/* Active indicator - small dot above icon */}
                    {isActive && (
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </div>
                  <span 
                    className={cn(
                      "text-xs font-medium transition-all duration-200",
                      isActive ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-background/80 backdrop-blur-md" />
    </div>
  );
}
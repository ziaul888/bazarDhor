"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Home, Store, Grid3X3, Info, Bell, Heart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Markets", href: "/markets", icon: Store },
  { name: "Category", href: "/category", icon: Grid3X3 },
  { name: "About", href: "/about", icon: Info },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand - Left side */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="text-lg sm:text-xl font-bold hidden sm:block">MyApp</span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-2 py-1 text-sm font-medium transition-all duration-200 relative group",
                  "text-muted-foreground hover:text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
              >
                <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                <span>{item.name}</span>
                {/* Hover indicator */}
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-muted-foreground/30 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Sign In - Desktop only */}
            <Button
              variant="ghost"
              className="hidden md:flex h-9 px-3 text-sm font-medium"
              aria-label="Sign In"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-medium">
                3
              </span>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-success rounded-full animate-pulse" />
            </Button>

            {/* Mobile menu trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1">
                  {/* Sign In on mobile */}
                  <div className="pb-4 border-b">
                    <Button
                      className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                  
                  {/* Navigation items */}
                  <div className="pt-4 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 group",
                          "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        )}
                      >
                        <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
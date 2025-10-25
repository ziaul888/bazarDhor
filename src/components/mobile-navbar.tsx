"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearch } from "@/app/_components/search-context";
import { useAuth } from "@/components/auth/auth-context";
import {
  Menu,
  Home,
  Store,
  Grid3X3,
  Info,
  Search,
  Bell,
  Heart,

  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Markets", href: "/markets", icon: Store },
  { name: "Category", href: "/category", icon: Grid3X3 },
  { name: "About", href: "/about", icon: Info },
];

export function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { toggleSearch } = useSearch();
  const { openAuthModal } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-background border-b"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/90 flex items-center justify-center shadow-lg ring-1 ring-primary/20">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-lg sm:text-xl hidden xs:block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                MyApp
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-2 py-1 text-sm font-medium transition-all duration-200 relative group",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    <span>{item.name}</span>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                    {/* Hover indicator */}
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-muted-foreground/30 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search - Desktop only */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex h-9 w-9"
                aria-label="Search"
                onClick={toggleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Sign In - Desktop only */}
              <Button
                variant="ghost"
                className="hidden lg:flex h-9 px-3 text-sm font-medium"
                aria-label="Sign In"
                onClick={() => openAuthModal('signin')}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
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
                className="relative h-9 w-9"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-success rounded-full animate-pulse" />
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-9 w-9"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <SheetHeader className="p-6 border-b">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/90 flex items-center justify-center shadow-lg ring-1 ring-primary/20">
                          <span className="text-primary-foreground font-bold">M</span>
                        </div>
                        <div>
                          <SheetTitle className="text-left text-lg">MyApp</SheetTitle>
                          <p className="text-sm text-muted-foreground">Welcome back!</p>
                        </div>
                      </div>
                    </SheetHeader>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      {/* Search on mobile */}
                      <div className="mb-6">
                        <Button
                          variant="outline"
                          className="w-full justify-start h-11"
                          onClick={() => {
                            toggleSearch();
                            setIsOpen(false);
                          }}
                        >
                          <Search className="h-4 w-4 mr-3" />
                          Search Products
                        </Button>
                      </div>

                      {/* Sign In on mobile */}
                      <div className="mb-6">
                        <Button
                          className="w-full justify-start h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => {
                            openAuthModal('signin');
                            setIsOpen(false);
                          }}
                        >
                          <LogIn className="h-4 w-4 mr-3" />
                          Sign In
                        </Button>
                      </div>

                      {/* Navigation */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Navigation
                        </p>
                        {navigation.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 relative group",
                                isActive
                                  ? "text-primary bg-primary/5 border-l-2 border-primary"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                              )}
                            >
                              <item.icon className={cn(
                                "h-5 w-5 transition-colors duration-200",
                                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                              )} />
                              <span>{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t bg-muted/30">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Version 1.0.0</span>
                        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-14 sm:h-16" />
    </>
  );
}
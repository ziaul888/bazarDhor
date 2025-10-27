"use client";

import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-context';

export function Footer() {
    const { openAuthModal } = useAuth();
    return (
        <footer className="bg-muted/50 border-t">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Company Info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-xs">M</span>
                                </div>
                                <span className="text-base font-bold">MyMarket</span>
                            </div>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                Your local market companion for fresh groceries and best deals.
                            </p>
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    <span>hello@mymarket.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
                            <div className="grid grid-cols-2 gap-1">
                                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Find Markets</a>
                                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Help Center</a>
                                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Compare Prices</a>
                                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact Us</a>
                                <button 
                                    onClick={() => openAuthModal('signin')}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
                                >
                                    Sign In
                                </button>
                                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                            </div>
                        </div>

                        {/* Social & Apps */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
                            <div className="flex items-center space-x-2">
                                <a href="#" className="w-6 h-6 bg-muted hover:bg-primary rounded-full flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-colors">
                                    <Facebook className="h-3 w-3" />
                                </a>
                                <a href="#" className="w-6 h-6 bg-muted hover:bg-primary rounded-full flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-colors">
                                    <Twitter className="h-3 w-3" />
                                </a>
                                <a href="#" className="w-6 h-6 bg-muted hover:bg-primary rounded-full flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-colors">
                                    <Instagram className="h-3 w-3" />
                                </a>
                            </div>
                            <div className="flex space-x-2">
                                <button className="flex items-center px-2 py-1 bg-black text-white rounded text-[10px] hover:bg-black/90 transition-colors">
                                    <span>App Store</span>
                                </button>
                                <button className="flex items-center px-2 py-1 bg-black text-white rounded text-[10px] hover:bg-black/90 transition-colors">
                                    <span>Google Play</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="py-3 border-t border-border">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <div className="text-xs text-muted-foreground">
                            © 2024 MyMarket. All rights reserved.
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <span>Made with</span>
                            <Heart className="h-3 w-3 text-red-500 fill-current" />
                            <span>for local communities</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
} 
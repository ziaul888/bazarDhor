"use client";

import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-muted/50 border-t">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-sm">M</span>
                                </div>
                                <span className="font-bold text-xl">MyMarket</span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Your local market companion. Find fresh groceries, compare prices, and discover 
                                the best deals on vegetables, meat, dairy, and daily essentials near you.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>123 Market Street, Downtown</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span>hello@mymarket.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Find Markets</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Groceries</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Compare Prices</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Fresh Produce</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Best Deals</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mobile App</a></li>
                            </ul>
                        </div>

                        {/* For Vendors */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">For Market Owners</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">List Your Market</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Market Dashboard</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Update Prices</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Inventory Management</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Customer Analytics</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support Center</a></li>
                            </ul>
                        </div>

                        {/* Support & Legal */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Support</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Social Media & App Downloads */}
                <div className="py-8 border-t border-border">
                    <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                        {/* Social Media */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-muted-foreground">Follow us:</span>
                            <div className="flex items-center space-x-3">
                                <a href="#" className="w-8 h-8 bg-muted hover:bg-primary rounded-full flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-colors">
                                    <Facebook className="h-4 w-4" />
                                </a>
                                <a href="#" className="w-8 h-8 bg-muted hover:bg-primary rounded-full flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-colors">
                                    <Twitter className="h-4 w-4" />
                                </a>
                                <a href="#" className="w-8 h-8 bg-muted hover:bg-primary rounded-full flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-colors">
                                    <Instagram className="h-4 w-4" />
                                </a>
                                <a href="#" className="w-8 h-8 bg-muted hover:bg-primary rounded-full flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-colors">
                                    <Youtube className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        {/* App Download Buttons */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-muted-foreground">Download our app:</span>
                            <div className="flex space-x-3">
                                <button className="flex items-center px-3 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors text-xs">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-5 h-5">
                                            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-[10px]">Download on the</div>
                                            <div className="text-xs font-semibold">App Store</div>
                                        </div>
                                    </div>
                                </button>

                                <button className="flex items-center px-3 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors text-xs">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-5 h-5">
                                            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-[10px]">Get it on</div>
                                            <div className="text-xs font-semibold">Google Play</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="py-6 border-t border-border">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>© 2024 MyMarket. All rights reserved.</span>
                            <span className="hidden md:inline">•</span>
                            <span className="hidden md:inline">Version 2.1.0</span>
                        </div>

                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <span>Made with</span>
                            <Heart className="h-4 w-4 text-red-500 fill-current" />
                            <span>for local communities</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
} 
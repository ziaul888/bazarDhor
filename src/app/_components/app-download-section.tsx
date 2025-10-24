"use client";

import { Smartphone, Star, Download, Bell, MapPin, ShoppingCart } from 'lucide-react';

export function AppDownloadSection() {
    return (
        <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left Content */}
                    <div className="order-2 lg:order-1">
                        <div className="max-w-lg">
                            {/* Badge */}
                            <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                                <Download className="h-4 w-4 mr-2" />
                                Download Our App
                            </div>

                            {/* Heading */}
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                                Shop Local Markets
                                <span className="block text-primary">On the Go</span>
                            </h2>

                            {/* Description */}
                            <p className="text-lg text-muted-foreground mb-6">
                                Find nearest markets, compare grocery prices, and get fresh produce delivered.
                                Update market prices and help your community save money.
                            </p>

                            {/* Features */}
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                                        <Bell className="h-4 w-4 text-success" />
                                    </div>
                                    <span className="text-sm font-medium">Price alerts for your favorite groceries</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-info/10 rounded-full flex items-center justify-center">
                                        <MapPin className="h-4 w-4 text-info" />
                                    </div>
                                    <span className="text-sm font-medium">GPS navigation to nearest markets</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="h-4 w-4 text-warning" />
                                    </div>
                                    <span className="text-sm font-medium">Update prices and earn community points</span>
                                </div>
                            </div>

                            {/* App Store Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <button className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8">
                                            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs">Download on the</div>
                                            <div className="text-sm font-semibold">App Store</div>
                                        </div>
                                    </div>
                                </button>

                                <button className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8">
                                            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs">Get it on</div>
                                            <div className="text-sm font-semibold">Google Play</div>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">4.8</span>
                                    <span>App Store Rating</span>
                                </div>
                                <div>
                                    <span className="font-medium">50K+</span>
                                    <span> Downloads</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Phone Mockup */}
                    <div className="order-1 lg:order-2 flex justify-center">
                        <div className="relative">
                            {/* Phone Frame */}
                            <div className="relative w-64 h-[520px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                                    {/* Status Bar */}
                                    <div className="h-6 bg-gray-50 flex items-center justify-between px-6 text-xs font-medium">
                                        <span>9:41</span>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                                            <div className="w-6 h-3 border border-gray-400 rounded-sm">
                                                <div className="w-4 h-full bg-green-500 rounded-sm"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* App Content */}
                                    <div className="p-4 h-full bg-gradient-to-b from-primary/10 to-accent/10">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg">MyMarket</h3>
                                                <p className="text-xs text-muted-foreground">Find local markets</p>
                                            </div>
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                <Bell className="h-4 w-4 text-primary-foreground" />
                                            </div>
                                        </div>

                                        {/* Search Bar */}
                                        <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
                                            <div className="flex items-center space-x-2 text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span className="text-sm">Search markets near you...</span>
                                            </div>
                                        </div>

                                        {/* Market Cards */}
                                        <div className="space-y-3">
                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg"></div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-sm">Downtown Market</h4>
                                                        <p className="text-xs text-muted-foreground">0.5 km • Open now</p>
                                                        <div className="flex items-center space-x-1 mt-1">
                                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                            <span className="text-xs">4.8</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg"></div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-sm">Riverside Market</h4>
                                                        <p className="text-xs text-muted-foreground">1.2 km • Closes 6 PM</p>
                                                        <div className="flex items-center space-x-1 mt-1">
                                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                            <span className="text-xs">4.7</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Navigation */}
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="bg-white rounded-lg p-2 shadow-lg">
                                                <div className="flex justify-around">
                                                    <div className="flex flex-col items-center p-2">
                                                        <MapPin className="h-4 w-4 text-primary" />
                                                        <span className="text-xs text-primary font-medium">Markets</span>
                                                    </div>
                                                    <div className="flex flex-col items-center p-2">
                                                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">Cart</span>
                                                    </div>
                                                    <div className="flex flex-col items-center p-2">
                                                        <Bell className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">Alerts</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-success/20 rounded-full flex items-center justify-center animate-pulse">
                                <Download className="h-6 w-6 text-success" />
                            </div>

                            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-bounce">
                                <Smartphone className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 
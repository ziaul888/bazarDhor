"use client";

import { Smartphone, Star, Download, Bell, MapPin, ShoppingCart } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';

// Types for better maintainability
interface Feature {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    colorClass: string;
}

interface AppStat {
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface MarketCard {
    name: string;
    distance: string;
    status: string;
    rating: number;
    reviews: number;
    iconColor: string;
    icon: React.ComponentType<{ className?: string }>;
}

// Data constants
const APP_FEATURES: Feature[] = [
    {
        icon: Bell,
        title: "Price alerts for your favorite groceries",
        description: "Get notified when prices drop",
        colorClass: "from-success/20 to-success/10 border-success/20 text-success"
    },
    {
        icon: MapPin,
        title: "GPS navigation to nearest markets",
        description: "Find markets within walking distance",
        colorClass: "from-info/20 to-info/10 border-info/20 text-info"
    },
    {
        icon: ShoppingCart,
        title: "Update prices and earn community points",
        description: "Help others save while earning rewards",
        colorClass: "from-warning/20 to-warning/10 border-warning/20 text-warning"
    }
];

const APP_STATS: AppStat[] = [
    { value: "4.8", label: "rating", icon: Star },
    { value: "50K+", label: "downloads" }
];

const MOCK_MARKETS: MarketCard[] = [
    {
        name: "Downtown Market",
        distance: "0.5 km",
        status: "Open now",
        rating: 4.8,
        reviews: 124,
        iconColor: "from-green-400 to-green-600",
        icon: ShoppingCart
    },
    {
        name: "Riverside Market",
        distance: "1.2 km",
        status: "Closes 6 PM",
        rating: 4.7,
        reviews: 89,
        iconColor: "from-blue-400 to-blue-600",
        icon: MapPin
    }
];

// Sub-components for better organization
function DownloadBadge() {
    return (
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-full text-sm font-semibold mb-6 border border-primary/20 shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Download Our App
        </div>
    );
}

function SectionHeading() {
    return (
        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
            Shop Local Markets{' '}
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                On the Go
            </span>
        </h2>
    );
}

function FeatureItem({ feature }: { feature: Feature }) {
    const Icon = feature.icon;
    return (
        <div className="flex items-start space-x-4 group">
            <div className={`w-12 h-12 bg-gradient-to-br ${feature.colorClass} rounded-xl flex items-center justify-center border group-hover:scale-105 transition-transform duration-200`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 pt-1">
                <span className="text-base font-semibold text-foreground block">{feature.title}</span>
                <span className="text-sm text-muted-foreground">{feature.description}</span>
            </div>
        </div>
    );
}

function AppStoreButton({ type, children }: { type: 'ios' | 'android'; children: React.ReactNode }) {
    return (
        <button className="group flex items-center justify-center px-6 py-4 bg-black text-white rounded-xl hover:bg-black/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 group-hover:scale-110 transition-transform duration-200">
                    {children}
                </div>
                <div className="text-left">
                    <div className="text-xs opacity-90">{type === 'ios' ? 'Download on the' : 'Get it on'}</div>
                    <div className="text-base font-semibold">{type === 'ios' ? 'App Store' : 'Google Play'}</div>
                </div>
            </div>
        </button>
    );
}

function AppStats() {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            {APP_STATS.map((stat, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    {stat.icon && (
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => {
                                const IconComponent = stat.icon!;
                                return <IconComponent key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
                            })}
                        </div>
                    )}
                    <div className="text-sm">
                        <span className="font-bold text-foreground">{stat.value}</span>
                        <span className="text-muted-foreground ml-1">{stat.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function PhoneStatusBar() {
    return (
        <div className="h-8 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between px-6 text-xs font-semibold">
            <span className="text-gray-900">9:41</span>
            <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-gray-900 rounded-full"></div>
                    ))}
                </div>
                <div className="w-6 h-3 border border-gray-400 rounded-sm ml-2">
                    <div className="w-5 h-full bg-green-500 rounded-sm"></div>
                </div>
            </div>
        </div>
    );
}

function AppHeader() {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="font-bold text-xl text-gray-900">MyMarket</h3>
                <p className="text-sm text-muted-foreground">Find local markets</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="h-5 w-5 text-white" />
            </div>
        </div>
    );
}

function SearchBar() {
    return (
        <div className="bg-white rounded-xl p-4 mb-5 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Search markets near you...</span>
            </div>
        </div>
    );
}

function MarketCardItem({ market }: { market: MarketCard }) {
    const Icon = market.icon;
    return (
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${market.iconColor} rounded-xl shadow-md flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900">{market.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{market.distance} • {market.status}</p>
                    <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{market.rating}</span>
                        <span className="text-xs text-muted-foreground">({market.reviews})</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BottomNavigation() {
    const navItems = [
        { icon: MapPin, label: "Markets", active: true },
        { icon: ShoppingCart, label: "Cart", active: false },
        { icon: Bell, label: "Alerts", active: false }
    ];

    return (
        <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white rounded-lg p-2 shadow-lg">
                <div className="flex justify-around">
                    {navItems.map((item, index) => (
                        <div key={index} className="flex flex-col items-center p-2">
                            <item.icon className={`h-4 w-4 ${item.active ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className={`text-xs ${item.active ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PhoneMockup() {
    return (
        <div className="relative group">
            {/* Phone Frame */}
            <div className="relative w-72 h-[580px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3.5rem] p-3 shadow-2xl group-hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105">
                <div className="w-full h-full bg-white rounded-[3rem] overflow-hidden relative shadow-inner">
                    <PhoneStatusBar />

                    {/* App Content */}
                    <div className="p-5 h-full bg-gradient-to-b from-primary/8 to-accent/8">
                        <AppHeader />
                        <SearchBar />

                        {/* Market Cards */}
                        <div className="space-y-4">
                            {MOCK_MARKETS.map((market, index) => (
                                <MarketCardItem key={index} market={market} />
                            ))}
                        </div>

                        <BottomNavigation />
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
    );
}

export function AppDownloadSection() {
    const { canInstall, isInstalled, install } = usePWA();

    const handlePWAInstall = async () => {
        try {
            await install();
        } catch (error) {
            console.error('PWA installation failed:', error);
        }
    };

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
                    {/* Left Content */}
                    <div className="order-2 lg:order-1 space-y-8">
                        <div className="max-w-xl">
                            <DownloadBadge />
                            <SectionHeading />

                            {/* Description */}
                            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                                Find nearest markets, compare grocery prices, and get fresh produce delivered.
                                Update market prices and help your community save money.
                            </p>

                            {/* Features */}
                            <div className="space-y-4 mb-10">
                                {APP_FEATURES.map((feature, index) => (
                                    <FeatureItem key={index} feature={feature} />
                                ))}
                            </div>

                            {/* App Store Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                {/* PWA Install Button - Show if installable */}
                                {canInstall && !isInstalled && (
                                    <button 
                                        onClick={handlePWAInstall}
                                        className="group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl hover:from-primary/90 hover:to-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Download className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
                                            <div className="text-left">
                                                <div className="text-xs opacity-90">Install</div>
                                                <div className="text-base font-semibold">Web App</div>
                                            </div>
                                        </div>
                                    </button>
                                )}

                                <AppStoreButton type="ios">
                                    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                </AppStoreButton>

                                <AppStoreButton type="android">
                                    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                    </svg>
                                </AppStoreButton>
                            </div>

                            <AppStats />
                        </div>
                    </div>

                    {/* Right Content - Phone Mockup */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <PhoneMockup />
                    </div>
                </div>
            </div>
        </section>
    );
} 
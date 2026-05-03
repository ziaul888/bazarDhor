"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Store, Heart, Check, ArrowRight, Tag, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Market } from '@/lib/api/types';

interface MarketCardProps {
    market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
    const [imgError, setImgError] = useState(false);
    const [favorited, setFavorited] = useState(false);

    const locationLine = market.location || market.address;
    const distanceSuffix =
        market.distance && market.distance !== 'N/A' ? ` • ${market.distance}` : '';

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group py-0 gap-0 border border-border/60">
            {/* Image */}
            <div className="relative h-48 bg-muted overflow-hidden">
                {market.image && !imgError ? (
                    <Image
                        src={market.image}
                        alt={market.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col items-center justify-center p-4 text-center">
                        <Store className="h-10 w-10 text-primary/20 mb-2" />
                        <span className="text-[10px] uppercase tracking-wider font-bold text-primary/40 leading-tight">
                            {market.name}
                        </span>
                    </div>
                )}

                {/* Favourite button — top left */}
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setFavorited((f) => !f); }}
                    className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                    <Heart
                        className={`h-4 w-4 transition-colors ${
                            favorited ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
                        }`}
                    />
                </button>

                {/* Open / Closed badge — top right */}
                <div className="absolute top-3 right-3">
                    <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow ${
                            market.isOpen ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}
                    >
                        {market.isOpen && <Check className="h-3 w-3 stroke-[3]" />}
                        {market.isOpen ? 'Open' : 'Closed'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <Link href={`/markets/${market.id}`} className="block">
                <div className="p-4">
                    {/* Market icon + name + location */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Store className="h-5 w-5 text-orange-500" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-0.5">
                                <h3 className="font-bold text-sm sm:text-base leading-tight line-clamp-1 flex-1">
                                    {market.name}
                                </h3>
                                <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="text-xs line-clamp-1">
                                    {locationLine}{distanceSuffix}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border/60 my-3" />

                    {/* 3-column stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        {/* Market Type */}
                        <div>
                            <div className="flex items-center justify-center gap-1 mb-0.5">
                                <Tag className="h-4 w-4 text-primary" />
                                <span className="font-bold text-xs leading-tight line-clamp-1">
                                    {market.type && market.type.trim().length > 0 ? market.type : 'Market'}
                                </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">Type</p>
                        </div>

                        {/* Market Status */}
                        <div>
                            <div className="flex items-center justify-center gap-1 mb-0.5">
                                <Activity
                                    className={`h-4 w-4 ${market.isOpen ? 'text-green-500' : 'text-gray-400'}`}
                                />
                                <span
                                    className={`font-bold text-xs leading-tight ${
                                        market.isOpen ? 'text-green-600' : 'text-gray-500'
                                    }`}
                                >
                                    {market.isOpen ? 'Open' : 'Closed'}
                                </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">Status</p>
                        </div>

                        {/* Hours */}
                        <div>
                            <div className="flex items-center justify-center gap-0.5 mb-0.5">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <span className="font-bold text-xs leading-tight">
                                    {market.openTime || '—'}
                                </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">Hours</p>
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    );
}

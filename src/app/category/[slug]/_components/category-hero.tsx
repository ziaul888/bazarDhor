"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Store } from 'lucide-react';

interface CategoryHeroProps {
    image: string;
    name: string;
    overlay?: boolean;
}

export function CategoryHero({ image, name, overlay = false }: CategoryHeroProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <>
            {!imgError ? (
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                    onError={() => setImgError(true)}
                />
            ) : (
                <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center">
                    <Store className="h-10 w-10 text-muted-foreground/30 mb-1" />
                    <span className="text-xs text-muted-foreground font-medium">{name}</span>
                </div>
            )}
            {overlay && <div className="absolute inset-0 bg-black/40" />}
        </>
    );
}

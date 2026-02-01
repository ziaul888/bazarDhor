"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Store } from 'lucide-react';

interface CategoryHeroProps {
    image: string;
    name: string;
}

export function CategoryHero({ image, name }: CategoryHeroProps) {
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
                    <Store className="h-16 w-16 text-muted-foreground/20 mb-2" />
                    <span className="text-muted-foreground font-medium">{name}</span>
                </div>
            )}
            <div className="absolute inset-0 bg-black/40" />
        </>
    );
}

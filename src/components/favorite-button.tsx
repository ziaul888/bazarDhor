"use client";

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites, useNotifications } from '@/store/hooks';

interface FavoriteButtonProps {
  marketId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

export function FavoriteButton({ marketId, variant = 'ghost', size = 'sm' }: FavoriteButtonProps) {
  const { isFavoriteMarket, toggleFavoriteMarket } = useFavorites();
  const { addNotification } = useNotifications();
  
  const isFavorite = isFavoriteMarket(marketId);

  const handleToggle = () => {
    toggleFavoriteMarket(marketId);
    addNotification({
      type: 'success',
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
    </Button>
  );
}
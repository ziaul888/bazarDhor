"use client";

import { Button } from '@/components/ui/button';
import { useAuth, useNotifications, useFavorites } from '@/store/hooks';

export function StoreDemo() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const { addNotification } = useNotifications();
  const { favoriteMarkets, toggleFavoriteMarket } = useFavorites();

  const handleLogin = () => {
    login({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      favoriteMarkets: [],
      preferences: {
        currency: 'USD',
        language: 'en',
        notifications: true,
        location: {},
      },
    });
  };



  const handleToggleFavorite = () => {
    toggleFavoriteMarket('market-1');
    addNotification({
      type: 'info',
      message: favoriteMarkets.includes('market-1') 
        ? 'Removed from favorites' 
        : 'Added to favorites',
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Zustand Store Demo</h3>
      
      <div className="space-y-4">
        {/* Auth Demo */}
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Status: {isAuthenticated ? `Logged in as ${user?.name}` : 'Not logged in'}
          </p>
          <Button
            onClick={isAuthenticated ? logout : handleLogin}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
          >
            {isAuthenticated ? 'Logout' : 'Login'}
          </Button>
        </div>



        {/* Favorites Demo */}
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Favorites: {favoriteMarkets.length} markets
          </p>
          <Button onClick={handleToggleFavorite} size="sm" variant="outline">
            {favoriteMarkets.includes('market-1') ? 'Remove' : 'Add'} Market Favorite
          </Button>
        </div>

        {/* Notification Demo */}
        <div>
          <Button
            onClick={() => addNotification({
              type: 'warning',
              message: 'This is a test notification!',
            })}
            size="sm"
            variant="secondary"
          >
            Show Notification
          </Button>
        </div>
      </div>
    </div>
  );
}
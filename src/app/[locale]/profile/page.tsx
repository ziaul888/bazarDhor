"use client";

import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Heart,
  ShoppingCart,
  TrendingUp,
  Settings,
  Edit3,
  Star,
  Clock,
  LogIn,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileSettings } from './_components/profile-settings';
import { ActivityHistory } from './_components/activity-history';
import { FavoriteMarkets } from './_components/favorite-markets';
import { useAuth } from '@/components/auth/auth-context';

const getUserInitial = (name?: string | null, email?: string | null): string => {
  const safeName = (name || '').trim();
  if (safeName) return safeName[0]?.toUpperCase() ?? 'U';

  const safeEmail = (email || '').trim();
  if (safeEmail) return safeEmail[0]?.toUpperCase() ?? 'U';

  return 'U';
};

const formatJoinDate = (createdAt?: string | null): string => {
  if (!createdAt) return '—';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
};

const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'activity', label: 'Activity', icon: Clock },
  { id: 'favorites', label: 'Favorites', icon: Heart },
];

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  stats: {
    marketsVisited: number;
    priceUpdates: number;
    reviewsWritten: number;
  };
  preferences: {
    notifications: {
      priceAlerts: boolean;
      newMarkets: boolean;
      weeklyDigest: boolean;
      promotions: boolean;
    };
    privacy: {
      profileVisible: boolean;
      shareLocation: boolean;
    };
  };
}

export default function ProfilePage() {
  const { hasHydrated, isAuthenticated, user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');
  const isLoadingUser = hasHydrated && hasToken && !user;

  if (!hasHydrated || isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading profile…</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="pb-24">
        <div className="container mx-auto max-w-3xl px-4 mt-8">
          <div className="rounded-xl border bg-card p-6 text-center">
            <h1 className="text-base font-semibold mb-1">Sign in required</h1>
            <p className="text-xs text-muted-foreground mb-4">
              Please sign in to view your profile.
            </p>
            <Button size="sm" onClick={() => openAuthModal('signin')} className="w-full sm:w-auto">
              <LogIn className="h-4 w-4 mr-2" />
              Sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const name =
    user.name?.trim() ||
    [user.first_name, user.last_name].filter(Boolean).join(' ').trim() ||
    user.username?.trim() ||
    'User';

  const location =
    user.address?.trim() ||
    [user.city, user.division].filter(Boolean).join(', ') ||
    '—';

  const joinDate = formatJoinDate(user.created_at);

  const avatarUrl = typeof user.avatar === 'string' && user.avatar.trim() ? user.avatar : undefined;
  const userInitial = getUserInitial(name, user.email);

  const userData: UserData = {
    id: user.id,
    name,
    email: user.email || '',
    phone: user.phone || '—',
    location,
    joinDate,
    stats: {
      marketsVisited: 0,
      priceUpdates: 0,
      reviewsWritten: 0,
    },
    preferences: {
      notifications: {
        priceAlerts: true,
        newMarkets: true,
        weeklyDigest: false,
        promotions: true,
      },
      privacy: {
        profileVisible: true,
        shareLocation: true,
      },
    },
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userData={userData} />;
      case 'settings':
        return <ProfileSettings userData={userData} />;
      case 'activity':
        return <ActivityHistory />;
      case 'favorites':
        return <FavoriteMarkets />;
      default:
        return <OverviewTab userData={userData} />;
    }
  };

  return (
    <div className="pb-24">
      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-4 pt-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex-none w-14 h-14 rounded-full overflow-hidden bg-primary/10 text-primary font-semibold flex items-center justify-center text-xl"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userData.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              userInitial
            )}
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold leading-tight truncate">{userData.name}</h1>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {userData.location}
              <span className="mx-1.5">·</span>
              Joined {userData.joinDate}
            </p>
          </div>
          <Button size="sm" variant="outline" className="hidden sm:inline-flex">
            <Edit3 className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 mt-4">
        <div className="border-y lg:border lg:rounded-xl bg-card divide-x grid grid-cols-3">
          <Stat
            icon={<MapPin className="h-4 w-4 text-primary" />}
            value={userData.stats.marketsVisited}
            label="Markets"
          />
          <Stat
            icon={<TrendingUp className="h-4 w-4 text-primary" />}
            value={userData.stats.priceUpdates}
            label="Updates"
          />
          <Stat
            icon={<Star className="h-4 w-4 text-primary" />}
            value={userData.stats.reviewsWritten}
            label="Reviews"
          />
        </div>
      </section>

      <div className="container mx-auto max-w-3xl lg:max-w-6xl px-4 mt-6">
        <div className="border-b border-border">
          <nav className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar -mx-1 px-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 py-2.5 border-b-2 text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4">{renderTabContent()}</div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="px-3 py-3 text-center">
      <div className="flex items-center justify-center gap-1.5">
        {icon}
        <span className="text-lg font-semibold">{value}</span>
      </div>
      <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function OverviewTab({ userData }: { userData: UserData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-4">
      <div>
        <h2 className="text-sm font-semibold px-1 mb-2">Personal info</h2>
        <div className="rounded-xl border bg-card divide-y">
          <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={userData.email || '—'} />
          <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={userData.phone} />
          <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={userData.location} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold px-1 mb-2">Quick actions</h2>
        <div className="rounded-xl border bg-card divide-y">
          <ActionRow icon={<Bell className="h-4 w-4" />} label="Notification settings" />
          <ActionRow icon={<Shield className="h-4 w-4" />} label="Privacy settings" />
          <ActionRow icon={<ShoppingCart className="h-4 w-4" />} label="Order history" />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="flex-none w-9 h-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function ActionRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
    >
      <span className="flex-none w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
    </button>
  );
}

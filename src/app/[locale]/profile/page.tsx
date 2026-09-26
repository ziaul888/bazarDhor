"use client";

import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  ShoppingCart,
  TrendingUp,
  Settings,
  Edit3,
  Star,
  Clock,
  LogIn,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProfileSettings } from './_components/profile-settings';
import { ActivityHistory } from './_components/activity-history';
import { useAuth } from '@/components/auth/auth-context';
import { useLogout } from '@/lib/api/hooks/useAuth';
import { useUserProfile, useActivityStatistics } from '@/lib/api/hooks/useUser';
import { useAppStore } from '@/store/app-store';

const getUserInitial = (name?: string | null, email?: string | null): string => {
  const safeName = (name || '').trim();
  if (safeName) return safeName[0]?.toUpperCase() ?? 'U';

  const safeEmail = (email || '').trim();
  if (safeEmail) return safeEmail[0]?.toUpperCase() ?? 'U';

  return 'U';
};

const formatJoinDate = (locale: string, createdAt?: string | null): string => {
  if (!createdAt) return '—';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
};

const tabs = [
  { id: 'overview', icon: User },
  { id: 'settings', icon: Settings },
  { id: 'activity', icon: Clock },
] as const;

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  division: string;
  address: string;
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
  const t = useTranslations('profile');
  const locale = useLocale();
  const { hasHydrated, isAuthenticated, user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');
  const isLoadingUser = hasHydrated && hasToken && !user;

  // Refresh the profile from GET /users/profile on every visit. The hook writes the
  // server copy back into the Zustand store, so a stale localStorage snapshot (from
  // an older login) or an edit made elsewhere can't linger in the UI.
  useUserProfile(hasToken);

  // Header stats come from the same statistics endpoint that powers the Activity
  // tab tiles — shared React Query cache, fetched once for both surfaces.
  const { data: activityStats } = useActivityStatistics(hasToken);

  if (!hasHydrated || isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">{t('loadingProfile')}</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="pb-24">
        <div className="container mx-auto max-w-3xl px-4 mt-8">
          <div className="rounded-xl border bg-card p-6 text-center">
            <h1 className="text-base font-semibold mb-1">{t('signInRequired.title')}</h1>
            <p className="text-xs text-muted-foreground mb-4">
              {t('signInRequired.description')}
            </p>
            <Button size="sm" onClick={() => openAuthModal('signin')} className="w-full sm:w-auto">
              <LogIn className="h-4 w-4 mr-2" />
              {t('signInRequired.action')}
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

  const joinDate = formatJoinDate(locale, user.created_at);

  const avatarUrl = typeof user.avatar === 'string' && user.avatar.trim() ? user.avatar : undefined;
  const userInitial = getUserInitial(name, user.email);

  const userData: UserData = {
    id: user.id,
    name,
    email: user.email || '',
    phone: user.phone || '—',
    location,
    city: user.city?.trim() || '',
    division: user.division?.trim() || '',
    address: user.address?.trim() || '',
    joinDate,
    stats: {
      marketsVisited: activityStats?.markets_visited ?? 0,
      priceUpdates: activityStats?.price_updates ?? 0,
      reviewsWritten: activityStats?.reviews_written ?? 0,
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
              {t('joined', { date: userData.joinDate })}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="hidden sm:inline-flex"
            onClick={() => setActiveTab('settings')}
          >
            <Edit3 className="h-3.5 w-3.5 mr-1.5" />
            {t('edit')}
          </Button>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 mt-4">
        <div className="border-y lg:border lg:rounded-xl bg-card divide-x grid grid-cols-3">
          <Stat
            icon={<MapPin className="h-4 w-4 text-primary" />}
            value={userData.stats.marketsVisited}
            label={t('stats.markets')}
          />
          <Stat
            icon={<TrendingUp className="h-4 w-4 text-primary" />}
            value={userData.stats.priceUpdates}
            label={t('stats.updates')}
          />
          <Stat
            icon={<Star className="h-4 w-4 text-primary" />}
            value={userData.stats.reviewsWritten}
            label={t('stats.reviews')}
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
                {t(`tabs.${tab.id}`)}
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
  const t = useTranslations('profile.overview');
  const tCommon = useTranslations('common');
  const tToasts = useTranslations('toasts');
  const logoutMutation = useLogout();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Even if the API call fails, make sure the local session is cleared.
      useAppStore.getState().logout();
      if (typeof window !== 'undefined') localStorage.removeItem('auth_token');
    }
    setConfirmOpen(false);
    toast.success(tToasts('logoutSuccess'));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-4">
      <div>
        <h2 className="text-sm font-semibold px-1 mb-2">{t('personalInfo')}</h2>
        <div className="rounded-xl border bg-card divide-y">
          <InfoRow icon={<Mail className="h-4 w-4" />} label={t('email')} value={userData.email || '—'} />
          <InfoRow icon={<Phone className="h-4 w-4" />} label={t('phone')} value={userData.phone} />
          <InfoRow icon={<MapPin className="h-4 w-4" />} label={t('location')} value={userData.location} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold px-1 mb-2">{t('quickActions')}</h2>
        <div className="rounded-xl border bg-card divide-y">
          {/* Other quick actions — hidden for now
          <ActionRow icon={<Bell className="h-4 w-4" />} label={t('notificationSettings')} />
          <ActionRow icon={<Shield className="h-4 w-4" />} label={t('privacySettings')} />
          <ActionRow icon={<ShoppingCart className="h-4 w-4" />} label={t('orderHistory')} />
          */}
          <ActionRow
            icon={<LogOut className="h-4 w-4" />}
            label={t('logout')}
            destructive
            onClick={() => setConfirmOpen(true)}
          />
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-xs rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('logoutConfirmTitle')}</DialogTitle>
            <DialogDescription>{t('logoutConfirmDescription')}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t('confirmLogout')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

function ActionRow({
  icon,
  label,
  destructive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  destructive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
        destructive
          ? 'text-red-600 hover:bg-red-500/10'
          : 'hover:bg-muted/40'
      }`}
    >
      <span
        className={`flex-none w-9 h-9 rounded-full flex items-center justify-center ${
          destructive ? 'bg-red-500/10 text-red-600' : 'bg-primary/10 text-primary'
        }`}
      >
        {icon}
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
    </button>
  );
}

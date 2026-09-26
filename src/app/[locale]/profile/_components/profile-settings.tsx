"use client";

import { useState } from 'react';
import { Bell, Shield, MapPin, Mail, Phone, User, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useUpdateProfile } from '@/lib/api/hooks/useUser';
import { handleApiError } from '@/lib/api/client';
import type { UpdateProfilePayload, UserProfile } from '@/lib/api/types';

interface ProfileSettingsProps {
  userData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    city: string;
    division: string;
    address: string;
    preferences: {
      notifications: Record<string, boolean>;
      privacy: Record<string, boolean>;
    };
  };
}

const inputClass =
  'w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background';

export function ProfileSettings({ userData }: ProfileSettingsProps) {
  const t = useTranslations('profile.settings');
  const tToasts = useTranslations('toasts');
  const updateProfile = useUpdateProfile();

  // Why: the API requires first_name/last_name separately (they are the only
  // required fields on App\Http\Requests\Api\UpdateProfileRequest), so the form
  // keeps them split instead of trying to recover them from the display name.
  const initialName = userData.name.trim().split(/\s+/);
  const [formData, setFormData] = useState({
    firstName: initialName[0] || '',
    lastName: initialName.slice(1).join(' '),
    email: userData.email,
    phone: userData.phone === '—' ? '' : userData.phone,
    city: userData.city,
    division: userData.division,
    address: userData.address,
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState(userData.preferences.notifications);
  const [privacy, setPrivacy] = useState(userData.preferences.privacy);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error(t('requiredFieldsError'));
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error(t('passwordMismatch'));
      return;
    }

    const payload: UpdateProfilePayload = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      city: formData.city.trim() || null,
      division: formData.division.trim() || null,
      address: formData.address.trim() || null,
    };

    if (formData.newPassword) {
      payload.password = formData.newPassword;
      payload.password_confirmation = formData.confirmPassword;
    }

    try {
      const profile: UserProfile = await updateProfile.mutateAsync(payload);

      // Re-seed the form from the server response so the fields reflect what was stored
      // (the store + profile query are already updated by the mutation itself).
      const nextName = (profile.name || '').trim().split(/\s+/);
      setFormData(prev => ({
        ...prev,
        firstName: nextName[0] || prev.firstName,
        lastName: nextName.slice(1).join(' ') || prev.lastName,
        email: profile.email ?? prev.email,
        phone: profile.phone ?? '',
        city: profile.city ?? '',
        division: profile.division ?? '',
        address: profile.address ?? '',
        newPassword: '',
        confirmPassword: '',
      }));

      toast.success(t('saveSuccess'));
    } catch (error) {
      // Why handleApiError: axios rejects with "Request failed with status code
      // 422/401" — the backend's real message ("The phone has already been
      // taken." / "Unauthenticated.") lives on error.response.data.message.
      toast.error(handleApiError(error) || tToasts('errorGeneric'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-card rounded-xl p-6 border">
        <h3 className="text-lg font-semibold mb-4">{t('personalInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('firstName')}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('lastName')}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('emailAddress')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('phoneNumber')}</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('city')}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder={t('cityPlaceholder')}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('division')}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.division}
                onChange={(e) => handleInputChange('division', e.target.value)}
                placeholder={t('divisionPlaceholder')}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">{t('address')}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder={t('addressPlaceholder')}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-card rounded-xl p-6 border">
        <h3 className="text-lg font-semibold mb-4">{t('changePassword')}</h3>
        <div className="space-y-4">
          {/* Why no "current password" field: App\Http\Requests\Api\UpdateProfileRequest
              only accepts `password` + `password_confirmation`, so collecting the old
              password would be a field the API never reads. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('newPassword')}</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className="w-full pr-12 pl-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background"
                  placeholder={t('newPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('confirmNewPassword')}</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pr-12 pl-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background"
                  placeholder={t('confirmNewPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings — hidden for now
      <div className="bg-card rounded-xl p-6 border">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{t('notificationPreferences')}</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{t('priceAlerts')}</div>
              <div className="text-sm text-muted-foreground">{t('priceAlertsDescription')}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.priceAlerts}
                onChange={(e) => handleNotificationChange('priceAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{t('newMarkets')}</div>
              <div className="text-sm text-muted-foreground">{t('newMarketsDescription')}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.newMarkets}
                onChange={(e) => handleNotificationChange('newMarkets', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{t('weeklyDigest')}</div>
              <div className="text-sm text-muted-foreground">{t('weeklyDigestDescription')}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weeklyDigest}
                onChange={(e) => handleNotificationChange('weeklyDigest', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{t('promotions')}</div>
              <div className="text-sm text-muted-foreground">{t('promotionsDescription')}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.promotions}
                onChange={(e) => handleNotificationChange('promotions', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
      */}

      {/* Privacy Settings — hidden for now
      <div className="bg-card rounded-xl p-6 border">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{t('privacySettings')}</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{t('publicProfile')}</div>
              <div className="text-sm text-muted-foreground">{t('publicProfileDescription')}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.profileVisible}
                onChange={(e) => handlePrivacyChange('profileVisible', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{t('shareLocation')}</div>
              <div className="text-sm text-muted-foreground">{t('shareLocationDescription')}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.shareLocation}
                onChange={(e) => handlePrivacyChange('shareLocation', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
      */}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {updateProfile.isPending ? t('saving') : t('saveChanges')}
        </Button>
      </div>
    </div>
  );
}

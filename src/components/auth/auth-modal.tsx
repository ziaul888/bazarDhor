"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from './auth-context';
import { useLogin, useRegister } from '@/lib/api/hooks/useAuth';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationFormData } from '@/lib/validations/registration';
import { useAppStore } from '@/store/app-store';

export function AuthModal() {
  const t = useTranslations('auth');
  const { isAuthModalOpen, authModalMode, closeAuthModal } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(authModalMode);

  // Sync mode with context when modal opens
  React.useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode);
    }
  }, [isAuthModalOpen, authModalMode]);

  const [showPassword, setShowPassword] = useState(false);

  // Login form state (manual)
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: ''
  });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Registration form (React Hook Form)
  const {
    register,
    handleSubmit: handleRegistrationSubmit,
    formState: { errors: registrationErrors },
    reset: resetRegistrationForm,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  // API hooks
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  // Handle login input changes
  const handleLoginInputChange = (field: string, value: string) => {
    setLoginFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (loginErrors[field]) {
      setLoginErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate login form
  const validateLoginForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!loginFormData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(loginFormData.email)) {
      newErrors.email = t('emailInvalid');
    }

    if (!loginFormData.password.trim()) {
      newErrors.password = t('passwordRequired');
    }

    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: loginFormData.email,
        password: loginFormData.password,
      });

      toast.success(t('welcomeBack'), {
        description: t('signedInDescription'),
        icon: <CheckCircle className="h-5 w-5" />,
      });

      closeAuthModal();

      // Reset form
      setLoginFormData({
        email: '',
        password: ''
      });
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || t('genericError');

      toast.error(t('signInFailed'), {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5" />,
      });

      console.error('Login error:', error);
    }
  };

  // Handle registration submission
  const onRegistrationSubmit = async (data: RegistrationFormData) => {
    try {
      const response = await registerMutation.mutateAsync({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        phone: data.phone,
        city: data.city,
        image: data.image || null,
        referred_by: data.referred_by,
      });

      toast.success(t('accountCreated'), {
        description: t('accountCreatedDescription'),
        icon: <CheckCircle className="h-5 w-5" />,
      });

      useAppStore.getState().login(response.user);
      closeAuthModal();

      // Reset forms
      setLoginFormData({
        email: '',
        password: ''
      });
      setLoginErrors({});
      resetRegistrationForm();
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || t('genericError');

      toast.error(t('registrationFailed'), {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5" />,
      });

      console.error('Registration error:', error);
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    // Reset login form
    setLoginFormData({
      email: '',
      password: ''
    });
    setLoginErrors({});
    // Reset registration form
    resetRegistrationForm();
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
              {mode === 'signin' ? t('signInTitle') : t('signUpTitle')}
            </DialogTitle>
            <p className="text-center text-primary-foreground/80 mt-2 text-sm sm:text-base px-2">
              {mode === 'signin' ? t('signInSubtitle') : t('signUpSubtitle')}
            </p>
          </DialogHeader>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6">
          <form onSubmit={mode === 'signin' ? handleLoginSubmit : handleRegistrationSubmit(onRegistrationSubmit)} className="space-y-3 sm:space-y-4">
            {/* Name Fields - Sign Up Only */}
            {mode === 'signup' && (
              <>
                {/* First Name */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-sm font-medium">{t('firstName')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t('firstNamePlaceholder')}
                      {...register('first_name')}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${registrationErrors.first_name ? 'border-destructive' : 'border-border'
                        }`}
                      disabled={isLoading}
                    />
                  </div>
                  {registrationErrors.first_name && (
                    <p className="text-xs text-destructive mt-1">{registrationErrors.first_name.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-sm font-medium">{t('lastName')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t('lastNamePlaceholder')}
                      {...register('last_name')}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${registrationErrors.last_name ? 'border-destructive' : 'border-border'
                        }`}
                      disabled={isLoading}
                    />
                  </div>
                  {registrationErrors.last_name && (
                    <p className="text-xs text-destructive mt-1">{registrationErrors.last_name.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm font-medium">{t('email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {mode === 'signin' ? (
                  <input
                    key="signin-email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={loginFormData.email || ''}
                    onChange={(e) => handleLoginInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${loginErrors.email ? 'border-destructive' : 'border-border'
                      }`}
                    required
                    disabled={isLoading}
                  />
                ) : (
                  <input
                    key="signup-email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    {...register('email')}
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${registrationErrors.email ? 'border-destructive' : 'border-border'
                      }`}
                    disabled={isLoading}
                  />
                )}
              </div>
              {mode === 'signin' ? (
                loginErrors.email && <p className="text-xs text-destructive mt-1">{loginErrors.email}</p>
              ) : (
                registrationErrors.email && <p className="text-xs text-destructive mt-1">{registrationErrors.email.message}</p>
              )}
            </div>

            {/* Phone Field - Sign Up Only */}
            {mode === 'signup' && (
              <>
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-sm font-medium">{t('phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder={t('phonePlaceholder')}
                      {...register('phone')}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${registrationErrors.phone ? 'border-destructive' : 'border-border'
                        }`}
                      disabled={isLoading}
                    />
                  </div>
                  {registrationErrors.phone && (
                    <p className="text-xs text-destructive mt-1">{registrationErrors.phone.message}</p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-sm font-medium">{t('city')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t('cityPlaceholder')}
                      {...register('city')}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${registrationErrors.city ? 'border-destructive' : 'border-border'
                        }`}
                      disabled={isLoading}
                    />
                  </div>
                  {registrationErrors.city && (
                    <p className="text-xs text-destructive mt-1">{registrationErrors.city.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Password Field */}
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm font-medium">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {mode === 'signin' ? (
                  <input
                    key="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('passwordPlaceholder')}
                    value={loginFormData.password || ''}
                    onChange={(e) => handleLoginInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${loginErrors.password ? 'border-destructive' : 'border-border'
                      }`}
                    required
                    disabled={isLoading}
                  />
                ) : (
                  <input
                    key="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('passwordPlaceholder')}
                    {...register('password')}
                    className={`w-full pl-10 pr-12 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${registrationErrors.password ? 'border-destructive' : 'border-border'
                      }`}
                    disabled={isLoading}
                  />
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {mode === 'signin' ? (
                loginErrors.password && <p className="text-xs text-destructive mt-1">{loginErrors.password}</p>
              ) : (
                registrationErrors.password && <p className="text-xs text-destructive mt-1">{registrationErrors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field - Sign Up Only */}
            {mode === 'signup' && (
              <div className="space-y-1 sm:space-y-2">
                <label className="text-sm font-medium">{t('confirmPassword')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('confirmPasswordPlaceholder')}
                    {...register('password_confirmation')}
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${registrationErrors.password_confirmation ? 'border-destructive' : 'border-border'
                      }`}
                    disabled={isLoading}
                  />
                </div>
                {registrationErrors.password_confirmation && (
                  <p className="text-xs text-destructive mt-1">{registrationErrors.password_confirmation.message}</p>
                )}
              </div>
            )}

            {/* Forgot Password - Sign In Only */}
            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  {t('forgotPassword')}
                </button>
              </div>
            )}

            {/* Terms & Conditions - Sign Up Only */}
            {mode === 'signup' && (
              <div className="flex items-start space-x-2 sm:space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 sm:mt-1 rounded border-border flex-shrink-0"
                  required
                />
                <label htmlFor="terms" className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t('agreeTo')}{' '}
                  <a href="#" className="text-primary hover:text-primary/80 underline">{t('termsOfService')}</a>
                  {' '}{t('and')}{' '}
                  <a href="#" className="text-primary hover:text-primary/80 underline">{t('privacyPolicy')}</a>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-2.5 sm:py-3 text-base sm:text-lg font-semibold mt-4 sm:mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {mode === 'signin' ? t('signingIn') : t('creatingAccount')}
                </>
              ) : (
                mode === 'signin' ? t('submitSignIn') : t('submitSignUp')
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4 sm:my-6">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-3 sm:px-4 text-sm text-muted-foreground">{t('or')}</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-2 sm:space-y-3">
            <Button variant="outline" className="w-full py-2.5 sm:py-3 text-sm sm:text-base" type="button">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t('continueWithGoogle')}
            </Button>

          </div>

          {/* Switch Mode */}
          <div className="text-center mt-4 sm:mt-6">
            <p className="text-sm text-muted-foreground px-2">
              {mode === 'signin' ? t('signInPrompt') : t('signUpPrompt')}
              {' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {mode === 'signin' ? t('switchToSignUp') : t('switchToSignIn')}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

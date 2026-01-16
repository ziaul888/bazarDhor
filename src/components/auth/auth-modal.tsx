"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, CheckCircle, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from './auth-context';
import { useLogin, useRegister } from '@/lib/api/hooks/useAuth';
import { toast } from 'sonner';

export function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(authModalMode);
  
  // Sync mode with context when modal opens
  React.useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode);
    }
  }, [isAuthModalOpen, authModalMode]);
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    city: '',
    division: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // API hooks
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      if (!formData.dob.trim()) {
        newErrors.dob = 'Date of birth is required';
      }
      if (!formData.gender) {
        newErrors.gender = 'Gender is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.division) {
        newErrors.division = 'Division is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'signin') {
        // Login
        await loginMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
        });
        
        toast.success('Welcome back!', {
          description: 'You have successfully signed in.',
          icon: <CheckCircle className="h-5 w-5" />,
        });
        
        closeAuthModal();
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dob: '',
          gender: '',
          city: '',
          division: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        // Register
        await registerMutation.mutateAsync({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          city: formData.city,
          division: formData.division,
        });
        
        toast.success('Account created!', {
          description: 'Welcome to MyMarket. Start exploring local markets.',
          icon: <CheckCircle className="h-5 w-5" />,
        });
        
        closeAuthModal();
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      
      toast.error(mode === 'signin' ? 'Sign in failed' : 'Registration failed', {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5" />,
      });
      
      console.error('Auth error:', error);
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      city: '',
      division: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
              {mode === 'signin' ? 'Welcome Back!' : 'Join MyMarket'}
            </DialogTitle>
            <p className="text-center text-primary-foreground/80 mt-2 text-sm sm:text-base px-2">
              {mode === 'signin' 
                ? 'Sign in to access your account and discover local markets'
                : 'Create an account to start exploring fresh local produce'
              }
            </p>
          </DialogHeader>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Name Fields - Sign Up Only */}
            {mode === 'signup' && (
              <>
                {/* First Name */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${
                        errors.firstName ? 'border-destructive' : 'border-border'
                      }`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${
                        errors.lastName ? 'border-destructive' : 'border-border'
                      }`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                  )}
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${
                    errors.email ? 'border-destructive' : 'border-border'
                  }`}
                  required
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Field - Sign Up Only */}
            {mode === 'signup' && (
              <>
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${
                        errors.phone ? 'border-destructive' : 'border-border'
                      }`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${
                        errors.dob ? 'border-destructive' : 'border-border'
                      }`}
                      required
                      disabled={isLoading}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.dob && (
                    <p className="text-xs text-destructive mt-1">{errors.dob}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${
                      errors.gender ? 'border-destructive' : 'border-border'
                    }`}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-xs text-destructive mt-1">{errors.gender}</p>
                  )}
                </div>

                {/* Division */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-sm font-medium">Division</label>
                  <select
                    value={formData.division}
                    onChange={(e) => handleInputChange('division', e.target.value)}
                    className={`w-full px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${
                      errors.division ? 'border-destructive' : 'border-border'
                    }`}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select division</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                  {errors.division && (
                    <p className="text-xs text-destructive mt-1">{errors.division}</p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${
                        errors.city ? 'border-destructive' : 'border-border'
                      }`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {errors.city && (
                    <p className="text-xs text-destructive mt-1">{errors.city}</p>
                  )}
                </div>
              </>
            )}

            {/* Password Field */}
            <div className="space-y-1 sm:space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${
                    errors.password ? 'border-destructive' : 'border-border'
                  }`}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field - Sign Up Only */}
            {mode === 'signup' && (
              <div className="space-y-1 sm:space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background text-sm sm:text-base ${
                      errors.confirmPassword ? 'border-destructive' : 'border-border'
                    }`}
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
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
                  Forgot Password?
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
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:text-primary/80 underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:text-primary/80 underline">Privacy Policy</a>
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
                  {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4 sm:my-6">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-3 sm:px-4 text-sm text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-2 sm:space-y-3">
            <Button variant="outline" className="w-full py-2.5 sm:py-3 text-sm sm:text-base" type="button">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button variant="outline" className="w-full py-2.5 sm:py-3 text-sm sm:text-base" type="button">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>
          </div>

          {/* Switch Mode */}
          <div className="text-center mt-4 sm:mt-6">
            <p className="text-sm text-muted-foreground px-2">
              {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
              {' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
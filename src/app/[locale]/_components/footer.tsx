"use client";

import Image from 'next/image';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/components/auth/auth-context';
import { useConfig } from '@/hooks/use-config';
import { getBrandInitial, resolveBrandImage } from '@/lib/branding';

const BRAND_FALLBACK = 'BazarDhor';

export function Footer() {
    const t = useTranslations('footer');
    const tSeo = useTranslations('seo');
    const { openAuthModal } = useAuth();
    const { getConfigValue } = useConfig();

    // Why: prefer the admin-configured brand from /config, but fall back to the
    // localized SEO brand so the footer reads the same as the rest of the site.
    const localizedBrand = tSeo('brand');
    const companyName =
        getConfigValue<string>('business_name', BRAND_FALLBACK) || localizedBrand;
    const companyLogo = resolveBrandImage(getConfigValue<string | null>('logo', null));
    const companyInitial = getBrandInitial(companyName);
    const companyPhone = getConfigValue<string | null>('phone', null);
    const companyEmail = getConfigValue<string | null>('email', null);
    const companyAddress = getConfigValue<string | null>('address', null);
    const socialMedia =
        getConfigValue<Record<string, string | null>>('social_media', {}) || {};
    const tagline = t('tagline');
    const year = new Date().getFullYear();

    return (
        <footer className="bg-muted/50 border-t">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Company Info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <div className="relative h-6 w-6 overflow-hidden rounded-lg bg-primary">
                                    {companyLogo ? (
                                        <Image
                                            src={companyLogo}
                                            alt={companyName}
                                            fill
                                            className="object-cover"
                                            sizes="24px"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <span className="text-primary-foreground font-bold text-xs">
                                                {companyInitial}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span className="text-base font-bold">{companyName}</span>
                            </div>
                            <p className="text-muted-foreground text-xs leading-relaxed">{tagline}</p>
                            <div className="space-y-1">
                                {companyAddress ? (
                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        <span>{companyAddress}</span>
                                    </div>
                                ) : null}
                                {companyPhone ? (
                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                        <Phone className="h-3 w-3" />
                                        <a href={`tel:${companyPhone}`} className="hover:text-foreground">
                                            {companyPhone}
                                        </a>
                                    </div>
                                ) : null}
                                {companyEmail ? (
                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                        <Mail className="h-3 w-3" />
                                        <a href={`mailto:${companyEmail}`} className="hover:text-foreground">
                                            {companyEmail}
                                        </a>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-foreground">{t('quickLinks')}</h3>
                            <div className="grid grid-cols-2 gap-1">
                                <Link
                                    href="/markets"
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {t('findMarkets')}
                                </Link>
                                <Link
                                    href="/markets/compare"
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {t('comparePrices')}
                                </Link>
                                <Link
                                    href="/items"
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {t('browseItems')}
                                </Link>
                                <Link
                                    href="/about"
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {t('about')}
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => openAuthModal('signin')}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
                                >
                                    {t('signIn')}
                                </button>
                            </div>
                        </div>

                        {/* Social */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-foreground">{t('connect')}</h3>
                            <div className="flex items-center space-x-2">
                                {socialMedia.facebook ? (
                                    <a
                                        href={socialMedia.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Facebook"
                                        className="w-6 h-6 bg-muted hover:bg-primary rounded-full flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-colors"
                                    >
                                        <Facebook className="h-3 w-3" />
                                    </a>
                                ) : null}
                                {socialMedia.twitter ? (
                                    <a
                                        href={socialMedia.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Twitter"
                                        className="w-6 h-6 bg-muted hover:bg-primary rounded-full flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-colors"
                                    >
                                        <Twitter className="h-3 w-3" />
                                    </a>
                                ) : null}
                                {socialMedia.instagram ? (
                                    <a
                                        href={socialMedia.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                        className="w-6 h-6 bg-muted hover:bg-primary rounded-full flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-colors"
                                    >
                                        <Instagram className="h-3 w-3" />
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="py-3 border-t border-border">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <div className="text-xs text-muted-foreground">
                            {t('rights', { year, brand: companyName })}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <span>{t('madeWith')}</span>
                            <Heart className="h-3 w-3 text-red-500 fill-current" />
                            <span>{t('forCommunities')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

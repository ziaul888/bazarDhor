/**
 * Rustic potato-themed color palette utilities for the application
 * These correspond to the CSS custom properties defined in globals.css
 * Primary color: Warm rustic brown with natural, earthy appeal
 */

export const colors = {
    // Base colors
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',

    // Card colors
    card: 'hsl(var(--card))',
    cardForeground: 'hsl(var(--card-foreground))',

    // Popover colors
    popover: 'hsl(var(--popover))',
    popoverForeground: 'hsl(var(--popover-foreground))',

    // Primary colors
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',

    // Secondary colors
    secondary: 'hsl(var(--secondary))',
    secondaryForeground: 'hsl(var(--secondary-foreground))',

    // Muted colors
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',

    // Accent colors
    accent: 'hsl(var(--accent))',
    accentForeground: 'hsl(var(--accent-foreground))',

    // Status colors
    destructive: 'hsl(var(--destructive))',
    success: 'hsl(var(--success))',
    successForeground: 'hsl(var(--success-foreground))',
    warning: 'hsl(var(--warning))',
    warningForeground: 'hsl(var(--warning-foreground))',
    info: 'hsl(var(--info))',
    infoForeground: 'hsl(var(--info-foreground))',

    // Border and input
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',

    // Chart colors
    chart1: 'hsl(var(--chart-1))',
    chart2: 'hsl(var(--chart-2))',
    chart3: 'hsl(var(--chart-3))',
    chart4: 'hsl(var(--chart-4))',
    chart5: 'hsl(var(--chart-5))',

    // Sidebar colors
    sidebar: 'hsl(var(--sidebar))',
    sidebarForeground: 'hsl(var(--sidebar-foreground))',
    sidebarPrimary: 'hsl(var(--sidebar-primary))',
    sidebarPrimaryForeground: 'hsl(var(--sidebar-primary-foreground))',
    sidebarAccent: 'hsl(var(--sidebar-accent))',
    sidebarAccentForeground: 'hsl(var(--sidebar-accent-foreground))',
    sidebarBorder: 'hsl(var(--sidebar-border))',
    sidebarRing: 'hsl(var(--sidebar-ring))',
} as const;

/**
 * Color variants for different states
 */
export const colorVariants = {
    status: {
        success: {
            bg: 'bg-success',
            text: 'text-success-foreground',
            border: 'border-success',
            hover: 'hover:bg-success/90',
        },
        warning: {
            bg: 'bg-warning',
            text: 'text-warning-foreground',
            border: 'border-warning',
            hover: 'hover:bg-warning/90',
        },
        info: {
            bg: 'bg-info',
            text: 'text-info-foreground',
            border: 'border-info',
            hover: 'hover:bg-info/90',
        },
        destructive: {
            bg: 'bg-destructive',
            text: 'text-destructive-foreground',
            border: 'border-destructive',
            hover: 'hover:bg-destructive/90',
        },
    },
    semantic: {
        primary: {
            bg: 'bg-primary',
            text: 'text-primary-foreground',
            border: 'border-primary',
            hover: 'hover:bg-primary/90',
        },
        secondary: {
            bg: 'bg-secondary',
            text: 'text-secondary-foreground',
            border: 'border-secondary',
            hover: 'hover:bg-secondary/80',
        },
        accent: {
            bg: 'bg-accent',
            text: 'text-accent-foreground',
            border: 'border-accent',
            hover: 'hover:bg-accent/80',
        },
        muted: {
            bg: 'bg-muted',
            text: 'text-muted-foreground',
            border: 'border-muted',
            hover: 'hover:bg-muted/80',
        },
    },
} as const;

/**
 * Rustic potato color shades for additional styling options
 */
export const potatoShades = {
    50: 'oklch(0.95 0.02 65)',    // Soft Wheat
    100: 'oklch(0.92 0.04 65)',   // Soft Wheat #F3E4C8
    200: 'oklch(0.85 0.05 65)',
    300: 'oklch(0.78 0.06 65)',
    400: 'oklch(0.74 0.07 65)',
    500: 'oklch(0.70 0.08 65)',   // Primary Rustic Brown #C29F6D
    600: 'oklch(0.62 0.07 65)',   // Primary Hover Deep Earth #A8824C
    700: 'oklch(0.55 0.06 65)',
    800: 'oklch(0.45 0.05 65)',
    900: 'oklch(0.35 0.04 65)',
    950: 'oklch(0.32 0.04 65)',   // Dark Soil #4A3B28
} as const;

/**
 * Button color variants using the rustic potato theme
 */
export const buttonVariants = {
    primary: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/20',
        outline: 'border-primary text-primary hover:bg-primary hover:text-primary-foreground focus:ring-primary/20',
        ghost: 'text-primary hover:bg-primary/10 focus:ring-primary/20',
        soft: 'bg-primary/10 text-primary hover:bg-primary/20 focus:ring-primary/20',
    },
    secondary: {
        default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/20',
        outline: 'border-secondary text-secondary-foreground hover:bg-secondary focus:ring-secondary/20',
        ghost: 'text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/20',
        soft: 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 focus:ring-secondary/20',
    },
    success: {
        default: 'bg-success text-success-foreground hover:bg-success/90 focus:ring-success/20',
        outline: 'border-success text-success hover:bg-success hover:text-success-foreground focus:ring-success/20',
        ghost: 'text-success hover:bg-success/10 focus:ring-success/20',
        soft: 'bg-success/10 text-success hover:bg-success/20 focus:ring-success/20',
    },
    destructive: {
        default: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/20',
        outline: 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground focus:ring-destructive/20',
        ghost: 'text-destructive hover:bg-destructive/10 focus:ring-destructive/20',
        soft: 'bg-destructive/10 text-destructive hover:bg-destructive/20 focus:ring-destructive/20',
    },
} as const;

/**
 * Rustic potato color palette with neutral background
 */
export const potatoPalette = {
    primary: '#C29F6D',           // Primary Rustic Brown (potato skin)
    primaryHover: '#A8824C',      // Primary Hover - Deep Earth
    accent: '#F3E4C8',            // Accent - Soft Wheat
    background: '#FFFFFF',        // Background - Clean White
    text: '#252525',              // Text - Dark Neutral
} as const;

/**
 * Helper function to get color with opacity
 */
export const withOpacity = (color: string, opacity: number) => {
    return `${color}/${Math.round(opacity * 100)}`;
};
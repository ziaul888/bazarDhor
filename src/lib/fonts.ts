/**
 * Font utilities for the application
 * Modern, versatile fonts perfect for artisanal/rustic themes
 */

export const fontFamilies = {
  // Primary fonts
  sans: 'var(--font-poppins)',        // Poppins - friendly and modern
  mono: 'var(--font-source-code-pro)', // Source Code Pro - clean monospace
  
  // Alternative fonts
  display: 'var(--font-playfair-display)', // Playfair Display - elegant serif
  body: 'var(--font-open-sans)',          // Open Sans - highly readable
} as const;

/**
 * Font classes for Tailwind CSS
 */
export const fontClasses = {
  // Primary fonts
  poppins: 'font-poppins',     // Uses Poppins (default)
  mono: 'font-mono',           // Uses Source Code Pro
  
  // Alternative fonts
  display: 'font-display',     // Uses Playfair Display
  body: 'font-body',          // Uses Open Sans
} as const;

/**
 * Typography scale with modern font pairings
 */
export const typography = {
  // Headings - using Poppins (friendly and modern)
  h1: 'text-4xl font-bold tracking-tight font-poppins',
  h2: 'text-3xl font-semibold tracking-tight font-poppins',
  h3: 'text-2xl font-semibold tracking-tight font-poppins',
  h4: 'text-xl font-semibold tracking-tight font-poppins',
  h5: 'text-lg font-medium tracking-tight font-poppins',
  h6: 'text-base font-medium tracking-tight font-poppins',
  
  // Body text - using Poppins for consistency
  body: 'text-base font-poppins',
  bodyLarge: 'text-lg font-poppins',
  bodySmall: 'text-sm font-poppins',
  
  // Special text
  lead: 'text-xl text-muted-foreground font-poppins',
  caption: 'text-sm text-muted-foreground font-body',
  
  // Code and monospace
  code: 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded',
  codeBlock: 'font-mono text-sm',
  
  // Elegant headings with Playfair Display
  displayHeading: 'font-display font-bold tracking-tight',
  displayLarge: 'text-5xl font-display font-bold tracking-tight',
  
  // Body text with Open Sans for high readability
  readableBody: 'font-body text-base',
  readableLarge: 'font-body text-lg',
} as const;

/**
 * Font weight utilities
 */
export const fontWeights = {
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
} as const;

/**
 * Letter spacing utilities
 */
export const letterSpacing = {
  tighter: 'tracking-tighter',
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest',
} as const;
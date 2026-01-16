# Component Architecture Guide: Server vs Client Components

## 🎯 Overview

This guide identifies which components should be Server Components (default in Next.js 15) and which need to be Client Components (with `"use client"`).

## 📋 Decision Criteria

### **Server Components** (Default - No "use client")
✅ Use when component:
- Fetches data from database/API
- Accesses backend resources
- Doesn't use browser APIs
- Doesn't use React hooks (useState, useEffect, etc.)
- Doesn't use event handlers (onClick, onChange, etc.)
- Doesn't use Context providers/consumers
- Is purely presentational with static props

### **Client Components** (Needs "use client")
✅ Use when component:
- Uses React hooks (useState, useEffect, useContext, etc.)
- Uses event handlers (onClick, onChange, onSubmit, etc.)
- Uses browser APIs (localStorage, window, navigator, etc.)
- Uses third-party libraries that depend on browser APIs
- Needs interactivity or state management
- Uses Zustand, React Query hooks, or other client-side state

## 🗂️ Component Classification

### **✅ CORRECT - Already Client Components**

These components correctly have `"use client"`:

#### **Interactive UI Components**
- ✅ `src/components/mobile-navbar.tsx` - Uses state, event handlers
- ✅ `src/components/bottom-nav.tsx` - Uses pathname, navigation
- ✅ `src/components/navbar.tsx` - Uses state, event handlers
- ✅ `src/components/floating-add-button.tsx` - Uses event handlers
- ✅ `src/components/cart-button.tsx` - Uses Zustand hooks
- ✅ `src/components/cart-sidebar.tsx` - Uses Zustand, state
- ✅ `src/components/favorite-button.tsx` - Uses Zustand, state
- ✅ `src/components/notifications.tsx` - Uses Zustand, effects
- ✅ `src/components/store-demo.tsx` - Uses Zustand hooks

#### **PWA Components**
- ✅ `src/components/pwa-install-prompt.tsx` - Uses browser APIs, state
- ✅ `src/components/offline-indicator.tsx` - Uses browser APIs, effects
- ✅ `src/components/pwa-status.tsx` - Uses browser APIs, effects

#### **Context Providers**
- ✅ `src/app/_components/search-context.tsx` - Context provider
- ✅ `src/components/auth/auth-context.tsx` - Context provider
- ✅ `src/components/add-item-context.tsx` - Context provider
- ✅ `src/providers/query-provider.tsx` - React Query provider

#### **Modal/Dialog Components**
- ✅ `src/components/auth/auth-modal.tsx` - Uses state, forms
- ✅ `src/components/add-item-modal.tsx` - Uses state, forms
- ✅ `src/components/add-item-drawer.tsx` - Uses state, forms

#### **Search Components**
- ✅ `src/app/_components/search-section.tsx` - Uses state, input handlers

#### **Slider/Carousel Components**
- ✅ `src/components/hero-slider.tsx` - Uses Swiper (browser library)
- ✅ `src/components/compact-slider.tsx` - Uses Swiper
- ✅ `src/app/_components/triple-slider.tsx` - Uses Swiper
- ✅ `src/app/_components/product-carousel.tsx` - Uses Swiper

### **❌ NEEDS "use client" - Missing Directive**

These components use client-side features but are missing `"use client"`:

#### **Pages (Need Client Features)**
```typescript
// ❌ NEEDS FIX
src/app/page.tsx                              // Uses React Query hooks
src/app/markets/page.tsx                      // Uses state, filters
src/app/markets/[id]/page.tsx                 // Uses state, tabs
src/app/category/page.tsx                     // Uses state, filters
src/app/category/[slug]/page.tsx              // Uses state, search
src/app/profile/page.tsx                      // Uses state, tabs
src/app/markets/compare/page.tsx              // Uses state, comparison
src/app/items/page.tsx                        // Uses state, filters
```

#### **Component Sections**
```typescript
// ❌ NEEDS FIX
src/app/_components/category-section.tsx      // Static data, but could be server
src/app/_components/banner-section.tsx        // Static content - could be server
src/app/_components/footer.tsx                // Static content - could be server
src/app/_components/newsletter-section.tsx    // Has form - needs client
src/app/_components/location-section.tsx      // Uses geolocation - needs client
src/app/_components/app-download-section.tsx  // Uses PWA hook - needs client
src/app/_components/compare-markets-section.tsx // Uses state - needs client
src/app/_components/best-price-section.tsx    // Static - could be server
```

#### **Market Components**
```typescript
// ❌ NEEDS FIX
src/app/markets/_components/market-list.tsx   // Uses React Query
src/app/markets/_components/market-card.tsx   // If has interactions
src/app/markets/_components/market-filters.tsx // Uses state, filters
src/app/markets/[id]/_components/market-items-list.tsx // Uses React Query
```

#### **Category Components**
```typescript
// ❌ NEEDS FIX
src/app/category/_components/category-filters.tsx // Uses state
src/app/category/_components/category-card.tsx    // If has interactions
```

#### **Profile Components**
```typescript
// ❌ NEEDS FIX
src/app/profile/_components/favorite-markets.tsx  // Uses React Query
src/app/profile/_components/activity-history.tsx  // Uses React Query
src/app/profile/_components/profile-settings.tsx  // Uses forms, state
```

#### **Compare Components**
```typescript
// ❌ NEEDS FIX
src/app/markets/compare/_components/comparison-table.tsx // Uses state
src/app/markets/compare/_components/market-selector.tsx  // Uses state
```

### **✅ SHOULD BE Server Components**

These can remain as Server Components (no "use client" needed):

```typescript
// ✅ KEEP AS SERVER COMPONENTS
src/app/layout.tsx                    // Root layout (wraps client providers)
src/app/about/page.tsx                // Static content page
src/components/ui/*                   // Most UI primitives (unless interactive)
```

## 🔧 Implementation Guide

### **Pattern 1: Pages with Data Fetching**

#### **❌ Before (Incorrect):**
```typescript
// src/app/markets/page.tsx
import { useMarkets } from '@/lib/api/hooks';

export default function MarketsPage() {
  const { data, isLoading } = useMarkets();
  // ...
}
```

#### **✅ After (Correct):**
```typescript
// src/app/markets/page.tsx
"use client";

import { useMarkets } from '@/lib/api/hooks';

export default function MarketsPage() {
  const { data, isLoading } = useMarkets();
  // ...
}
```

### **Pattern 2: Split Server/Client Components**

#### **✅ Better Approach:**
```typescript
// src/app/markets/page.tsx (Server Component)
import { MarketList } from './_components/market-list';

export default function MarketsPage() {
  return (
    <div>
      <h1>Markets</h1>
      <MarketList />
    </div>
  );
}

// src/app/markets/_components/market-list.tsx (Client Component)
"use client";

import { useMarkets } from '@/lib/api/hooks';

export function MarketList() {
  const { data, isLoading } = useMarkets();
  // Interactive logic here
}
```

### **Pattern 3: Static Content Components**

#### **✅ Keep as Server Component:**
```typescript
// src/app/_components/footer.tsx (No "use client" needed)
import Link from 'next/link';

export function Footer() {
  return (
    <footer>
      <Link href="/about">About</Link>
    </footer>
  );
}
```

### **Pattern 4: Components with Forms**

#### **✅ Needs "use client":**
```typescript
// src/app/_components/newsletter-section.tsx
"use client";

import { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 📝 Quick Reference Checklist

### **Add "use client" if component uses:**

- [ ] `useState`, `useEffect`, `useReducer`, `useRef`
- [ ] `useContext` or custom hooks that use context
- [ ] Event handlers: `onClick`, `onChange`, `onSubmit`, etc.
- [ ] Browser APIs: `window`, `document`, `localStorage`, `navigator`
- [ ] React Query hooks: `useQuery`, `useMutation`
- [ ] Zustand hooks: `useAppStore`, `useAuth`, `useCart`, etc.
- [ ] Third-party hooks: `usePathname`, `useRouter` (from next/navigation)
- [ ] Form libraries: React Hook Form, Formik
- [ ] Animation libraries: Framer Motion, React Spring
- [ ] Slider libraries: Swiper, React Slick

### **Keep as Server Component if component:**

- [ ] Only renders static content
- [ ] Only uses props (no state or effects)
- [ ] Fetches data at build time
- [ ] Doesn't need interactivity
- [ ] Is a layout or template

## 🎯 Recommended Actions

### **Priority 1: Fix Pages**
Add `"use client"` to all page components that use:
- React Query hooks
- State management
- Event handlers
- Forms

### **Priority 2: Fix Interactive Components**
Add `"use client"` to components with:
- User interactions
- State management
- Browser APIs

### **Priority 3: Optimize Architecture**
Consider splitting large components:
- Server Component wrapper (data fetching, layout)
- Client Component children (interactivity)

## 🚀 Benefits of Proper Architecture

### **Server Components:**
- ✅ Smaller JavaScript bundle
- ✅ Better SEO
- ✅ Faster initial page load
- ✅ Direct database access
- ✅ Secure API keys

### **Client Components:**
- ✅ Interactivity
- ✅ State management
- ✅ Browser APIs
- ✅ Real-time updates
- ✅ User interactions

## 📊 Current Status

### **Correctly Configured:**
- ✅ ~30 components with proper "use client"
- ✅ Context providers
- ✅ Interactive UI components
- ✅ PWA components

### **Needs Attention:**
- ⚠️ ~15 page components
- ⚠️ ~20 feature components
- ⚠️ Some static components that could be server

### **Estimated Impact:**
- 📦 Bundle size reduction: ~15-20%
- ⚡ Initial load improvement: ~10-15%
- 🎯 Better SEO for static pages

## 🔍 Testing After Changes

```bash
# 1. Build the application
npm run build

# 2. Check bundle sizes
# Look for reduced client bundle sizes

# 3. Test functionality
npm run dev
# Test all interactive features

# 4. Check for errors
# Look for "use client" related errors in console
```

## 📚 Additional Resources

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

---

**Next Steps:** Review each component and add `"use client"` where needed, or refactor to use Server Components where possible.
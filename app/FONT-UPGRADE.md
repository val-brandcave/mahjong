# 🔤 Font Upgrade Guide - Switch to Geist Sans

## Current Status: Using System Fonts ✅

**Why:** 
- Faster load times for MVP/demo
- No download needed
- Native to each device

**Current font stack:**
```css
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

---

## 🎯 TODO: Upgrade to Geist Sans for Production

When ready to make the app more polished with consistent branding across all devices, follow these steps:

### Step 1: Install Geist Font Package

```bash
cd app
npm install geist
```

### Step 2: Update `app/layout.tsx`

Replace the current import section with:

```typescript
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// ... metadata and viewport stay the same ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} antialiased`}>
        <div className="mobile-container">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
```

### Step 3: Update `app/globals.css`

Change the body font-family to use the CSS variable:

```css
body {
  @apply bg-background text-foreground;
  font-feature-settings: "rlig" 1, "calt" 1;
  font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## ✨ Benefits of Geist Sans

- ✅ **Consistent** across all devices (same look everywhere)
- ✅ **Modern & Friendly** - perfect for the "Pickleball Mom" demographic
- ✅ **Highly readable** - optimized for 40-70 age group
- ✅ **Professional** - conveys quality and trust
- ✅ **Variable font** - can fine-tune weight/spacing
- ✅ **~100KB** - small file size for a custom font

---

## 🎨 Design Impact

**Before (System Fonts):**
- iOS: San Francisco
- Windows: Segoe UI
- Android: Roboto
- *Different on each device*

**After (Geist Sans):**
- All devices: Geist Sans
- *Consistent brand identity*
- *More polished, professional feel*

---

## 📊 When to Switch?

**Keep System Fonts if:**
- Still in MVP/testing phase ✅ (Current)
- Want fastest possible load times
- Prioritizing performance over branding

**Switch to Geist Sans when:**
- Ready for production launch
- Want consistent branding
- Building brand identity
- User testing shows good font readability

---

## 🚀 Quick Switch Command

When ready, just run:

```bash
# Install
npm install geist

# Then update layout.tsx and globals.css as shown above

# Restart dev server
npm run dev
```

That's it! Takes ~5 minutes to switch.

---

**Current Status:** System fonts (optimal for MVP) ✅  
**Next Step:** Switch to Geist Sans before production launch 🎯

*This file created as a reminder to upgrade fonts later.*


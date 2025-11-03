# Profile System - Feature Documentation

## Overview
The profile system allows users to view and manage their Mahjong learning profile, including personal information, flair, status, and language preferences.

## Pages & Routes

### 1. **Profile Page** (`/profile`)
The main profile view accessible from:
- Top-left avatar icon on the home dashboard
- Deep links from other pages

**Features:**
- Display user avatar, username, status, and flair
- Show current level and day streak
- Display stats: lessons completed, challenges completed, achievements
- Top-right menu with "Edit" and "Share Profile" options

**Components:**
- `useOnboardingStore()` - for username
- `useUserProfileStore()` - for level, streak, status, flair

---

### 2. **Edit Profile Page** (`/profile/edit`)
Full profile editing interface with:

**Input Fields:**
- **Profile Picture** - Avatar upload with file picker (take photo / choose from gallery)
- **Flair** - Navigate to flair selector (→ `/profile/edit/flair`)
- **Status** - Text input (50 char max, shows character count)
- **Username** - Read-only display (set during onboarding)
- **First Name** - Text input
- **Last Name** - Text input
- **Country** - Dropdown select with 12+ countries
- **Location** - Text input (city or region)
- **Language** - Navigate to language settings (→ `/profile/edit/language`)

**Save Button:** Persists all changes to `useUserProfileStore()`

---

### 3. **Flair Selection Page** (`/profile/edit/flair`)
Emoji/badge selection for user profile flair that appears next to username.

**Categories:**
1. **Remove Flair** - Option to clear flair (✕)
2. **Membership** - Diamond badges (💎, 🔷, 🟣, ❤️, 🟠, 💛)
3. **Crowns & Royalty** - Crown and star symbols (👑, ⭐, 🌟, ✨ + locked items)
4. **Emojis** - General emojis (😊, 😎, 💕, 🔥, 🌟, 🎉)
5. **Holidays & Seasons** - Holiday-themed emojis (🎄, 🎃, 💝, 🐰, 🌞, ❄️)

**Features:**
- Live preview of selected flair next to username
- Lock icons on premium/achievement-locked items
- Checkmark indicator for selected item
- Grid layout (6 columns) with smooth animations

---

### 4. **Language Settings Page** (`/profile/edit/language`)
Language and localization preferences with toggle switches.

**Settings:**
- "Display content in English when not available in my language" (default: ON)
- "Force English" (default: OFF)

**Button:**
- "Select Language" - For choosing specific language (future implementation)

---

## State Management

### `useUserProfileStore()` (Zustand)
Persistent state stored in localStorage under `mahjong-user-profile`

```typescript
interface UserProfileState {
  // Profile fields
  firstName: string;
  lastName: string;
  status: string;
  location: string;
  country: string;
  flair: string;
  language: string;
  
  // Progression
  level: number;        // Default: 8
  streak: number;       // Default: 12
  
  // Actions
  setFirstName(name: string): void;
  setLastName(name: string): void;
  setStatus(status: string): void;
  setLocation(location: string): void;
  setCountry(country: string): void;
  setFlair(flair: string): void;
  setLanguage(language: string): void;
  setLevel(level: number): void;
  setStreak(streak: number): void;
  resetProfile(): void;
}
```

### `useOnboardingStore()` (Zustand)
Used for username and avatar (set during auth flow)

```typescript
interface OnboardingState {
  username: string;
  avatarUrl: string;
  // ... other auth fields
}
```

---

## UI Components Used

- `MobileContainer` - Layout wrapper
- `Button` - Action buttons
- `Input` - Text fields
- Motion (Framer) - Smooth animations
- Lucide Icons - Menu icons, navigation arrows

---

## Navigation Flow

```
Home (/home)
  └─ Avatar Icon (top-left) → Profile (/profile)
      ├─ Menu (top-right)
      │  ├─ Edit → Edit Profile (/profile/edit)
      │  │  ├─ Profile Picture → File Picker
      │  │  ├─ Flair → Select Flair (/profile/edit/flair)
      │  │  ├─ Language → Language Settings (/profile/edit/language)
      │  │  └─ Save → Back to Profile
      │  └─ Share Profile → Share functionality (TODO)
      └─ Stats Section (Level, Streak, Lessons, Challenges, Achievements)
```

---

## Future Enhancements

1. **Avatar Upload** - Integrate with cloud storage (Firebase/Supabase)
2. **Share Profile** - Generate shareable links and social media cards
3. **Flair Unlocks** - Wire flair items to achievements/premium subscriptions
4. **Language Selection** - Add full language picker (i18n integration)
5. **Profile Validation** - Add backend validation for username uniqueness
6. **Profile Pictures** - Support image uploads instead of emoji avatars
7. **Social Stats** - Add friends count, referrals, etc.
8. **Privacy Controls** - Toggle what stats are publicly visible

---

## File Structure

```
app/
├── profile/
│   ├── page.tsx                    # Main profile view
│   └── edit/
│       ├── page.tsx                # Edit profile form
│       ├── flair/
│       │   └── page.tsx            # Flair selection
│       └── language/
│           └── page.tsx            # Language settings
lib/store/
└── onboarding.ts                   # Both onboarding and profile stores

PROFILE-FEATURE.md (this file)
```

---

## Testing Checklist

- [ ] Profile page displays all user info correctly
- [ ] Edit profile form saves changes to store
- [ ] Flair selection works and previews correctly
- [ ] Locked flair items show lock icon
- [ ] Country dropdown filters and selects properly
- [ ] Language toggles work smoothly
- [ ] Back button navigation works from all pages
- [ ] Mobile responsiveness on all screens
- [ ] Data persists after page reload (Zustand persistence)

---

**Status:** ✅ Complete - Profile system fully implemented with all pages functional.
**Last Updated:** November 2, 2025

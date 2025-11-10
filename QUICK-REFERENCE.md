# Quick Reference Guide

## 🎯 Quick Stats

| Metric | Value |
|--------|-------|
| **Build Status** | ✅ Production-ready |
| **Phase** | 1 Complete, 2 Starting |
| **Completion %** | 25% (foundation done) |
| **Pages Built** | 14+ pages |
| **No. of Stores** | 3 (Zustand) |
| **Tile Assets** | 98 images ready |
| **Lines of Code** | 3,000+ |
| **Dependencies** | All installed |
| **Linter Errors** | 0 ✅ |

---

## 🚀 How to Run the App

```bash
cd app
npm run dev
```

Then open: **http://localhost:3000**

To test on mobile:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone 14 Pro
4. Reload page

---

## 📂 Key File Locations

| What | Where |
|------|-------|
| **Onboarding Screens** | `app/app/onboarding/` |
| **Profile Pages** | `app/app/profile/` |
| **Friends Page** | `app/app/friends/page.tsx` |
| **State Stores** | `app/lib/store/onboarding.ts` |
| **Tiles Images** | `app/public/tiles/` |
| **Design System** | `app/app/globals.css` |
| **Components** | `app/components/` |
| **Layout Config** | `app/app/layout.tsx` |

---

## 🎨 Color Palette

```css
Primary:    #B565D8  /* Warm Mauve */
Secondary:  #5DAFA0  /* Soft Teal */
Accent:     #E86B8E  /* Coral Rose */
Success:    #52B788  /* Soft Green */
Background: #FAF8F5  /* Warm Off-white */
```

---

## 📱 Current Pages & Routes

### Onboarding (Complete ✅)
- `/onboarding` - Welcome & phone entry
- `/onboarding/phone-verify` - PIN verification
- `/onboarding/username` - Username setup
- `/onboarding/experience` - Experience level
- `/onboarding/theme` - Theme selection
- `/onboarding/trial` - Free trial offer
- `/home` - Home dashboard

### Profile (Complete ✅)
- `/profile` - Profile overview
- `/profile/edit` - Edit profile
- `/profile/edit/flair` - Flair selector
- `/profile/edit/language` - Language settings

### Friends (Complete ✅)
- `/friends` - Friends page

### To Build (Next)
- `/lessons` - Lessons library
- `/challenges` - Challenges library
- `/achievements` - Achievements gallery
- `/lesson/:id` - Individual lesson
- `/challenge/:id` - Individual challenge

---

## 🧠 State Stores (Zustand)

### `useOnboardingStore()`
Stores: `username`, `email`, `phone`, `experience`, `theme`, `trialAccepted`

```typescript
const { username, setUsername } = useOnboardingStore();
```

### `useUserProfileStore()`
Stores: `firstName`, `lastName`, `status`, `location`, `country`, `flair`, `language`, `level`, `streak`

```typescript
const { level, setLevel, streak, setStreak } = useUserProfileStore();
```

### `useFriendsStore()`
Stores: `friends[]`, `addFriend()`, `removeFriend()`

```typescript
const { friends, addFriend } = useFriendsStore();
```

---

## 🎯 Next 3 Tasks (Immediate)

### Task 1: Lessons Page (2 days)
- [ ] Create `/app/lessons/page.tsx`
- [ ] Show lesson cards with progress
- [ ] Implement star requirement logic

### Task 2: Lesson 01 Content (3 days)
- [ ] Build "Welcome to Mahjong" lesson
- [ ] Add interactive screens
- [ ] Implement star grading

### Task 3: First Challenge (2 days)
- [ ] Build "Tile Twins" challenge
- [ ] Implement scoring & stars

---

## 💾 Data Model (14 Tables Planned)

Already designed, need database setup:

1. User
2. UserStats (level, XP, stars, streaks)
3. UserSettings
4. Lesson
5. LessonProgress
6. Challenge
7. ChallengeAttempt
8. Achievement
9. UserAchievement
10. Streak
11. Friend
12. Subscription
13. NotificationPreference
14. DailyChallenge

Schema in: `context/data-model.md`

---

## 🎮 Gamification Quick Reference

### XP System
- **Per Lesson:** 100 XP base
- **Per Challenge:** 50 XP base + bonuses
- **Level Formula:** `level = floor(sqrt(total_xp / 100))`
- **Level 10:** 10,000 XP needed

### Star System
- **Per Lesson/Challenge:** 1-3 stars (based on performance)
- **Total Stars:** Sum of all stars earned
- **Unlock Requirements:**
  - Lesson 5: 10 stars
  - Lesson 8: 20 stars
  - Lesson 11: 50 stars

### Streak System
- **Calculation:** Days of consecutive activity
- **Reset Time:** >48 hours without activity
- **Notifications:** At 20 hours without activity
- **Shield:** Premium feature (skip 1 day)

### Achievements (50+ planned)
- **Categories:** Learning, Skill, Social, Dedication, Special
- **Unlock:** Based on user progression
- **Rewards:** XP bonus + badge/icon

---

## 🎓 Content Roadmap (Priority Order)

### Week 1-2: Basics
1. **Lesson 01:** Welcome to Mahjong (✅ Design ready)
2. **Lesson 02:** Tiles Overview (✅ Design ready)
3. **Lesson 03:** Dealing Process (✅ Design ready)
4. **Lesson 04:** Building Walls (✅ Design ready)

### Week 2-3: Charleston (Priority!)
5. **Lesson 05:** Charleston Basics (✅ Design ready)
6. **Lesson 06:** Charleston Speed (✅ Design ready)
7. **Lesson 07:** Charleston Strategy (✅ Design ready)

### Week 3-4: Strategy & Advanced
8. **Lesson 08:** Strategy Basics (✅ Design ready)
9. **Lesson 09:** Advanced Concepts (✅ Design ready)
10. **Lesson 10:** Game Situations (✅ Design ready)

---

## 🎯 Challenge Categories (32 Total)

| Category | Count | First Challenge |
|----------|-------|-----------------|
| Pattern Recognition | 6 | Which Hand? |
| Speed | 4 | Lightning Charleston |
| Charleston Mastery | 5 | Confidence Builder |
| Card Reading | 4 | Explorer |
| Tile Identification | 4 | Twins Match |
| Strategic Decision | 4 | Pivot Strategy |
| Memory | 3 | Discard Memory |
| Completion | 4 | What Do I Need? |

---

## 🚀 Getting Started with Next Task

### To Build Lessons Page:

1. Create file: `app/app/lessons/page.tsx`

2. Import components:
```typescript
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
```

3. Create lesson cards showing:
   - Lesson number & title
   - Stars needed / stars earned
   - Locked/unlocked state
   - Progress bar

4. Add category tabs (Basics, Charleston, Strategy, Advanced)

5. Wire to stores:
   - `useOnboardingStore()` - for user data
   - `useUserProfileStore()` - for level/stars

6. Navigation:
   - Click lesson → `/lesson/[id]` (build next)

---

## 📊 Development Stats

| Aspect | Status |
|--------|--------|
| **Frontend Setup** | ✅ Complete |
| **Mobile UX** | ✅ Optimized |
| **Design System** | ✅ Implemented |
| **State Management** | ✅ Working |
| **Navigation** | ✅ Functional |
| **Authentication UI** | ✅ Built |
| **Auth Backend** | ❌ Pending |
| **Database** | ❌ Pending |
| **API Endpoints** | ❌ Pending |
| **Payment System** | ❌ Pending |

---

## 🐛 Troubleshooting

### App won't start
```bash
rm -rf .next
npm run dev
```

### Module not found error
- Check file is in `/app/components/` (not `/components/`)
- Check import path starts with `@/`
- Clear .next and restart

### State not persisting
- Check `persist` middleware in Zustand store
- Check localStorage key in DevTools (F12)
- Try refreshing page

### Tiles not showing
- Check images exist in `public/tiles/regular/` or `public/tiles/black/`
- Check MahjongTile component path
- Verify tile symbol matches filename

---

## 📞 Key Contacts

| Role | Name | Note |
|------|------|------|
| **Founder/Instructor** | Genny | Mahjong expert, Austin |
| **Founder/Instructor** | Rebekah | Mahjong expert, Austin |
| **Developer** | Cody Miles | brandcave.co |

---

## 🎁 Resources & Links

- **Design References:** `context/design-references/`
- **Lesson Outlines:** `context/lessons/`
- **Challenge Specs:** `context/challenges/`
- **Data Model:** `context/data-model.md`
- **Information Architecture:** `context/information-architecture.md`
- **Gamification Strategy:** `context/gamification-strategy.md`

---

## 🔐 Security Notes

### Current (Phase 1)
- ❌ No authentication
- ✅ Data in localStorage only
- ✅ Client-side validation

### Needed (Phase 3)
- [ ] Backend authentication
- [ ] Secure API endpoints
- [ ] Password hashing
- [ ] HTTPS enforcement
- [ ] GDPR compliance

---

## 💡 Tips & Tricks

### Testing Mobile Keyboard
```
type="tel" → Number pad
type="text" → QWERTY
inputMode="numeric" → Number pad
```

### State Debugging
- Open DevTools → Application → LocalStorage
- Look for keys: `mahjong-onboarding`, `mahjong-user-profile`, `mahjong-friends`

### Animations
- All animations use Framer Motion
- Config in component files
- Adjust duration in `{animate: { ... }}`

### Adding New Route
1. Create folder: `app/app/[route-name]/`
2. Create file: `page.tsx`
3. Import MobileContainer
4. Add to navigation (tabs or buttons)

---

## ✅ Checklist: Before Each Development Session

- [ ] Branch latest code (git pull)
- [ ] `npm run dev` is running
- [ ] No console errors (F12)
- [ ] DevTools shows mobile viewport
- [ ] Can navigate between pages
- [ ] Data persists after reload

---

## 🎯 Success Criteria Checklist

**App is ready when:**

- [ ] 3+ lessons built and playable
- [ ] 3+ challenges built and playable
- [ ] XP/level system working
- [ ] Streak system tracking
- [ ] Achievements unlocking
- [ ] No critical bugs
- [ ] Mobile experience feels native
- [ ] All animations smooth
- [ ] All data persists

---

**Version:** 1.0  
**Last Updated:** November 10, 2025  
**Keep this handy!** 📌


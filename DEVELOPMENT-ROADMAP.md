# Mahjong App - Development Roadmap

**Current Phase:** MVP Foundation Complete ✅  
**Next Phase:** Core Features (Lessons, Challenges, Gamification)

---

## 📅 Phase Overview

```
PHASE 1: Foundation ✅ COMPLETE
├─ Design system & components
├─ Onboarding flow (7 screens)
├─ Profile management system
├─ Friends system
└─ Mobile optimization

PHASE 2: Core Features 🚀 STARTING
├─ Lesson system
├─ Challenge system
├─ Gamification (XP/levels/streaks/achievements)
└─ First content (Lesson 01 + Challenge 1)

PHASE 3: Backend Integration
├─ User authentication
├─ Database setup
├─ API endpoints
└─ Data persistence

PHASE 4: Premium & Monetization
├─ Subscription system
├─ Payment processing
├─ Premium paywalls
└─ In-app purchases

PHASE 5: Polish & Launch
├─ Performance optimization
├─ Accessibility (WCAG)
├─ User testing
├─ App store submission
└─ Marketing setup
```

---

## 🎯 Phase 2 Tasks: Core Features (CURRENT)

### Sprint 1: Lessons System (Week 1)

**Task 1.1: Lessons Page Setup** [2 days]
- [ ] Create `/app/lessons/page.tsx`
- [ ] Build lesson library view with categories
  - [ ] Category filter tabs: Basics, Charleston, Strategy, Advanced
  - [ ] Lesson cards showing:
    - [ ] Lesson number & title
    - [ ] Star requirement indicator
    - [ ] Stars earned by user
    - [ ] Locked/unlocked state
    - [ ] Progress percentage
- [ ] Implement scroll view for mobile
- [ ] Add "back" button navigation
- [ ] Wire up star requirements check

**Task 1.2: Lesson Detail/Intro Screen** [1 day]
- [ ] Create lesson intro screen
- [ ] Display lesson objectives
- [ ] Show estimated duration
- [ ] "Start Lesson" button
- [ ] Show prerequisites (star count needed)

**Task 1.3: Lesson 01 - Welcome to Mahjong** [3 days]
- [ ] Create first interactive lesson
- [ ] Content screens:
  - [ ] Intro: "What is Mahjong?"
  - [ ] Overview: Game objective
  - [ ] Tiles: Show all 34 tile types
  - [ ] Practice: Identify tiles
  - [ ] Summary: Key takeaways
- [ ] Add interactivity:
  - [ ] Force user to click/tap to progress
  - [ ] Practice exercises (identify tiles)
  - [ ] Can't proceed until correct
- [ ] Implement star calculation:
  - [ ] 3 stars: Perfect (100%)
  - [ ] 2 stars: Good (70-99%)
  - [ ] 1 star: Completed (50-69%)
  - [ ] 0 stars: Failed (<50%)
- [ ] Add completion screen with stars earned
- [ ] Award XP (100 XP base)

**Task 1.4: Lesson Progress Tracking** [1 day]
- [ ] Update `UserStats` store with:
  - [ ] `lessonProgress` object tracking each lesson
  - [ ] `starsEarned` per lesson (0-3)
  - [ ] `totalStars` aggregate
  - [ ] `lessonsCompleted` counter
- [ ] Create `getLessonStatus()` helper
- [ ] Create `completeLessonWithStars()` action
- [ ] Store persistence to localStorage

---

### Sprint 2: First Challenge (Weeks 1-2)

**Task 2.1: Challenges Page Setup** [2 days]
- [ ] Create `/app/challenges/page.tsx`
- [ ] Build challenge library with categories:
  - [ ] Pattern Recognition (6 challenges)
  - [ ] Speed Challenges (4 challenges)
  - [ ] Charleston Mastery (5 challenges)
  - [ ] Card Reading (4 challenges)
  - [ ] Tile Identification (4 challenges)
  - [ ] Strategic Decision (4 challenges)
  - [ ] Memory Challenges (3 challenges)
  - [ ] Completion Challenges (4 challenges)
- [ ] Challenge cards showing:
  - [ ] Challenge name & difficulty
  - [ ] Star requirement
  - [ ] Stars earned
  - [ ] Best score
  - [ ] Locked/unlocked state
- [ ] Category filter tabs
- [ ] Add search functionality

**Task 2.2: Challenge Gameplay Loop** [2 days]
- [ ] Create challenge intro screen
- [ ] Challenge gameplay interface
- [ ] Round feedback screen
- [ ] Challenge completion screen with:
  - [ ] Score achieved
  - [ ] Stars earned
  - [ ] XP earned
  - [ ] Share score option
  - [ ] Retry button

**Task 2.3: Tile Twins Challenge** [2 days]
- [ ] Challenge: "Match pairs of identical tiles"
- [ ] Gameplay:
  - [ ] Show 6 pairs of tiles (12 total, shuffled)
  - [ ] User taps two tiles to match
  - [ ] Correct match = stay flipped
  - [ ] Wrong match = flip back
  - [ ] Time limit: 60 seconds
  - [ ] Score = matches completed
- [ ] Scoring:
  - [ ] 3 stars: 6/6 matches in <20 seconds
  - [ ] 2 stars: 6/6 matches in <40 seconds
  - [ ] 1 star: 6/6 matches in <60 seconds
  - [ ] 0 stars: Incomplete
- [ ] XP reward: 50 XP base (+ bonus if 3-star)

**Task 2.4: Challenge Progress Tracking** [1 day]
- [ ] Update `UserStats` store with:
  - [ ] `challengeAttempts` array
  - [ ] Best score per challenge
  - [ ] Total attempts counter
  - [ ] XP earned from challenges
- [ ] Create `attemptChallenge()` action
- [ ] Create `getChallengeProgress()` helper
- [ ] Store persistence

---

### Sprint 3: Gamification Core (Week 2-3)

**Task 3.1: XP & Level System** [2 days]
- [ ] Implement XP earning:
  - [ ] Lesson completion: 100 XP base
  - [ ] Challenge attempt: 50 XP base + bonus
  - [ ] First attempt bonus: +50 XP
  - [ ] 3-star bonus: +50 XP
- [ ] Implement level calculation:
  - [ ] Formula: `level = floor(sqrt(total_xp / 100))`
  - [ ] Show XP progress to next level
  - [ ] Track `totalXP` in UserStats
- [ ] Create XP display:
  - [ ] XP bar on home dashboard
  - [ ] XP popup on activity completion
  - [ ] Current level display
- [ ] Add XP popup animation (Framer Motion)

**Task 3.2: Level-Up System** [1.5 days]
- [ ] Detect level up (new_level > old_level)
- [ ] Create level-up modal:
  - [ ] Show new level number
  - [ ] Celebrate with animation
  - [ ] Show XP progress
  - [ ] List rewards unlocked
- [ ] Level milestones:
  - [ ] Level 5: Unlock new challenge category
  - [ ] Level 10: Unlock custom avatars
  - [ ] Level 15: Unlock new tile style
  - [ ] Level 20: Unlock weekly tournaments
- [ ] Confetti animation on level-up

**Task 3.3: Star Tracking & Requirements** [1 day]
- [ ] Track total stars earned
  - [ ] Sum across all lessons
  - [ ] Sum across all challenge attempts
  - [ ] Display on profile & dashboard
- [ ] Update lesson unlock requirements:
  - [ ] Lesson 1-4: Always available (0 stars)
  - [ ] Lesson 5+: Star requirement increases
  - [ ] Lesson 8: 20 stars required
  - [ ] Lesson 11: 50 stars required
- [ ] Check star requirements before allowing entry
- [ ] Show "X more stars needed" message

**Task 3.4: Streak System** [2 days]
- [ ] Track daily login streak:
  - [ ] Record `current_streak` in UserStats
  - [ ] Record `longest_streak` in UserStats
  - [ ] Record `last_activity_date`
- [ ] Update streak logic:
  - [ ] Increment if activity within 24 hours
  - [ ] Keep same if just past 24 hours
  - [ ] Reset if >48 hours without activity
- [ ] Display on dashboard:
  - [ ] Show current streak (day count)
  - [ ] Show longest streak
  - [ ] Show last activity time
  - [ ] "Streak at risk" warning at 20+ hours
- [ ] Push notification at 20 hours (TODO: needs backend)

**Task 3.5: Daily Activity & Streaks Calendar** [1.5 days]
- [ ] Create streak calendar view
- [ ] Show last 30 days activity
- [ ] Green dot = activity that day
- [ ] Empty = no activity
- [ ] Access from profile page
- [ ] Add to dashboard summary

---

### Sprint 4: Achievements System (Week 3)

**Task 4.1: Achievement Definitions** [0.5 day]
- [ ] Define 50+ achievements (already designed)
- [ ] Categories:
  - [ ] Learning (first lesson, 5 lessons, etc.)
  - [ ] Skill (3-star lessons, challenge records)
  - [ ] Social (friend additions)
  - [ ] Dedication (streaks, login consistency)
  - [ ] Special (seasonal, event-based)
- [ ] For each achievement:
  - [ ] Name & description
  - [ ] Icon/badge
  - [ ] XP reward
  - [ ] Requirement type
  - [ ] Requirement value
  - [ ] Hidden/visible

**Task 4.2: Achievement Checking** [2 days]
- [ ] Create achievement checking logic
- [ ] Check triggers on:
  - [ ] Lesson completion
  - [ ] Challenge completion
  - [ ] Level up
  - [ ] Streak milestones
  - [ ] Friend additions
- [ ] For each achievement check:
  - [ ] Get user's current progress
  - [ ] Compare against requirement
  - [ ] Award if met (one-time only)
  - [ ] Add to `userAchievements` store
- [ ] Functions:
  - [ ] `checkLessonAchievements()`
  - [ ] `checkChallengeAchievements()`
  - [ ] `checkStreakAchievements()`
  - [ ] `checkFriendAchievements()`
  - [ ] `getAchievementProgress()`

**Task 4.3: Achievement Unlock Notifications** [1.5 days]
- [ ] Create achievement-unlocked modal
- [ ] Display on screen:
  - [ ] Achievement icon/badge (large)
  - [ ] Achievement name
  - [ ] Achievement description
  - [ ] XP reward earned
  - [ ] "Share" button
  - [ ] "Continue" button
- [ ] Queue achievements if multiple unlock
- [ ] Show after current activity completes
- [ ] Smooth animation (scale in, etc.)

**Task 4.4: Achievements Gallery Page** [2 days]
- [ ] Create `/app/achievements/page.tsx`
- [ ] Display all achievements in grid:
  - [ ] Locked achievements shown grayed out
  - [ ] Unlocked achievements highlighted
  - [ ] Progress indicator for in-progress
  - [ ] Earned date for unlocked
- [ ] Category filters
- [ ] Sort by: earned date, difficulty, name
- [ ] Achievement detail view:
  - [ ] Full description
  - [ ] Requirement details
  - [ ] Progress bar toward requirement
  - [ ] Share button

---

## 🎓 Content Creation Tasks

### Charleston Lessons Priority (4 lessons)

**Lesson 05: Charleston Basics** [Day 1]
- What is the Charleston
- Four passes: Right, Across, Left, Courtesy
- Interactive demo of each pass
- Practice: Tile movement exercise

**Lesson 06: Charleston Speed** [Day 1]
- Charleston timing and pace
- Common mistakes
- Fast vs. slow Charleston
- Practice: Timed Charleston

**Lesson 07: Charleston Strategy** [Day 2]
- Strategic thinking during Charleston
- Reading opponents
- Pass positioning
- Practice: Strategic scenarios

### Basic Lessons (Lessons 02-04)

**Lesson 02: Tiles Overview**
**Lesson 03: Dealing Process**
**Lesson 04: Building Walls**

---

## 🔧 Technical Setup Tasks

### Backend Infrastructure

**Task B.1: Database Setup** [1 day]
- [ ] Create PostgreSQL database (or Supabase)
- [ ] Create 14 tables (schema in data-model.md)
- [ ] Add indexes for performance
- [ ] Add constraints and validation
- [ ] Seed initial data (lessons, challenges, achievements)

**Task B.2: Authentication Backend** [2 days]
- [ ] Set up auth service (Auth0 or Supabase Auth)
- [ ] Phone verification with SMS (Twilio)
- [ ] Email verification
- [ ] Social auth (Apple, Google)
- [ ] JWT token generation
- [ ] Session management

**Task B.3: API Endpoints** [3 days]
- [ ] User management: /api/users
- [ ] Progress tracking: /api/progress
- [ ] Lessons: /api/lessons
- [ ] Challenges: /api/challenges
- [ ] Achievements: /api/achievements
- [ ] Streaks: /api/streaks
- [ ] Friends: /api/friends
- [ ] Stats: /api/stats

**Task B.4: Data Sync** [1 day]
- [ ] Replace localStorage with API calls
- [ ] Implement data fetching
- [ ] Error handling & offline support
- [ ] Data caching strategy

---

## 📊 Estimated Timeline

```
Week 1 (Sprint 1 + 2 start):
  - Lessons page + Lesson 01
  - Challenges page + Tile Twins challenge
  Estimated: 5 days dev time

Week 2 (Sprint 2 finish + 3 start):
  - Challenge progress tracking
  - XP & level system
  - Level-up celebrations
  Estimated: 5 days dev time

Week 3 (Sprint 3 finish + 4 start):
  - Star tracking & requirements
  - Streak system & calendar
  - Achievements system
  - Achievements gallery
  Estimated: 5 days dev time

Week 4 (Backend sprint):
  - Database setup
  - Authentication backend
  - API endpoints
  - Data sync from frontend to backend
  Estimated: 5-7 days dev time

Weeks 5-6:
  - Charleston lessons content
  - Additional challenges
  - Bug fixes
  - Performance optimization
  Estimated: 10 days

Total: ~4-5 weeks to MVP-ready
```

---

## ✅ Definition of Done (Phase 2)

A feature is "done" when:

- [ ] Code written and linted (no errors)
- [ ] Feature works on mobile (428px viewport)
- [ ] Data persists to localStorage/backend
- [ ] Smooth animations (Framer Motion)
- [ ] Touch-friendly interactions
- [ ] Accessible (labels, ARIA, proper contrast)
- [ ] Error states handled
- [ ] Empty states designed
- [ ] Responsive to different screen sizes
- [ ] No console errors or warnings
- [ ] Documented in code comments

---

## 🚨 Known Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Mahjong rules complexity | High | Hire Mahjong consultant for lesson content |
| Backend not ready | High | Use mock data longer, build API incrementally |
| Target demographic UX | Medium | User test with 50+ year old women early |
| Performance on older phones | Medium | Profile & optimize early, avoid large bundles |
| User engagement/retention | Medium | Implement streaks & achievements early |

---

## 🎯 Success Metrics (Phase 2)

After Phase 2 completion, measure:

- ✅ App loads in <3 seconds
- ✅ All 7 onboarding screens convert >80%
- ✅ 3+ lessons available and playable
- ✅ 3+ challenges available and playable
- ✅ Level-up celebration triggers correctly
- ✅ Achievements unlock and notify
- ✅ Zero critical linter errors
- ✅ Mobile experience feels native
- ✅ User can complete full lesson-to-reward flow

---

## 📝 Notes & Decisions

### Content Priority
1. **Highest:** Charleston lessons (major pain point)
2. **High:** Basic lessons (tiles, dealing, walls)
3. **Medium:** Strategy lessons
4. **Medium:** Advanced lessons (post-MVP)

### Challenge Priority
1. **First:** Tile Twins (simplest, good intro)
2. **Second:** Pattern Recognition 1
3. **Third:** Speed challenges (require timer)

### XP/Level Tuning
- Start conservative (100 XP per lesson)
- Adjust based on play testing
- Goal: Level 10 in ~10-15 hours of play

### Streak Psychology
- Notifications critical (push at 20h mark)
- Streak shield as premium feature ($2-3)
- Visual calendar reinforces daily habit

---

## 🚀 Go/No-Go Criteria

**Phase 2 is complete and ready for Phase 3 when:**

- [ ] All tasks in Sprint 1-4 marked complete
- [ ] 3+ lessons fully playable with clear progression
- [ ] 3+ challenges fully playable with scoring
- [ ] XP & level system working (player reaches level 2+)
- [ ] Streak system tracking correctly (24h+ testing)
- [ ] Achievements unlock and notify correctly
- [ ] No critical bugs on mobile device
- [ ] Performance metrics met (<3s load)
- [ ] User can complete Lesson → Challenge → Level Up flow
- [ ] All features tested by Genny & Rebekah (instructors)

---

**Document Version:** 1.0  
**Last Updated:** November 10, 2025  
**Next Review:** After Sprint 1 completion


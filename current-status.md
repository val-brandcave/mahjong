## Current Status – Mahjong Learning App

### Product Goal (Context Overview)

**High-level vision**  
- Build a beginner-friendly American (NMJL) Mahjong learning app for women 40–70 that feels fun, not academic.  
- Focus on interactive, step-by-step tutorials—especially the Charleston—and practice modes that complement in-person classes.  
- Use strong gamification (XP, levels, stars, streaks, achievements, collections, challenges) to keep students practicing between sessions and to make progress visible.

**Target user**  
- Primary persona: “Pickleball/Candy Crush mom” (40–70, female, low–medium tech confidence, likes bright, friendly apps, willing to pay for a good experience).  
- Key problems: hard-to-remember rules, intimidating Charleston, weak retention between paid classes, and cluttered/confusing competitor apps.

---

## What’s Implemented in the `app` Next.js Project

### Mobile Shell, Design System, and Tech Stack

- **Mobile-first shell**
  - Root `layout.tsx` wraps everything in a `mobile-container` optimized for ~428px width.
  - Viewport locked (no pinch-zoom) for a “native app” feel.
  - Global Toaster setup for lightweight notifications.

- **Design system**
  - Tailwind + shadcn/ui components for buttons, inputs, dialogs, sheets, tabs, etc.
  - Color palette, typography, spacing tuned for accessibility and older eyes (larger text, generous tap targets).
  - Mahjong tile component (`MahjongTile`) and mobile scaffolding (`MobileContainer`, `MobileHeader`) used across pages for a consistent visual language.

- **Tech stack**
  - Next.js App Router + TypeScript.
  - Zustand + `persist` middleware for client-side state (onboarding, user stats, profile, friends).
  - Framer Motion for transitions and micro-animations.

---

## Onboarding Flow (Implemented)

**Overall**  
- Complete, end-to-end **mocked** onboarding that collects all critical profile and personalization data and then lands the user on `/home`.
- All data stored in `useOnboardingStore` (Zustand + localStorage).

### Screens Implemented

- **`/onboarding` – Auth welcome screen**
  - Phone number auth: country code selector, phone input, validation, “Continue with phone” CTA.
  - Other options: email, Apple, Google, and “Play as guest” (all mocked).
  - Uses `MahjongTile` as a hero visual and branded headline (“Learn Mahjong. Have Fun.”).
  - Stores `authMethod`, `phoneNumber`, `countryCode` in onboarding store.

- **`/onboarding/phone-verify` – PIN code verification**
  - 6-digit code inputs with:
    - Auto-focus first input.
    - Auto-advance between digits.
    - Paste support (fills all 6 boxes).
    - Countdown / resend logic (simulated).
  - On successful entry, saves `pinCode` and routes to `/onboarding/username`.

- **`/onboarding/username` – Username & avatar**
  - Username input:
    - Restricts to alphanumeric + underscores.
    - Validates 3–20 chars with live feedback.
  - Avatar:
    - Visual placeholder with camera overlay (no real upload yet).
  - Terms of Service:
    - Required checkbox; button disabled until accepted.
  - On continue:
    - Persists `username` and moves to `/onboarding/experience`.

- **`/onboarding/experience` – Experience level**
  - Uses `experienceLevels` data to show 4 options:
    - Never played, basic rules, played several times, experienced.
  - Each option is a large, tile-based card with Mahjong tile icons and subtle animations.
  - Selected state stored as `experienceLevel` in onboarding store; continue routes to `/onboarding/theme`.

- **`/onboarding/theme` – Tile theme selection**
  - Tile theme grid from `tileThemes`:
    - Traditional, Modern, Colorful, High Contrast (with example tiles).
  - Selected state tracked in local state and persisted to `tileTheme`.
  - Continues to next onboarding step (social/permissions flow placeholder).

- **`/onboarding/trial` – Free trial / premium upsell**
  - Presents 1-week free premium trial with:
    - Core benefits list (e.g., unlimited challenges, advanced stats).
    - Yearly vs monthly toggle with price math and savings percentage.
  - Accept/skip:
    - `Redeem 1 Week Free` sets `acceptedTrial=true`.
    - `No, thank you` leaves it false.
  - Both paths route to `/home`.

### Data Stored from Onboarding

- **Auth & contact:** `authMethod`, `phoneNumber`, `countryCode`, stubbed `email`/`password`.
- **Profile basics:** `username`, `avatarUrl` (placeholder).
- **Preferences:** `experienceLevel`, `tileTheme`.
- **Monetization:** `acceptedTrial` flag.

> **Note:** All auth and trial behaviors are purely front-end mocks—no real SMS, email, or Stripe yet.

---

## Main App Navigation & Dashboard

### `/home` – Dashboard

- **Header**
  - Left: profile avatar shortcut -> `/profile`.
  - Center: “Mahj Club” brand title.
  - Right: friends/world icon -> `/friends`.

- **Premium banner**
  - Dismissible “Try Premium” banner with gradient background.
  - No real upsell wiring yet (just a visual CTA).

- **Progress section**
  - Level card:
    - Displays `level` from `useUserStatsStore`.
    - Uses XP to compute progress toward next level (supports level-based curve).
  - Streak card:
    - Shows `currentStreak` in days.
    - Visual 7-day bar motif for “mini streak” feel (partial implementation of full streak calendar).

- **Continue learning CTA**
  - Chooses **next incomplete lesson** from a small local list of lesson metadata.
  - Button routes to `/lesson/[id]` for that next lesson.

- **Daily challenge card**
  - Static daily challenge representation (title, difficulty, duration, tile).
  - Routes to `/challenges` (no per-challenge gameplay yet).

- **Quick stats tiles**
  - Lessons, challenges, achievements counts.
  - Currently mix of live and placeholder data (e.g., lessons partly tied to store; challenges/achievements still mostly static).

- **Friend activity**
  - Static mocked feed of recent friend actions (e.g., completed lesson, earned streak, mastered category).
  - Visual preview of future social layer; no real backend yet.

- **Bottom navigation**
  - Tabs for Home, Lessons, Challenges, More.
  - Wired so that tapping tabs routes between `/home`, `/lessons`, `/challenges`, and `/more-options`.

---

## Lessons System

### `/lessons` – Lesson Library

- **Lesson inventory**
  - 12 lessons defined in a local `ALL_LESSONS` list, mirroring the conceptual outline:
    - Foundation (1–2), Setup & Structure (3–4), Charleston (5–7), Reading the Card, Basic Gameplay, Strategy & Advanced.
  - Each lesson has:
    - `title`, `phase`, `difficulty`, `duration`, `starsRequired`, `tileSymbol`.

- **Grouping & ordering**
  - Lessons grouped by `phase` and rendered in phase order to match the teaching journey.

- **Locking & availability**
  - Lessons 1–3 always available (no star requirement).
  - Later lessons:
    - Lock if user has fewer stars than `starsRequired` *and* hasn’t already completed them.
    - Show lock icon and a badge with required stars where relevant.
  - Clicking a lesson:
    - If available/unlocked or already completed → navigates to `/lesson/[id]`.
    - If locked → no navigation.

- **Card UI details**
  - Each lesson card includes:
    - Mahjong tile preview, difficulty pill, duration, and star display for completed lessons.
  - Visual states:
    - Completed: green-tinged background, border highlight, stars filled based on `starsEarned`.
    - Available/next: accent-colored border and hover effect.
    - Locked: muted background, reduced opacity.

### `/lesson/[id]` – Interactive Lesson Runner

- **Lesson data mapping**
  - `LESSONS_MAP` currently includes:
    - `1: lesson01`, `2: lesson02`, `3: lesson03`.
  - Each `lessonXX` object (in `lib/data`) defines:
    - Lesson metadata (title, unlocks).
    - Screen content: a sequence of interactive screens.
    - Quiz questions.
    - Optional confidence rating step.
    - Rewards: base XP, XP per star, badge, next unlock.

- **State & progression logic**
  - Uses `useLessonProgressStore` to:
    - Start lessons with total screen count.
    - Track current screen index.
    - Mark screens/interaction steps complete.
    - Track quiz completion and overall lesson completion.
  - On mount:
    - If the lesson exists and is not yet started, calls `startLesson` with total steps.

- **Screen flow**
  - Lesson screens:
    - `LessonContainer` wraps UI (title, back/continue, progress).
    - `LessonScreen` renders each individual screen, including interactive elements and “Continue” buttons.
  - Back button:
    - Steps backward through screens; if at the first screen, returns to `/home`.
  - Continue button:
    - Marks current screen complete, moves to next screen.
    - When past last content screen → transitions to quiz.

- **Quiz and confidence rating**
  - Quiz:
    - `LessonQuiz` component renders questions and aggregates results.
    - On completion, returns `correctCount` and `totalCount`.
  - Confidence rating:
    - If the lesson defines `confidenceRating`, the flow shows `ConfidenceRatingComponent` after the quiz and before completion.

- **Star & XP calculation**
  - Stars based on quiz accuracy:
    - 3 stars: 100% correct.
    - 2 stars: ≥ 70% correct.
    - 1 star: ≥ 50% correct.
    - 0 stars: below 50%.
  - XP earned:
    - Base XP from lesson config plus star bonus XP from `starBonusXP`.
  - `completeLesson`:
    - Persists lesson completion and star count in `useLessonProgressStore`.
    - Updates user stats store’s XP and stars (partial implementation of full gamification loop).

- **Completion screen**
  - `LessonCompletion` shows:
    - Stars earned, total XP earned for the lesson, badge (if any), and CTA to next lesson.
    - Uses `nextLessonId` to route or suggest the next step.

### Scripted Game Engine (Lessons 2 & 3)

- **Dummy engine prototype**
  - Built `lib/game-engine/` with tile types, board state model, scenario validator, and lesson scenarios for tile sorting (Lesson 2) and wall building (Lesson 3).
  - Scenes use real Mahjong tile PNGs (`public/tiles/regular`) and happy visual styles from the reference folder.
- **Interactive components**
  - Added `MahjongBoard`, `InteractiveTile`, and `ScenarioPlayer` to render a pan/zoom mobile board, draggable tiles, fixed bucket UI with counters, and animated hints/toasts.
  - Supports pinch/scroll zoom, pan, drag, stack, and drop handling across scenarios.
- **Prototype automation**
  - Hint dismissal remembers once user closes it.
  - Lesson 2 auto-completes after 4 bucket drops (rest disappear + counter refresh).
  - Lesson 3 auto-flips/restores and auto-pairs/arranges with animation and toasts.
  - Always shows positive toasts (“Nice Job - Correct!”, “Great job!”) without invalid warnings.

### Current Limitations

- Only **Lessons 1–3** have real interactive content and quizzes; Lessons 4–12 are metadata only.
- Stars from challenges (see below) are not yet piped into the same `totalStars` that gates lessons.
- Achievements, streak shields, and other meta-rewards from lessons are not implemented yet.

---

## Challenges System

### `/challenges` – Challenge Library

- **Challenge catalog**
  - Uses `DUMMY_CHALLENGES` data to represent challenge definitions.
  - Categories align with design docs:
    - Pattern Recognition, Speed, Charleston Mastery, Card Reading, Tile Identification, Strategic Decisions, Memory, Completion.
  - Each challenge has:
    - `id`, `title`, `category`, `difficulty`, `duration`, `tileSymbol`, `starsRequired`, `unlocked`, `completed`, `bestStars`.

- **Locking & stars**
  - Displays total challenge stars earned (sum of `bestStars`).
  - Shows challenge completion counts (completed/total) at top.
  - For each challenge:
    - If unlocked: card is active, `Play` button style CTA.
    - If locked: muted card with lock icon plus “Earn X ⭐ to unlock” copy.
    - If completed: card still playable and shows up to three stars filled.

- **Navigation**
  - Clicking an unlocked challenge tries to route to `/challenges/[id]`.
  - As of now, **no** `/challenges/[id]` or gameplay implementation exists; navigation would lead to a missing route.

### Current Limitations

- No actual challenge gameplay screens (no per-type UX: pattern spotting, speed taps, Charleston drills, etc.).
- No persistence of challenge attempts beyond dummy data.
- Challenge stars do not yet feed into a unified `totalStars` or XP system shared with lessons.

---

## Profile, Social, and “More” Sections

### `/profile` – Profile Overview

- **Header & menu**
  - Title “Profile”, back button, overflow menu (Edit, Share Profile).
  - Share action is currently a stub (console log).

- **Profile summary**
  - Avatar placeholder (emoji-based).
  - Username from onboarding store or generic “Player”.
  - Optional status message and flair emoji from profile store.

- **Stats**
  - Level card and day streak card showing values from `useUserProfileStore` (initially seeded with example level/streak).
  - Grid tiles for lessons, challenges, achievements with hard-coded counts (not yet linked to live data).

### `/profile/edit` – Edit Profile

- **Avatar upload**
  - File input wired to a hidden `<input type="file">`; click opens file picker.
  - No upload pipeline yet (just logs selected file).

- **Flair**
  - Button routes to `/profile/edit/flair` to manage profile flair emoji.

- **Status & personal info**
  - Editable status message with character count.
  - Read-only username.
  - First name, last name, location, and country fields stored via `useUserProfileStore`.
  - Country dropdown with a predefined list; uses animated dropdown and selection state.

- **Language**
  - Entry route to `/profile/edit/language` for language settings; currently only English is shown as active.

- **Save**
  - “Save Changes” button persists all local edits back to the profile store and navigates back.

### `/profile/edit/flair` – Flair Selector

- **Preview**
  - Shows `username` and current selected flair (or “No flair”).

- **Flair categories**
  - Categories like Remove Flair, Membership, Crowns & Royalty, Emojis, Holidays & Seasons.
  - Items:
    - Each has id, emoji, label, and optional `locked` flag.
  - UX:
    - Locked flair shows 🔒 and cannot be selected.
    - Selected flair is highlighted with border and check badge.
  - Save button persists selection to profile store and returns to previous screen.

### `/profile/edit/language` – Language Settings

- **Toggles**
  - Simple options like:
    - “Display content in English when not available in my language.”
    - “Force English.”
  - Toggles stored locally (not yet wired to a global i18n system).

- **Select Language button**
  - Placeholder button for future full language-picker UI.

### `/friends` – Friends & Leaderboard

- **Invite tiles**
  - Visual buttons for Facebook, email, and generic “Invite” flows (no real integration yet).

- **Search & tabs**
  - Search field that filters both friends and suggestions.
  - Tabs for “Friends” and “Suggestions,” with pill badges showing counts.

- **Friends list**
  - Backed by `useFriendsStore`:
    - Stores an initial seeded list and allows adding new friends from suggestions.
  - Cards show initials avatar, username, full name, and level.
  - “View profile” button is present but not yet wired to a dedicated friend profile view.

- **Friend suggestions**
  - Static suggested-friend list with names/levels.
  - “Add friend” button adds to `useFriendsStore` and removes from suggestions.

- **Weekly leaderboard**
  - Static top-3 leaderboard with colored rank badges.
  - Cards show username, name, level, and a “view profile” button (stubbed).

- **Bottom navigation**
  - Same as other pages; wired to `/home`, `/lessons`, `/challenges`, and `/more-options`.

### `/more-options` – “More” Menu

- **Menu sections**
  - Try Premium (visual CTA only).
  - Shortcuts:
    - Stats (stub), Profile, Theme (stub), Awards (stub), Friends, Messages (stub), Settings (stub).
  - Learn:
    - Lessons and Challenges entries linking into main learning surfaces.
  - Account:
    - Membership and Support (both stubbed).

- **App info**
  - Version info and quick links for Privacy/Terms (buttons only, no routing yet).

---

## State & Data Model Alignment

### Zustand Stores (Front-End Only)

- **Onboarding store**
  - Matches the conceptual `User` + onboarding preferences from `data-model.md` at a minimal, front-end level.

- **User stats store**
  - Tracks level, total XP, total stars, lessons completed, challenges completed, streak, etc.
  - Partially wired to lessons: XP and stars update on lesson completion.
  - Does *not* yet implement the full XP curve, tiered rewards, or all fields described in `UserStats` from `data-model.md`.

- **Lesson progress store**
  - Mirrors `LessonProgress` from `data-model.md` in simplified form.
  - Tracks per-lesson status, stars, attempts, and current screen; writes to localStorage.

- **Profile & friends stores**
  - Provide front-end-only versions of `User`, `Friend`, and `Leaderboard` concepts.
  - Support profile editing and friend suggestions but not server-side data or multi-device sync.

### Where It Matches the Strategy

- **Stars & locking**
  - Lessons and challenges visually use star counts to gate progression, aligning with the “earn stars to unlock new tiers” pattern.

- **XP & level**
  - Lessons award XP and increment level using a growth formula, approximating the level tiers described in `gamification-strategy.md`.

- **Streak**
  - Streak is represented on Home/Profile and conceptually matches the daily login streak mechanic, though the real streak calendar and edge cases are not implemented.

---

## What’s Partially Done vs. Still Missing

### Partially Implemented

- **Lessons**
  - Lessons 1–3 are fully interactive with quizzes, stars, and XP.
  - Lessons 4–12 are defined as items in the library but have no content or lesson data objects.

- **Challenges**
  - Challenge catalog, locking, and stars UI are in place.
  - No challenge gameplay routes (`/challenges/[id]`) or logic yet; everything is dummy data.

- **Gamification loop**
  - Stars, XP, and levels exist in code and drive some UI and gating.
  - Achievements, daily/weekly goals, reward chests, collections (tiles/backgrounds/avatars), and streak shields are **not** implemented yet.

- **Social**
  - Friend list, suggestions, leaderboard, and profile flair all work locally.
  - There is no backend, real time sync, or actual messaging/sharing.

- **Monetization**
  - Free trial upsell exists visually and toggles a local flag.
  - No real billing, subscription enforcement, or premium-only content gating.

### Not Yet Implemented (High-Level)

- **Backend & real auth**
  - Real phone/email/Apple/Google auth and backend persistence for all entities described in `data-model.md`.

- **Complete lesson content**
  - Interactive flow + quiz + confidence rating for Lessons 4–12, based on the `context/lessons` specs.

- **Challenge gameplay**
  - Per-challenge-type screens and logic for all challenges in `context/challenges` (pattern recognition, Charleston drills, memory, speed, completion, etc.).

- **Full gamification system**
  - Achievements, streak shields, daily/weekly/monthly goals, reward chests, collection galleries, and advanced stats wired end-to-end.

- **Social & notifications**
  - Real friend connections, invites, messaging/reactions, and push notifications for streaks, new content, and friend milestones.

- **Monetization & premium**
  - Stripe (or similar) integration, proper free-trial handling, premium-only content, and optional cosmetic purchases aligned with the monetization strategy.

- **Mahjong game engine (post-MVP)**
  - Full practice games vs bots/multiplayer, card logic, Charleston engine, scoring, and match-level stats—if and when the project moves beyond a lessons+challenges MVP.

---

## How to Use This Document

- **Reference**: Use this file as the single source of truth for “what’s currently built” in the Next.js app.
- **Planning**: When deciding next tasks, update the “Partially Implemented” and “Not Yet Implemented” bullets to reflect current progress.
- **Onboarding new contributors**: Share this alongside the `context` docs so new devs understand both the product vision and the build status.



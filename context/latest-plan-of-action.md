## Latest Plan of Action

### 1. Shared Understanding
- Audience: women 40‑70 (“Pickleball Mom”) who need private, confidence-building practice between $60 beginner classes.
- Positioning: “Duolingo for American Mahjong” that demystifies the Charleston in 5‑minute interactive drills, layers XP/stars/streaks, and lives in a mobile-first experience instructors can recommend.
- Business targets: validate freemium funnel, hit 1K subs in six months, and convert instructors into the primary acquisition channel.

### 2. Competitive Snapshot
- **Mahj with Friends / Real Mahjong**: high awareness, poor UX, no learning path → we own “finally an app for beginners.”
- **Mahjongo**: best visuals but confusing; we must match polish and beat them on guided practice.
- **I Love Mahj**: instructor favorite web app ($6/mo). Treat as high threat—position as their mobile companion first, then replace once entrenched.
- **Passive formats (MahJongg Made Easy, in-person classes, YouTube)**: great top-of-funnel sources, not threats. Messaging becomes “watch/attend there, practice here.”

### 3. App Status (POC Baseline)
- ✅ Full onboarding flow with Zustand persistence.
- ✅ Lesson engine with three interactive lessons, quizzes, confidence check, and star/XP rewards.
- ✅ Home dashboard shows XP meter, streak, next lesson CTA, dummy friend feed, and challenge overview.
- ✅ Challenge list UI grouped by category (data in `lib/data/challenges.ts`).
- ✅ Prototype gameplay scenes (`/gameplay-*`) that render 2D/3D tables.
- ❌ Remaining: lessons 4+, Charleston drills, real challenge gameplay, instructor referral hooks, backend/auth, analytics, and polished gameplay environment around the table.

### 4. Gaps to Close Before POC Sign-off
1. **Curriculum**: lock scripts for first five lessons (including a three-part Charleston arc) plus dealing/walls coverage.
2. **Interactive Content**: convert Charleston instructions into drag/pass interactions and timed drills.
3. **Challenges**: ship at least one playable mini-game (“Tile Twins” or “Which Hand Is This?”) tied to XP/stars.
4. **Gamification Glue**: propagate streak/XP/star state to lesson gating, challenge locks, and celebratory micro-animations.
5. **Instructor Loop**: add referral CTA, shareable code/QR, and talking points so teachers can prescribe specific lessons.
6. **Gameplay Ambiance**: turn the landscape scene into a stage-set with three walls, ambient furniture, and warm lighting.
7. **Telemetry & Persistence**: add analytics events and abstract persistence so Zustand can later sync with a backend.

### 5. Execution Plan
#### Sprint 1 – Curriculum & Lessons
- Finalize lesson scripts, answer keys, and Charleston flowcharts with instructors.
- Extend `lesson-04/05` content plus Charleston Part 1–3 using existing LessonContainer/Screen system.
- Add new interaction types (drag-to-pass, timed taps) as reusable components.

#### Sprint 2 – Challenges & Gamification
- Promote one dummy challenge into a functioning mini-game with timers, scoring, and star thresholds; wire into `useUserStatsStore`.
- Update Home/lesson cards to display real totals, add streak/XP animations, and enable star-based locking logic already scaffolded in Lessons page.

#### Sprint 3 – Instructor & Social Hooks
- Turn the friend feed area into an “Instructor Recommended” module with referral CTA.
- Add basic share code/QR (even if stubbed) and supporting copy for instructors (“Assign Lesson 2 + Charleston Drill before session two”).

#### Sprint 4 – Gameplay Landscape Polish
- Implement three-wall “stage play” environment around the 3D table (textured planes, subtle furniture meshes, baked lighting) to avoid heavy performance hits.
- Add ambient particles or soft light sweeps for mood without distracting from tiles.

#### Sprint 5 – Tech Hardening & Analytics
- Instrument lesson/challenge start & completion events (Segment/PostHog placeholder).
- Swap Zustand `persist` to a service wrapper so we can redirect to backend storage later.
- Add lightweight auth guard + “resume onboarding” logic for QA flow.

### 6. Success Criteria for POC
- User can onboard, finish Charleston Lesson 1–3 plus at least one playable challenge, and see XP/stars/streak updates everywhere.
- Instructor can hand student a referral code and prescribe lessons confident the app mirrors their curriculum.
- Playtests with 3–5 students show Charleston comprehension in <10 minutes and measurable confidence gain.
- Gameplay landscape feels like an actual mahjong parlor (walls/furniture/lighting) when presenting the prototype.

### 7. Inputs Needed from Stakeholders
- Lesson copy, diagrams, and instructor-approved Charleston breakdowns.
- Visual references for the gameplay environment (colors, furniture, décor) and any licensing constraints (NML card usage).
- Decision on free vs. premium cut line for POC so paywalls and messaging align with monetization goals.

With this plan we prove the differentiated learning loop (interactive lessons + Charleston mastery + rewarding practice), showcase mobile-first polish that competitors lack, and give instructors a tangible tool to recommend—exactly what the proposal and positioning documents call for.


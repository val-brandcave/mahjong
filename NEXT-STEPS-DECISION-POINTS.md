# Next Steps & Decision Points

**Prepared:** November 10, 2025  
**For:** Genny, Rebekah, and Development Team

---

## 🎯 Immediate Priorities (Next 48 Hours)

### 1. **Review & Approval from Instructors** [CRITICAL]

**What:** Genny & Rebekah should review the built app

**Action Items:**
- [ ] Schedule 30-min demo session
- [ ] Walk through all 7 onboarding screens
- [ ] Get feedback on:
  - Text size and readability
  - Button sizes and spacing
  - Color scheme appeal
  - Navigation intuitiveness
  - Content accuracy
- [ ] Approve profile fields (all 8 fields correct?)
- [ ] Confirm lesson order priority
- [ ] Validate Charleston focus is clear

**Success Criteria:**
- ✅ Instructors approve onboarding content
- ✅ No requested design changes
- ✅ Lesson priority confirmed
- ✅ Content gaps identified

---

### 2. **Finalize Lesson Content Structure** [CRITICAL]

**Question:** How should lessons be structured?

**Options:**

#### Option A: Mini-Lessons (Recommended)
- **Lesson 01:** 5 minutes (Intro to Mahjong)
- **Lesson 02:** 5 minutes (Tiles)
- **Lesson 03:** 5 minutes (Dealing)
- etc.
- **Pros:** Easier to create, bite-sized learning
- **Cons:** More lessons to build total
- **Better for:** Retention, daily habit building

#### Option B: Full Lessons
- **Lesson 01:** 15-20 minutes (All basics)
- Covers tiles, dealing, walls
- **Pros:** Fewer total lessons to build
- **Cons:** Longer commitment, harder to complete
- **Better for:** Comprehensive learning

**Decision Needed:** ❓ Which approach?
**Recommendation:** Option A (mini-lessons) better for 40-70 demographic and retention

---

### 3. **Content Priority Decision** [CRITICAL]

**Question:** What content should be built first?

**Timeline Options:**

#### Option 1: Foundation First (7 weeks to MVP)
```
Week 1-2: Basic Lessons (Lessons 01-04)
  - Welcome to Mahjong
  - Tiles Overview
  - Dealing Process
  - Building Walls
  
Week 2-3: Charleston (Lessons 05-07) ← PRIORITY
  - Charleston Basics
  - Charleston Speed
  - Charleston Strategy
  
Week 3-4: Support Features
  - XP/Level system
  - Streak tracking
  - First 3 challenges
  
Week 4-5: Backend Setup
Week 5-7: Polish & Integration
```

#### Option 2: Charleston First (4 weeks to MVP)
```
Week 1: Charleston Only (Lessons 05-07 only)
  - Skip basics, assume players know basics
  
Week 1-2: Challenges (3-4 quick challenges)
Week 2-3: Gamification (XP/levels/achievements)
Week 3-4: Backend integration

Pros: Addresses major pain point (Charleston)
Cons: No foundational lessons, incomplete experience
```

**Decision Needed:** ❓ Foundation first or Charleston first?
**Recommendation:** Foundation first (but make Charleston 2nd priority)

---

## 💼 Business Decisions

### 4. **Monetization Model** [HIGH IMPORTANCE]

**Current Plan:** Subscription ($4-6/mo or $60-100/yr)

**Decision Needed:** Confirm or adjust?

**Options:**

#### Option 1: Full Subscription (Current Plan)
- $6/month or $100/year
- Gates: Lessons 11-13, unlimited challenges, ad-free
- 7-day free trial
- **Revenue:** High ($100/yr × 1000 users = $100k)
- **Barrier:** Paywall blocks users early
- **Better for:** Premium revenue model

#### Option 2: Freemium (Pay-Per-Lesson)
- Free: First 10 lessons
- Premium: Lessons 11-13 ($2.99 each)
- Plus: Cosmetics & premium challenges
- **Revenue:** Medium (depends on conversion)
- **Barrier:** Lower, more users convert
- **Better for:** Volume growth

#### Option 3: Hybrid (Subscription + In-App Purchases)
- Free: All lessons (1-10)
- Premium: Subscription for unlimited (lessons 1-13)
- Plus: Cosmetic purchases (tile styles, avatars, etc.)
- **Revenue:** High (multiple revenue streams)
- **Barrier:** Low barrier to entry
- **Better for:** Growth + revenue

**Decision Needed:** ❓ Which monetization model?
**Recommendation:** Hybrid approach (lessons free, subscription for advanced features + cosmetics)

---

### 5. **Feature Scope for MVP** [HIGH IMPORTANCE]

**Current Plan:** Lessons + Challenges + Gamification

**Decision Needed:** What's minimum viable?

**Options:**

#### Option 1: Minimum (Lean MVP)
- 3 lessons only (01, 05, 06)
- 2 challenges only (Tile Twins, Pattern 1)
- XP/level system
- No achievements initially
- No leaderboards
- **Time:** 4 weeks
- **Risk:** Too bare-bones

#### Option 2: Recommended (Balanced MVP)
- 7 lessons (01-07, includes Charleston)
- 8 challenges (one per category)
- XP/level system
- Basic achievements (5 starter achievements)
- Streak tracking
- **Time:** 6-7 weeks
- **Risk:** Ambitious but doable

#### Option 3: Full Feature (Complete)
- 13 lessons (all planned)
- 32 challenges (all planned)
- 50+ achievements
- Leaderboards
- Friends system (already built!)
- **Time:** 12+ weeks
- **Risk:** Too long before launch

**Decision Needed:** ❓ Minimum, balanced, or full scope?
**Recommendation:** Balanced MVP (option 2) - ship with 7 lessons + 8 challenges + core gamification

---

## 🛠️ Technical Decisions

### 6. **Backend & Database** [CRITICAL]

**Question:** When to build backend?

**Current State:** All frontend with localStorage (temporary)

**Options:**

#### Option 1: Build Now (Parallel)
- Week 1: Start database setup (Monday)
- Week 2-3: Build API endpoints
- Week 4: Migrate frontend to backend
- **Pros:** Data is safe, real auth, scalable
- **Cons:** Doubles dev work initially
- **Needs:** 2 developers OR 1 dev + 2 weeks solo

#### Option 2: Build Later (After MVP)
- Weeks 1-5: Frontend only (localStorage)
- Week 5: Start backend setup
- Week 6-7: Migrate to backend
- **Pros:** Faster initial MVP
- **Cons:** Data loss risk, no real auth, offline issues
- **Better for:** Tight timeline

#### Option 3: Hybrid (Gradual Migration)
- Weeks 1-3: Frontend + simple backend for auth only
- Week 3-4: Add progress tracking endpoints
- Week 4-5: Full backend integration
- **Pros:** Balanced approach
- **Cons:** More complex setup
- **Better for:** Team learning

**Stack Recommendation:**
- Database: Supabase (PostgreSQL with built-in auth)
- OR: Firebase (Firestore + Auth)
- Rationale: Faster setup, built-in auth, real-time sync

**Decision Needed:** ❓ Build backend now, later, or hybrid?
**Recommendation:** Supabase (easier than building from scratch) + phased migration

---

### 7. **Authentication Approach** [IMPORTANT]

**Current State:** Onboarding UI only, no real auth

**Options:**

#### Option 1: Simple Email (Easiest)
- Just email + password
- Skip phone verification (for MVP)
- Use Supabase Auth (built-in)
- **Time:** 1 day
- **Pros:** Fastest, simple
- **Cons:** Doesn't match onboarding (phone priority)

#### Option 2: Phone SMS (Original Plan)
- Phone verification with 6-digit PIN
- Use Twilio or SendGrid
- More complex setup
- **Time:** 3-4 days
- **Pros:** Matches UX, better for demographic
- **Cons:** Costs money, complex

#### Option 3: Social + Email (Best UX)
- Apple/Google OAuth
- Email as fallback
- Phone verification optional (later)
- **Time:** 2 days
- **Pros:** Works now, easy for users
- **Cons:** Less aligned with original vision

**Decision Needed:** ❓ Email, Phone, or Social first?
**Recommendation:** Social + Email for MVP, add phone later

---

## 📊 Timeline Options

### Option A: Fast Track (4 weeks to MVP)
```
Week 1: Lessons 01-03 + First Challenge
Week 2: Remaining Lessons 04-07 + 3 more Challenges
Week 3: XP/Level/Streak + Basic Achievements
Week 4: Backend integration + Bug fixes
Result: 7 lessons, 5 challenges, gamification working
```

### Option B: Balanced (6 weeks to MVP)
```
Week 1: Lessons 01-04
Week 2: Lessons 05-07 + First Challenge
Week 3: 5 more Challenges + Start Backend
Week 4: XP/Level/Streak System
Week 5: Achievements + Backend Integration
Week 6: Polish + Bug Fixes + Testing
Result: 7 lessons, 8 challenges, full gamification, real backend
```

### Option C: Comprehensive (8 weeks to MVP)
```
Week 1-2: Lessons 01-07 + Backend Setup
Week 2-3: Challenges 1-16 + XP/Level
Week 4: Achievements + Leaderboards
Week 5: Streaks + Notifications
Week 6: Friends feature + Social
Week 7: Payment System + Shop
Week 8: Testing + Polish
Result: Full feature set ready
```

**Decision Needed:** ❓ Which timeline?
**Recommendation:** Balanced (6 weeks) - gets quality product to market quickly

---

## 👥 Team & Resources

### 8. **Do You Need Additional Help?** [IMPORTANT]

**Current Setup:** 1 developer (Cody Miles)

**Assess Needs:**

| Task | Difficulty | Needs Help? | Role |
|------|-----------|-----------|------|
| Frontend (lessons/UI) | Medium | Maybe | Junior React dev |
| Backend (API/Database) | Hard | YES | Backend engineer |
| Content Creation | Easy | YES | Genny & Rebekah |
| Game Logic | Medium | YES | Dedicated dev |
| Art/Tiles | Easy | NO | Already designed |

**Recommendation:**
- ✅ Add 1 backend engineer (Node.js/SQL)
- ✅ Add 1 junior frontend dev (React)
- ✅ Content: Genny & Rebekah provide lesson scripts
- Timing: Start immediately (week 1)

---

## 🚀 Recommended Path Forward

### WEEK 1 (This Week)

**Day 1-2: Instructor Review**
- [ ] Demo app to Genny & Rebekah
- [ ] Gather feedback
- [ ] Approve onboarding content
- [ ] Confirm lesson priority

**Day 3-4: Decisions**
- [ ] Confirm monetization model
- [ ] Confirm MVP scope (7 lessons or more?)
- [ ] Confirm backend timeline (now or later?)
- [ ] Confirm team composition

**Day 5: Setup**
- [ ] Set up Supabase project (database)
- [ ] Create GitHub project board
- [ ] Set up CI/CD pipeline
- [ ] Create content outline (Genny & Rebekah)

### WEEKS 2-3: Content Sprint

**Build:**
- 7 interactive lessons (Lessons 01-07)
- First 3 challenges (Tiles, Pattern, Charleston)
- XP and level system
- Streak tracking

**Content:**
- Genny & Rebekah create lesson scripts
- Game designers document challenge rules
- QA tests all interactions

### WEEKS 4-6: Integration & Polish

**Build:**
- 5 more challenges
- Achievement system
- Backend integration
- Payment system setup

**Testing:**
- User testing with target demographic
- Performance optimization
- Bug fixes

### WEEK 7: Launch Prep

- [ ] Final QA
- [ ] App store submission prep
- [ ] Marketing materials
- [ ] Beta tester recruitment

---

## 📋 Decision Checklist

**Please confirm these decisions:**

### Design & UX
- [ ] **Text size:** Current is good? (16px+ base)
- [ ] **Button size:** Current is good? (44px+)
- [ ] **Colors:** All approved? (Warm Mauve primary)
- [ ] **Navigation:** Tab-based is good?

### Content
- [ ] **Charleston Priority:** Yes, after basics?
- [ ] **Mini-lessons:** 5-min lessons vs 20-min lessons?
- [ ] **Lesson Order:** Lessons 01-07 first?
- [ ] **Challenge Selection:** Which first? (Tile Twins?)

### Business
- [ ] **Monetization:** Subscription, freemium, or hybrid?
- [ ] **Target Price:** $6/mo or $100/yr confirmed?
- [ ] **Free Trial:** 7 days? Auto-convert?
- [ ] **Launch Target:** Q1 2026?

### Technical
- [ ] **Backend Timing:** Build now or later?
- [ ] **Database:** Supabase, Firebase, or build?
- [ ] **Auth Method:** Email, phone, or social first?
- [ ] **Team:** Need to hire developers?

### Timeline
- [ ] **MVP Scope:** 7 lessons + 8 challenges?
- [ ] **Timeline:** 6-week sprint to MVP?
- [ ] **Launch Date:** End of December 2025?
- [ ] **Resources:** Cody + 1 backend + 1 frontend?

---

## ⚠️ Risk & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Mahjong rules complexity | High | High | Hire consultant, Genny/Rebekah review |
| Target demographic UX | Medium | High | Test with 40-70 year olds NOW |
| Backend delays | Medium | High | Start NOW, use Supabase not custom |
| Content creation slow | Medium | Medium | Clear process, templates ready |
| Payment integration | Low | Medium | Use Stripe, Apple, Google SDKs |
| Performance issues | Low | Medium | Profile early, optimize late |

---

## 🎯 Success Metrics (MVP)

**App is "shipped" when:**

- [ ] 7+ lessons are playable (80%+ completion rate)
- [ ] 8+ challenges are playable (70%+ completion rate)
- [ ] Users can reach Level 5 naturally
- [ ] Streak system works for 7+ days
- [ ] Achievements unlock (5+ tested)
- [ ] Onboarding conversion >80%
- [ ] App loads in <2 seconds
- [ ] No critical bugs
- [ ] Target demographic approves UX
- [ ] Payment system works

---

## 💡 Optional Enhancements (Post-MVP)

**Don't do these yet, but plan for:**

- [ ] Video tutorials (10-15 total)
- [ ] Live multiplayer (1v1 against friends)
- [ ] Tournaments & leaderboards
- [ ] Push notifications (daily reminders)
- [ ] Referral program (instructor commissions)
- [ ] More cosmetics & themes
- [ ] Mahjong glossary/dictionary
- [ ] Annual card breakdowns (April releases)

---

## 📞 Action Items Summary

### For Genny & Rebekah:
- [ ] Review app this week
- [ ] Provide feedback on UX
- [ ] Approve onboarding flow
- [ ] Start writing lesson scripts (by Week 2)
- [ ] Validate game rules in challenges

### For Cody:
- [ ] Set up project infrastructure
- [ ] Make final tech decisions (backend/auth)
- [ ] Create development roadmap
- [ ] Hire/recruit team members
- [ ] Begin Lesson 01 development

### For Product/Business:
- [ ] Confirm monetization model
- [ ] Finalize MVP scope
- [ ] Approve timeline
- [ ] Allocate budget for team
- [ ] Plan beta testing

---

## 🎉 Final Thoughts

**The foundation is excellent.** You have:

✅ A beautiful, working interface  
✅ Complete onboarding flow  
✅ Profile and friends systems  
✅ Zero technical debt  
✅ Mobile-optimized design  
✅ Ready for content  

**Now it's about making the game.**

The hard part starts now - building engaging content that teaches Mahjong. But with Genny & Rebekah's expertise and clear content outlines, you're set up for success.

**Recommended next step:** Have them test the app THIS WEEK, then make go/no-go decision on Monday.

---

**Questions?** Review `APP-STATUS-SUMMARY.md` and `DEVELOPMENT-ROADMAP.md`

**Ready to start Phase 2?** All resources are in place. 🚀

---

**Document Version:** 1.0  
**Prepared by:** Development Team  
**Status:** Ready for Discussion & Decisions


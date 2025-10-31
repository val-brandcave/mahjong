# Challenge 1.1: Which Hand Is This?

## Challenge Metadata

**Challenge ID:** PATTERN-001
**Category:** Pattern Recognition
**Difficulty Levels:** Easy, Medium, Hard
**Estimated Duration:** 3-5 minutes
**Unlock Requirement:** Available from start
**Skills Trained:** Pattern matching, card familiarity, quick recognition

---

## Challenge Description

**Objective:** Given a completed hand of 14 tiles, identify which line on the NML card it matches.

**Why This Matters:** This is the core skill of Mahjong - recognizing patterns and matching them to the card. The faster you can identify hands, the better you'll play.

**Player Benefit:** Develop "Mahjong Eye" for instant pattern recognition, critical for knowing when you're close to winning.

---

## Mechanics

### Setup
- Display 14 tiles in a winning configuration
- Tiles are organized to show the pattern clearly
- NML card accessible for reference
- Timer displays at top (30 seconds per hand)

### Gameplay Loop
1. 14 tiles appear on screen in organized pattern
2. Timer starts (30 seconds)
3. User taps "View Card" to browse NML card
4. User selects matching line on card
5. System validates selection
6. Correct: Celebration + next hand
7. Incorrect: Show correct answer + continue
8. Complete 10 hands per session

### User Actions
- View the tile arrangement
- Browse NML card sections
- Tap to select matching line
- Submit answer
- See results and explanation

### Progression
- 10 hands per challenge session
- Hands increase in complexity
- Score accumulates
- Stars awarded based on performance

---

## Difficulty Levels

### Easy Mode
**Characteristics:**
- Common, frequently-used patterns
- Clear visual arrangements
- Obvious card sections (e.g., Consecutive Runs)
- Generous 30-second time limit per hand
- Simple patterns (FF 1111 2222 3333)

**Example Hands:**
- 2 Flowers + Four 1s + Four 2s + Four 3s
- Three Red Dragons + Pairs pattern
- Simple consecutive run

**Success Rate Target:** 80%+ completion

---

### Medium Mode
**Characteristics:**
- Less common patterns
- More card sections to search
- 25-second time limit per hand
- Similar-looking patterns (requires careful checking)
- Mixed suit patterns

**Example Hands:**
- Complex Dragon/Wind combinations
- Year-specific hands
- Patterns with C/X requirements

**Success Rate Target:** 65%+ completion

---

### Hard Mode
**Characteristics:**
- Obscure, rarely-used patterns
- Very similar hands that differ by one tile
- 20-second time limit per hand
- Patterns from less-visited card sections
- Concealed hands with subtle differences

**Example Hands:**
- Advanced quint patterns
- Unusual year hands
- High-point rare combinations

**Success Rate Target:** 50%+ completion

---

## Scoring System

### Base Scoring
- **Correct answer:** +100 points
- **Incorrect answer:** 0 points
- **Skip (no answer):** -25 points

### Time Bonuses
- **Under 10 seconds:** +100 bonus
- **Under 15 seconds:** +50 bonus
- **Under 20 seconds:** +25 bonus
- **Over time limit:** Answer still accepted, no time bonus

### Streak Bonuses
- **3 in a row:** +50 bonus
- **5 in a row:** +150 bonus
- **7 in a row:** +300 bonus
- **10 in a row (perfect):** +1000 bonus

### Difficulty Multipliers
- **Easy:** 1x points
- **Medium:** 1.5x points
- **Hard:** 2x points

### Maximum Possible Score
- Easy: 2,600 points (10 correct + all time bonuses + perfect streak)
- Medium: 3,900 points (with 1.5x multiplier)
- Hard: 5,200 points (with 2x multiplier)

---

## 3-Star Requirements

### ⭐ 1 Star - Completion
**Requirements:**
- Complete all 10 hands
- 70% accuracy (7/10 correct)
- Finish the challenge

**Reward:**
- 50 XP
- Challenge marked complete
- Unlock progress

---

### ⭐⭐ 2 Stars - Proficiency
**Requirements:**
- 80% accuracy (8/10 correct)
- Average time under 20 seconds per hand
- Total score above 1,500 points

**Reward:**
- 100 XP
- "Pattern Spotter" progress
- Bragging rights

---

### ⭐⭐⭐ 3 Stars - Mastery
**Requirements:**
- 90% accuracy (9/10 correct)
- Average time under 15 seconds per hand
- Total score above 2,200 points
- At least one 5+ streak

**Reward:**
- 200 XP
- "Pattern Master" badge (if all 3-star in category)
- Leaderboard eligibility
- Special achievement

---

## User Interface

### Main Screen
```
┌─────────────────────────────────────┐
│  Which Hand Is This?          [?]   │
│  Time: 28s         Hand 3/10        │
├─────────────────────────────────────┤
│                                     │
│  [Tile Display Area]                │
│  FF 1111 2222 3333                  │
│  [14 tiles arranged clearly]        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [VIEW CARD] [SKIP (-25 pts)]      │
│                                     │
│  Current Score: 850                 │
│  Streak: 3 🔥                       │
└─────────────────────────────────────┘
```

### Card Selection Screen
```
┌─────────────────────────────────────┐
│  ← Back to Hand                     │
│                                     │
│  Select Matching Pattern:           │
│                                     │
│  📋 Singles & Pairs                 │
│  📋 Consecutive Runs               │
│  📋 Quints                         │
│  📋 3-369                          │
│  📋 Winds & Dragons                │
│  📋 Year Hands                     │
│                                     │
│  [Scrollable card sections]         │
│  [Tap line to select]              │
└─────────────────────────────────────┘
```

### Results Screen (After Answer)
```
┌─────────────────────────────────────┐
│  ✓ Correct! +100 pts               │
│  Time Bonus: +50 (14 seconds)      │
│  Streak Bonus: +50 (3 in a row)    │
│                                     │
│  Pattern: Consecutive Runs          │
│  25 Points | FF 1111 2222 3333     │
│                                     │
│  [NEXT HAND]                        │
│                                     │
│  Progress: ████████░░ 8/10          │
└─────────────────────────────────────┘
```

---

## Visual Assets Needed

### Tile Graphics
- All 152 tiles in high quality
- Organized display arrangements
- Highlighted selections
- Celebration animations for correct answers

### UI Elements
- Timer display (countdown)
- Score counter (animated)
- Streak indicator (fire emoji + number)
- Progress bar (X/10 hands)
- Star indicators
- Card section icons

### Animations
- Tile reveal animation
- Correct answer celebration (confetti, glow)
- Incorrect answer shake
- Time running out warning (red pulse)
- Streak animation (fire effect)
- Score incrementing

### Card Interface
- Scrollable card sections
- Highlight selected line
- Zoom on tap
- Back navigation

---

## Implementation Notes

### Technical Requirements
- Tile rendering system
- Card database with all patterns
- Pattern matching validation algorithm
- Timer system (accurate to 0.1 second)
- Score calculation engine
- Streak tracking
- Star calculation

### Pattern Database
```json
{
  "pattern_id": "CONSEC_001",
  "section": "Consecutive Runs",
  "tiles": ["F", "F", "1B", "1C", "1D", "1B", "2B", "2C", "2D", "2B", "3B", "3C", "3D", "3B"],
  "card_line": "FF 1111 2222 3333",
  "points": 25,
  "difficulty": "easy"
}
```

### Randomization
- Pull from pattern database by difficulty
- Ensure variety (no repeats in same session)
- Balance card sections (not all from same section)
- Shuffle tile arrangements slightly (same pattern, different suits)

### Validation
- Compare user selection to correct pattern ID
- Allow exact match only
- Provide feedback on incorrect selections
- Show correct answer after wrong guess

---

## Success Metrics

### Player Engagement
- **Completion rate:** % who finish all 10 hands
- **Retry rate:** % who replay challenge
- **Time spent:** Average duration per session
- **Drop-off point:** Which hand do users quit on?

### Difficulty Balance
- **Easy mode success:** Target 80% accuracy
- **Medium mode success:** Target 65% accuracy
- **Hard mode success:** Target 50% accuracy
- Adjust if too easy/hard

### Learning Effectiveness
- **Improvement over time:** Compare 1st vs 10th attempt
- **Pattern familiarity:** Which patterns are learned fastest?
- **Speed improvement:** Time reduction over multiple plays
- **Accuracy improvement:** % increase over sessions

### Scoring Distribution
- Average score per difficulty
- High score tracking
- Percentile rankings
- Star distribution (how many 1/2/3 star completions?)

---

## Player Feedback & Hints

### During Challenge
- **First wrong answer:** "Don't worry! Check the card carefully and try to match the exact pattern."
- **Time running low:** "10 seconds left! Take your best guess."
- **3+ wrong in a row:** "Tip: Look at the section first - is it Consecutive Runs? Dragons? That narrows it down!"

### Post-Challenge
- **Below 50% accuracy:** "Keep practicing! Familiarity with the card comes with time. Try Easy mode to build confidence."
- **50-70% accuracy:** "Good progress! Try to identify the card section first, then find the specific pattern."
- **70-85% accuracy:** "Great job! You're developing your Mahjong Eye. Ready for the next difficulty?"
- **85%+ accuracy:** "Excellent! You're recognizing patterns like a pro. Try the next difficulty or beat your high score!"

---

## Accessibility Considerations

### Visual
- High contrast tiles
- Colorblind-friendly mode
- Zoom on tile display
- Large tap targets for card selection
- Clear labeling

### Cognitive
- Hint button available (point penalty)
- Skip option (small penalty)
- Adjustable time limits in settings
- Tutorial available any time
- Pattern explained after each hand

### Motor
- Large tap targets
- No precision required
- Swipe or tap options
- Voice input (future feature)

---

## Related Challenges

**Prerequisite Skills:**
- Lesson 02: Know Your Tiles
- Lesson 08: Understanding the Card

**Complementary Challenges:**
- Pattern Match Sprint (builds speed)
- Spot the Pattern (applies to own tiles)
- Card Explorer (builds card familiarity)

**Next Challenge:**
- Try Medium difficulty
- Pattern-1.2: Spot the Pattern

---

## Leaderboard & Social Features

### Leaderboards
- **Daily:** Top scores today
- **Weekly:** Top scores this week
- **All-Time:** Best scores ever
- **Friends:** Compare with friends
- **Difficulty-Specific:** Separate boards for Easy/Medium/Hard

### Sharing
- Share score to social media
- Challenge friends to beat score
- Share achievement badges
- "I got 3 stars on Which Hand Is This!"

### Competitive Elements
- Daily challenge version (same patterns for all users)
- Weekly tournament with prizes
- Achievement for beating friends' scores

---

*Last Updated: October 26, 2024*
*Status: Complete - Ready for Design & Development*

# Full Gameplay Flow - Complete Specification

## ✅ **Corrected Game Flow**

### **STAGE 1: Initial State**
- 4 colored racks visible (Yellow, Blue, Pink, Green)
- **All racks EMPTY** - no tiles dealt yet
- Wall tiles: 80 total (10 stacks × 2 high × 4 sides)
- **Golden pulsing ring** on first wall tile
- Message: "Initial Deal - Drag 6 tiles from wall"

---

### **STAGE 2: Player Draws 6 Tiles (Manual)**

**What Happens:**
1. Player clicks/drags the golden-ring wall tile
2. Tile automatically goes to player's yellow rack
3. Tile stands upright, facing player (readable)
4. Golden ring moves to NEXT wall tile
5. Counter updates (not shown in HUD anymore)
6. **Repeat 5 more times** until player has 6 tiles

**Fixed Issues:**
- ✅ Each draw is one tile at a time
- ✅ Tiles auto-position in rack
- ✅ Golden ring guides which tile to drag
- ✅ Stops at exactly 6 tiles

---

### **STAGE 3: Opponents Auto-Draw (Animated - ~5.4 seconds)**

**Opponent 1 (Blue Rack):**
- Draws **exactly 6 tiles** from wall
- One every 300ms (1.8 seconds total)
- Tiles go to blue rack, face-down

**Opponent 2 (Pink Rack):**
- Draws **exactly 6 tiles** from wall
- One every 300ms (1.8 seconds total)
- Tiles go to pink rack, face-down

**Opponent 3 (Green Rack):**
- Draws **exactly 6 tiles** from wall
- One every 300ms (1.8 seconds total)
- Tiles go to green rack, face-down

**Total:** 18 tiles drawn automatically in 5.4 seconds

---

### **STAGE 3.5: Transition Popup (3 seconds)**

**Popup appears:**
- Large centered modal
- Blue/purple gradient
- Message: **"Pick a new tile from the wall and discard"**
- Auto-dismisses after 3 seconds
- **No HUD** - popup is large and clear

---

### **STAGE 4: Gameplay Loop (Your Turn)**

**Player Actions:**
1. **Draw:** Drag one tile from wall → Adds to your rack (now 7 tiles)
2. **Discard:** Drag one tile from your rack → Drop toward center
3. Tile goes to **fixed discard position** near player's side
4. Reference: Screenshot shows discards in center, slightly toward player

**Tile Rearranging in Rack:**
- ✅ Drag tiles within your rack to reorder
- ✅ Other tiles shift to make space
- ✅ Smooth repositioning animation
- ✅ Tiles never overflow rack length (max 7 during turn)

**Discard Placement:**
- Position: Center of table, slightly toward player (Z=0.3 to 0.5)
- Layout: Grid pattern (4 tiles per row)
- Scattered slightly (random rotation ±0.3)

---

### **STAGE 5: Opponent Turns (Automated - 2 sec each)**

**Each Opponent:**
1. Draws 1 tile from wall (animated)
2. Discards 1 tile to center (animated)
3. 2 seconds total per opponent
4. 3 opponents × 2 sec = 6 seconds total

**Then back to player's turn (Stage 4)**

---

### **STAGE 6: Win Condition**

**After 5 Complete Rounds:**
- Round = Player turn + 3 opponent turns
- After 5 rounds, when it becomes player's turn again
- **Game ends** - "You won!" trophy modal
- Options: Play Again or Back to Home

---

## **Key Fixes Implemented:**

### **Fixed #1: Opponents Draw Exact Count**
- ✅ Each opponent draws EXACTLY 6 tiles during dealing
- ✅ Loop stops at 6, not random amounts
- ✅ Used `for (let i = 0; i < 6; i++)` instead of filtering

### **Fixed #2: Popup Instead of HUD**
- ✅ Large centered popup after dealing
- ✅ Clear message: "Pick a new tile from the wall and discard"
- ✅ Auto-dismisses after 3 seconds
- ✅ Much more visible than tiny HUD

### **Fixed #3: Discard Placement**
- ✅ Fixed position in center (not random scatter)
- ✅ Grid layout near player's side (Z=0.3+)
- ✅ Reference image matched
- ✅ 4 tiles per row pattern

### **Fixed #4: Rack Tile Rearranging**
- ✅ Drag within rack to reorder
- ✅ Find insertion index based on X position
- ✅ Other tiles shift smoothly
- ✅ No overflow - rack accommodates tiles

### **Fixed #5: Game Phase Tracking**
- ✅ "dealing" - Player draws 6, opponents draw 6 each
- ✅ "transition" - Popup shows for 3 seconds
- ✅ "playing" - Draw 1, discard 1 loop
- ✅ "won" - After 5 rounds, player wins

---

## **Technical Details:**

### **Tile Counts:**
- Start: 80 tiles in wall
- After dealing: 80 - 24 = 56 tiles in wall
- Each round: 4 players × 1 draw = 4 tiles from wall
- 5 rounds: 20 tiles drawn
- End: 56 - 20 = 36 tiles remain in wall

### **Timing:**
- Player draws 6 tiles: ~10-30 seconds (manual)
- Opponent auto-deal: 5.4 seconds
- Transition popup: 3 seconds
- Each round: ~10-15 seconds (player + 6 sec opponents)
- Total game: ~1-2 minutes

---

## **Files:**
- `app/components/gameplay-3d/FullGameplayV2.tsx` - New complete gameplay logic
- `app/app/gameplay-full/page.tsx` - Updated to use V2 and show popup
- `app/components/gameplay-3d/TileRack.tsx` - Colored racks (existing)

---

## **What You'll See Now:**

1. Empty racks + wall tiles
2. Golden ring prompting first tile
3. Drag 6 times → Your rack fills up
4. Watch opponents auto-draw
5. Big popup: "Pick a new tile and discard"
6. Your turn - draw 1, discard 1
7. Opponents play (6 seconds)
8. Repeat 5 times
9. You win! 🏆

The dev server should hot-reload. Try it now! 🎮


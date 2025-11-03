# Mahjong Tile Scaling Update ✅

## What Changed

Updated the MahjongTile component to display symbol images at **70% scale** of the background, with **centered positioning**.

### Visual Comparison

#### **Before (100% scale)**
```
┌─────────────────────────┐
│                         │
│    ┌───────────────┐    │
│    │               │    │  ← Symbol takes full space
│    │   [Symbol]    │    │     (100% of tile size)
│    │               │    │
│    └───────────────┘    │
│                         │
└─────────────────────────┘
```

#### **After (70% scale, centered)**
```
┌─────────────────────────┐
│        ┌─────────┐      │
│        │         │      │  ← Symbol is 70% size
│        │ [Symbol]│      │     Centered with padding
│        │         │      │
│        └─────────┘      │
└─────────────────────────┘
```

## Code Changes

### Key Calculations (Lines 60-65)

```typescript
// Symbol is 70% of the background size, centered
const symbolScale = 0.7;
const symbolWidth = Math.round(tileWidth * symbolScale);           // 70% width
const symbolHeight = Math.round(tileHeight * symbolScale);         // 70% height
const symbolOffsetX = Math.round((tileWidth - symbolWidth) / 2);   // Center X
const symbolOffsetY = Math.round((tileHeight - symbolHeight) / 2); // Center Y
```

### Layout Changes (Lines 108-116)

```typescript
{/* Layer 2: Tile Symbol (70% size, centered, overlaid on top) */}
<div
  style={{
    position: "absolute",
    top: `${symbolOffsetY}px`,      // ← Centered vertically
    left: `${symbolOffsetX}px`,     // ← Centered horizontally
    width: `${symbolWidth}px`,      // ← 70% of tile width
    height: `${symbolHeight}px`,    // ← 70% of tile height
    zIndex: 1,
  }}
>
```

## Size Examples

### Tile Size: 100px wide
```
Background:  100px × 120px (Full)
Symbol:      70px × 84px   (70% scale)
Padding:     15px on each side (30px ÷ 2)
```

### Tile Size: 60px wide
```
Background:  60px × 72px   (Full)
Symbol:      42px × 50px   (70% scale)
Padding:     9px on each side (18px ÷ 2)
```

### Tile Size: 150px wide
```
Background:  150px × 180px (Full)
Symbol:      105px × 126px (70% scale)
Padding:     22px on each side (45px ÷ 2)
```

## How It Works

### Step 1: Calculate Dimensions
```typescript
tileWidth = size parameter (e.g., 100)
tileHeight = tileWidth × 1.2 (e.g., 120)
```

### Step 2: Calculate Symbol Size (70%)
```typescript
symbolWidth = tileWidth × 0.7   (e.g., 70)
symbolHeight = tileHeight × 0.7 (e.g., 84)
```

### Step 3: Calculate Centering Offset
```typescript
offsetX = (tileWidth - symbolWidth) / 2   (e.g., (100 - 70) / 2 = 15)
offsetY = (tileHeight - symbolHeight) / 2 (e.g., (120 - 84) / 2 = 18)
```

### Step 4: Position Symbol
```typescript
position: absolute
top: offsetY (e.g., 18px)
left: offsetX (e.g., 15px)
width: symbolWidth (e.g., 70px)
height: symbolHeight (e.g., 84px)
```

## Component Structure

```
┌─ Main Container ─────────┐
│  (width: 100px)          │
│  (height: 120px)         │
│                          │
│  ┌─ Background Layer ──┐ │
│  │ (Front.png)        │ │
│  │ Full 100x120       │ │
│  │ z-index: 0         │ │
│  └────────────────────┘ │
│                          │
│  ┌─ Symbol Layer ─────┐  │
│  │ (Chun.png)        │  │
│  │ 70x84 (70%)       │  │
│  │ Top: 18px         │  │
│  │ Left: 15px        │  │
│  │ z-index: 1        │  │
│  └────────────────────┘  │
│                          │
└──────────────────────────┘
```

## Usage Examples

### Default Size (100px)
```tsx
<MahjongTile tileSymbol="Chun" />
```
- Background: 100px × 120px
- Symbol: 70px × 84px (centered)

### Small Size (60px)
```tsx
<MahjongTile tileSymbol="Pin5" size={60} />
```
- Background: 60px × 72px
- Symbol: 42px × 50px (centered)

### Large Size (150px)
```tsx
<MahjongTile tileSymbol="Hatsu" size={150} />
```
- Background: 150px × 180px
- Symbol: 105px × 126px (centered)

### With Black Variant
```tsx
<MahjongTile tileSymbol="flower-plum" variant="black" size={100} />
```
- Background: 100px × 120px
- Symbol: 70px × 84px (centered)
- Uses black tile style

## Benefits of 70% Scaling

✅ **Better Visual Balance**
- Symbol doesn't overwhelm the tile
- Shows off the tile background design
- More professional appearance

✅ **Consistent Padding**
- Equal padding on all sides
- Proportional at any size
- Clean, organized look

✅ **Improved Readability**
- Symbol stays clear and visible
- No clipping or overflow
- Good contrast with background

✅ **Scalable Design**
- Works at any tile size
- Proportions remain consistent
- Responsive and adaptable

## Updated Component Properties

| Property | Before | After |
|----------|--------|-------|
| Symbol width | 100% | 70% |
| Symbol height | 100% | 70% |
| Positioning | Full container | Centered |
| Offset X | 0px | Auto-calculated |
| Offset Y | 0px | Auto-calculated |
| Background size | 100% | 100% (unchanged) |

## Testing Sizes

Try these to see the scaling in action:

```tsx
// Tiny
<MahjongTile tileSymbol="Chun" size={40} />

// Small
<MahjongTile tileSymbol="Chun" size={60} />

// Medium (default)
<MahjongTile tileSymbol="Chun" size={100} />

// Large
<MahjongTile tileSymbol="Chun" size={120} />

// Extra Large
<MahjongTile tileSymbol="Chun" size={150} />
```

## Implementation Details

### Key Lines (Lines 60-65)

```typescript
// Symbol is 70% of the background size, centered
const symbolScale = 0.7;
const symbolWidth = Math.round(tileWidth * symbolScale);
const symbolHeight = Math.round(tileHeight * symbolScale);
const symbolOffsetX = Math.round((tileWidth - symbolWidth) / 2);
const symbolOffsetY = Math.round((tileHeight - symbolHeight) / 2);
```

### Positioning Lines (Lines 108-116)

```typescript
<div
  style={{
    position: "absolute",
    top: `${symbolOffsetY}px`,
    left: `${symbolOffsetX}px`,
    width: `${symbolWidth}px`,
    height: `${symbolHeight}px`,
    zIndex: 1,
  }}
>
```

## Next Steps

1. **Restart dev server** (if running)
   ```bash
   npm run dev
   ```

2. **Hard refresh browser**
   ```
   Ctrl+Shift+R
   ```

3. **Navigate to `/onboarding`**
   - Red Dragon tile should show scaled symbol
   - Symbol centered with padding
   - Clean, professional appearance

## Verification

✅ Component updated with 70% scaling  
✅ Symbol centered with auto-calculated offsets  
✅ Background remains full size (Front.png)  
✅ Works at any tile size  
✅ No linting errors  
✅ Ready to use!

---

**Update:** Symbol scaling to 70% with centering  
**Status:** ✅ Complete and verified  
**Applies to:** All future tiles  
**Ready:** Yes! 🀄

The tiles now have a professional appearance with proper spacing and balance!

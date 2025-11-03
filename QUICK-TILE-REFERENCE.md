# Quick Reference: MahjongTile Component

## Simplest Usage

```tsx
import { MahjongTile } from "@/components/mahjong/MahjongTile";

<MahjongTile tileSymbol="Chun" />
```

---

## All Tile Symbols (Copy-Paste Ready)

### Number Tiles (27)
```tsx
{/* Dots */}
<MahjongTile tileSymbol="Pin1" />
<MahjongTile tileSymbol="Pin2" />
<MahjongTile tileSymbol="Pin3" />
<MahjongTile tileSymbol="Pin4" />
<MahjongTile tileSymbol="Pin5" />
<MahjongTile tileSymbol="Pin6" />
<MahjongTile tileSymbol="Pin7" />
<MahjongTile tileSymbol="Pin8" />
<MahjongTile tileSymbol="Pin9" />

{/* Bams */}
<MahjongTile tileSymbol="Sou1" />
<MahjongTile tileSymbol="Sou2" />
<MahjongTile tileSymbol="Sou3" />
<MahjongTile tileSymbol="Sou4" />
<MahjongTile tileSymbol="Sou5" />
<MahjongTile tileSymbol="Sou6" />
<MahjongTile tileSymbol="Sou7" />
<MahjongTile tileSymbol="Sou8" />
<MahjongTile tileSymbol="Sou9" />

{/* Craks */}
<MahjongTile tileSymbol="Man1" />
<MahjongTile tileSymbol="Man2" />
<MahjongTile tileSymbol="Man3" />
<MahjongTile tileSymbol="Man4" />
<MahjongTile tileSymbol="Man5" />
<MahjongTile tileSymbol="Man6" />
<MahjongTile tileSymbol="Man7" />
<MahjongTile tileSymbol="Man8" />
<MahjongTile tileSymbol="Man9" />
```

### Honor Tiles (7)
```tsx
{/* Winds */}
<MahjongTile tileSymbol="Ton" />      {/* East */}
<MahjongTile tileSymbol="Nan" />      {/* South */}
<MahjongTile tileSymbol="Shaa" />     {/* West */}
<MahjongTile tileSymbol="Pei" />      {/* North */}

{/* Dragons */}
<MahjongTile tileSymbol="Chun" />     {/* Red */}
<MahjongTile tileSymbol="Hatsu" />    {/* Green */}
<MahjongTile tileSymbol="Haku" />     {/* White */}
```

### Bonus Tiles (8)
```tsx
{/* Flowers */}
<MahjongTile tileSymbol="flower-plum" />
<MahjongTile tileSymbol="flower-orchid" />
<MahjongTile tileSymbol="flower-chrysanthemum" />
<MahjongTile tileSymbol="flower-bamboo" />

{/* Seasons */}
<MahjongTile tileSymbol="season-spring" />
<MahjongTile tileSymbol="season-summer" />
<MahjongTile tileSymbol="season-autumn" />
<MahjongTile tileSymbol="season-winter" />
```

### Special Tiles (4)
```tsx
{/* Joker */}
<MahjongTile tileSymbol="joker" />

{/* Premium Red-5s */}
<MahjongTile tileSymbol="Man5-Dora" />  {/* Red 5-Crak */}
<MahjongTile tileSymbol="Pin5-Dora" />  {/* Red 5-Dot */}
<MahjongTile tileSymbol="Sou5-Dora" />  {/* Red 5-Bam */}
```

---

## Common Sizes

```tsx
<MahjongTile tileSymbol="Chun" size={40} />   {/* Tiny (48px tall) */}
<MahjongTile tileSymbol="Chun" size={60} />   {/* Small (72px tall) */}
<MahjongTile tileSymbol="Chun" size={80} />   {/* Medium (96px tall) */}
<MahjongTile tileSymbol="Chun" size={100} />  {/* Large (120px tall) - DEFAULT */}
<MahjongTile tileSymbol="Chun" size={120} />  {/* XL (144px tall) */}
<MahjongTile tileSymbol="Chun" size={150} />  {/* XXL (180px tall) */}
```

---

## Variants

```tsx
{/* Regular (default) */}
<MahjongTile tileSymbol="Chun" variant="regular" />

{/* Black (high contrast) */}
<MahjongTile tileSymbol="Chun" variant="black" />
```

---

## Common Patterns

### Player Hand
```tsx
function Hand() {
  const tiles = ["Pin1", "Pin2", "Pin3", "Ton", "Chun"];
  return (
    <div className="flex gap-2">
      {tiles.map(t => <MahjongTile key={t} tileSymbol={t} size={70} />)}
    </div>
  );
}
```

### Discard Pile
```tsx
function DiscardPile() {
  const discards = ["Pin5", "Sou3", "Man9", "Hatsu"];
  return (
    <div className="flex flex-wrap gap-1">
      {discards.map((t, i) => (
        <div key={i} style={{ transform: `rotate(${Math.random() * 10 - 5}deg)` }}>
          <MahjongTile tileSymbol={t} size={50} />
        </div>
      ))}
    </div>
  );
}
```

### Animated Tile
```tsx
import { motion } from "framer-motion";

<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
  <MahjongTile tileSymbol="Chun" size={100} />
</motion.div>
```

### Grid Display
```tsx
function AllTiles() {
  const allTiles = [
    "Pin1", "Pin2", "Pin3", "Pin4", "Pin5", "Pin6", "Pin7", "Pin8", "Pin9",
    "Sou1", "Sou2", "Sou3", "Sou4", "Sou5", "Sou6", "Sou7", "Sou8", "Sou9",
    "Man1", "Man2", "Man3", "Man4", "Man5", "Man6", "Man7", "Man8", "Man9",
    "Ton", "Nan", "Shaa", "Pei",
    "Chun", "Hatsu", "Haku",
    "flower-plum", "flower-orchid", "flower-chrysanthemum", "flower-bamboo",
    "season-spring", "season-summer", "season-autumn", "season-winter",
    "joker",
    "Man5-Dora", "Pin5-Dora", "Sou5-Dora"
  ];

  return (
    <div className="grid grid-cols-9 gap-2">
      {allTiles.map(t => (
        <MahjongTile key={t} tileSymbol={t} size={60} />
      ))}
    </div>
  );
}
```

---

## Props Reference

```typescript
interface MahjongTileProps {
  tileSymbol: string;          // Required: tile name (e.g., "Chun")
  size?: number;               // Optional: width in px (default: 100)
  variant?: "regular" | "black"; // Optional: style (default: "regular")
  className?: string;          // Optional: extra CSS classes
  alt?: string;                // Optional: alt text
  title?: string;              // Optional: hover tooltip
}
```

---

## Asset Info

- **Location:** `/public/tiles/{regular|black}/`
- **Total Designs:** 49 per variant
- **Supported Sizes:** Any size (recommended 40-150px)
- **Aspect Ratio:** 1:1.2 (auto-calculated)
- **Tile Count in Full Set:** 152 physical tiles (with 4× copies)

---

## Common Mistakes

```tsx
// ❌ WRONG - filename needs no extension
<MahjongTile tileSymbol="Chun.png" />

// ✅ CORRECT
<MahjongTile tileSymbol="Chun" />

// ❌ WRONG - case sensitive
<MahjongTile tileSymbol="chun" />

// ✅ CORRECT
<MahjongTile tileSymbol="Chun" />

// ❌ WRONG - variant must be exact
<MahjongTile tileSymbol="Chun" variant="Regular" />

// ✅ CORRECT
<MahjongTile tileSymbol="Chun" variant="regular" />
```

---

## File Structure Quick Look

```
/public/tiles/
├── regular/
│   ├── Front.png         ← Tile background
│   ├── Back.png          ← Tile back
│   ├── Chun.png          ← Red Dragon
│   ├── Pin1.png ... Pin9.png   ← Dots
│   ├── Sou1.png ... Sou9.png   ← Bams
│   ├── Man1.png ... Man9.png   ← Craks
│   ├── Ton.png, Nan.png, Shaa.png, Pei.png ← Winds
│   ├── Hatsu.png, Haku.png     ← Dragons
│   ├── flower-*.png            ← Flowers
│   ├── season-*.png            ← Seasons
│   ├── joker.png               ← Joker
│   ├── Man5-Dora.png, Pin5-Dora.png, Sou5-Dora.png
│   └── Blank.png
│
└── black/
    └── [Same structure]
```

---

## Where It's Used

- ✅ Onboarding page (`app/app/onboarding/page.tsx`) - Red Dragon (Chun)

## Ready to Use In

- Player hand display
- Discard pile
- Tile selector
- Game board
- Leaderboard
- Tutorial/help pages
- Any mahjong-related UI

---

## Next: Just Copy & Paste!

```tsx
import { MahjongTile } from "@/components/mahjong/MahjongTile";

export default function MyComponent() {
  return <MahjongTile tileSymbol="Chun" size={100} />;
}
```

Done! 🀄

---

**Last Updated:** November 2, 2025

# MahjongTile Component Documentation

## Overview

The `MahjongTile` component is a reusable React component that renders complete mahjong tiles by layering symbol images on top of the `Front.png` background. It supports both Regular and Black tile variants.

---

## Component Location

```
components/mahjong/MahjongTile.tsx
```

---

## Tile Assets Location

Tile assets are stored in the public folder for web access:

```
public/tiles/
├── regular/
│   ├── Front.png
│   ├── Back.png
│   ├── Chun.png (Red Dragon) ⭐
│   ├── Pin1-9.png (Dots)
│   ├── Sou1-9.png (Bams)
│   ├── Man1-9.png (Craks)
│   ├── Ton.png (East Wind)
│   ├── Nan.png (South Wind)
│   ├── Shaa.png (West Wind)
│   ├── Pei.png (North Wind)
│   ├── Hatsu.png (Green Dragon)
│   ├── Haku.png (White Dragon)
│   ├── flower-*.png (4 Flowers)
│   ├── season-*.png (4 Seasons)
│   ├── joker.png
│   ├── Man5-Dora.png, Pin5-Dora.png, Sou5-Dora.png
│   └── Blank.png
│
└── black/
    └── [Same structure as regular]
```

**Total:** 49 tile designs per directory (98 across both variants)

---

## Component Props

```typescript
interface MahjongTileProps {
  /**
   * The tile symbol to display (e.g., "Chun", "Pin5", "flower-plum")
   * Should be the filename without extension
   */
  tileSymbol: string;

  /**
   * Width and height of the tile in pixels
   * Default: 100
   * Height is automatically calculated as width × 1.2 (tile aspect ratio)
   */
  size?: number;

  /**
   * The tile style variant: "regular" or "black"
   * Default: "regular"
   */
  variant?: "regular" | "black";

  /**
   * Optional CSS class for additional styling
   */
  className?: string;

  /**
   * Optional alt text for accessibility
   */
  alt?: string;

  /**
   * Optional title for hover tooltip
   */
  title?: string;
}
```

---

## Usage Examples

### Basic Usage

```tsx
import { MahjongTile } from "@/components/mahjong/MahjongTile";

export function MyComponent() {
  return (
    <MahjongTile 
      tileSymbol="Chun"  // Red Dragon tile
      size={100}
      variant="regular"
    />
  );
}
```

### With Styling and Animation

```tsx
import { MahjongTile } from "@/components/mahjong/MahjongTile";
import { motion } from "framer-motion";

export function OnboardingHero() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="drop-shadow-lg"
    >
      <MahjongTile 
        tileSymbol="Chun" 
        size={96} 
        variant="regular"
        title="Red Dragon - Start Your Journey!"
      />
    </motion.div>
  );
}
```

### Different Tile Types

```tsx
// Displaying different tile types
<MahjongTile tileSymbol="Pin5" size={100} />      {/* 5-Dot */}
<MahjongTile tileSymbol="Sou1" size={100} />      {/* 1-Bam */}
<MahjongTile tileSymbol="Man9" size={100} />      {/* 9-Crak */}
<MahjongTile tileSymbol="Ton" size={100} />       {/* East Wind */}
<MahjongTile tileSymbol="Hatsu" size={100} />     {/* Green Dragon */}
<MahjongTile tileSymbol="flower-plum" size={100} /> {/* Plum Flower */}
<MahjongTile tileSymbol="season-spring" size={100} /> {/* Spring */}
<MahjongTile tileSymbol="joker" size={100} />     {/* Joker */}
```

### Black Variant

```tsx
<MahjongTile 
  tileSymbol="Chun" 
  size={100} 
  variant="black"  // High-contrast black style
/>
```

### With Custom Styling

```tsx
<MahjongTile 
  tileSymbol="Pin5"
  size={80}
  variant="regular"
  className="hover:drop-shadow-xl transition-shadow cursor-pointer"
  title="Tile: 5-Dot"
/>
```

### In a Grid/Hand Display

```tsx
export function TileHand() {
  const tiles = ["Pin1", "Pin2", "Pin3", "Ton", "Chun"];
  
  return (
    <div className="flex gap-2">
      {tiles.map((tile) => (
        <MahjongTile 
          key={tile}
          tileSymbol={tile}
          size={70}
          variant="regular"
        />
      ))}
    </div>
  );
}
```

---

## Component Internals

### How It Works

The component layers two images on top of each other:

```
┌─────────────────────────────────┐
│  Symbol Image (Pin5.png)        │  ← Layer 2 (z-index implicit)
│  - Absolutely positioned         │
│  - Same size as container        │
├─────────────────────────────────┤
│  Background (Front.png)         │  ← Layer 1
│  - Tile template/container       │
└─────────────────────────────────┘
```

### Dimensions

- **Width:** Specified by `size` prop (default: 100px)
- **Height:** Automatically calculated as `size × 1.2` (maintains tile aspect ratio)
- **Aspect Ratio:** 1:1.2 (standard mahjong tile proportions)

### Asset Loading

The component constructs image URLs dynamically:

```
Background URL: /tiles/{variant}/Front.png
Symbol URL:    /tiles/{variant}/{tileSymbol}.png
```

**Example:**
- `variant="regular"`, `tileSymbol="Chun"` → `/tiles/regular/Chun.png`
- `variant="black"`, `tileSymbol="Pin5"` → `/tiles/black/Pin5.png`

---

## Available Tile Symbols

### Number Suits (27 tiles)
- **Dots:** `Pin1`, `Pin2`, ..., `Pin9`
- **Bams:** `Sou1`, `Sou2`, ..., `Sou9`
- **Craks:** `Man1`, `Man2`, ..., `Man9`

### Honor Tiles (7 tiles)
- **Winds:** `Ton` (East), `Nan` (South), `Shaa` (West), `Pei` (North)
- **Dragons:** `Chun` (Red), `Hatsu` (Green), `Haku` (White)

### Bonus Tiles (8 tiles)
- **Flowers:** `flower-plum`, `flower-orchid`, `flower-chrysanthemum`, `flower-bamboo`
- **Seasons:** `season-spring`, `season-summer`, `season-autumn`, `season-winter`

### Wildcard (1 tile)
- **Joker:** `joker`

### Premium Variants (3 tiles)
- **Red-5s:** `Man5-Dora`, `Pin5-Dora`, `Sou5-Dora`

---

## Integration Examples

### 1. Onboarding Page (Already Implemented)

```tsx
// File: app/app/onboarding/page.tsx
<motion.div
  initial={{ rotateY: 0 }}
  animate={{ rotateY: [0, 5, -5, 0] }}
  transition={{ duration: 3, repeat: Infinity }}
  className="drop-shadow-lg"
>
  <MahjongTile 
    tileSymbol="Chun" 
    size={96} 
    variant="regular"
    title="Red Dragon - Mahjong Tile"
  />
</motion.div>
```

### 2. Player Hand Display

```tsx
export function PlayerHand({ tiles }: { tiles: string[] }) {
  return (
    <div className="flex gap-1 bg-card p-2 rounded-lg">
      {tiles.map((tile) => (
        <MahjongTile 
          key={tile}
          tileSymbol={tile}
          size={60}
          variant="regular"
          className="cursor-pointer hover:scale-110 transition-transform"
        />
      ))}
    </div>
  );
}
```

### 3. Tile Selector/Picker

```tsx
export function TilePicker() {
  const allTiles = [
    "Pin1", "Pin2", "Pin3", "Pin4", "Pin5",
    "Sou1", "Sou2", "Sou3", "Sou4", "Sou5",
    "Man1", "Man2", "Man3", "Man4", "Man5",
    "Ton", "Nan", "Shaa", "Pei",
    "Chun", "Hatsu", "Haku",
    "flower-plum", "flower-orchid",
    "season-spring", "season-summer",
    "joker"
  ];

  return (
    <div className="grid grid-cols-6 gap-2">
      {allTiles.map((tile) => (
        <button key={tile} className="p-1 hover:bg-accent/10 rounded">
          <MahjongTile 
            tileSymbol={tile}
            size={50}
            variant="regular"
          />
        </button>
      ))}
    </div>
  );
}
```

### 4. Tile Display Board

```tsx
export function DiscardPile({ tiles }: { tiles: string[] }) {
  return (
    <div className="flex flex-wrap gap-1 bg-muted/50 p-4 rounded-lg">
      {tiles.map((tile, index) => (
        <div 
          key={index} 
          className="relative"
          style={{ transform: `rotate(${Math.random() * 10 - 5}deg)` }}
        >
          <MahjongTile 
            tileSymbol={tile}
            size={50}
            variant="regular"
          />
        </div>
      ))}
    </div>
  );
}
```

---

## Styling & Customization

### Size Variants

```tsx
<MahjongTile tileSymbol="Chun" size={40} />  {/* Small (48px tall) */}
<MahjongTile tileSymbol="Chun" size={60} />  {/* Medium (72px tall) */}
<MahjongTile tileSymbol="Chun" size={100} /> {/* Large (120px tall) */}
<MahjongTile tileSymbol="Chun" size={150} /> {/* Extra Large (180px tall) */}
```

### Hover Effects

```tsx
<MahjongTile 
  tileSymbol="Chun"
  size={100}
  className="hover:drop-shadow-lg hover:scale-105 transition-all cursor-pointer"
/>
```

### Animation with Framer Motion

```tsx
<motion.div
  whileHover={{ scale: 1.1, rotateZ: 2 }}
  whileTap={{ scale: 0.95 }}
  className="cursor-pointer"
>
  <MahjongTile tileSymbol="Chun" size={100} />
</motion.div>
```

### Variants with CSS Classes

```tsx
// Selected state
<MahjongTile 
  tileSymbol="Chun"
  size={100}
  className="ring-2 ring-primary shadow-lg"
/>

// Disabled state
<MahjongTile 
  tileSymbol="Chun"
  size={100}
  className="opacity-50 grayscale"
/>

// Highlighted state
<MahjongTile 
  tileSymbol="Chun"
  size={100}
  className="ring-2 ring-accent drop-shadow-lg"
/>
```

---

## Performance Considerations

### Image Optimization
- All images use `priority` and `unoptimized` flags for immediate loading
- Images are pre-loaded from the public folder
- Consider lazy loading for large tile collections

### Rendering Performance
- Component is memoizable if needed: `memo(MahjongTile)`
- Consider virtualizing large tile lists (e.g., 50+ tiles)

### Tile Assets
- 49 unique designs per variant = minimal bundle impact
- PNG format optimized for small file sizes
- Can be compressed further with tools like TinyPNG

---

## Future Enhancements

- [ ] Add click handler support for interactive tiles
- [ ] Support tile rotation/orientation
- [ ] Add highlight/selection states via props
- [ ] Create face-down tile display (Back.png variant)
- [ ] Animation library for tile drawing/discarding
- [ ] Responsive sizing based on viewport
- [ ] Accessibility improvements (ARIA labels)
- [ ] SVG variants for better scalability

---

## Troubleshooting

### Tile Not Displaying

**Issue:** MahjongTile shows broken image
**Solutions:**
1. Verify tile symbol name matches filename (e.g., "Chun" not "chun")
2. Ensure tile PNG exists in `/public/tiles/{variant}/`
3. Check browser console for 404 errors on image URLs
4. Restart Next.js dev server

### Image Blurry

**Issue:** Tile image appears pixelated
**Solutions:**
1. Ensure you're not scaling tiles too large (100px is optimal)
2. Remove `unoptimized` flag if you want Next.js optimization
3. Check that tile asset quality is good

### Wrong Tile Displaying

**Issue:** Symbol doesn't match tileSymbol prop
**Solutions:**
1. Verify exact spelling of tileSymbol (case-sensitive: "Pin5" not "pin5")
2. Check that both Front.png and symbol PNG are present
3. Clear browser cache and rebuild Next.js

---

## Testing

```tsx
import { render } from "@testing-library/react";
import { MahjongTile } from "@/components/mahjong/MahjongTile";

describe("MahjongTile", () => {
  it("renders with correct symbol", () => {
    const { container } = render(
      <MahjongTile tileSymbol="Chun" size={100} />
    );
    expect(container.querySelector('[alt*="Chun"]')).toBeInTheDocument();
  });

  it("supports custom size", () => {
    const { container } = render(
      <MahjongTile tileSymbol="Chun" size={50} />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.style.width).toBe("50px");
  });

  it("supports both variants", () => {
    const { rerender } = render(
      <MahjongTile tileSymbol="Chun" variant="regular" />
    );
    expect(document.querySelector('img[src*="regular"]')).toBeInTheDocument();
    
    rerender(<MahjongTile tileSymbol="Chun" variant="black" />);
    expect(document.querySelector('img[src*="black"]')).toBeInTheDocument();
  });
});
```

---

## Summary

The **MahjongTile** component provides a robust, reusable way to display mahjong tiles throughout the application. It handles all the complexity of layering symbols on backgrounds while maintaining flexibility for sizing, styling, and variant selection.

**Status:** ✅ Production-ready  
**First Implementation:** Onboarding page  
**Total Tile Designs:** 49 per variant (98 total)  
**Asset Location:** `/public/tiles/{regular|black}/`

---

**Last Updated:** November 2, 2025

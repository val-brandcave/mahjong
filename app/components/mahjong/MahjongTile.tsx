import Image from "next/image";

export interface MahjongTileProps {
  /**
   * The tile symbol to display (e.g., "Chun", "Pin5", "flower-plum")
   * Should be the filename without extension
   */
  tileSymbol: string;

  /**
   * Width and height of the tile in pixels
   * Default: 100
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

/**
 * MahjongTile Component
 * 
 * Renders a complete mahjong tile with:
 * - Subtle dark drop shadow
 * - Symbol image (scaled to 70% and centered) on top of Front.png background
 * 
 * Usage:
 * <MahjongTile tileSymbol="Chun" size={100} variant="regular" />
 * <MahjongTile tileSymbol="Pin5" size={80} variant="black" />
 */
export const MahjongTile = ({
  tileSymbol,
  size = 100,
  variant = "regular",
  className = "",
  alt,
  title,
}: MahjongTileProps) => {
  // Calculate dimensions (tiles are wider than tall: ~100px Ã— 120px)
  const tileWidth = size;
  const tileHeight = Math.round(size * 1.2); // 1.2 aspect ratio

  // Symbol is 70% of the background size, centered
  const symbolScale = 0.7;
  const symbolWidth = Math.round(tileWidth * symbolScale);
  const symbolHeight = Math.round(tileHeight * symbolScale);
  const symbolOffsetX = Math.round((tileWidth - symbolWidth) / 2);
  const symbolOffsetY = Math.round((tileHeight - symbolHeight) / 2);

  // Construct paths to assets from public folder
  // Directory structure: /public/tiles/regular/ or /public/tiles/black/
  const backgroundUrl = `/tiles/${variant}/Front.png`;
  const symbolUrl = `/tiles/${variant}/${tileSymbol}.png`;

  // Generate default alt text if not provided
  const altText = alt || `Mahjong tile: ${tileSymbol}`;

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        width: `${tileWidth}px`,
        height: `${tileHeight}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15))",
      }}
      title={title}
    >
      {/* Layer 1: Tile Container with tile background and symbol */}
      <div
        style={{
          position: "relative",
          width: `${tileWidth}px`,
          height: `${tileHeight}px`,
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {/* Layer 1a: Tile Background (Front.png) - Full size */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={backgroundUrl}
            alt="tile-background"
            fill
            sizes={`${tileWidth}px`}
            style={{
              objectFit: "cover",
            }}
            priority
            unoptimized
          />
        </div>

        {/* Layer 1b: Tile Symbol (70% size, centered, overlaid on top) */}
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
          <Image
            src={symbolUrl}
            alt={altText}
            fill
            sizes={`${symbolWidth}px`}
            style={{
              objectFit: "cover",
            }}
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default MahjongTile;

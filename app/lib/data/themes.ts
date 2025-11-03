export const tileThemes = [
  {
    id: "traditional",
    name: "Traditional",
    description: "Classic mahjong tiles",
    preview: "/tiles/traditional-preview.png",
    tile: "Chun",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design",
    preview: "/tiles/modern-preview.png",
    tile: "Sou8",
  },
  {
    id: "colorful",
    name: "Colorful",
    description: "Bright and vibrant",
    preview: "/tiles/colorful-preview.png",
    tile: "Sou1",
  },
  {
    id: "high-contrast",
    name: "High Contrast",
    description: "Easy to read",
    preview: "/tiles/high-contrast-preview.png",
    tile: "Man6",
  },
];

export const experienceLevels = [
  {
    id: "never_played" as const,
    title: "Never Played",
    description: "Start from the very beginning",
    tile: "Pin1",
  },
  {
    id: "basic_rules" as const,
    title: "Know The Basics",
    description: "I have learned a bit but need practice",
    tile: "Pin2",
  },
  {
    id: "played_several" as const,
    title: "Played Several Times",
    description: "I know the game but want to improve",
    tile: "Pin3",
  },
  {
    id: "experienced" as const,
    title: "Experienced Player",
    description: "Looking to refine my skills",
    tile: "Pin4",
  },
];


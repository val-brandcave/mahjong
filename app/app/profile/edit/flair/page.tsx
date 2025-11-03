
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useUserProfileStore } from "@/lib/store/onboarding";
import { useOnboardingStore } from "@/lib/store/onboarding";

interface FlairItem {
  id: string;
  emoji: string;
  label: string;
  locked?: boolean;
}

interface FlairCategory {
  name: string;
  items: FlairItem[];
}

const FLAIR_DATA: FlairCategory[] = [
  {
    name: "Remove Flair",
    items: [
      {
        id: "remove",
        emoji: "✕",
        label: "Remove Flair",
        locked: false,
      },
    ],
  },
  {
    name: "Membership",
    items: [
      { id: "diamond-blue", emoji: "💎", label: "Blue Diamond", locked: false },
      { id: "diamond-cyan", emoji: "🔷", label: "Cyan Diamond", locked: false },
      { id: "diamond-purple", emoji: "🟣", label: "Purple Diamond", locked: false },
      { id: "diamond-red", emoji: "❤️", label: "Red Diamond", locked: false },
      { id: "diamond-orange", emoji: "🟠", label: "Orange Diamond", locked: false },
      { id: "diamond-yellow", emoji: "💛", label: "Yellow Diamond", locked: false },
    ],
  },
  {
    name: "Crowns & Royalty",
    items: [
      { id: "crown-white", emoji: "👑", label: "White Crown", locked: false },
      { id: "crown-gold", emoji: "👑", label: "Gold Crown", locked: false },
      { id: "star-gold", emoji: "⭐", label: "Gold Star", locked: false },
      { id: "star-blue", emoji: "🌟", label: "Blue Star", locked: false },
      { id: "star-purple", emoji: "✨", label: "Purple Star", locked: true },
      { id: "star-red", emoji: "🔴", label: "Red Star", locked: true },
    ],
  },
  {
    name: "Emojis",
    items: [
      { id: "emoji-smile", emoji: "😊", label: "Smile", locked: false },
      { id: "emoji-cool", emoji: "😎", label: "Cool", locked: false },
      { id: "emoji-heart", emoji: "💕", label: "Love", locked: false },
      { id: "emoji-fire", emoji: "🔥", label: "Fire", locked: false },
      { id: "emoji-star", emoji: "🌟", label: "Star", locked: false },
      { id: "emoji-party", emoji: "🎉", label: "Party", locked: false },
    ],
  },
  {
    name: "Holidays & Seasons",
    items: [
      { id: "holiday-christmas", emoji: "🎄", label: "Christmas", locked: false },
      { id: "holiday-halloween", emoji: "🎃", label: "Halloween", locked: false },
      { id: "holiday-valentine", emoji: "💝", label: "Valentine's", locked: false },
      { id: "holiday-easter", emoji: "🐰", label: "Easter", locked: false },
      { id: "holiday-summer", emoji: "🌞", label: "Summer", locked: false },
      { id: "holiday-snow", emoji: "❄️", label: "Winter", locked: false },
    ],
  },
];

export default function FlairPage() {
  const router = useRouter();
  const { username } = useOnboardingStore();
  const { flair, setFlair } = useUserProfileStore();
  const [selectedFlair, setSelectedFlair] = useState(flair);

  const handleFlairSelect = (flairEmoji: string) => {
    if (flairEmoji === "✕") {
      setSelectedFlair("");
    } else {
      setSelectedFlair(flairEmoji);
    }
  };

  const handleSave = () => {
    setFlair(selectedFlair);
    router.back();
  };

  return (
    <MobileContainer>
      {/* Fixed Header */}
      <MobileHeader 
        title="Select Flair"
        showBack
        centered
      />

      {/* Content */}
      <div className="mobile-content space-y-6 pb-24 pt-16">
        {/* Preview */}
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">Preview</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium">{username}</span>
            {selectedFlair && <span className="text-xl">{selectedFlair}</span>}
            {!selectedFlair && (
              <span className="text-xs text-muted-foreground">No flair</span>
            )}
          </div>
        </div>

        {/* Flair Categories */}
        {FLAIR_DATA.map((category, categoryIndex) => (
          <div key={category.name}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              {category.name}
            </h3>
            <div className="grid grid-cols-6 gap-3">
              {category.items.map((item, itemIndex) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: itemIndex * 0.05 }}
                  onClick={() => !item.locked && handleFlairSelect(item.emoji)}
                  disabled={item.locked}
                  className={`relative aspect-square rounded-lg border-2 flex items-center justify-center text-2xl transition-all ${
                    item.locked
                      ? "bg-muted/50 border-border/50 cursor-not-allowed opacity-50"
                      : selectedFlair === item.emoji
                      ? "bg-primary/20 border-primary"
                      : "bg-card border-border hover:border-primary/50 hover:bg-accent/5"
                  }`}
                  title={item.label}
                >
                  {item.emoji}

                  {/* Lock icon for locked items */}
                  {item.locked && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">
                      🔒
                    </div>
                  )}

                  {/* Checkmark for selected */}
                  {selectedFlair === item.emoji && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
        >
          Save Flair
        </Button>
      </div>
    </MobileContainer>
  );
}

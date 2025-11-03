"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { MahjongTile } from "@/components/mahjong/MahjongTile";
import { useOnboardingStore } from "@/lib/store/onboarding";
import { tileThemes } from "@/lib/data/themes";

export default function ThemePage() {
  const router = useRouter();
  const { tileTheme: storedTheme, setTileTheme } = useOnboardingStore();
  const [selected, setSelected] = useState(storedTheme || "traditional");

  const handleSelect = (themeId: string) => {
    setSelected(themeId);
  };

  const handleContinue = () => {
    setTileTheme(selected);
    router.push("/onboarding/sync-contacts");
  };

  return (
    <MobileContainer isOnboarding>
      <MobileHeader showBack />

      <div className="mobile-content">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-3">Choose Your Tile Theme</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            You can change this later in settings
          </p>
        </div>

        {/* Theme Options Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {tileThemes.map((theme, index) => (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(theme.id)}
              className={`relative aspect-square rounded-xl border-2 transition-all overflow-hidden flex flex-col items-center justify-center gap-3 p-4 ${
                selected === theme.id
                  ? "border-primary shadow-lg"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {/* Theme Tile Preview */}
              {theme.tile && (
                <MahjongTile
                  tileSymbol={theme.tile}
                  size={48}
                  variant="regular"
                  alt={theme.name}
                />
              )}

              {/* Theme Info */}
              <div className="text-center">
                <h3 className="font-semibold text-sm mb-1">{theme.name}</h3>
                <p className="text-xs text-muted-foreground">{theme.description}</p>
              </div>

              {/* Checkmark Badge */}
              {selected === theme.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary shadow-lg flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Preview Text */}
        <div className="p-4 bg-muted/50 rounded-lg mb-6">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            <span className="font-medium text-foreground">{tileThemes.find(t => t.id === selected)?.name}</span>
            {" "}theme selected. You can preview all themes in the app later!
          </p>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
        >
          Continue
        </Button>
      </div>
    </MobileContainer>
  );
}

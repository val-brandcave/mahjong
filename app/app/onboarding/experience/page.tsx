"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { MahjongTile } from "@/components/mahjong/MahjongTile";
import { useOnboardingStore, ExperienceLevel } from "@/lib/store/onboarding";
import { experienceLevels } from "@/lib/data/themes";

export default function ExperiencePage() {
  const router = useRouter();
  const { experienceLevel: storedLevel, setExperienceLevel } = useOnboardingStore();
  const [selected, setSelected] = useState<ExperienceLevel | null>(storedLevel);

  const handleSelect = (level: ExperienceLevel) => {
    setSelected(level);
  };

  const handleContinue = () => {
    if (selected) {
      setExperienceLevel(selected);
      router.push("/onboarding/theme");
    }
  };

  return (
    <MobileContainer isOnboarding>
      <MobileHeader showBack />

      <div className="mobile-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">What Is Your Mahjong Experience?</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Help us personalize your learning journey
          </p>
        </div>

        {/* Experience Options */}
        <div className="space-y-3 mb-8">
          {experienceLevels.map((level, index) => (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(level.id)}
              className={`relative w-full px-4 py-3 rounded-xl border-2 transition-all text-left tap-target flex flex-row items-center gap-3 ${
                selected === level.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              {/* Mahjong Tile */}
              {level.tile && (
                <div className="flex-shrink-0">
                  <MahjongTile
                    tileSymbol={level.tile}
                    size={48}
                    variant="regular"
                    alt={level.title}
                  />
                </div>
              )}

              {/* Content with padding on right for checkmark */}
              <div className="flex-1 pr-10">
                <h3 className="font-semibold text-base leading-tight">{level.title}</h3>
              </div>

              {/* Checkmark - Fixed position top right, doesn't affect layout */}
              {selected === level.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </MobileContainer>
  );
}





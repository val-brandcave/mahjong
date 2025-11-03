
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";

interface LanguageSetting {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
}

export default function LanguagePage() {
  const router = useRouter();
  const [settings, setSettings] = useState<LanguageSetting[]>([
    {
      id: "english-fallback",
      label: "Display content in English when not available in my language",
      enabled: true,
    },
    {
      id: "force-english",
      label: "Force English",
      enabled: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setSettings(
      settings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const handleSelectLanguage = () => {
    // TODO: Open language selector
    console.log("Select language");
  };

  return (
    <MobileContainer>
      {/* Fixed Header */}
      <MobileHeader 
        title="Language"
        showBack
        centered
      />

      {/* Content */}
      <div className="mobile-content space-y-4 pb-24 pt-16">
        {/* Settings */}
        <div className="space-y-3">
          {settings.map((setting) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {setting.label}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle(setting.id)}
                  className={`flex-shrink-0 w-12 h-7 rounded-full transition-colors ${
                    setting.enabled
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                      setting.enabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  ></div>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Select Language Button */}
        <Button
          onClick={handleSelectLanguage}
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 mt-6"
        >
          Select Language
        </Button>

        {/* Helper Text */}
        <div className="bg-muted/50 rounded-lg p-4 mt-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Choose your preferred language for the app interface. Some content may not be available in all languages yet.
          </p>
        </div>
      </div>
    </MobileContainer>
  );
}

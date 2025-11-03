"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Check } from "lucide-react";
import { useOnboardingStore } from "@/lib/store/onboarding";

export default function UsernamePage() {
  const router = useRouter();
  const { setUsername, setAvatarUrl, username: storedUsername } = useOnboardingStore();
  const [username, setUsernameInput] = useState(storedUsername || "");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleUsernameChange = (value: string) => {
    // Only allow alphanumeric and underscores
    const cleaned = value.replace(/[^a-zA-Z0-9_]/g, "");
    setUsernameInput(cleaned);
    
    // Validate: 3-20 characters
    setIsValid(cleaned.length >= 3 && cleaned.length <= 20);
  };

  const handleContinue = () => {
    if (isValid && acceptedTerms) {
      setUsername(username);
      router.push("/onboarding/experience");
    }
  };

  const handleAvatarClick = () => {
    // Placeholder for avatar upload
    console.log("Avatar upload clicked");
  };

  return (
    <MobileContainer isOnboarding>
      <MobileHeader showBack />

      <div className="mobile-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Choose a Username</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            This is what other players will see
          </p>
        </div>

        {/* Avatar Upload */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleAvatarClick}
            className="relative group"
            aria-label="Upload avatar"
          >
            <Avatar className="w-24 h-24 border-4 border-muted">
              <AvatarImage src="" alt="Avatar" />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-4xl">
                {username.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </button>
        </div>

        {/* Username Input */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            maxLength={20}
            className="h-14 text-base"
            aria-label="Username"
          />
          <div className="flex justify-between items-center mt-2 px-1">
            <p className="text-sm text-muted-foreground">
              {username.length > 0 && (
                isValid ? (
                  <span className="text-success flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Looks good!
                  </span>
                ) : username.length < 3 ? (
                  <span className="text-destructive">
                    At least 3 characters
                  </span>
                ) : null
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {username.length}/20
            </p>
          </div>
        </div>

        {/* Terms Acceptance */}
        <button
          onClick={() => setAcceptedTerms(!acceptedTerms)}
          className="flex items-start gap-3 mb-8 tap-target w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
            acceptedTerms 
              ? "bg-primary border-primary" 
              : "border-muted-foreground"
          }`}>
            {acceptedTerms && <Check className="w-3 h-3 text-primary-foreground" />}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By signing up, I accept the{" "}
            <span className="text-primary font-medium underline">
              Terms of Service
            </span>
          </p>
        </button>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!isValid || !acceptedTerms}
          className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50"
        >
          Continue
        </Button>

        {/* Helper Text */}
        {!acceptedTerms && isValid && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground text-center mt-4"
          >
            Please accept the terms to continue
          </motion.p>
        )}
      </div>
    </MobileContainer>
  );
}


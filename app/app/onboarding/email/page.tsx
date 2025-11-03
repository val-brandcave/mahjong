"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "@/lib/store/onboarding";

export default function EmailPage() {
  const router = useRouter();
  const { setEmail } = useOnboardingStore();
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = () => {
    if (!isValidEmail(emailInput)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmail(emailInput);
    router.push("/onboarding/password");
  };

  const handleEmailChange = (e: string) => {
    setEmailInput(e);
    setEmailError("");
  };

  return (
    <MobileContainer isOnboarding>
      <MobileHeader showBack />

      {/* Content */}
      <div className="mobile-content flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold mb-2">What's your email?</h1>
            <p className="text-muted-foreground">We'll use this to secure your account</p>
          </div>

          {/* Email Input */}
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={emailInput}
              onChange={(e) => handleEmailChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && isValidEmail(emailInput)) {
                  handleContinue();
                }
              }}
              className="h-auto py-3 text-base"
              autoFocus
            />
            {emailError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-2"
              >
                {emailError}
              </motion.p>
            )}
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: isValidEmail(emailInput) ? 1 : 0.5,
            }}
          >
            <Button
              onClick={handleContinue}
              disabled={!isValidEmail(emailInput)}
              className={`w-full h-14 text-base font-semibold ${
                isValidEmail(emailInput)
                  ? "bg-primary hover:bg-primary/90 cursor-pointer"
                  : "bg-primary/50 cursor-not-allowed"
              }`}
            >
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </MobileContainer>
  );
}
